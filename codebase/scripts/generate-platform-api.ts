import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { z } from 'zod';
import { endpoints, type EndpointSpec } from '../src/backend/platform/endpoints';
import { responses, errorSchema } from '../src/backend/platform/responses';

const specs = Object.entries(endpoints) as [string,EndpointSpec][];
const schema = (value:z.ZodTypeAny) => zodToJsonSchema(value, {target:'openApi3',$refStrategy:'none'});
const paths:Record<string,Record<string,unknown>> = {};
for(const [operationId,spec] of specs) {
  const parameters:unknown[] = [...spec.path.matchAll(/\{(\w+)\}/g)].map(match=>({
    name:match[1],in:'path',required:true,schema:{type:'string',...(match[1]==='id'?{format:'uuid'}:{})},
  }));
  if (spec.query) {
    const query=schema(spec.query) as {properties:Record<string,unknown>;required?:string[]};
    for(const [name,property] of Object.entries(query.properties)) parameters.push({name,in:'query',required:query.required?.includes(name)??false,schema:property});
  }
  const success={type:'object',required:['data',...(spec.query?['meta']:[])],properties:{
    data:{$ref:'#/components/schemas/'+spec.response},
    ...(spec.query?{meta:{type:'object',required:['limit','offset','count'],properties:{limit:{type:'integer'},offset:{type:'integer'},count:{type:'integer'}}}}:{}),
  }};
  (paths[spec.path]??={})[spec.method.toLowerCase()] = {
    operationId,tags:[spec.feature],summary:spec.summary,'x-roles':spec.roles.length?spec.roles:['guest'],
    security:spec.roles.length?[{bearerAuth:[]}]:[],parameters,
    ...(spec.body?{requestBody:{required:true,content:{'application/json':{schema:schema(spec.body)}}}}:{}),
    responses:{
      [spec.status??200]:{description:'Success',content:{'application/json':{schema:success}}},
      ...Object.fromEntries([400,401,403,404,409,413,415,500,503].map(code=>[code,{description:{
        400:'Invalid input',401:'Missing/invalid token',403:'Forbidden/disabled account',404:'Missing or outside ownership',
        409:'Revision/state/duplicate conflict',413:'Body exceeds 128 KB',415:'JSON required',500:'Internal error',503:'Configuration/provider/database unavailable',
      }[code],content:{'application/json':{schema:{$ref:'#/components/schemas/Error'}}}}])),
    },
  };
}
const openapi={openapi:'3.0.3',info:{title:'Vinonymus Four-role API',version:'1.0.0',
  description:'TypeScript / Next.js. Document endpoints manage metadata only; Qdrant ingestion and file transfer are deferred. Guest is unauthenticated, VIP is a tier.'},
  servers:[{url:'http://localhost:3000/api/v1'}],paths,
  components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer',bearerFormat:'Supabase JWT'}},
    schemas:{...Object.fromEntries(Object.entries(responses).map(([name,value])=>[name,schema(value)])),Error:schema(errorSchema)}},
};

const lab='lab-prompt-tool-calling';
const doc={title:'Prompt handbook',summary:'References for learning prompts',labId:lab,itemIds:['ptc-prompt-basics'],
  sourcePath:'lecture/handbook.md',fileName:'handbook.md',fileType:'markdown',mimeType:'text/markdown',fileSizeBytes:100,contentHash:'a'.repeat(64)};
const quiz={title:'Prompt basics',labId:lab,passPercent:70,questions:[{id:'q1',text:'Which answer is correct?',
  options:{A:'First',B:'Second',C:'Third',D:'Fourth'},correctOption:'A',explanation:'First is correct in this sample.'}]};
