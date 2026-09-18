-- Guest is anonymous. Auth users have one profile; only trusted app metadata may provision staff roles.
begin;

create or replace function public.platform_new_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name, role)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data->>'display_name', ''), 100),
    case when new.raw_app_meta_data->>'platform_role' in ('lecture', 'admin')
      then new.raw_app_meta_data->>'platform_role' else 'student' end
  ) on conflict (id) do nothing;
  return new;
end $$;

-- Migration 0016 may already have backfilled these Auth users as students.
insert into public.profiles(id, display_name, role)
select id, left(coalesce(raw_user_meta_data->>'display_name', ''), 100),
  case when raw_app_meta_data->>'platform_role' in ('lecture', 'admin')
    then raw_app_meta_data->>'platform_role' else 'student' end
from auth.users
on conflict (id) do update set role = excluded.role, updated_at = now()
where public.profiles.role = 'student' and excluded.role in ('lecture', 'admin');

-- source_path is the object key inside this private bucket for uploaded materials.
alter table public.lecture_documents
  add column if not exists storage_bucket text,
  add column if not exists embedding_model text,
  add column if not exists indexed_revision integer,
  add column if not exists indexed_at timestamptz;

alter table public.lecture_documents
  add constraint lecture_documents_indexed_revision_check
  check (indexed_revision is null or indexed_revision between 1 and revision);
alter table public.lecture_documents
  add constraint lecture_documents_storage_bucket_check
  check (storage_bucket is null or storage_bucket = 'lecture-materials');

-- Keep the old response field for compatibility without labelling new rows as Qdrant data.
alter table public.lecture_documents alter column qdrant_collection set default '';

create index if not exists lecture_documents_published_indexed_idx
  on public.lecture_documents(id, revision)
  where status = 'published' and deleted_at is null and indexed_revision = revision;
create unique index if not exists lecture_documents_storage_object_idx
  on public.lecture_documents(storage_bucket, source_path)
  where storage_bucket is not null and deleted_at is null;

commit;
