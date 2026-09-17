-- Store uploaded files privately and embed their chunks in the same Postgres project.
begin;

create extension if not exists vector;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('lecture-materials', 'lecture-materials', false, 100000000,
  array['application/pdf', 'text/plain', 'text/markdown'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table public.lecture_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.lecture_documents(id) on delete cascade,
  revision integer not null check (revision > 0),
  ordinal integer not null check (ordinal >= 0),
  content text not null check (length(btrim(content)) > 0),
  heading_path text,
  token_count integer check (token_count is null or token_count >= 0),
  embedding vector(768) not null,
  created_at timestamptz not null default now(),
  unique (document_id, revision, ordinal)
);

create index lecture_document_chunks_document_idx
  on public.lecture_document_chunks(document_id, revision, ordinal);
create index lecture_document_chunks_embedding_idx
  on public.lecture_document_chunks using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

alter table public.lecture_document_chunks enable row level security;
revoke all on public.lecture_document_chunks from public, anon, authenticated;
grant select, insert, update, delete on public.lecture_document_chunks to service_role;

-- The API must call this only from its server-side service client.
create or replace function public.search_lecture_document_chunks(
  p_embedding vector(768), p_limit integer default 8, p_min_similarity double precision default 0
)
returns table(chunk_id uuid, document_id uuid, title text, content text, similarity double precision)
language sql stable security invoker set search_path = public as $$
  select c.id, d.id, d.title, c.content, 1 - (c.embedding <=> p_embedding)
  from public.lecture_document_chunks c
  join public.lecture_documents d on d.id = c.document_id
  where d.status = 'published' and d.deleted_at is null
    and d.indexed_revision = d.revision and c.revision = d.revision
    and 1 - (c.embedding <=> p_embedding) >= p_min_similarity
  order by c.embedding <=> p_embedding
  limit least(greatest(coalesce(p_limit, 8), 1), 50)
$$;

revoke all on function public.search_lecture_document_chunks(vector,integer,double precision)
  from public, anon, authenticated;
grant execute on function public.search_lecture_document_chunks(vector,integer,double precision)
  to service_role;

commit;
