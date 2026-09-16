-- 0014 — RPC submit_feedback(): ghi/ghi đè đánh giá 👍👎
--
-- VÌ SAO CẦN RPC (cùng lý do với log_query ở 0013):
-- `query_feedback` chỉ có policy INSERT (0009). Nhưng FR-18 AC4 yêu cầu "đổi ý được" — gửi lại
-- cùng client_session_id thì ghi đè đánh giá cũ — tức là cần UPSERT, mà upsert đòi thêm quyền
-- UPDATE và SELECT. Mở 2 policy đó cho anon thì ai cũng sửa được đánh giá của người khác và đọc
-- được toàn bộ ghi chú người khác viết — không chấp nhận được.
--
-- Hàm SECURITY DEFINER này chỉ cho phép đúng một việc: ghi/ghi đè đánh giá của CHÍNH phiên đó
-- (khoá theo cặp query_log_id + client_session_id), không mở đường đọc hay sửa gì khác.

create or replace function public.submit_feedback(
  p_query_log_id      uuid,
  p_rating            smallint,
  p_reason            text default null,
  p_note              text default null,
  p_client_session_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if p_rating not in (-1, 1) then
    raise exception 'rating phải là 1 hoặc -1';
  end if;

  insert into public.query_feedback (query_log_id, rating, reason, note, client_session_id)
  values (p_query_log_id, p_rating, p_reason, p_note, p_client_session_id)
  on conflict (query_log_id, client_session_id)
  do update set rating = excluded.rating,
                reason = excluded.reason,
                note   = excluded.note
  returning id into v_id;

  return v_id;
end;
$$;
