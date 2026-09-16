create extension if not exists "vector";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";
create extension if not exists "pgcrypto";

create or replace function public.immutable_unaccent(text)
returns text language sql immutable parallel safe strict
as $$ select public.unaccent('public.unaccent', $1) $$;

create or replace function public.normalize_text(input text)
returns text language sql immutable parallel safe
as $$
  select regexp_replace(
           trim(lower(public.immutable_unaccent(
             replace(replace(coalesce(input, ''), 'đ', 'd'), 'Đ', 'D')
           ))),
           '\s+', ' ', 'g'
         )
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
