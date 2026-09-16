insert into public.app_settings (key, value, description) values
  ('faq_trigram_threshold', '0.75'::jsonb,   'Ngưỡng khớp trigram cho FAQ'),
  ('faq_vector_threshold',  '0.90'::jsonb,   'Ngưỡng cosine similarity cho FAQ'),
  ('rag_min_score',         '0.015'::jsonb,  'Điểm RRF tối thiểu để coi là có tài liệu liên quan'),
  ('rag_top_k',             '8'::jsonb,      'Số chunk đưa vào context của LLM'),
  ('rag_candidate_k',       '20'::jsonb,     'Số ứng viên lấy từ mỗi nhánh tìm kiếm'),
  ('chunk_size_tokens',     '800'::jsonb,    'Kích thước chunk mục tiêu'),
  ('chunk_overlap_ratio',   '0.15'::jsonb,   'Tỉ lệ chồng lấn giữa các chunk liền kề'),
  ('cache_ttl_days',        '7'::jsonb,      'Thời gian sống của cache ngữ nghĩa'),
  ('cache_enabled',         'true'::jsonb,   'Bật/tắt cache ngữ nghĩa'),
  ('conversation_context_turns', '6'::jsonb, 'Số lượt hội thoại gần nhất client gửi kèm làm ngữ cảnh'),
  ('refusal_message',
   '"Mình chưa tìm thấy thông tin này trong kho tài liệu của khóa học. Bạn thử diễn đạt lại câu hỏi nhé."'::jsonb,
   'Câu trả lời khi không đủ dữ liệu')
on conflict (key) do nothing;
