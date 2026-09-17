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
    { model: 'gemini-flash-latest', tasks: ['chat', 'vision', 'classify'], contextWindow: 1_048_576 },
    { model: 'gemini-embedding-001', tasks: ['embedding'], contextWindow: 2048 },
  ],
  groq: [
    { model: 'openai/gpt-oss-20b', tasks: ['chat'], contextWindow: 131_072 },
  ],
  cerebras: [
    { model: 'gpt-oss-120b', tasks: ['chat'], contextWindow: 8_192 },
  ],
  openrouter: [
    { model: 'openrouter/free', tasks: ['chat'], contextWindow: 65_536 },
  ],
  fpt: [
    { model: 'gpt-oss-120b', tasks: ['chat'], contextWindow: 131_072 },
  ],
};

export interface RouteResult {
  stream: AsyncIterable<string>;
  provider: string;
  model: string;
}
