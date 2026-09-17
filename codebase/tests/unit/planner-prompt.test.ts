import { describe, expect, it } from 'vitest';
import { findLab } from '@/data/planner-catalog';
import { buildPlannerUserPrompt, parsePlannerLLMOutput } from '@/lib/prompts/planner';

describe('planner prompt', () => {
  it('không đưa URL vào prompt', () => {
    const lab = findLab('lab-prompt-tool-calling');
    if (!lab) throw new Error('missing fixture lab');
    const prompt = buildPlannerUserPrompt(
      { background: 'non_tech', availableMinutes: 60, labId: lab.labId, note: 'ghi chú' },
      lab,
    );
    expect(prompt).not.toContain('https://');
  });

  it('parse JSON hợp lệ', () => {
    const raw = JSON.stringify({
      status: 'plan',
      diagnosis: { confidence: 'high', summary: 'Phù hợp' },
      tasks: [{ item_id: 'ptc-prompt-basics', reason: 'Cần nền tảng' }],
      message: '60 phút',
    });
    expect(parsePlannerLLMOutput(raw).status).toBe('plan');
  });

  it('chấp nhận câu hỏi làm rõ dài nhưng an toàn', () => {
    const raw = JSON.stringify({ status: 'clarify', question: 'X'.repeat(300) });
    expect(parsePlannerLLMOutput(raw).status).toBe('clarify');
  });

  it('từ chối output vượt quá 3 nhiệm vụ', () => {
    const tasks = Array.from({ length: 4 }, (_, index) => ({ item_id: `item-${index}`, reason: 'Lý do' }));
    const raw = JSON.stringify({
      status: 'plan',
      diagnosis: { confidence: 'high', summary: 'Tóm tắt' },
      tasks,
      message: 'Kế hoạch',
    });
    expect(() => parsePlannerLLMOutput(raw)).toThrow();
  });
});
