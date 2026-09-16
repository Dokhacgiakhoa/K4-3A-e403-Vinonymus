import type { ChatApiHeaderKeys, CitationItem } from '@/types/chat';
import { routeLLMRequest } from '@/lib/llm/router';
import { SYSTEM_PROMPT_GENERAL_RAG, buildGeneralRagUserPrompt } from '@/lib/prompts/rag-general';
import { stripImagesFromStream } from './stream-text';

/**
 * Tổng hợp câu trả lời từ nhiều chunk tài liệu (tầng RAG tổng quát) — khác FAQ, không có "văn bản
 * gốc" để fallback thô khi LLM lỗi, nên trả về `null` khi lỗi thay vì giả vờ có câu trả lời;
 * pipeline coi `null` là "tầng này không trả lời được", rơi tiếp xuống tầng đối thoại.
 */
export interface SynthesizeRagAnswerResult {
  stream: AsyncIterable<string>;
  /** Provider/model đã dùng — chỉ để ghi `query_logs`, KHÔNG bao giờ kèm key. */
  provider: string;
  model: string;
}

export async function synthesizeRagAnswer(
  question: string,
  citations: CitationItem[],
  keys: ChatApiHeaderKeys,
  history?: { role: 'user' | 'assistant'; content: string }[]
): Promise<SynthesizeRagAnswerResult | null> {
  try {
    const userPrompt = buildGeneralRagUserPrompt(question, citations, history);
    const routeRes = await routeLLMRequest(
      { systemPrompt: SYSTEM_PROMPT_GENERAL_RAG, userPrompt },
      keys
    );

    return {
      stream: stripImagesFromStream(routeRes.stream),
      provider: routeRes.provider,
      model: routeRes.model,
    };
  } catch (err) {
    console.error('[rag-synthesize] synthesizeRagAnswer lỗi:', err);
    return null;
  }
}
