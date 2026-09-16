import type { LLMProviderAdapter, ChatPayload } from '../types';

export const claudeAdapter: LLMProviderAdapter = {
  id: 'claude',
  async *chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string> {
    const messages = [
      ...(payload.history || []).map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: payload.userPrompt },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        system: payload.systemPrompt,
        messages,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API Error ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:')) {
          const jsonStr = trimmed.slice(5).trim();
          try {
            const data = JSON.parse(jsonStr) as {
              type?: string;
              delta?: { text?: string };
            };
            if (data.type === 'content_block_delta' && data.delta?.text) {
              yield data.delta.text;
            }
          } catch {
            // Skip incomplete JSON
          }
        }
      }
    }
  },
};
