import type { ChatPayload, LLMProviderAdapter } from '../types';
import { streamOpenAiCompatible } from './openai-compatible';

// FPT AI Factory (FPT Smart Cloud) — API chuẩn OpenAI-compatible.
// https://marketplace.fptcloud.com — endpoint xác nhận qua tài liệu goai.sh/providers/fptcloud.
export const fptAdapter: LLMProviderAdapter = {
  id: 'fpt',
  chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string> {
    return streamOpenAiCompatible('https://mkp-api.fptcloud.com/v1', 'gpt-oss-120b', payload, apiKey);
  },
};
