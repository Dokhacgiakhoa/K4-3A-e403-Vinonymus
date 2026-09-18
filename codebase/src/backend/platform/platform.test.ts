import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { execute } from './controller';
import { endpoints, type EndpointSpec, type OperationId } from './endpoints';
import { responses } from './responses';
import type { PlatformDependencies } from './dependencies';
import type { Profile, AccountRole } from './models';
import type { Json } from '@/types/database';
import { ApiError, databaseError } from './http';
import { PLANNER_CATALOG } from '@/data/planner-catalog';

vi.mock('@/lib/llm/router', () => ({routeLLMRequest:vi.fn().mockRejectedValue(new Error('offline test'))}));
const db = new PGlite();
const actors = {student:randomUUID(),other:randomUUID(),lecture:randomUUID(),otherLecture:randomUUID(),admin:randomUUID()};
type Actor = keyof typeof actors;
const covered = new Set<OperationId>();
const revoked = new Set<string>();
const lab = PLANNER_CATALOG[0]!;
const documentBody = {title:'Prompt handbook',summary:'Reviewed learning references',labId:lab.labId,itemIds:[lab.items[0]!.itemId],
  sourcePath:'lecture/handbook.md',fileName:'handbook.md',fileType:'markdown',mimeType:'text/markdown',fileSizeBytes:100,contentHash:'a'.repeat(64)};
const deps: PlatformDependencies = {
  async identify(token) {
    const id = actors[token as Actor];
    if (!id || revoked.has(token)) throw new ApiError(401,'UNAUTHENTICATED','Invalid token');
    const profile = (await db.query<Profile>('select * from profiles where id=$1',[id])).rows[0]!;
    if (!profile.is_active) throw new ApiError(403,'ACCOUNT_DISABLED','Disabled');
    return profile;
  },
  async auth(action,input,token) {
    if (action==='logout') { revoked.add(token!); return {loggedOut:true}; }
    if (action==='register') return {requiresEmailConfirmation:true,session:null};
    if (action==='refresh' && input.refreshToken!=='valid') throw new ApiError(401,'AUTH_FAILED','Invalid refresh');
    return {accessToken:'student',refreshToken:'valid',expiresAt:2000000000,requiresEmailConfirmation:false,user:await this.identify('student')};
  },
  async rpc(name,args) {
    try {
      return (await db.query<{data:Json}>(`select ${name}($1::uuid,$2::text,$3::uuid,$4::jsonb) as data`,
        [args.p_actor,args.p_action,args.p_target,JSON.stringify(args.p_data)])).rows[0]!.data;
    } catch(error) { const e=error as {message:string;code:string}; databaseError(e.message,e.code); }
  },
};

async function call(op: OperationId, actor?:Actor, body?:unknown, params:Record<string,string>={}, expected=200, query='') {
  const spec:EndpointSpec = endpoints[op];
  const response = await execute(op,new Request('http://localhost/api/v1'+spec.path+query,{method:spec.method,
    headers:{...(actor ? {Authorization:'Bearer '+actor}:{}),...(body===undefined ? {}:{'Content-Type':'application/json'})},
    ...(body===undefined ? {}:{body:JSON.stringify(body)})}),params,deps);
  const payload = await response.json();
  expect(response.status,op+' '+JSON.stringify(payload)).toBe(expected);
  expect(response.headers.get('cache-control')).toBe('no-store');
  if (expected<300) {
    responses[spec.response]!.parse(payload.data);
    covered.add(op);
  }
  return payload.data;
}
beforeAll(async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}',raw_app_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql as 'select null::uuid';`);
  for (const name of ['0015_platform_roles_and_lecture_documents.sql','0016_four_role_workflows.sql','0017_review_hardening.sql','0018_platform_identity_and_material_metadata.sql'])
    await db.exec(readFileSync(new URL('../../../supabase/migrations/'+name,import.meta.url),'utf8'));
  for (const [key,id] of Object.entries(actors)) {
    await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)",[id,JSON.stringify({role:'admin',display_name:key})]);
    const role:AccountRole = key==='admin' ? 'admin' : key.toLowerCase().includes('lecture') ? 'lecture':'student';
    await db.query('update profiles set role=$2 where id=$1',[id,role]);
  }
},30000);
afterAll(async()=>{await db.close();});

