import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { routeLLMRequest } from '@/lib/llm/router';
import { PLANNER_CATALOG } from '@/data/planner-catalog';
import { analyzeLearner, generateRoadmap } from './mentor';
vi.mock('@/lib/llm/router',()=>({routeLLMRequest:vi.fn()}));
const input={background:'tech_base' as const,goal:'Learn RAG',available_minutes:60,note:'',cv_text:'I write JavaScript.'};
const request=new Request('http://localhost',{headers:{'x-gemini-key':'test-key'}});
const lab=PLANNER_CATALOG[0]!;
function output(value:unknown) {
  vi.mocked(routeLLMRequest).mockResolvedValue({provider:'gemini',model:'test',
    stream:(async function*(){yield typeof value==='string'?value:JSON.stringify(value);})()});
}
beforeEach(()=>{vi.mocked(routeLLMRequest).mockReset();});
afterEach(()=>vi.unstubAllEnvs());
describe('mentor grounding and fallback',()=>{
  it('labels recommendation AI only after validating catalog IDs and verbatim evidence',async()=>{
    output({recommendedLabId:lab.labId,summary:'Start with this lab.',evidence:['JavaScript']});
    const result=await analyzeLearner(input,request);
    expect(result.source).toBe('ai');
    expect(result.evidence).toEqual(['JavaScript']);
    expect(result.requiresAssessment).toBe(true);
    const call=vi.mocked(routeLLMRequest).mock.calls[0]![0];
    expect(call.userPrompt).toContain('<learner_data>');
  });
  it.each([
    {recommendedLabId:'invented',summary:'Invalid',evidence:[]},
    {recommendedLabId:lab.labId,summary:'Invalid',evidence:['Invented CV experience']},
    {recommendedLabId:lab.labId,summary:'Read https://invented.example',evidence:[]},
    'invalid JSON',
  ])('falls back on ungrounded or malformed model output %#',async value=>{
    output(value);
    expect((await analyzeLearner(input,request)).source).toBe('baseline');
  });
  it('uses baseline roadmap on provider failure and keeps catalog URLs',async()=>{
    vi.mocked(routeLLMRequest).mockRejectedValue(new Error('provider failure'));
    const result=await generateRoadmap({background:'tech_base',availableMinutes:60,labId:lab.labId,note:''},request);
    expect(result.status).toBe('plan');
    if(result.status==='plan'){
      expect(result.source).toBe('baseline');
      for(const task of result.tasks) expect(lab.items.find(item=>item.itemId===task.itemId)?.url).toBe(task.url);
    }
  });
});
