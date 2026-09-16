import type { LLMProviderAdapter } from '../types';
import { streamOpenAiCompatible } from './openai-compatible';

export const deepseekAdapter: LLMProviderAdapter = {
  id: 'deepseek',
  chatStream(payload, apiKey) {
    return streamOpenAiCompatible('https://api.deepseek.com/v1', 'deepseek-chat', payload, apiKey);
  },
};
