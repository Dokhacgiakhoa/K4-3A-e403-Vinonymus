create table public.unanswered_questions (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  question_norm text generated always as (public.normalize_text(question)) stored,
  embedding     vector(768),
  asked_count   int  not null default 1,
  last_asked_at timestamptz not null default now(),
  state         unanswered_state not null default 'pending',
  resolved_faq_id uuid references public.faqs(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index unanswered_state_idx     on public.unanswered_questions (state, asked_count desc);
create index unanswered_norm_idx      on public.unanswered_questions (question_norm);
create index unanswered_embedding_idx on public.unanswered_questions using hnsw (embedding vector_cosine_ops);

create table public.semantic_cache (
  id            uuid primary key default gen_random_uuid(),
  question_hash text not null unique,
  question      text not null,
  answer        text not null,
  citations     jsonb not null default '[]'::jsonb,
  hit_count     int  not null default 0,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null
);

create index semantic_cache_expires_idx on public.semantic_cache (expires_at);

create table public.app_settings (
  key         text primary key,
  value       jsonb not null,
  description text,
  updated_at  timestamptz not null default now()
);