describe('four-role API and real PostgreSQL workflows',()=>{
  it('publishes a catalog; validates auth inputs; reads/edits a profile',async()=>{
    await call('catalog');
    await call('register',undefined,{email:'learner@example.com',password:'password123',displayName:'Learner'}, {},201);
    await call('register',undefined,{email:'learner@example.com',password:'password123',displayName:'Learner',role:'admin'}, {},400);
    await call('login',undefined,{email:'learner@example.com',password:'password123'});
    await call('refresh',undefined,{refreshToken:'valid'});
    await call('refresh',undefined,{refreshToken:'invalid'}, {},401);
    await call('me','student');
    const updated=await call('updateMe','student',{displayName:'New name',background:'tech_base',goal:'Learn AI',weeklyMinutes:180});
    expect(updated.weekly_minutes).toBe(180);
    await call('updateMe','student',{role:'admin'}, {},400);
    await call('updateMe','student',{}, {},400);
    const id=randomUUID();
    await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)',[id,JSON.stringify({role:'admin'})]);
    expect((await db.query<{role:string}>('select role from profiles where id=$1',[id])).rows[0]!.role).toBe('student');
    const staffId=randomUUID();
    await db.query('insert into auth.users(id,raw_user_meta_data,raw_app_meta_data) values($1,$2,$3)',
      [staffId,JSON.stringify({display_name:'Demo Lecture',role:'admin'}),JSON.stringify({platform_role:'lecture'})]);
    expect((await db.query<{role:string}>('select role from profiles where id=$1',[staffId])).rows[0]!.role).toBe('lecture');
  });

  it('saves a roadmap and scopes progress to its owner and existing tasks',async()=>{
    await call('nodes','student');
    const analysis=await call('analyze','student',{background:'tech_base',goal:'Learn prompt engineering',available_minutes:60,cv_text:'I write JavaScript.'});
    expect(analysis.source).toBe('baseline');
    expect(analysis.requiresAssessment).toBe(true);
    const result=await call('createRoadmap','student',{background:'tech_base',available_minutes:60,lab_id:lab.labId});
    expect(result.status).toBe('plan');
    const id=result.roadmap.id;
    expect(result.roadmap.tasks.length).toBeGreaterThan(0);
    const itemId=result.roadmap.tasks[0].itemId;
    await call('roadmaps','student');
    await call('roadmap','student',undefined,{id});
    await call('roadmap','other',undefined,{id},404);
    const done=await call('task','student',{status:'completed'},{id,itemId});
    expect(done.tasks[0].completedAt).toBeTruthy();
    await call('task','other',{status:'completed'},{id,itemId},404);
    await call('task','student',{status:'completed'},{id,itemId:'does-not-exist'},404);
    await call('task','student',{status:'invented'},{id,itemId},400);
    const reverted=await call('updateProgress','student',{roadmapId:id,nodeId:itemId,status:'in_progress'});
    expect(reverted.tasks[0].completedAt).toBeNull();
    await call('progress','student');
    const rows=await call('roadmaps','other');
    expect(rows).toEqual([]);
    await call('deleteRoadmap','other',undefined,{id},404);
    await call('deleteRoadmap','student',undefined,{id});
    await call('roadmap','student',undefined,{id},404);
  });

  it('enforces document ownership, revisions and review before publication',async()=>{
    const doc=await call('createDocument','lecture',documentBody,{},201);
    const id=doc.id;
    await call('documents','lecture');
    await call('documents','lecture',undefined,{},400,'?limit=101');
    await call('documents','lecture',undefined,{},400,'?status=wrong');
    await call('document','lecture',undefined,{id});
    await call('document','otherLecture',undefined,{id},404);
    expect(await call('documents','otherLecture')).toEqual([]);
    await call('studentDocument','student',undefined,{id},404);
    await call('publishDocument','lecture',{revision:1},{id},409);
    await call('reviewDocument','lecture',{revision:1,decision:'approved',note:'Checked'},{id},409);
    await call('updateDocument','otherLecture',{...documentBody,revision:1},{id},404);
    const edited=await call('updateDocument','lecture',{...documentBody,title:'Updated title',revision:1},{id});
    expect(edited.revision).toBe(2);
    await call('updateDocument','lecture',{...documentBody,revision:1},{id},409);
    await call('submitDocument','lecture',{revision:2},{id});
    await call('publishDocument','lecture',{revision:2},{id},409);
    await call('reviewDocument','lecture',{revision:2,decision:'approved',note:'Owner cannot approve own document'},{id},409);
    await call('reviewDocument','otherLecture',{revision:2,decision:'approved',note:'Reviewed content and links'},{id});
    await call('publishDocument','lecture',{revision:2},{id},409);
    await call('publishDocument','otherLecture',{revision:2},{id});
    expect((await call('versions','lecture',undefined,{id})).length).toBe(2);
    expect((await call('reviews','lecture',undefined,{id}))[0].revision).toBe(2);
    const visible=await call('studentDocument','student',undefined,{id});
    expect(visible).not.toHaveProperty('source_path');
    expect(visible).not.toHaveProperty('content_hash');
    expect((await call('studentDocuments','student')).length).toBe(1);
    await call('updateDocument','lecture',{...documentBody,revision:2},{id},409);
    await call('deleteDocument','lecture',{revision:2},{id},409);
    await call('archiveDocument','lecture',{revision:2},{id});
    expect(await call('studentDocuments','student')).toEqual([]);
    await call('deleteDocument','lecture',{revision:2},{id});
    await call('document','lecture',undefined,{id},404);
    await call('createDocument','lecture',{...documentBody,itemIds:['bogus']},{},400);
    await call('createDocument','lecture',{...documentBody,mimeType:'application/pdf'},{},400);
  });

  it('admin moderates content, assigns roles and blocks accounts with audit',async()=>{
    const doc=await call('createDocument','lecture',{...documentBody,sourcePath:'lecture/admin-review.md'},{},201);const id=doc.id;
    await call('adminDocuments','admin');
    await call('adminDocument','admin',undefined,{id});
    await call('submitDocument','lecture',{revision:1},{id});
    await call('adminReview','admin',{revision:1,decision:'needs_changes',note:'Add context'},{id});
    await call('submitDocument','lecture',{revision:1},{id});
    await call('adminReview','admin',{revision:1,decision:'approved',note:'Approved'},{id});
    await call('adminPublish','admin',{revision:1},{id});
    await call('adminArchive','admin',{revision:1},{id});
    await call('adminDelete','admin',{revision:1},{id});
    await call('users','admin');
    await call('user','admin',undefined,{id:actors.other});
    await call('userRole','admin',{role:'lecture',tier:'vip'},{id:actors.other});
    await call('nodes','other',undefined,{},403);
    await call('userRole','admin',{role:'student'},{id:actors.other});
    await call('userStatus','admin',{isActive:false},{id:actors.other});
    await call('me','other',undefined,{},403);
    await call('userStatus','admin',{isActive:true},{id:actors.other});
    await call('me','other');
    await call('userRole','admin',{role:'student'},{id:actors.admin},403);
    await call('userStatus','admin',{isActive:false},{id:actors.admin},403);
    const audit=await call('audit','admin',undefined,{},200,'?limit=100');
    expect(audit.some((row:{action:string})=>row.action==='document.review')).toBe(true);
    expect(audit.some((row:{action:string})=>row.action==='user.role')).toBe(true);
    await call('analytics','admin');
  });

  it('checks authorization for EVERY protected operation and all inappropriate roles',async()=>{
    for(const [name,value] of Object.entries(endpoints)) {
      const spec:EndpointSpec=value;
      if (!spec.roles.length) continue;
      await call(name as OperationId,undefined,undefined,{},401);
      for(const actor of ['student','lecture','admin'] as const)
        if (!spec.roles.includes(actor)) await call(name as OperationId,actor,undefined,{},403);
    }
  });

  it('blocks direct SQL clients from bypassing server authorization',async()=>{
    await db.exec('grant select,insert,update,delete on all tables in schema public to authenticated');
    await db.exec('set role authenticated');
    try {
      await expect(db.query('select platform_admin($1,\'users\',null,\'{}\')',[actors.admin])).rejects.toThrow(/permission denied/);
      expect((await db.query('select * from profiles')).rows).toEqual([]);
      expect((await db.query('select * from lecture_documents')).rows).toEqual([]);
      expect((await db.query("update profiles set role='admin' where id=$1 returning id",[actors.student])).rows).toEqual([]);
      await expect(db.query("insert into profiles(id) values($1)",[randomUUID()])).rejects.toThrow(/row-level security/);
    } finally {await db.exec('reset role');}
    await db.exec('set role service_role');
    try {
      await expect(db.query('select platform_admin($1,\'users\',null,\'{}\')',[actors.student])).rejects.toThrow('FORBIDDEN');
      expect((await db.query<{data:Profile}>("select platform_profile($1,'get',null,'{}') data",[actors.student])).rows[0]!.data.role).toBe('student');
    } finally {await db.exec('reset role');}
  });

  it('rolls back a metadata mutation if its audit insert fails',async()=>{
    await db.exec("create function test_audit_failure() returns trigger language plpgsql as $$ begin raise exception 'test failure'; end $$; create trigger test_audit_failure before insert on platform_audit for each row execute function test_audit_failure();");
    try {
      await call('createDocument','lecture',{...documentBody,sourcePath:'rollback-test.md'},{},503);
      expect((await db.query("select id from lecture_documents where source_path='rollback-test.md'")).rows).toEqual([]);
    } finally {await db.exec('drop trigger test_audit_failure on platform_audit; drop function test_audit_failure();');}
  });

  it('handles malformed JSON, path IDs, media types and oversized bodies',async()=>{
    const request=(body:string,type='application/json')=>new Request('http://localhost/api/v1/me',{method:'PATCH',headers:{Authorization:'Bearer student','Content-Type':type},body});
    expect((await execute('updateMe',request('{'),{},deps)).status).toBe(400);
    expect((await execute('updateMe',request('{}','text/plain'),{},deps)).status).toBe(415);
    expect((await execute('updateMe',request(JSON.stringify({goal:'x'.repeat(129000)})),{},deps)).status).toBe(413);
    await call('roadmap','student',undefined,{id:'bad'},400);
  });

  it('logs out and covers every documented operation with a successful response',async()=>{
    await call('logout','student');
    await call('me','student',undefined,{},401);
    expect([...Object.keys(endpoints)].filter(id=>!covered.has(id as OperationId))).toEqual([]);
  });
});
