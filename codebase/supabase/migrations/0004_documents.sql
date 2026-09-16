create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  source_path  text        not null unique,   -- 'data/documents/lich-hoc/thoi-khoa-bieu-hk1.md'
  title        text        not null,
  content      text        not null,          -- markdown, NGUYÊN VĂN từ file
  summary      text,
  category_id  uuid        references public.categories(id) on delete set null,
  status       doc_status  not null default 'published',
  content_hash text        not null,          -- sha256 nội dung file, để sync bỏ qua file không đổi
  synced_at    timestamptz not null default now(),

  content_tsv  tsvector generated always as (
    to_tsvector('simple',
      public.immutable_unaccent(coalesce(title,'') || ' ' || coalesce(content,''))
    )
  ) stored
);

create index documents_status_idx   on public.documents (status);
create index documents_category_idx on public.documents (category_id);
create index documents_tsv_idx      on public.documents using gin (content_tsv);

create table public.document_tags (
  document_id uuid not null references public.documents(id) on delete cascade,
  tag_id      uuid not null references public.tags(id)      on delete cascade,
  primary key (document_id, tag_id)
);

create table public.chunks (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid not null references public.documents(id) on delete cascade,
  ordinal      int  not null,
  content      text not null,
  heading_path text,
  token_count  int,
  embedding    vector(768),                   -- NULL nếu embedding lỗi lúc sync — chunk vẫn tìm được qua FTS
  created_at   timestamptz not null default now(),

  content_tsv  tsvector generated always as (
    to_tsvector('simple',
      public.immutable_unaccent(coalesce(heading_path,'') || ' ' || coalesce(content,''))
    )
  ) stored,

  unique (document_id, ordinal)
);

create index chunks_document_idx  on public.chunks (document_id);
create index chunks_tsv_idx       on public.chunks using gin (content_tsv);
create index chunks_embedding_idx on public.chunks using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);
