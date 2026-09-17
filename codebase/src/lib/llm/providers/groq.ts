import type { ChatPayload, LLMProviderAdapter } from '../types';
import { streamOpenAiCompatible } from './openai-compatible';

export const groqAdapter: LLMProviderAdapter = {
  id: 'groq',
  chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string> {
    return streamOpenAiCompatible(
      'https://api.groq.com/openai/v1',
      'openai/gpt-oss-20b',
      payload,
      apiKey
    );
  },
};
