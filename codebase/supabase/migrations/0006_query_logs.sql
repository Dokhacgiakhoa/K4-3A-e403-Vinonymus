create table public.query_logs (
  id                uuid primary key default gen_random_uuid(),
  question          text not null,
  question_norm     text generated always as (public.normalize_text(question)) stored,
  answer_excerpt    text,                       -- 500 ký tự đầu, đủ để xem nhanh trong thống kê
  path              answer_path not null,
  citations         jsonb not null default '[]'::jsonb,
  faq_id            uuid references public.faqs(id) on delete set null,
  provider          text,                       -- provider CỦA NGƯỜI DÙNG đã dùng, vd 'gemini'
  model             text,
  latency_ms        int,
  client_session_id text,                       -- uuid ngẫu nhiên sinh ở trình duyệt, KHÔNG định danh cá nhân
  created_at        timestamptz not null default now()
);

create index query_logs_created_idx on public.query_logs (created_at desc);
create index query_logs_path_idx    on public.query_logs (path, created_at desc);
create index query_logs_norm_idx    on public.query_logs (question_norm);

create table public.query_feedback (
  id                uuid primary key default gen_random_uuid(),
  query_log_id      uuid not null references public.query_logs(id) on delete cascade,
  rating            smallint not null check (rating in (-1, 1)),
  reason            text check (reason in ('wrong','incomplete','irrelevant','other')),
  note              text,
  client_session_id text,
  created_at        timestamptz not null default now(),
  unique (query_log_id, client_session_id)      -- vẫn chặn spam đánh giá lặp, chỉ khác là theo session ẩn danh
);
