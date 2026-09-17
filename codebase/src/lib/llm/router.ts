import type { ChatApiHeaderKeys } from '@/types/chat';
import type { ChatPayload, LLMProviderAdapter, RouteResult } from './types';
import { geminiAdapter } from './providers/gemini';
import { openaiAdapter } from './providers/openai';
import { claudeAdapter } from './providers/claude';
import { deepseekAdapter } from './providers/deepseek';
import { groqAdapter } from './providers/groq';
import { cerebrasAdapter } from './providers/cerebras';
import { fptAdapter } from './providers/fpt';

const ADAPTERS: Record<string, LLMProviderAdapter> = {
  gemini: geminiAdapter,
  openai: openaiAdapter,
  claude: claudeAdapter,
  deepseek: deepseekAdapter,
  groq: groqAdapter,
  cerebras: cerebrasAdapter,
  fpt: fptAdapter,
};

// FPT AI Factory là tài khoản trả phí của nhóm — đặt ưu tiên cao hơn các provider free-tier
// hay bị giới hạn quota (Gemini free tier chỉ ~20 request/ngày cho model flash mới nhất).
const DEFAULT_PRIORITY = ['fpt', 'gemini', 'openai', 'claude', 'deepseek', 'groq', 'cerebras'];

export class LLMRouterError extends Error {
  constructor(
    message: string,
    public code: 'NEED_KEY' | 'INVALID_API_KEY' | 'RATE_LIMITED' | 'ALL_FAILED',
    public provider?: string
  ) {
    super(message);
    this.name = 'LLMRouterError';
  }
}

async function peekFirstChunk(stream: AsyncIterable<string>): Promise<{ firstChunk: string | null; rest: AsyncIterable<string> }> {
  const iterator = stream[Symbol.asyncIterator]();
  const first = await iterator.next();
  if (first.done) {
    return { firstChunk: null, rest: (async function* () {})() };
  }
  const firstVal = first.value;
  async function* combined() {
    if (firstVal) yield firstVal;
    while (true) {
      const next = await iterator.next();
      if (next.done) break;
      if (next.value) yield next.value;
    }
  }
  return { firstChunk: firstVal, rest: combined() };
}

// 503 UNAVAILABLE ("quá tải, thử lại sau" — theo đúng lời Google) và 429 RESOURCE_EXHAUSTED
// dạng rate-limit-per-minute là lỗi tạm thời, thử lại thường qua ngay. Không retry lỗi
// key sai (401/403) — đằng nào cũng không tự hết.
const TRANSIENT_PATTERNS = ['503', 'unavailable', '429', 'resource_exhausted', 'overloaded'];
const RETRY_DELAYS_MS = [1200, 2500];

function isTransientError(message: string): boolean {
  const m = message.toLowerCase();
  return TRANSIENT_PATTERNS.some((p) => m.includes(p));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function routeLLMRequest(
  payload: ChatPayload,
  keys: ChatApiHeaderKeys
): Promise<RouteResult> {
  const availableProviders = DEFAULT_PRIORITY.filter(
    (p) => Boolean(keys[p as keyof ChatApiHeaderKeys]?.trim())
  );

  if (availableProviders.length === 0) {
    throw new LLMRouterError(
      'Không tìm thấy API key hợp lệ trong request',
      'NEED_KEY'
    );
  }

  let lastError: Error | null = null;

  for (const providerId of availableProviders) {
    const adapter = ADAPTERS[providerId];
    const apiKey = keys[providerId as keyof ChatApiHeaderKeys];

    if (!adapter || !apiKey) continue;

    let attempt = 0;
    let providerFailed = false;

    while (true) {
      try {
        const rawStream = adapter.chatStream(payload, apiKey);
        const { firstChunk, rest } = await peekFirstChunk(rawStream);

        // Nếu stream rỗng, chuyển provider tiếp theo
        if (firstChunk === null) {
          providerFailed = true;
          break;
        }

        return {
          stream: rest,
          provider: providerId,
          model:
            providerId === 'fpt'
              ? 'gpt-oss-120b'
              : providerId === 'gemini'
              ? 'gemini-3.5-flash-lite'
              : providerId === 'openai'
              ? 'gpt-4o-mini'
              : providerId === 'claude'
              ? 'claude-haiku-4-5-20251001'
              : providerId === 'deepseek'
              ? 'deepseek-chat'
              : providerId === 'groq'
              ? 'llama-3.3-70b-versatile'
              : 'llama-3.3-70b',
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);

        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.toLowerCase().includes('invalid api key') || errorMsg.toLowerCase().includes('not valid')) {
          throw new LLMRouterError(
            `API Key của nhà cung cấp ${providerId.toUpperCase()} không hợp lệ hoặc đã hết hạn.`,
            'INVALID_API_KEY',
            providerId
          );
        }

        const delay = RETRY_DELAYS_MS[attempt];
        if (isTransientError(errorMsg) && delay !== undefined) {
          console.warn(`[LLMRouter] Provider ${providerId} lỗi tạm thời (thử ${attempt + 1}): ${errorMsg}. Thử lại sau ${delay}ms...`);
          attempt += 1;
          await sleep(delay);
          continue;
        }

        console.warn(`[LLMRouter] Provider ${providerId} failed: ${errorMsg}. Trying next provider...`);
        lastError = err instanceof Error ? err : new Error(errorMsg);
        providerFailed = true;
      }

      if (providerFailed) break;
    }
  }

  throw new LLMRouterError(
    `Tất cả các nhà cung cấp API (${availableProviders.join(', ')}) đều bận hoặc gặp lỗi: ${lastError?.message}`,
    'RATE_LIMITED'
  );
}
