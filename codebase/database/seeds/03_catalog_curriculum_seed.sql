-- D-05 canonical catalog seed: one idempotent source for the public lab catalog.
-- Run after migrations 0001-0009 with search_path set to app.
SET search_path TO app, public, extensions;

INSERT INTO curriculum_modules
  (id, module_number, title, slug, description, target_level, bloom_level,
   estimated_hours, human_ai_ratio, is_published)
VALUES
  ('d0500000-0000-0000-0000-000000000001', 901,
   'Lab 01 • Prompt Engineering & Tool Calling', 'lab-prompt-tool-calling',
   'Thiết kế prompt có cấu trúc và gọi công cụ an toàn trong ứng dụng AI.',
   'L1', 'Apply', 6, '30% AI - 70% Human', TRUE),
  ('d0500000-0000-0000-0000-000000000002', 902,
   'Lab 02 • AI Product Specification', 'lab-ai-product-spec',
   'Chuyển nhu cầu sản phẩm thành đặc tả có tiêu chí kiểm thử rõ ràng.',
   'L1', 'Apply', 6, '20% AI - 80% Human', TRUE),
  ('d0500000-0000-0000-0000-000000000003', 903,
   'Lab 03 • RAG Foundations', 'lab-rag-foundations',
   'Xây pipeline RAG nền tảng: chunking, embedding và truy hồi có nguồn.',
   'L2', 'Analyze', 8, '40% AI - 60% Human', TRUE)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  target_level = EXCLUDED.target_level,
  bloom_level = EXCLUDED.bloom_level,
  estimated_hours = EXCLUDED.estimated_hours,
  human_ai_ratio = EXCLUDED.human_ai_ratio,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO curriculum_topics
  (id, module_id, topic_number, title, slug, description,
   reading_time_minutes, is_published)
SELECT * FROM (VALUES
  ('d0510000-0000-0000-0000-000000000001'::uuid,
   'd0500000-0000-0000-0000-000000000001'::uuid, 1,
   'Prompt có cấu trúc và tool calling', 'lab-prompt-tool-calling-intro',
   'Các thành phần prompt, schema tham số và kiểm tra đầu vào trước khi gọi tool.', 35, TRUE),
  ('d0510000-0000-0000-0000-000000000002'::uuid,
   'd0500000-0000-0000-0000-000000000002'::uuid, 1,
   'Đặc tả sản phẩm AI có thể kiểm thử', 'lab-ai-product-spec-intro',
   'Viết user story, tiêu chí chấp nhận và các giới hạn an toàn cho tính năng AI.', 35, TRUE),
  ('d0510000-0000-0000-0000-000000000003'::uuid,
   'd0500000-0000-0000-0000-000000000003'::uuid, 1,
   'Chunking và truy hồi trong RAG', 'lab-rag-foundations-intro',
   'Chia đoạn tài liệu, tạo embedding và truy hồi các đoạn gần nhất có nguồn.', 45, TRUE)
) AS seed(id, module_id, topic_number, title, slug, description, reading_time_minutes, is_published)
ON CONFLICT (module_id, topic_number) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  is_published = EXCLUDED.is_published,
  updated_at = now();
