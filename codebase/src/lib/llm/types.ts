export type LLMTask = 'chat' | 'classify' | 'vision' | 'embedding';

export interface ModelSpec {
  model: string;
  tasks: LLMTask[];
  contextWindow: number;
}

export interface ChatPayload {
  systemPrompt: string;
  userPrompt: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface LLMProviderAdapter {
  readonly id: string;
  chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string>;
}

export const MODEL_CATALOG: Record<string, ModelSpec[]> = {
  gemini: [
    { model: 'gemini-3.5-flash-lite', tasks: ['chat', 'vision', 'classify'], contextWindow: 1_048_576 },
    { model: 'gemini-embedding-001', tasks: ['embedding'], contextWindow: 2048 },
  ],
  groq: [
    { model: 'llama-3.3-70b-versatile', tasks: ['chat'], contextWindow: 131_072 },
  ],
  cerebras: [
    { model: 'llama-3.3-70b', tasks: ['chat'], contextWindow: 8_192 },
  ],
};

export interface RouteResult {
  stream: AsyncIterable<string>;
  provider: string;
  model: string;
}
