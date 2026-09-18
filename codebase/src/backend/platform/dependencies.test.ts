import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlatformDependencies } from './dependencies';

const id='11111111-1111-4111-8111-111111111111';
const claims={exp:2000000000,sub:id};
const token='eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.signature';
const profile={id,display_name:'Student',role:'student',tier:'free',is_active:true,background:null,goal:'',weekly_minutes:120,created_at:'2026-01-01',updated_at:'2026-01-01'};
const user={id,aud:'authenticated',role:'authenticated',email:'learner@example.com',app_metadata:{},user_metadata:{},created_at:'2026-01-01'};
const requests:{url:string;headers:Headers;body:Record<string,unknown>}[]=[];
let revoked=false;
let confirmEmail=false;
let active=true;
let failRpc=false;
beforeEach(()=>{
  requests.length=0;revoked=false;confirmEmail=false;active=true;failRpc=false;
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://test.supabase.co');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','anon-test');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','service-test');
  vi.stubGlobal('fetch',vi.fn(async(input:RequestInfo|URL,init?:RequestInit)=>{
    const url=String(input);const headers=new Headers(init?.headers);
    const body=init?.body ? JSON.parse(String(init.body)): {};
    requests.push({url,headers,body});
    const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
    if(url.includes('/auth/v1/signup') && confirmEmail) return json(user);
    if(url.includes('/auth/v1/token') || url.includes('/auth/v1/signup')) return json({access_token:token,refresh_token:'refresh-test',token_type:'bearer',expires_in:3600,user});
    if(url.endsWith('/auth/v1/user')) return json(user);
    if(url.includes('/auth/v1/logout')) return new Response(null,{status:204});
    if(url.includes('platform_revoked_sessions')) {
      if(init?.method==='POST') {revoked=true;return new Response(null,{status:201});}
      return json(revoked ? {token_hash:'revoked'}:null);
    }
    if(url.includes('/rest/v1/profiles')) return json({...profile,is_active:active});
    if(url.includes('/rest/v1/rpc/')) return failRpc ? json({message:'internal table secret',code:'42P01'},404) : json(profile);
    throw new Error('Unexpected fetch '+url);
  }));
});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
describe('production Supabase adapter (mock HTTP transport)',()=>{
  it('uses normal signup without forcing confirmation or granting privileged roles',async()=>{
    confirmEmail=true;
    const result=await createPlatformDependencies().auth('register',{email:'learner@example.com',password:'password123',displayName:'Student'});
    expect(result).toEqual({requiresEmailConfirmation:true,session:null});
    const signup=requests.find(r=>r.url.includes('/signup'))!;
    expect(signup.headers.get('apikey')).toBe('anon-test');
    expect(signup.body).not.toHaveProperty('email_confirm');
    expect(signup.body.data).toEqual({display_name:'Student'});
  });
  it('keeps service RPC credentials separate from user login and refresh sessions',async()=>{
    const deps=createPlatformDependencies();
    expect(await deps.auth('login',{email:'learner@example.com',password:'password123'})).toMatchObject({accessToken:token,user:{role:'student'}});
    await deps.auth('refresh',{refreshToken:'refresh-test'});
    await deps.rpc('platform_profile',{p_actor:id,p_action:'get',p_target:null,p_data:{}});
    const rpc=requests.find(r=>r.url.includes('/rpc/'))!;
    expect(rpc.headers.get('authorization')).toBe('Bearer service-test');
    expect(requests.find(r=>r.url.includes('grant_type=refresh_token'))!.body.refresh_token).toBe('refresh-test');
  });
  it('rejects locked profiles and revoked access tokens and revokes refresh session on logout',async()=>{
    const deps=createPlatformDependencies();
    active=false;await expect(deps.identify(token)).rejects.toMatchObject({status:403,code:'ACCOUNT_DISABLED'});
    active=true;await deps.identify(token);
    await deps.auth('logout',{},token);
    expect(requests.some(r=>r.url.includes('/logout?scope=local'))).toBe(true);
    const stored=requests.find(r=>r.url.includes('platform_revoked_sessions')&&r.body.token_hash)!;
    expect(stored.body.token_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(stored.body)).not.toContain(token);
    await expect(deps.identify(token)).rejects.toMatchObject({status:401,code:'SESSION_REVOKED'});
  });
  it('fails closed on missing configuration and database errors without revealing internals',async()=>{
    failRpc=true;
    await expect(createPlatformDependencies().rpc('platform_profile',{p_actor:id,p_action:'get',p_target:null,p_data:{}})).rejects.toMatchObject({status:503,code:'DATABASE_UNAVAILABLE'});
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','');
    expect(()=>createPlatformDependencies()).toThrow('Chưa cấu hình');
  });
});
