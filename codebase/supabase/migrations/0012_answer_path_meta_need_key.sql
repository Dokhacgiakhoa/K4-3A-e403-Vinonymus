-- 0012 — Bổ sung 'meta' và 'need_key' vào enum answer_path
--
-- LÝ DO: pipeline hiện sinh ra 5 loại kết quả (meta / faq / rag / refused / need_key) nhưng enum
-- chỉ có 5 giá trị cũ ('faq','cache','rag','refused','error') — thiếu đúng 2 giá trị cần để ghi
-- query_logs:
--   'meta'     — câu chỉ là trò chuyện (tầng 0, hoặc tầng 4 khi LLM tự phán đoán INTENT: chat)
--   'need_key' — đã hiện lời nhắc nhập API key. KHÔNG ghi được giá trị này thì không thể tính
--                "tỉ lệ người dùng bỏ đi ngay khi thấy lời nhắc nhập key" (docs/00-TONG-QUAN.md mục 6).
--
-- Giá trị 'cache' vẫn giữ dù chưa dùng (tầng cache chưa nối vào pipeline) — xoá một giá trị enum
-- trong Postgres rất phiền, và nó sẽ dùng được ngay khi tầng cache được bật.

alter type public.answer_path add value if not exists 'meta';
alter type public.answer_path add value if not exists 'need_key';
