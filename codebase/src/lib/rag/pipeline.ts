import type { ChatApiHeaderKeys, CitationItem } from '@/types/chat';
import { supabase } from '@/lib/supabase/client';
import { matchFaq, matchFaqCandidates, getRelatedFaqQuestions } from './faq-match';
import { embedBatch } from './embed';
import { verifyFaqWithLLM, synthesizeFocusedFaqAnswer } from './faq-verify';
import { retrieveChunks } from './retrieve';
import { synthesizeRagAnswer } from './rag-synthesize';
import {
  looksLikeSmallTalk,
  converseStream,
  FALLBACK_TEXT,
  type ConverseOutcome,
} from './converse';
import { stripImagesFromStream, textToStream } from './stream-text';

export interface PipelineMetaResult {
  type: 'meta';
  stream: AsyncIterable<string>;
  provider: string;
  model: string;
}

export interface PipelineFaqResult {
  type: 'faq';
  stream: AsyncIterable<string>;
  faqId: string;
  isVerified?: boolean;
  verificationSource?: string;
  suggestions?: string[];
  degraded?: boolean;
  provider?: string;
  model?: string;
}

export interface PipelineRagResult {
  type: 'rag';
  stream: AsyncIterable<string>;
  citations: CitationItem[];
  provider: string;
  model: string;
}

export interface PipelineNeedKeyResult {
  type: 'need_key';
}

export interface PipelineRefusedResult {
  type: 'refused';
  stream: AsyncIterable<string>;
  outcome?: ConverseOutcome;
  suggestions?: string[];
  degraded?: boolean;
  provider?: string;
  model?: string;
}

export type PipelineResult =
  | PipelineMetaResult
  | PipelineFaqResult
  | PipelineRagResult
  | PipelineNeedKeyResult
  | PipelineRefusedResult;

