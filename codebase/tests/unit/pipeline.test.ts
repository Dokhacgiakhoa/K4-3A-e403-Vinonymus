import { describe, it, expect, vi } from 'vitest';
import { processChatPipeline } from '../../src/lib/rag/pipeline';

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
  it('trả về type faq khi câu hỏi trúng FAQ', async () => {
    const res = await processChatPipeline('Deadline nộp Assignment 1 là khi nào?', {});
    expect(res.type).toBe('faq');
    if (res.type === 'faq') {
      expect(await collect(res.stream)).toContain('25/09/2026');
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

    const res = await processChatPipeline('Câu hỏi ngoài kho FAQ', {});
    expect(res.type).toBe('need_key');
  });
});
