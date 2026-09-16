import type { LLMProviderAdapter } from '../types';
import { streamOpenAiCompatible } from './openai-compatible';

export const openaiAdapter: LLMProviderAdapter = {
  id: 'openai',
  chatStream(payload, apiKey) {
    return streamOpenAiCompatible('https://api.openai.com/v1', 'gpt-4o-mini', payload, apiKey);
  },
};
