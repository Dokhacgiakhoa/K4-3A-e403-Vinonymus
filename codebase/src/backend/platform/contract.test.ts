import SwaggerParser from '@apidevtools/swagger-parser';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { endpoints, type EndpointSpec } from './endpoints';

describe('FE contract artifacts',()=>{
  it('validates the published OpenAPI document and every registered operation',async()=>{
    const api=await SwaggerParser.validate('../docs/role-api.openapi.json');
    let count=0;
    for(const [name,spec] of Object.entries(endpoints)) {
      const operation=api.paths![spec.path]![spec.method.toLowerCase() as 'get'];
      expect(operation?.operationId).toBe(name);
      count++;
    }
    expect(count).toBe(Object.keys(endpoints).length);
  });
  it('maps all registry methods to thin Next route exports',()=>{
    for(const [name,spec] of Object.entries(endpoints)) {
      const file='src/app/api/v1'+spec.path.replace(/\{(\w+)\}/g,'[$1]')+'/route.ts';
      expect(readFileSync(file,'utf8')).toContain("export const "+spec.method+" = handler('"+name+"')");
    }
  });
  it('has a Postman request and valid sample input for every operation',()=>{
    const collection=JSON.parse(readFileSync('../docs/role-api.postman_collection.json','utf8')) as {
      item:{request:{method:string;url:string;body?:{raw:string}}}[];
    };
    const operations=Object.values(endpoints) as EndpointSpec[];
    expect(collection.item.length).toBe(operations.length);
    const substitute:Record<string,string>={
      email:'sample@example.com',password:'test-password',refreshToken:'test-refresh',
      roadmapId:'11111111-1111-4111-8111-111111111111',itemId:'ptc-setup-colab',
      documentRevision:'1','$guid':'11111111-1111-4111-8111-111111111111',
    };
    for(let i=0;i<operations.length;i++){
      const spec=operations[i]!;
      const request=collection.item[i]!.request;
      expect(request.method).toBe(spec.method);
      if (spec.body) {
        const raw=request.body!.raw.replace(/\{\{([^}]+)\}\}/g,(_,key:string)=>substitute[key]??'test');
        spec.body.parse(JSON.parse(raw));
      }
    }
  });
});
