import type { ChatPayload, LLMProviderAdapter } from '../types';
import { streamOpenAiCompatible } from './openai-compatible';

export const openrouterAdapter: LLMProviderAdapter = {
  id: 'openrouter',
  chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string> {
    return streamOpenAiCompatible(
      'https://openrouter.ai/api/v1',
      'openrouter/free',
      payload,
      apiKey,
      {
        'HTTP-Referer': 'https://aiia-notebook.local',
        'X-Title': 'AIIA Notebook',
      }
    );
  },
};
