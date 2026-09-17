import { describe, it, expect, afterEach, vi } from 'vitest';
import { routeLLMRequest, LLMRouterError } from '../../src/lib/llm/router';

// Giả lập response dạng SSE mà gemini.ts mong đợi, tránh gọi mạng thật trong unit test —
// routeLLMRequest giờ chủ động duyệt (peek) chunk đầu tiên ngay khi chọn provider (xem router.ts),
// nên test provider-selection không thể dùng key giả gọi API thật như trước nữa.
function mockGeminiStreamResponse(text: string): Response {
  const sseBody = `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] })}\n\n`;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(sseBody));
      controller.close();
    },
  });
  return new Response(stream, { status: 200 });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LLM Router Engine', () => {
  it('ném lỗi NEED_KEY khi không có bất kỳ API key nào trong request', async () => {
    await expect(
      routeLLMRequest(
        { systemPrompt: 'test', userPrompt: 'hello' },
        {}
      )
    ).rejects.toThrow(LLMRouterError);

    try {
      await routeLLMRequest({ systemPrompt: 'test', userPrompt: 'hello' }, {});
    } catch (err: unknown) {
      const error = err as LLMRouterError;
      expect(error.code).toBe('NEED_KEY');
    }
  });

  it('lựa chọn Gemini adapter khi request truyền key gemini', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => mockGeminiStreamResponse('Chào bạn')));

    const res = await routeLLMRequest(
      { systemPrompt: 'test', userPrompt: 'hello' },
      { gemini: 'fake-key' }
    );

    expect(res.provider).toBe('gemini');
    expect(res.model).toBe('gemini-3.5-flash-lite');
    expect(res.stream).toBeDefined();

    let text = '';
    for await (const chunk of res.stream) text += chunk;
    expect(text).toBe('Chào bạn');
  });

  it('ưu tiên Gemini khi có cả Gemini và Claude key', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => mockGeminiStreamResponse('Chào bạn')));

    const res = await routeLLMRequest(
      { systemPrompt: 'test', userPrompt: 'hello' },
      { gemini: 'gemini-key', claude: 'claude-key' }
    );

    expect(res.provider).toBe('gemini');
    expect(res.model).toBe('gemini-3.5-flash-lite');
  });

  it('ném LLMRouterError khi API key không hợp lệ (401/403)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('API key not valid', { status: 401 }))
    );

    try {
      await routeLLMRequest({ systemPrompt: 'test', userPrompt: 'hello' }, { gemini: 'fake-key' });
      expect.unreachable('phải ném lỗi');
    } catch (err: unknown) {
      const error = err as LLMRouterError;
      expect(error.code).toBe('INVALID_API_KEY');
    }
  });
});
