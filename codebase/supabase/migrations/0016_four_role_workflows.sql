-- Additive upgrade from 0015. File parsing, vectors and retrieval remain external.
begin;

alter table public.profiles add column if not exists background text;
alter table public.profiles add column if not exists goal text not null default '';
alter table public.profiles add column if not exists weekly_minutes integer not null default 120;
alter table public.profiles add constraint profiles_background_check check (background in ('non_tech', 'tech_base', 'ai'));
alter table public.profiles add constraint profiles_minutes_check check (weekly_minutes between 0 and 10080);

create or replace function public.platform_new_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id, display_name, role) values
    (new.id, left(coalesce(new.raw_user_meta_data->>'display_name', ''), 100), 'student')
    on conflict (id) do nothing;
  return new;
end $$;
create trigger platform_new_profile after insert on auth.users
for each row execute function public.platform_new_profile();
insert into public.profiles(id, display_name)
select id, left(coalesce(raw_user_meta_data->>'display_name', ''), 100) from auth.users
on conflict (id) do nothing;

alter table public.lecture_documents add column if not exists title text not null default '';
alter table public.lecture_documents add column if not exists summary text not null default '';
alter table public.lecture_documents add column if not exists lab_id text;
alter table public.lecture_documents add column if not exists item_ids text[] not null default '{}';
alter table public.lecture_documents add column if not exists revision integer not null default 1;
alter table public.lecture_documents add column if not exists approved_revision integer;
alter table public.lecture_documents add column if not exists deleted_at timestamptz;
alter table public.lecture_document_reviews add column if not exists revision integer;
alter table public.lecture_documents drop constraint if exists lecture_documents_source_path_content_hash_key;
create unique index if not exists lecture_documents_owner_source_hash_idx
  on public.lecture_documents(owner_id, source_path, content_hash) where deleted_at is null;

create table public.platform_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_id uuid,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index platform_audit_time_idx on public.platform_audit(created_at desc);
create table public.lecture_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.lecture_documents(id),
  revision integer not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique(document_id, revision)
);

