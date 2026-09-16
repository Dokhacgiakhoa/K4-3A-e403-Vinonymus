-- 0013 — RPC log_query(): ghi query_logs và trả về id
--
-- VÌ SAO CẦN RPC THAY VÌ INSERT TRỰC TIẾP:
-- `query_logs` chỉ có policy INSERT (0009), không có policy SELECT — cố ý, vì cho anon đọc bảng này
-- nghĩa là ai cũng đọc được toàn bộ câu hỏi của người khác. Nhưng client cần lấy lại `id` của bản
-- ghi vừa tạo để gắn đánh giá 👍/👎 (`query_feedback.query_log_id`), mà `insert ... returning id`
-- lại đòi quyền SELECT → dính lỗi "new row violates row-level security policy".
--
-- Giải pháp: hàm SECURITY DEFINER chỉ trả về đúng id của bản ghi VỪA TẠO, không mở đường đọc bản
-- ghi nào khác. Cùng khuôn với record_unanswered() ở 0008.

create or replace function public.log_query(
  p_question          text,
  p_path              text,
  p_answer_excerpt    text default null,
  p_citations         jsonb default '[]'::jsonb,
  p_faq_id            uuid default null,
  p_provider          text default null,
  p_model             text default null,
  p_latency_ms        int default null,
  p_client_session_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  insert into public.query_logs (
    question, answer_excerpt, path, citations, faq_id,
    provider, model, latency_ms, client_session_id
  ) values (
    p_question,
    left(p_answer_excerpt, 500),
    p_path::public.answer_path,
    coalesce(p_citations, '[]'::jsonb),
    p_faq_id,
    p_provider,
    p_model,
    p_latency_ms,
    p_client_session_id
  )
  returning id into v_id;

  return v_id;
end;
$$;
