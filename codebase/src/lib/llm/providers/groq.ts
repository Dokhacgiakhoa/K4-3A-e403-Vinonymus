import type { ChatPayload, LLMProviderAdapter } from '../types';
import { streamOpenAiCompatible } from './openai-compatible';

export const groqAdapter: LLMProviderAdapter = {
  id: 'groq',
  chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string> {
    return streamOpenAiCompatible(
      'https://api.groq.com/openai/v1',
      'llama-3.3-70b-versatile',
      payload,
      apiKey
    );
  },
};
