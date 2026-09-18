import { describe, expect, it } from 'vitest';
import { findLab } from '@/data/planner-catalog';
import { materializePlannerResult } from '@/lib/planner/ai-planner';
import type { PlannerInput } from '@/types/planner';

const input: PlannerInput = {
  background: 'tech_base',
  availableMinutes: 45,
  labId: 'lab-prompt-tool-calling',
  note: '',
};

const lab = findLab(input.labId);
if (!lab) throw new Error('missing fixture lab');

describe('materializePlannerResult', () => {
  it('lọc item bịa, trùng và vượt quỹ thời gian; ghép URL từ catalog', () => {
    const result = materializePlannerResult(
      {
        status: 'plan',
        diagnosis: { confidence: 'high', summary: 'Đã biết code, mới với AI.' },
        tasks: [
          { item_id: 'ptc-function-calling', reason: 'Phần thực hành chính.' },
          { item_id: 'khong-ton-tai', reason: 'Item bịa.' },
          { item_id: 'ptc-function-calling', reason: 'Bị trùng.' },
        ],
        message: 'Không tin message này.',
      },
      input,
      lab,
    );
    expect(result.status).toBe('plan');
    if (result.status !== 'plan') return;
    expect(result.source).toBe('ai');
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0]?.url).toBe('https://ai.google.dev/gemini-api/docs/function-calling');
    expect(result.message).toContain('30/45');
  });

  it('hỏi lại khi model báo độ tin cậy thấp', () => {
    const result = materializePlannerResult(
      {
        status: 'plan',
        diagnosis: { confidence: 'low', summary: 'Mâu thuẫn.' },
        tasks: [{ item_id: 'ptc-prompt-basics', reason: 'Cần làm rõ.' }],
        message: 'Làm rõ.',
      },
      input,
      lab,
    );
    expect(result.status).toBe('clarify');
  });

  it('ưu tiên item khớp trực tiếp ghi chú trước khi lọc theo quỹ thời gian', () => {
    const result = materializePlannerResult(
      {
        status: 'plan',
        diagnosis: { confidence: 'high', summary: 'Đã biết code, cần tập trung tool calling.' },
        tasks: [
          { item_id: 'ptc-setup-colab', reason: 'Chuẩn bị môi trường.' },
          { item_id: 'ptc-prompt-basics', reason: 'Ôn prompt cơ bản.' },
          { item_id: 'ptc-function-calling', reason: 'Ghi chú nhắc trực tiếp phần này.' },
          { item_id: 'ptc-structured-output', reason: 'Ôn schema nếu còn thời gian.' },
        ],
        message: 'Sắp theo gợi ý model.',
      },
      {
        background: 'tech_base',
        availableMinutes: 60,
        labId: 'lab-prompt-tool-calling',
        note: 'Mình đã biết code nhưng chưa hiểu tool calling và function calling.',
      },
      lab,
    );

    expect(result.status).toBe('plan');
    if (result.status !== 'plan') return;
    expect(result.tasks[0]?.itemId).toBe('ptc-function-calling');
    expect(result.tasks.map((task) => task.itemId)).toContain('ptc-function-calling');
    expect(result.tasks.reduce((sum, task) => sum + task.minutes, 0)).toBeLessThanOrEqual(60);
  });

  it('cắt nội dung dài về giới hạn hiển thị', () => {
    const result = materializePlannerResult(
      {
        status: 'plan',
        diagnosis: { confidence: 'high', summary: 'S'.repeat(300) },
        tasks: [{ item_id: 'ptc-function-calling', reason: 'R'.repeat(300) }],
        message: 'M'.repeat(300),
      },
      input,
      lab,
    );
    expect(result.status).toBe('plan');
    if (result.status !== 'plan') return;
    expect(result.diagnosis.summary).toHaveLength(240);
    expect(result.tasks[0]?.reason).toHaveLength(160);
  });
});
