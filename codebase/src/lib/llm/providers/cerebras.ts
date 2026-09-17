import type { ChatPayload, LLMProviderAdapter } from '../types';
import { streamOpenAiCompatible } from './openai-compatible';

export const cerebrasAdapter: LLMProviderAdapter = {
  id: 'cerebras',
  chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string> {
    return streamOpenAiCompatible(
      'https://api.cerebras.ai/v1',
      'gpt-oss-120b',
      payload,
      apiKey
    );
  },
};