export async function processChatPipeline(
  question: string,
  keys: ChatApiHeaderKeys,
  history?: { role: 'user' | 'assistant'; content: string }[]
): Promise<PipelineResult> {
  const trimmedQuestion = question.trim();

  // 0. Tầng đối thoại xã giao: nhận diện tin nhắn giao tiếp không cần key
  if (looksLikeSmallTalk(trimmedQuestion)) {
    const converseRes = await converseStream(
      trimmedQuestion,
      { kind: 'smalltalk' },
      keys,
      history
    );
    if (converseRes) {
      return {
        type: 'meta',
        stream: converseRes.stream,
        provider: converseRes.provider,
        model: converseRes.model,
      };
    }
    // Không có key hoặc LLM lỗi: fallback câu văn định sẵn
    return {
      type: 'meta',
      stream: textToStream(FALLBACK_TEXT.smalltalk),
      provider: 'fallback',
      model: 'fallback',
    };
  }

  // 1. Tầng nhanh & miễn phí: khớp chính xác / gần đúng theo câu chữ FAQ
  const exactMatch = await matchFaq(trimmedQuestion, null, 0.75);
  if (exactMatch) {
    const focusedAnswer = await synthesizeFocusedFaqAnswer(
      trimmedQuestion,
      exactMatch,
      keys,
      history
    );
    const hasAnyLlmKey = Boolean(
      keys.gemini ||
        keys.openai ||
        keys.claude ||
        keys.deepseek ||
        keys.groq ||
        keys.cerebras
    );
    return {
      type: 'faq',
      stream: stripImagesFromStream(textToStream(focusedAnswer)),
      faqId: exactMatch.faqId,
      isVerified: exactMatch.isVerified,
      verificationSource: exactMatch.verificationSource,
      suggestions: await getRelatedFaqQuestions(exactMatch.faqId),
      degraded: !hasAnyLlmKey,
    };
  }

  const hasAnyKey = Boolean(
    keys.gemini ||
      keys.openai ||
      keys.claude ||
      keys.deepseek ||
      keys.groq ||
      keys.cerebras
  );
  if (!hasAnyKey) {
    return { type: 'need_key' };
  }

  // 2. Tầng khớp mờ theo vector + LLM xác minh ý định FAQ
  let queryEmbedding: number[] | null = null;
  if (keys.gemini) {
    try {
      const embeds = await embedBatch([trimmedQuestion], keys.gemini, 'RETRIEVAL_QUERY');
      queryEmbedding = embeds[0] ?? null;
    } catch (err) {
      console.warn('[pipeline] embedBatch failed:', err);
    }
  }

  if (queryEmbedding) {
    const candidates = await matchFaqCandidates(trimmedQuestion, queryEmbedding, 0.75, 0.55);
    if (candidates.length > 0) {
      const wordCount = trimmedQuestion.split(/\s+/).filter(Boolean).length;
      const isTooShort = wordCount < 4;
      const isTopScoreClose =
        candidates.length >= 2 &&
        Math.abs((candidates[0]?.score ?? 0) - (candidates[1]?.score ?? 0)) < 0.02;

      // Chốt chặn 1 & 2: câu hỏi quá ngắn hoặc 2 ứng viên đầu quá sát điểm
      if (isTooShort || isTopScoreClose) {
        const candidateQuestions = candidates.slice(0, 3).map((c) => c.question);
        const converseRes = await converseStream(
          trimmedQuestion,
          { kind: 'unclear', candidates: candidateQuestions },
          keys,
          history
        );
        if (converseRes) {
          return {
            type: 'refused',
            stream: converseRes.stream,
            outcome: converseRes.outcome,
            suggestions: candidateQuestions,
            provider: converseRes.provider,
            model: converseRes.model,
          };
        }
        return {
          type: 'refused',
          stream: textToStream(FALLBACK_TEXT.unclear),
          suggestions: candidateQuestions,
          degraded: true,
          provider: 'fallback',
          model: 'fallback',
        };
      }

      const verified = await verifyFaqWithLLM(trimmedQuestion, candidates, keys);
      if (verified) {
        const focusedAnswer = await synthesizeFocusedFaqAnswer(
          trimmedQuestion,
          verified,
          keys,
          history
        );
        return {
          type: 'faq',
          stream: stripImagesFromStream(textToStream(focusedAnswer)),
          faqId: verified.faqId,
          isVerified: verified.isVerified,
          verificationSource: verified.verificationSource,
          suggestions: await getRelatedFaqQuestions(verified.faqId),
          degraded: false,
        };
      }
    }
  }

  // 3. Tầng RAG tổng quát từ các chunk tài liệu
  const retrieval = await retrieveChunks(trimmedQuestion, queryEmbedding, 8, 0.015);
  if (retrieval.citations.length > 0) {
    const ragRes = await synthesizeRagAnswer(trimmedQuestion, retrieval.citations, keys, history);
    if (ragRes) {
      return {
        type: 'rag',
        stream: ragRes.stream,
        citations: retrieval.citations,
        provider: ragRes.provider,
        model: ragRes.model,
      };
    }
  }

  // 4. Tầng đối thoại khi không tìm thấy thông tin
  try {
    await supabase.rpc('record_unanswered' as any, {
      p_question: trimmedQuestion,
      p_embedding: queryEmbedding,
      p_sim_threshold: 0.88,
    });
  } catch (err) {
    console.warn('[pipeline] record_unanswered failed:', err);
  }

  const converseRes = await converseStream(
    trimmedQuestion,
    { kind: 'no_info' },
    keys,
    history
  );

  if (converseRes) {
    return {
      type: 'refused',
      stream: converseRes.stream,
      outcome: converseRes.outcome,
      suggestions: [],
      provider: converseRes.provider,
      model: converseRes.model,
    };
  }

  return {
    type: 'refused',
    stream: textToStream(FALLBACK_TEXT.no_info),
    suggestions: [],
    degraded: true,
    provider: 'fallback',
    model: 'fallback',
  };
}
