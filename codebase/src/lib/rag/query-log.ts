import { supabase } from '@/lib/supabase/client';
import type { AnswerPath } from '@/types/database';
import type { CitationItem } from '@/types/chat';

const ANSWER_EXCERPT_LIMIT = 500;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface QueryLogInput {
  question: string;
  path: AnswerPath;
  answer?: string;
  /** Chỉ ghi khi là UUID thật của bảng faqs — xem ghi chú trong hàm. */
  faqId?: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  clientSessionId?: string;
  citations?: CitationItem[];
}

/**
 * Ghi một lượt hỏi–đáp vào `query_logs`, trả về id để gắn đánh giá 👍/👎 (`query_feedback`).
 *
 * Best-effort: mọi lỗi đều nuốt và trả `null` — không bao giờ được làm hỏng câu trả lời đã stream
 * xong cho người dùng chỉ vì ghi log thất bại.
 *
 * TUYỆT ĐỐI không ghi API key của người dùng vào đây (AGENTS.md bất biến #2) — chỉ ghi tên
 * provider/model đã dùng.
 */
export async function logQuery(input: QueryLogInput): Promise<string | null> {
  try {
    // faq_id là khoá ngoại uuid tới bảng faqs. Nhưng khi Supabase không sẵn sàng, matchFaq() rơi
    // về bộ khớp local và trả faqId là *slug file* (vd "deadline-assignment-1"), không phải UUID —
    // nhét slug vào cột uuid sẽ lỗi. Chỉ ghi khi đúng dạng UUID, còn lại bỏ trống.
    const faqId = input.faqId && UUID_RE.test(input.faqId) ? input.faqId : null;

    // Dùng RPC thay vì insert trực tiếp: `query_logs` cố ý KHÔNG có policy SELECT (cho anon đọc
    // bảng này nghĩa là ai cũng đọc được câu hỏi của người khác), mà `insert ... returning id` lại
    // đòi quyền SELECT. Hàm SECURITY DEFINER chỉ trả đúng id bản ghi vừa tạo — xem migration 0013.
    const { data, error } = await supabase.rpc('log_query' as never, {
      p_question: input.question,
      p_path: input.path,
      p_answer_excerpt: input.answer ? input.answer.slice(0, ANSWER_EXCERPT_LIMIT) : null,
      p_citations: (input.citations ?? []) as never,
      p_faq_id: faqId,
      p_provider: input.provider ?? null,
      p_model: input.model ?? null,
      p_latency_ms: input.latencyMs ?? null,
      p_client_session_id: input.clientSessionId ?? null,
    } as never);

    if (error || !data) {
      console.warn('[query-log] Không ghi được query_logs:', error?.message);
      return null;
    }
    return data as unknown as string;
  } catch (err) {
    console.warn('[query-log] Lỗi ngoài dự kiến khi ghi query_logs:', err);
    return null;
  }
}
