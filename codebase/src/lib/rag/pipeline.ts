import type { ChatApiHeaderKeys, CitationItem } from '@/types/chat';
import type { LearnerContext } from '@/lib/learner-context';
import { canAccessLearningFeatures, type BackendUserRole } from '@/lib/auth/helpdesk-access';
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
import { decideHelpdeskAction, looksLikePlannerRequest } from './helpdesk-agent';

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
  history?: { role: 'user' | 'assistant'; content: string }[],
  role: BackendUserRole = 'Visitor',
  learnerContext?: LearnerContext,
): Promise<PipelineResult> {
  const trimmedQuestion = question.trim();
  const activeLearnerContext = canAccessLearningFeatures(role) ? learnerContext : undefined;

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

  if (looksLikePlannerRequest(trimmedQuestion)) {
    if (!canAccessLearningFeatures(role)) {
      return {
        type: 'refused',
        stream: textToStream(
          'Lộ trình cá nhân hoá dành cho tài khoản đã được cấp quyền học. Bạn hãy đăng nhập bằng tài khoản học viên để sử dụng tính năng này.',
        ),
        suggestions: [],
        provider: 'rules',
        model: 'rules',
      };
    }
    return {
      type: 'meta',
      stream: textToStream(
        'Yêu cầu này phù hợp với công cụ chẩn đoán và lập lộ trình cá nhân hóa. [Mở Lộ trình cá nhân hoá](/personalized-path).',
      ),
      provider: 'rules',
      model: 'rules',
    };
  }

  // 1. Tầng nhanh & miễn phí: khớp chính xác / gần đúng theo câu chữ FAQ
  const exactMatch = await matchFaq(trimmedQuestion, null, 0.75);
  if (exactMatch) {
    const focusedAnswer = await synthesizeFocusedFaqAnswer(
      trimmedQuestion,
      exactMatch,
      keys,
      history,
      activeLearnerContext,
    );
    return {
      type: 'faq',
      stream: stripImagesFromStream(textToStream(focusedAnswer.text)),
      faqId: exactMatch.faqId,
      isVerified: exactMatch.isVerified,
      verificationSource: exactMatch.verificationSource,
      suggestions: await getRelatedFaqQuestions(exactMatch.faqId),
      degraded: focusedAnswer.degraded,
      provider: focusedAnswer.provider,
      model: focusedAnswer.model,
    };
  }

  const hasAnyKey = Boolean(keys.gemini);
  if (!hasAnyKey) {
    return { type: 'need_key' };
  }

  // 2. Agent dùng Gemini chọn đúng một hành động trước khi gọi công cụ tra cứu.
  const decision = await decideHelpdeskAction(trimmedQuestion, keys, history, activeLearnerContext);
  if (decision.action === 'chat') {
    return {
      type: 'meta',
      stream: textToStream(decision.response ?? FALLBACK_TEXT.smalltalk),
      provider: decision.provider,
      model: decision.model,
    };
  }
  if (decision.action === 'handoff_planner') {
    if (!canAccessLearningFeatures(role)) {
      return {
        type: 'refused',
        stream: textToStream(
          'Lộ trình cá nhân hoá dành cho tài khoản đã được cấp quyền học. Bạn hãy đăng nhập bằng tài khoản học viên để sử dụng tính năng này.',
        ),
        suggestions: [],
        provider: 'rules',
        model: 'rules',
      };
    }
    return {
      type: 'meta',
      stream: textToStream(
        `${decision.response ?? 'Yêu cầu này phù hợp với công cụ lập lộ trình cá nhân hóa.'} [Mở Lộ trình cá nhân hoá](/personalized-path).`,
      ),
      provider: decision.provider,
      model: decision.model,
    };
  }
  if (decision.action === 'clarify' || decision.action === 'refuse') {
    return {
      type: 'refused',
      stream: textToStream(
        decision.response ??
          (decision.action === 'clarify'
            ? 'Bạn mô tả rõ hơn nội dung, bài học hoặc mốc thời gian cần hỏi nhé.'
            : 'Mình không thể thực hiện yêu cầu này, nhưng có thể hỗ trợ bạn tra cứu tài liệu và hướng dẫn cách tự làm.'),
      ),
      suggestions: [],
      provider: decision.provider,
      model: decision.model,
    };
  }

  const searchQuestion = decision.rewritten_query ?? trimmedQuestion;

  // 3. Công cụ khớp mờ theo vector + LLM xác minh ý định FAQ
  let queryEmbedding: number[] | null = null;
  if (keys.gemini) {
    try {
      const embeds = await embedBatch([searchQuestion], keys.gemini, 'RETRIEVAL_QUERY');
      queryEmbedding = embeds[0] ?? null;
    } catch (err) {
      console.warn('[pipeline] embedBatch failed:', err);
    }
  }

  if (queryEmbedding) {
    const candidates = await matchFaqCandidates(searchQuestion, queryEmbedding, 0.75, 0.55);
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
          history,
          activeLearnerContext,
        );
        return {
          type: 'faq',
          stream: stripImagesFromStream(textToStream(focusedAnswer.text)),
          faqId: verified.faqId,
          isVerified: verified.isVerified,
          verificationSource: verified.verificationSource,
          suggestions: await getRelatedFaqQuestions(verified.faqId),
          degraded: focusedAnswer.degraded,
          provider: focusedAnswer.provider,
          model: focusedAnswer.model,
        };
      }
    }
  }

  // 4. Công cụ RAG tổng quát từ các chunk tài liệu
  const retrieval = await retrieveChunks(
    searchQuestion,
    queryEmbedding,
    8,
    0.015,
    canAccessLearningFeatures(role),
  );
  if (retrieval.citations.length > 0) {
    const ragRes = await synthesizeRagAnswer(
      trimmedQuestion,
      retrieval.citations,
      keys,
      history,
      activeLearnerContext,
    );
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

  // 5. Tầng đối thoại khi không tìm thấy thông tin
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