create table public.student_roadmaps (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  lab_id text not null,
  source text not null check (source in ('baseline', 'ai')),
  diagnosis jsonb not null,
  tasks jsonb not null check (jsonb_typeof(tasks) = 'array' and jsonb_array_length(tasks) between 1 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index student_roadmaps_owner_idx on public.student_roadmaps(student_id, created_at desc);

create table public.learning_quizzes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  title text not null,
  lab_id text not null,
  questions jsonb not null check (jsonb_typeof(questions) = 'array' and jsonb_array_length(questions) between 1 and 30),
  pass_percent integer not null default 70 check (pass_percent between 1 and 100),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  revision integer not null default 1,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.learning_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  quiz_id uuid not null references public.learning_quizzes(id),
  quiz_revision integer not null,
  request_id uuid not null,
  answers jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  unique(student_id, request_id)
);
create index learning_attempts_owner_idx on public.learning_quiz_attempts(student_id, created_at desc);
create table public.platform_revoked_sessions (
  token_hash text primary key,
  expires_at timestamptz not null
);

-- All platform reads/writes go through server-only RPCs. No direct client write
-- policies can bypass ownership, review transitions or role checks.
drop policy if exists profiles_self_read on public.profiles;
drop policy if exists published_documents_read on public.lecture_documents;
drop policy if exists document_reviews_staff_read on public.lecture_document_reviews;
drop policy if exists evaluations_staff_read on public.knowledge_evaluations;
drop policy if exists student_progress_self_all on public.student_learning_progress;
alter table public.platform_audit enable row level security;
alter table public.lecture_document_versions enable row level security;
alter table public.student_roadmaps enable row level security;
alter table public.learning_quizzes enable row level security;
alter table public.learning_quiz_attempts enable row level security;
alter table public.platform_revoked_sessions enable row level security;

create or replace function public.platform_require(p_actor uuid, p_roles text[]) returns public.profiles
language plpgsql security invoker set search_path = public as $$
declare p profiles;
begin
  select * into p from profiles where id = p_actor;
  if not found then raise exception 'UNAUTHENTICATED'; end if;
  if not p.is_active or not (p.role = any(p_roles)) then raise exception 'FORBIDDEN'; end if;
  return p;
end $$;

create or replace function public.platform_profile(p_actor uuid, p_action text, p_target uuid, p_data jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare p profiles;
begin
  p := platform_require(p_actor, array['student','lecture','admin']);
  if p_action = 'update' then
    update profiles set
      display_name = coalesce(p_data->>'displayName', display_name),
      background = coalesce(p_data->>'background', background),
      goal = coalesce(p_data->>'goal', goal),
      weekly_minutes = coalesce((p_data->>'weeklyMinutes')::int, weekly_minutes),
      updated_at = now()
    where id = p_actor returning * into p;
  elsif p_action <> 'get' then raise exception 'INVALID_ACTION'; end if;
  return to_jsonb(p);
end $$;

create or replace function public.platform_documents(p_actor uuid, p_action text, p_target uuid, p_data jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare p profiles; d lecture_documents; result jsonb; next_status text;
  lim int := least(100, greatest(1, coalesce((p_data->>'limit')::int,20)));
  offst int := greatest(0, coalesce((p_data->>'offset')::int,0));
begin
  p := platform_require(p_actor, array['student','lecture','admin']);
  if p_action = 'list' then
    select coalesce(jsonb_agg(to_jsonb(x)), '[]') into result from (
      select id,title,summary,lab_id,item_ids,file_type,status,revision,owner_id,published_at,updated_at
      from lecture_documents where deleted_at is null
        and (p.role = 'admin' or (p.role = 'lecture' and owner_id = p.id) or (p.role = 'student' and status = 'published'))
        and (p_data->>'status' is null or status = p_data->>'status')
      order by created_at desc,id limit lim offset offst
    ) x;
    return result;
  end if;
  if p_action = 'create' then
    if p.role not in ('lecture','admin') then raise exception 'FORBIDDEN'; end if;
    insert into lecture_documents(owner_id,title,summary,lab_id,item_ids,source_path,file_name,file_type,mime_type,file_size_bytes,content_hash)
    values(p.id,p_data->>'title',p_data->>'summary',p_data->>'labId',array(select jsonb_array_elements_text(p_data->'itemIds')),
      p_data->>'sourcePath',p_data->>'fileName',p_data->>'fileType',p_data->>'mimeType',
      (p_data->>'fileSizeBytes')::bigint,p_data->>'contentHash') returning * into d;
  else
    select * into d from lecture_documents where id = p_target and deleted_at is null for update;
    if not found then raise exception 'NOT_FOUND'; end if;
    if (p.role = 'lecture' and d.owner_id <> p.id) or (p.role = 'student' and d.status <> 'published') then raise exception 'NOT_FOUND'; end if;
    if p_action = 'get' then
      if p.role = 'student' then
        return jsonb_build_object('id',d.id,'title',d.title,'summary',d.summary,'lab_id',d.lab_id,'item_ids',d.item_ids,
          'file_type',d.file_type,'status',d.status,'revision',d.revision,'published_at',d.published_at);
      end if;
      return to_jsonb(d) - 'extracted_content';
    end if;
    if p.role not in ('lecture','admin') then raise exception 'FORBIDDEN'; end if;
    if p_action = 'versions' then
      select coalesce(jsonb_agg(to_jsonb(v) order by revision desc),'[]') into result
      from lecture_document_versions v where document_id=d.id;
      return result;
    end if;
    if p_action = 'reviews' then
      select coalesce(jsonb_agg(to_jsonb(r) order by created_at desc),'[]') into result
      from lecture_document_reviews r where document_id=d.id;
      return result;
    end if;
    if coalesce((p_data->>'revision')::int,0) <> d.revision then raise exception 'REVISION_CONFLICT'; end if;
    if p_action = 'update' then
      if d.status = 'published' then raise exception 'ARCHIVE_BEFORE_EDIT'; end if;
      update lecture_documents set title=p_data->>'title',summary=p_data->>'summary',lab_id=p_data->>'labId',
        item_ids=array(select jsonb_array_elements_text(p_data->'itemIds')),source_path=p_data->>'sourcePath',
        file_name=p_data->>'fileName',file_type=p_data->>'fileType',mime_type=p_data->>'mimeType',
        file_size_bytes=(p_data->>'fileSizeBytes')::bigint,content_hash=p_data->>'contentHash',
        revision=revision+1,approved_revision=null,status='draft',review_note=null,published_at=null,published_by=null,updated_at=now()
      where id=d.id returning * into d;
    elsif p_action = 'submit' then
      if d.status not in ('draft','failed') then raise exception 'INVALID_TRANSITION'; end if;
      update lecture_documents set status='review',approved_revision=null,updated_at=now() where id=d.id returning * into d;
    elsif p_action = 'review' then
      if d.status <> 'review' then raise exception 'INVALID_TRANSITION'; end if;
      if p_data->>'decision' not in ('approved','rejected','needs_changes') then raise exception 'INVALID_TRANSITION'; end if;
      next_status := case p_data->>'decision' when 'approved' then 'review' when 'rejected' then 'failed' else 'draft' end;
      insert into lecture_document_reviews(document_id,reviewer_id,decision,note,revision)
      values(d.id,p.id,p_data->>'decision',p_data->>'note',d.revision);
      update lecture_documents set status=next_status,review_note=p_data->>'note',
        approved_revision=case when p_data->>'decision'='approved' then revision else null end,updated_at=now()
      where id=d.id returning * into d;
    elsif p_action = 'publish' then
      if d.status <> 'review' or d.approved_revision is distinct from d.revision then raise exception 'REVIEW_REQUIRED'; end if;
      update lecture_documents set status='published',published_by=p.id,published_at=now(),updated_at=now()
      where id=d.id returning * into d;
    elsif p_action = 'archive' then
      update lecture_documents set status='archived',approved_revision=null,updated_at=now() where id=d.id returning * into d;
    elsif p_action = 'delete' then
      if d.status = 'published' then raise exception 'ARCHIVE_BEFORE_DELETE'; end if;
      update lecture_documents set deleted_at=now(),status='archived',updated_at=now() where id=d.id returning * into d;
    else raise exception 'INVALID_ACTION'; end if;
  end if;
  if p_action in ('create','update') then
    insert into lecture_document_versions(document_id,revision,snapshot) values(d.id,d.revision,to_jsonb(d)-'extracted_content');
  end if;
  insert into platform_audit(actor_id,action,resource_id,details)
  values(p.id,'document.'||p_action,d.id,jsonb_build_object('revision',d.revision,'status',d.status));
  return to_jsonb(d)-'extracted_content';
end $$;

create or replace function public.platform_learning(p_actor uuid, p_action text, p_target uuid, p_data jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare r student_roadmaps; result jsonb; task jsonb; v_tasks jsonb := '[]'; matched boolean := false;
begin
  perform platform_require(p_actor, array['student']);
  if p_action='create' then
    insert into student_roadmaps(student_id,lab_id,source,diagnosis,tasks)
    values(p_actor,p_data->>'labId',p_data->>'source',p_data->'diagnosis',p_data->'tasks') returning * into r;
    return to_jsonb(r);
  elsif p_action='list' then
    select coalesce(jsonb_agg(to_jsonb(x)),'[]') into result from (
      select * from student_roadmaps where student_id=p_actor order by created_at desc,id
      limit least(100,coalesce((p_data->>'limit')::int,20)) offset coalesce((p_data->>'offset')::int,0)
    ) x;
    return result;
  elsif p_action='progress' then
    select coalesce(jsonb_agg(to_jsonb(x)),'[]') into result from (
      select id as roadmap_id,lab_id,tasks,updated_at from student_roadmaps where student_id=p_actor order by updated_at desc,id
      limit least(100,coalesce((p_data->>'limit')::int,20)) offset coalesce((p_data->>'offset')::int,0)
    ) x;
    return result;
  end if;
  select * into r from student_roadmaps where id=p_target and student_id=p_actor for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if p_action='get' then return to_jsonb(r); end if;
  if p_action='delete' then delete from student_roadmaps where id=r.id; return jsonb_build_object('id',r.id,'deleted',true); end if;
  if p_action <> 'task' then raise exception 'INVALID_ACTION'; end if;
  for task in select value from jsonb_array_elements(r.tasks) loop
    if task->>'itemId' = p_data->>'itemId' then
      matched := true;
      task := task || jsonb_build_object('status',p_data->>'status','completedAt',
        case when p_data->>'status'='completed' then to_jsonb(now()) else 'null'::jsonb end);
    end if;
    v_tasks := v_tasks || jsonb_build_array(task);
  end loop;
  if not matched then raise exception 'NOT_FOUND'; end if;
  update student_roadmaps set tasks=v_tasks,updated_at=now() where id=r.id;
  return to_jsonb(r) || jsonb_build_object('tasks',v_tasks,'updated_at',now());
end $$;

create or replace function public.platform_quizzes(p_actor uuid, p_action text, p_target uuid, p_data jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare p profiles; q learning_quizzes; a learning_quiz_attempts; result jsonb; question jsonb;
  details jsonb := '[]'; correct int := 0; score numeric; choice text;
begin
  p := platform_require(p_actor,array['student','lecture','admin']);
  if p_action='submit' then
    if p.role<>'student' then raise exception 'FORBIDDEN'; end if;
    select * into a from learning_quiz_attempts where student_id=p.id and request_id=(p_data->>'requestId')::uuid;
    if found then
      if a.quiz_id is distinct from p_target or a.answers is distinct from p_data->'answers'
        or a.quiz_revision is distinct from (p_data->>'revision')::int then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
      return to_jsonb(a);
    end if;
  end if;
  if p_action='list' then
    select coalesce(jsonb_agg(to_jsonb(x)),'[]') into result from (
      select id,title,lab_id,status,revision,pass_percent,jsonb_array_length(questions) as question_count,owner_id from learning_quizzes
      where deleted_at is null and (p.role='admin' or (p.role='lecture' and owner_id=p.id) or (p.role='student' and status='published'))
      order by created_at desc,id limit least(100,coalesce((p_data->>'limit')::int,20)) offset coalesce((p_data->>'offset')::int,0)
    ) x;
    return result;
  elsif p_action='attempts' then
    if p.role <> 'student' then raise exception 'FORBIDDEN'; end if;
    select coalesce(jsonb_agg(to_jsonb(x)),'[]') into result from (
      select * from learning_quiz_attempts where student_id=p.id order by created_at desc,id
      limit least(100,coalesce((p_data->>'limit')::int,20)) offset coalesce((p_data->>'offset')::int,0)
    ) x;
    return result;
  elsif p_action='attempt' then
    select * into a from learning_quiz_attempts where id=p_target and student_id=p.id;
    if not found then raise exception 'NOT_FOUND'; end if;
    return to_jsonb(a);
  elsif p_action='create' then
    if p.role not in ('lecture','admin') then raise exception 'FORBIDDEN'; end if;
    insert into learning_quizzes(owner_id,title,lab_id,questions,pass_percent)
    values(p.id,p_data->>'title',p_data->>'labId',p_data->'questions',(p_data->>'passPercent')::int) returning * into q;
  else
    select * into q from learning_quizzes where id=p_target and deleted_at is null for update;
    if not found then raise exception 'NOT_FOUND'; end if;
    if (p.role='lecture' and q.owner_id<>p.id) or (p.role='student' and q.status<>'published') then raise exception 'NOT_FOUND'; end if;
    if p_action='get' then
      if p.role='student' then
        select jsonb_agg(value - 'correctOption' - 'explanation') into result from jsonb_array_elements(q.questions);
        return (to_jsonb(q)-'questions') || jsonb_build_object('questions',result);
      end if;
      return to_jsonb(q);
    elsif p_action='submit' then
      if p.role<>'student' then raise exception 'FORBIDDEN'; end if;
      select * into a from learning_quiz_attempts where student_id=p.id and request_id=(p_data->>'requestId')::uuid;
      if found then
        if a.quiz_id<>q.id or a.answers<>p_data->'answers'
          or a.quiz_revision is distinct from (p_data->>'revision')::int then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
        return to_jsonb(a);
      end if;
      if coalesce((p_data->>'revision')::int,0)<>q.revision then raise exception 'REVISION_CONFLICT'; end if;
      if jsonb_array_length(p_data->'answers')<>jsonb_array_length(q.questions) then raise exception 'INVALID_ANSWERS'; end if;
      if (select count(distinct value->>'questionId') from jsonb_array_elements(p_data->'answers'))<>jsonb_array_length(q.questions) then raise exception 'INVALID_ANSWERS'; end if;
      for question in select value from jsonb_array_elements(q.questions) loop
        select value->>'option' into choice from jsonb_array_elements(p_data->'answers') where value->>'questionId'=question->>'id';
        if choice is null or not (question->'options' ? choice) then raise exception 'INVALID_ANSWERS'; end if;
        if choice=question->>'correctOption' then correct:=correct+1; end if;
        details:=details||jsonb_build_array(jsonb_build_object('questionId',question->>'id','correct',choice=question->>'correctOption',
          'correctOption',question->>'correctOption','explanation',question->>'explanation'));
      end loop;
      score:=round(correct*100.0/jsonb_array_length(q.questions),2);
      insert into learning_quiz_attempts(student_id,quiz_id,quiz_revision,request_id,answers,result)
      values(p.id,q.id,q.revision,(p_data->>'requestId')::uuid,p_data->'answers',jsonb_build_object(
        'correctAnswers',correct,'totalQuestions',jsonb_array_length(q.questions),'scorePercent',score,'passed',score>=q.pass_percent,'details',details)) returning * into a;
      return to_jsonb(a);
    end if;
    if p.role not in ('lecture','admin') then raise exception 'FORBIDDEN'; end if;
    if coalesce((p_data->>'revision')::int,0)<>q.revision then raise exception 'REVISION_CONFLICT'; end if;
    if p_action='update' then
      if q.status='published' then raise exception 'ARCHIVE_BEFORE_EDIT'; end if;
      update learning_quizzes set title=p_data->>'title',lab_id=p_data->>'labId',questions=p_data->'questions',
        pass_percent=(p_data->>'passPercent')::int,revision=revision+1,status='draft',updated_at=now() where id=q.id returning * into q;
    elsif p_action='publish' then
      if q.status<>'draft' then raise exception 'INVALID_TRANSITION'; end if;
      update learning_quizzes set status='published',updated_at=now() where id=q.id returning * into q;
    elsif p_action='archive' then
      update learning_quizzes set status='archived',updated_at=now() where id=q.id returning * into q;
    elsif p_action='delete' then
      if q.status='published' then raise exception 'ARCHIVE_BEFORE_DELETE'; end if;
      update learning_quizzes set deleted_at=now(),status='archived',updated_at=now() where id=q.id returning * into q;
    else raise exception 'INVALID_ACTION'; end if;
  end if;
  insert into platform_audit(actor_id,action,resource_id) values(p.id,'quiz.'||p_action,q.id);
  return to_jsonb(q);
end $$;

create or replace function public.platform_admin(p_actor uuid,p_action text,p_target uuid,p_data jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare p profiles; result jsonb;
begin
  perform platform_require(p_actor,array['admin']);
  if p_action='users' then
    select coalesce(jsonb_agg(to_jsonb(x)),'[]') into result from (
      select * from profiles where (p_data->>'role' is null or role=p_data->>'role')
      order by created_at desc,id limit least(100,coalesce((p_data->>'limit')::int,20)) offset coalesce((p_data->>'offset')::int,0)
    ) x;
    return result;
  elsif p_action='audit' then
    select coalesce(jsonb_agg(to_jsonb(x)),'[]') into result from (
      select * from platform_audit order by created_at desc,id
      limit least(100,coalesce((p_data->>'limit')::int,20)) offset coalesce((p_data->>'offset')::int,0)
    ) x;
    return result;
  elsif p_action='analytics' then
    return jsonb_build_object('users',(select count(*) from profiles),'activeUsers',(select count(*) from profiles where is_active),
      'publishedDocuments',(select count(*) from lecture_documents where status='published' and deleted_at is null),
      'pendingReviews',(select count(*) from lecture_documents where status='review' and approved_revision is null and deleted_at is null),
      'roadmaps',(select count(*) from student_roadmaps),'quizAttempts',(select count(*) from learning_quiz_attempts));
  end if;
  -- Serialize admin changes to prevent two admins concurrently disabling the last admin.
  perform pg_advisory_xact_lock(617403);
  perform platform_require(p_actor,array['admin']);
  select * into p from profiles where id=p_target for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if p_action='get' then return to_jsonb(p); end if;
  if p_target=p_actor then raise exception 'SELF_CHANGE_FORBIDDEN'; end if;
  if p.role='admin' and p.is_active and (p_action='status' and not (p_data->>'isActive')::boolean or p_action='role' and p_data->>'role'<>'admin') then
    if (select count(*) from profiles where role='admin' and is_active)<=1 then raise exception 'LAST_ADMIN'; end if;
  end if;
  if p_action='role' then
    update profiles set role=p_data->>'role',tier=coalesce(p_data->>'tier',tier),updated_at=now() where id=p.id returning * into p;
  elsif p_action='status' then
    update profiles set is_active=(p_data->>'isActive')::boolean,updated_at=now() where id=p.id returning * into p;
  else raise exception 'INVALID_ACTION'; end if;
  insert into platform_audit(actor_id,action,resource_id,details) values(p_actor,'user.'||p_action,p.id,p_data);
  return to_jsonb(p);
end $$;

revoke all on function public.platform_new_profile() from public,anon,authenticated;
revoke all on function public.platform_require(uuid,text[]) from public,anon,authenticated;
revoke all on function public.platform_profile(uuid,text,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.platform_documents(uuid,text,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.platform_learning(uuid,text,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.platform_quizzes(uuid,text,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.platform_admin(uuid,text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.platform_require(uuid,text[]) to service_role;
grant execute on function public.platform_profile(uuid,text,uuid,jsonb) to service_role;
grant execute on function public.platform_documents(uuid,text,uuid,jsonb) to service_role;
grant execute on function public.platform_learning(uuid,text,uuid,jsonb) to service_role;
grant execute on function public.platform_quizzes(uuid,text,uuid,jsonb) to service_role;
grant execute on function public.platform_admin(uuid,text,uuid,jsonb) to service_role;
grant all on public.profiles,public.lecture_documents,public.lecture_document_reviews,public.lecture_document_versions,
  public.platform_audit,public.student_roadmaps,public.learning_quizzes,public.learning_quiz_attempts,public.platform_revoked_sessions to service_role;
commit;
