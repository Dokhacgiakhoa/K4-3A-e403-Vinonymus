import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { endpoints } from '../src/backend/platform/endpoints';

async function main() {
  const reservation=createServer();
  reservation.listen(0,'127.0.0.1');
  await once(reservation,'listening');
  const address=reservation.address();
  if(!address || typeof address==='string') throw new Error('No test port');
  const port=address.port;
  await new Promise<void>((done,error)=>reservation.close(e=>e?error(e):done()));
  const env={...process.env};
  for(const name of ['NEXT_PUBLIC_SUPABASE_URL','SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY',
    'GEMINI_API_KEY','OPENAI_API_KEY','ANTHROPIC_API_KEY','DEEPSEEK_API_KEY','GROQ_API_KEY','CEREBRAS_API_KEY','FPT_API_KEY']) env[name]='';
  const child=spawn(process.execPath,[resolve('node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],
    {env,stdio:['ignore','pipe','pipe'],windowsHide:true});
  const exited=once(child,'exit');
  let log='';
  child.stdout.on('data',data=>{log+=String(data);});
  child.stderr.on('data',data=>{log+=String(data);});
  const base='http://127.0.0.1:'+port;
  const request=(path:string,init?:RequestInit)=>fetch(base+path,{...init,signal:AbortSignal.timeout(10000)});
  try {
    let ready=false;
    for(let i=0;i<100;i++){
      try {if((await request('/api/health')).ok){ready=true;break;}} catch { /* Chờ server test khởi động. */ }
      if(child.exitCode!==null) throw new Error(log);
      await sleep(200);
    }
    assert.ok(ready,'Next server failed to start');
    assert.equal((await request('/api/v1/catalog/labs')).status,200);
    let protectedCount=0;
    for(const spec of Object.values(endpoints)) {
      if(!spec.roles.length) continue;
      const url='/api/v1'+spec.path.replace('{id}','11111111-1111-4111-8111-111111111111').replace('{itemId}','ptc-setup-colab');
      const response=await request(url,{method:spec.method});
      assert.equal(response.status,401,spec.method+' '+spec.path);
      protectedCount++;
    }
    const post=(body:string)=>request('/api/roadmap',{method:'POST',headers:{'Content-Type':'application/json'},body});
    assert.equal((await post('{')).status,400);
    const planner=await post(JSON.stringify({background:'tech_base',available_minutes:60,lab_id:'lab-prompt-tool-calling',note:''}));
    assert.equal(planner.status,200);
    const result=await planner.json();
    assert.equal(result.status,'plan');
    assert.equal(result.source,'baseline');
    assert.ok(result.tasks.length>=1 && result.tasks.length<=3);
    console.log('HTTP smoke passed: health, catalog, '+protectedCount+' protected operations, invalid JSON and baseline Planner.');
  } finally {
    child.kill();
    await exited;
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
