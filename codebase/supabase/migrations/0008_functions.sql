create or replace function public.search_chunks_vector(
  query_embedding vector(768), match_count int default 20, min_similarity float default 0.0
)
returns table (chunk_id uuid, document_id uuid, content text, heading_path text, document_title text, similarity float)
language sql stable as $$
  select c.id, c.document_id, c.content, c.heading_path, d.title,
         1 - (c.embedding <=> query_embedding) as similarity
    from public.chunks c join public.documents d on d.id = c.document_id
   where d.status = 'published' and c.embedding is not null
     and 1 - (c.embedding <=> query_embedding) >= min_similarity
   order by c.embedding <=> query_embedding
   limit match_count;
$$;

create or replace function public.search_chunks_fts(query_text text, match_count int default 20)
returns table (chunk_id uuid, document_id uuid, content text, heading_path text, document_title text, rank float)
language sql stable as $$
  with q as (select websearch_to_tsquery('simple', public.immutable_unaccent(query_text)) as tsq)
  select c.id, c.document_id, c.content, c.heading_path, d.title,
         ts_rank_cd(c.content_tsv, q.tsq)::float
    from public.chunks c join public.documents d on d.id = c.document_id cross join q
   where d.status = 'published' and c.content_tsv @@ q.tsq
   order by ts_rank_cd(c.content_tsv, q.tsq) desc
   limit match_count;
$$;

create or replace function public.search_chunks_hybrid(
  query_text text, query_embedding vector(768), match_count int default 8, rrf_k int default 60
)
returns table (chunk_id uuid, document_id uuid, content text, heading_path text, document_title text,
               rrf_score float, vector_rank int, fts_rank int)
language sql stable as $$
  with v as (select chunk_id, row_number() over () as rnk from public.search_chunks_vector(query_embedding, 20, 0.0)),
       f as (select chunk_id, row_number() over () as rnk from public.search_chunks_fts(query_text, 20)),
       fused as (
         select coalesce(v.chunk_id, f.chunk_id) as chunk_id,
                coalesce(1.0/(rrf_k+v.rnk),0.0) + coalesce(1.0/(rrf_k+f.rnk),0.0) as score,
                v.rnk::int as v_rank, f.rnk::int as f_rank
           from v full outer join f on v.chunk_id = f.chunk_id
       )
  select c.id, c.document_id, c.content, c.heading_path, d.title, fused.score::float, fused.v_rank, fused.f_rank
    from fused join public.chunks c on c.id = fused.chunk_id
               join public.documents d on d.id = c.document_id
   order by fused.score desc limit match_count;
$$;

create or replace function public.match_faq(
  p_question text, p_embedding vector(768) default null, p_trgm_threshold float default 0.55
)
returns table (faq_id uuid, question text, answer text, match_type text, score float, priority int)
language sql stable as $$
  with norm as (select public.normalize_text(p_question) as q),
  exact as (
    select f.id, f.question, f.answer, 'exact'::text, 1.0::float, f.priority
      from public.faqs f, norm where f.is_active and f.question_norm = norm.q
    union all
    select f.id, f.question, f.answer, 'exact'::text, 1.0::float, f.priority
      from public.faq_variants fv join public.faqs f on f.id = fv.faq_id, norm
     where f.is_active and fv.question_norm = norm.q
  ),
  trigram as (
    select f.id, f.question, f.answer, 'trigram'::text, similarity(f.question_norm, norm.q)::float, f.priority
      from public.faqs f, norm where f.is_active and similarity(f.question_norm, norm.q) >= p_trgm_threshold
    union all
    select f.id, f.question, f.answer, 'trigram'::text, similarity(fv.question_norm, norm.q)::float, f.priority
      from public.faq_variants fv join public.faqs f on f.id = fv.faq_id, norm
     where f.is_active and similarity(fv.question_norm, norm.q) >= p_trgm_threshold
  ),
  vec as (
    select f.id, f.question, f.answer, 'vector'::text, (1-(f.embedding <=> p_embedding))::float, f.priority
      from public.faqs f
     where p_embedding is not null and f.is_active and f.embedding is not null
    union all
    select f.id, f.question, f.answer, 'vector'::text, (1-(fv.embedding <=> p_embedding))::float, f.priority
      from public.faq_variants fv join public.faqs f on f.id = fv.faq_id
     where p_embedding is not null and f.is_active and fv.embedding is not null
  )
  select distinct on (t.id) t.* from
    (select * from exact union all select * from trigram union all select * from vec)
    as t(id, question, answer, match_type, score, priority)
  order by t.id, t.score desc limit 5;
$$;

create or replace function public.record_unanswered(
  p_question text, p_embedding vector(768) default null, p_sim_threshold float default 0.88
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from public.unanswered_questions
   where question_norm = public.normalize_text(p_question) limit 1;

  if v_id is null and p_embedding is not null then
    select id into v_id from public.unanswered_questions
     where embedding is not null and 1 - (embedding <=> p_embedding) >= p_sim_threshold
     order by embedding <=> p_embedding limit 1;
  end if;

  if v_id is not null then
    update public.unanswered_questions set asked_count = asked_count + 1, last_asked_at = now() where id = v_id;
    return v_id;
  end if;

  insert into public.unanswered_questions (question, embedding) values (p_question, p_embedding) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.increment_faq_view(p_faq_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.faqs set view_count = view_count + 1 where id = p_faq_id;
$$;
