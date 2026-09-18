import { describe, it, expect, vi } from 'vitest';
import { processChatPipeline } from '../../src/lib/rag/pipeline';
import { looksLikePlannerRequest, parseHelpdeskDecision } from '../../src/lib/rag/helpdesk-agent';
import * as helpdeskAgent from '../../src/lib/rag/helpdesk-agent';

// Mock Supabase RPC cho tests
vi.mock('../../src/lib/supabase/client', () => ({
  supabase: {
    rpc: vi.fn((fnName: string) => {
      if (fnName === 'match_faq') {
        return Promise.resolve({
          data: [
            {
              faq_id: 'faq-1',
              question: 'Deadline nộp Assignment 1 là khi nào?',
              answer: 'Assignment 1 hạn nộp là 23:59 ngày 25/09/2026.',
              match_type: 'exact',
              score: 1.0,
              priority: 10,
            },
          ],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
        });
      }
      return Promise.resolve({
        data: [],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK',
      });
    }),
  },
}));

async function collect(stream: AsyncIterable<string>): Promise<string> {
  let out = '';
  for await (const chunk of stream) out += chunk;
  return out;
}

describe('processChatPipeline', () => {
  it('handoff Planner trước khi FAQ fuzzy-match có thể nuốt sai ý định', async () => {
    const res = await processChatPipeline('Hãy cá nhân hóa lịch học tuần này cho mình', {}, undefined, 'Member');
    expect(res.type).toBe('meta');
    if (res.type === 'meta') {
      expect(await collect(res.stream)).toContain('/personalized-path');
    }
  });

  it('trả về type faq khi câu hỏi trúng FAQ', async () => {
    const res = await processChatPipeline('Deadline nộp Assignment 1 là khi nào?', {});
    expect(res.type).toBe('faq');
    if (res.type === 'faq') {
      expect(await collect(res.stream)).toContain('25/09/2026');
      expect(res.degraded).toBe(true);
    }
  });

  it('trả về type need_key khi trượt FAQ và không có API key', async () => {
    const { supabase } = await import('../../src/lib/supabase/client');
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [],
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    } as any);

    const res = await processChatPipeline('Câu hỏi ngoài kho FAQ', {}, undefined, 'Member');
    expect(res.type).toBe('need_key');
  });
});

describe('parseHelpdeskDecision', () => {
  it('đọc JSON quyết định dù model bọc trong code fence', () => {
    expect(
      parseHelpdeskDecision(
        `~~~json\n${JSON.stringify({ action: 'search', rewritten_query: 'deadline-lab-2' })}\n~~~`,
      ),
    ).toEqual({ action: 'search', rewritten_query: 'deadline-lab-2' });
  });

  it('từ chối quyết định không-search nếu thiếu câu trả lời', () => {
    expect(() => parseHelpdeskDecision(JSON.stringify({ action: 'clarify' }))).toThrow();
  });
});

describe('looksLikePlannerRequest', () => {
  it('chuyển yêu cầu lập lịch cá nhân sang Planner nhưng không nuốt câu hỏi lịch lớp', () => {
    expect(looksLikePlannerRequest('Hãy cá nhân hóa lịch học tuần này cho mình')).toBe(true);
    expect(looksLikePlannerRequest('Lịch học lớp 3A hôm nay ở phòng nào?')).toBe(false);
  });
});

describe('Helpdesk role gate', () => {
  it('không mở lộ trình cá nhân hoá cho Visitor', async () => {
    const res = await processChatPipeline(
      'Hãy cá nhân hóa lịch học tuần này cho mình',
      {},
      undefined,
      'Visitor',
    );
    expect(res.type).toBe('refused');
    if (res.type === 'refused') {
      expect(await collect(res.stream)).toContain('tài khoản học viên');
      expect(res.provider).toBe('rules');
    }
  });

  it('không mở lộ trình cho Visitor khi decision agent chọn handoff_planner', async () => {
    const { supabase } = await import('../../src/lib/supabase/client');
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [],
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    } as any);
    const decisionSpy = vi.spyOn(helpdeskAgent, 'decideHelpdeskAction').mockResolvedValueOnce({
      action: 'handoff_planner',
      response: 'Mình sẽ chuyển bạn sang công cụ phù hợp.',
      provider: 'gemini',
      model: 'gemini-3.5-flash-lite',
    });

    const res = await processChatPipeline(
      'Mình muốn được chẩn đoán năng lực để biết hướng học phù hợp',
      { gemini: 'test-key' },
      undefined,
      'Visitor',
      {
        background: 'non_tech',
        availableMinutes: 60,
        labId: 'day-05',
        source: 'ai',
        diagnosis: 'Đang học kiến thức nền.',
        tasks: [],
      },
    );

    expect(decisionSpy).toHaveBeenCalledWith(
      expect.any(String),
      { gemini: 'test-key' },
      undefined,
      undefined,
    );
    expect(res.type).toBe('refused');
    if (res.type === 'refused') {
      expect(await collect(res.stream)).not.toContain('/personalized-path');
      expect(res.provider).toBe('rules');
    }
  });
});
