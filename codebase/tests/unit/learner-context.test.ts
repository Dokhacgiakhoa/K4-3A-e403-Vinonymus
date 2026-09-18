import { describe, expect, it } from 'vitest';
import {
  buildLearnerContextBlock,
  getLearnerContext,
  parseLearnerContext,
} from '../../src/lib/learner-context';

const context = {
  background: 'non_tech' as const,
  availableMinutes: 60,
  labId: 'day-05',
  note: 'Cần ví dụ đơn giản',
  source: 'ai' as const,
  diagnosis: 'Đang học kiến thức nền.',
  tasks: [
    {
      title: 'Function cơ bản',
      reason: 'Cần cho bài lab hiện tại',
      minutes: 30,
      done: false,
    },
  ],
};

describe('learner context', () => {
  it('rút gọn roadmap đã lưu thành context tối đa 3 nhiệm vụ', () => {
    const parsed = parseLearnerContext(
      JSON.stringify({
        input: {
          background: context.background,
          availableMinutes: context.availableMinutes,
          labId: context.labId,
          note: context.note,
        },
        result: {
          status: 'plan',
          source: context.source,
          diagnosis: { summary: context.diagnosis },
        },
        checklist: [...context.tasks, ...context.tasks, ...context.tasks, ...context.tasks],
      }),
    );

    expect(parsed?.tasks).toHaveLength(3);
    expect(parsed?.background).toBe('non_tech');
  });

  it('bỏ learner context của Visitor nhưng giữ cho Member', () => {
    expect(getLearnerContext('Visitor', context)).toBeUndefined();
    expect(getLearnerContext('Member', context)).toEqual(context);
  });

  it('đánh dấu learner context thành một khối dữ liệu riêng', () => {
    const block = buildLearnerContextBlock(context);
    expect(block).toContain('<learner_context>');
    expect(block).toContain('Function cơ bản');
  });
});
