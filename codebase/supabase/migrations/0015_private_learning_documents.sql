alter table public.documents
  add column if not exists audience text not null default 'public'
  check (audience in ('public', 'learning'));

create index if not exists documents_audience_idx on public.documents (audience);

drop policy if exists "documents_read" on public.documents;
create policy "documents_read" on public.documents for select
  using (status = 'published' and audience = 'public');

drop policy if exists "chunks_read" on public.chunks;
create policy "chunks_read" on public.chunks for select using (
  exists (
    select 1 from public.documents d
    where d.id = chunks.document_id
      and d.status = 'published'
      and d.audience = 'public'
  )
);

drop policy if exists "document_tags_read" on public.document_tags;
create policy "document_tags_read" on public.document_tags for select using (
  exists (
    select 1 from public.documents d
    where d.id = document_tags.document_id
      and d.status = 'published'
      and d.audience = 'public'
  )
);

-- Disable the three placeholder documents without deleting database history.
update public.documents
set status = 'archived', synced_at = now()
where source_path in (
  'data/documents/bai-tap/assignment-1.md',
  'data/documents/de-cuong/de-cuong-mon-hoc.md',
  'data/documents/lich-hoc/thoi-khoa-bieu-hk1.md'
);
