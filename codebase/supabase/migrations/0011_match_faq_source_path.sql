-- 0011 — Bổ sung source_path + ngưỡng vector cho match_faq()
--
-- LÝ DO: src/lib/rag/faq-match.ts cần source_path để suy ra slug file .md local, từ đó join lại
-- metadata chỉ có ở local (is_verified, verification_source, title, media_links) — DB trả về faq_id
-- là UUID nên không join trực tiếp được. Đồng thời matchFaqCandidates() truyền p_vector_threshold
-- riêng (khác p_trgm_threshold) để lấy danh sách ứng viên cho bước LLM xác minh.
--
-- Hàm này đã được áp trực tiếp lên DB production trước đó nhưng THIẾU file migration trong repo —
-- dựng DB mới từ 0008 sẽ cho ra bản cũ và làm hỏng app (join metadata trượt hết, và
-- matchFaqCandidates gọi hàm với tham số không tồn tại). File này khôi phục lại sự đồng bộ đó.
-- Nội dung chép nguyên văn từ pg_get_functiondef() của hàm đang chạy.
--
-- Không sửa 0008_functions.sql (bất biến: không sửa migration đã chạy production).

drop function if exists public.match_faq(text, vector, float);

create or replace function public.match_faq(
  p_question text,
  p_embedding vector(768) default null,
  p_trgm_threshold float default 0.55,
  p_vector_threshold float default 0.75
)
returns table (
  faq_id uuid, question text, answer text, match_type text,
  score float, priority int, source_path text
)
language sql stable as $$
  with norm as (select public.normalize_text(p_question) as q),
  exact as (
    select f.id, f.question, f.answer, 'exact'::text, 1.0::float, f.priority, f.source_path
      from public.faqs f, norm where f.is_active and f.question_norm = norm.q
    union all
    select f.id, f.question, f.answer, 'exact'::text, 1.0::float, f.priority, f.source_path
      from public.faq_variants fv join public.faqs f on f.id = fv.faq_id, norm
      where f.is_active and fv.question_norm = norm.q
  ),
  trigram as (
    select f.id, f.question, f.answer, 'trigram'::text, similarity(f.question_norm, norm.q)::float, f.priority, f.source_path
      from public.faqs f, norm where f.is_active and similarity(f.question_norm, norm.q) >= p_trgm_threshold
    union all
    select f.id, f.question, f.answer, 'trigram'::text, similarity(fv.question_norm, norm.q)::float, f.priority, f.source_path
      from public.faq_variants fv join public.faqs f on f.id = fv.faq_id, norm
      where f.is_active and similarity(fv.question_norm, norm.q) >= p_trgm_threshold
  ),
  vec as (
    select f.id, f.question, f.answer, 'vector'::text, (1-(f.embedding <=> p_embedding))::float, f.priority, f.source_path
      from public.faqs f
      where p_embedding is not null and f.is_active and f.embedding is not null
        and (1-(f.embedding <=> p_embedding)) >= p_vector_threshold
    union all
    select f.id, f.question, f.answer, 'vector'::text, (1-(fv.embedding <=> p_embedding))::float, f.priority, f.source_path
      from public.faq_variants fv join public.faqs f on f.id = fv.faq_id
      where p_embedding is not null and f.is_active and fv.embedding is not null
        and (1-(fv.embedding <=> p_embedding)) >= p_vector_threshold
  ),
  deduped as (
    select distinct on (t.id) t.* from
      (select * from exact union all select * from trigram union all select * from vec)
      as t(id, question, answer, match_type, score, priority, source_path)
    order by t.id, t.score desc
  )
  select * from deduped order by score desc limit 5;
$$;
