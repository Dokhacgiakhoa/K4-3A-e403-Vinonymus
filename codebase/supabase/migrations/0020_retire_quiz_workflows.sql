-- Quiz is retired from the public API. Keep legacy rows for audit/rollback, but
-- remove the server RPC grant so the old workflow cannot be called accidentally.
begin;

revoke all on function public.platform_quizzes(uuid, text, uuid, jsonb)
  from public, anon, authenticated, service_role;

commit;

