-- Role and knowledge-base metadata for the TypeScript/Next.js backend.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'student'
    check (role in ('student', 'lecture', 'admin')),
  tier text not null default 'free'
    check (tier in ('free', 'vip')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_tier_idx on public.profiles(tier);

-- The first role migration also upgrades the legacy metadata table in place.
-- Existing rows are assigned to the first authenticated profile and remain intact.
insert into public.profiles(id, display_name)
select id, left(coalesce(raw_user_meta_data->>'display_name', ''), 100)
from auth.users
on conflict (id) do nothing;
do $$
begin
  if to_regclass('public.lecture_documents') is not null
     and not exists (select 1 from information_schema.columns where table_schema='public' and table_name='lecture_documents' and column_name='owner_id') then
    alter table public.lecture_documents add column owner_id uuid;
    update public.lecture_documents set owner_id = (select id from public.profiles order by created_at, id limit 1);
    alter table public.lecture_documents alter column owner_id set not null;
    alter table public.lecture_documents add constraint lecture_documents_owner_id_fkey foreign key (owner_id) references public.profiles(id) on delete restrict;
  end if;
end $$;

create table if not exists public.lecture_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  source_path text not null,
  file_name text not null,
  file_type text not null check (file_type in ('pdf', 'text', 'markdown')),
  mime_type text not null,
  file_size_bytes bigint not null default 0,
  extracted_content text,
  qdrant_collection text not null default 'vlearn_documents',
  content_hash text not null,
  chunk_count integer not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'processing', 'review', 'published', 'archived', 'failed')),
  review_note text,
  published_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_path, content_hash)
);

create index if not exists lecture_documents_owner_idx on public.lecture_documents(owner_id);
create index if not exists lecture_documents_status_idx on public.lecture_documents(status);
create index if not exists lecture_documents_hash_idx on public.lecture_documents(content_hash);

create table if not exists public.lecture_document_reviews (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.lecture_documents(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  decision text not null check (decision in ('approved', 'rejected', 'needs_changes')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists lecture_document_reviews_document_idx
  on public.lecture_document_reviews(document_id, created_at desc);

create table if not exists public.knowledge_evaluations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.lecture_documents(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  question text not null,
  expected_answer text not null,
  actual_answer text,
  citation_ids text[] not null default '{}',
  score numeric(5,2),
  passed boolean,
  created_at timestamptz not null default now()
);

create table if not exists public.student_learning_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  node_id text not null,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, node_id)
);

create index if not exists student_learning_progress_student_idx
  on public.student_learning_progress(student_id);

alter table public.profiles enable row level security;
alter table public.lecture_documents enable row level security;
alter table public.lecture_document_reviews enable row level security;
alter table public.knowledge_evaluations enable row level security;
alter table public.student_learning_progress enable row level security;

create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id);
create policy "published_documents_read" on public.lecture_documents
  for select using (status = 'published' or auth.uid() = owner_id);
create policy "document_reviews_staff_read" on public.lecture_document_reviews
  for select using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('lecture', 'admin')
  ));
create policy "evaluations_staff_read" on public.knowledge_evaluations
  for select using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('lecture', 'admin')
  ));
create policy "student_progress_self_all" on public.student_learning_progress
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
