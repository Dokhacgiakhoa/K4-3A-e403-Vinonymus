create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,          -- khớp tên thư mục trong data/documents/<slug>/
  name        text not null,
  description text,
  icon        text,
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);

create table public.tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

create index tags_name_trgm_idx on public.tags using gin (name gin_trgm_ops);