const examples:Record<string,unknown>={
  register:{email:'{{email}}',password:'{{password}}',displayName:'Learner'},
  login:{email:'{{email}}',password:'{{password}}'},refresh:{refreshToken:'{{refreshToken}}'},
  updateMe:{displayName:'Learner',background:'tech_base',goal:'Learn AI',weeklyMinutes:120},
  analyze:{background:'tech_base',goal:'Learn prompts',available_minutes:60,note:'',cv_text:'I write JavaScript.'},
  createRoadmap:{background:'tech_base',available_minutes:60,lab_id:lab,note:''},
  task:{status:'completed'},updateProgress:{roadmapId:'{{roadmapId}}',nodeId:'{{itemId}}',status:'completed'},
  createDocument:doc,updateDocument:{...doc,revision:1},
  reviewDocument:{revision:1,decision:'approved',note:'Reviewed references and metadata'},
  adminReview:{revision:1,decision:'approved',note:'Reviewed references and metadata'},
  createQuiz:quiz,updateQuiz:{...quiz,revision:1},
  submitQuiz:{revision:1,requestId:'{{$guid}}',answers:[{questionId:'q1',option:'A'}]},
  userRole:{role:'lecture'},userStatus:{isActive:false},
};
const collection={info:{name:'Vinonymus - 4 roles',schema:'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  description:'Run requests in the workflow order in role-api-schema.md, not Run All. Set email/password for each test account, login to fill the appropriate role token. Never export populated secrets.'},
  variable:Object.entries({baseUrl:'http://localhost:3000',email:'',password:'',studentToken:'',lectureToken:'',adminToken:'',refreshToken:'',
    roadmapId:'',itemId:'',documentId:'',documentRevision:'1',quizId:'',quizRevision:'1',attemptId:'',userId:''}).map(([key,value])=>({key,value,type:'string'})),
  item:specs.map(([op,spec])=>{
    const resource=spec.path.includes('documents')?'documentId':spec.path.includes('quizzes/submissions')?'attemptId':
      spec.path.includes('quizzes')?'quizId':spec.path.includes('users')?'userId':'roadmapId';
    let raw=JSON.stringify(examples[op]??{revision:1},null,2);
    if(spec.body && raw.includes('"revision": 1')) raw=raw.replace('"revision": 1','"revision": {{'+(resource==='quizId'?'quizRevision':'documentRevision')+'}}');
    const role=spec.roles[0]??'student';
    const url='{{baseUrl}}/api/v1'+spec.path.replace('{id}','{{'+resource+'}}').replace('{itemId}','{{itemId}}')+(spec.query?'?limit=20&offset=0':'');
    return {name:spec.method+' '+spec.path+' - '+spec.summary,request:{
      method:spec.method,url,description:spec.feature+'; '+spec.summary,
      header:spec.body?[{key:'Content-Type',value:'application/json'}]:[],
      auth:spec.roles.length?{type:'bearer',bearer:[{key:'token',value:'{{'+role+'Token}}',type:'string'}]}:{type:'noauth'},
      ...(spec.body?{body:{mode:'raw',raw,options:{raw:{language:'json'}}}}:{}),
    },event:[{listen:'test',script:{type:'text/javascript',exec:[
      'pm.test("Expected status", () => pm.response.to.have.status('+String(spec.status??200)+'));',
      'if (pm.response.code < 300) {',
      '  const d = pm.response.json().data;',
      '  if (d && d.accessToken) { pm.collectionVariables.set(d.user.role + "Token", d.accessToken); pm.collectionVariables.set("refreshToken", d.refreshToken); }',
      '  if (d && d.roadmap) { pm.collectionVariables.set("roadmapId", d.roadmap.id); pm.collectionVariables.set("itemId", d.roadmap.tasks[0].itemId); }',
      ...(spec.response==='Document'?['  if (d && d.id) { pm.collectionVariables.set("documentId", d.id); pm.collectionVariables.set("documentRevision", d.revision); }']:[]),
      ...(spec.response==='Quiz'?['  if (d && d.id) { pm.collectionVariables.set("quizId", d.id); pm.collectionVariables.set("quizRevision", d.revision); }']:[]),
      ...(op==='submitQuiz'?['  if (d && d.id) pm.collectionVariables.set("attemptId", d.id);']:[]),
      '}',
    ]}}]};
  })};

const header=readFileSync(resolve('scripts/platform-api-guide.md'),'utf8').trimEnd();
const tick=String.fromCharCode(96);
const table=[
  '## Danh sách endpoint v1',
  '',
  'Tất cả path bên dưới có tiền tố /api/v1. Guest = công khai; tài khoản đã đăng nhập cũng gọi được API công khai.',
  '',
  '| Method | Path | Role | Tính năng / mục đích | Body | Data trả về | File route |',
  '|---|---|---|---|---|---|---|',
  ...specs.map(([op,s])=>[
    '| '+s.method,tick+s.path+tick,s.roles.join(', ')||'guest',s.feature+': '+s.summary,
    s.body?'Xem '+tick+op+tick+' trong OpenAPI':'Không',
    tick+s.response+tick,
    '[route.ts](../codebase/src/app/api/v1'+s.path.replace(/\{(\w+)\}/g,'[$1]')+'/route.ts) |',
  ].join(' | ')),
  '',
].join('\n');
const outputs:Record<string,string>={
  '../docs/role-api-schema.md':header+'\n\n'+table,
  '../docs/role-api.openapi.json':JSON.stringify(openapi,null,2)+'\n',
  '../docs/role-api.postman_collection.json':JSON.stringify(collection,null,2)+'\n',
};
for(const [path,contents] of Object.entries(outputs)) {
  if(process.argv.includes('--check')) {
    if(readFileSync(resolve(path),'utf8')!==contents) throw new Error('Outdated generated API artifact: '+path);
  } else writeFileSync(resolve(path),contents,'utf8');
}
console.log((process.argv.includes('--check')?'Checked':'Generated')+' '+specs.length+' operations / '+Object.keys(paths).length+' route files.');
