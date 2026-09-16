create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  source_path text not null unique,           -- 'data/faqs/deadline-assignment-2.md'
  question    text not null,
  answer      text not null,
  category_id uuid references public.categories(id) on delete set null,
  priority    int  not null default 0,
  is_active   boolean not null default true,
  view_count  int  not null default 0,        -- CHỈ cột này được app cập nhật lúc runtime (tăng dần)
  embedding   vector(768),
  content_hash text not null,
  synced_at   timestamptz not null default now(),

  question_norm text generated always as (public.normalize_text(question)) stored,
  question_tsv  tsvector generated always as (
    to_tsvector('simple', public.immutable_unaccent(coalesce(question,'')))
  ) stored
);

create index faqs_active_idx    on public.faqs (is_active) where is_active;
create index faqs_norm_idx      on public.faqs (question_norm);
create index faqs_tsv_idx       on public.faqs using gin (question_tsv);
create index faqs_trgm_idx      on public.faqs using gin (question_norm gin_trgm_ops);
create index faqs_embedding_idx on public.faqs using hnsw (embedding vector_cosine_ops);

create table public.faq_variants (
  id         uuid primary key default gen_random_uuid(),
  faq_id     uuid not null references public.faqs(id) on delete cascade,
  question   text not null,
  embedding  vector(768),

  question_norm text generated always as (public.normalize_text(question)) stored,
  question_tsv  tsvector generated always as (
    to_tsvector('simple', public.immutable_unaccent(coalesce(question,'')))
  ) stored
);

create index faq_variants_faq_idx       on public.faq_variants (faq_id);
create index faq_variants_norm_idx      on public.faq_variants (question_norm);
create index faq_variants_tsv_idx       on public.faq_variants using gin (question_tsv);
create index faq_variants_trgm_idx      on public.faq_variants using gin (question_norm gin_trgm_ops);
create index faq_variants_embedding_idx on public.faq_variants using hnsw (embedding vector_cosine_ops);
