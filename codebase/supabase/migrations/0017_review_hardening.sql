-- Enforce independent review for lecture-owned documents.
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
    if (p.role = 'lecture' and d.owner_id <> p.id and p_action not in ('review','publish')) or (p.role = 'student' and d.status <> 'published') then raise exception 'NOT_FOUND'; end if;
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
      if p.role = 'lecture' and d.owner_id = p.id then raise exception 'SELF_REVIEW'; end if;
      if p_data->>'decision' not in ('approved','rejected','needs_changes') then raise exception 'INVALID_TRANSITION'; end if;
      next_status := case p_data->>'decision' when 'approved' then 'review' when 'rejected' then 'failed' else 'draft' end;
      insert into lecture_document_reviews(document_id,reviewer_id,decision,note,revision)
      values(d.id,p.id,p_data->>'decision',p_data->>'note',d.revision);
      update lecture_documents set status=next_status,review_note=p_data->>'note',
        approved_revision=case when p_data->>'decision'='approved' then revision else null end,updated_at=now()
      where id=d.id returning * into d;
    elsif p_action = 'publish' then
      if p.role = 'lecture' and d.owner_id = p.id then raise exception 'SELF_REVIEW'; end if;
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

revoke all on function public.platform_documents(uuid,text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.platform_documents(uuid,text,uuid,jsonb) to service_role;

create index if not exists platform_revoked_sessions_expires_idx
  on public.platform_revoked_sessions(expires_at);