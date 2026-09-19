create table if not exists public.chat_sessions (
  id             uuid primary key default gen_random_uuid(),
  owner_kind     text not null check (owner_kind in ('guest', 'user')),
  owner_key_hash text not null,
  expires_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (owner_kind, owner_key_hash)
);

create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.chat_sessions(id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null check (char_length(content) between 1 and 12000),
  citations   jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists chat_messages_session_created_idx
  on public.chat_messages (session_id, created_at desc);

create index if not exists chat_sessions_expires_idx
  on public.chat_sessions (expires_at)
  where expires_at is not null;

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Không tạo policy cho anon/authenticated: chỉ API server dùng service role được đọc/ghi memory.
revoke all on public.chat_sessions from anon, authenticated;
revoke all on public.chat_messages from anon, authenticated;
