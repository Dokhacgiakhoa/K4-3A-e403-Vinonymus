import type { ChatPayload, LLMProviderAdapter } from '../types';

export const geminiAdapter: LLMProviderAdapter = {
  id: 'gemini',
  async *chatStream(payload: ChatPayload, apiKey: string): AsyncIterable<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: payload.systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: payload.userPrompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
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
          if (jsonStr === '[DONE]') continue;
          try {
            const data = JSON.parse(jsonStr) as {
              candidates?: Array<{
                content?: {
                  parts?: Array<{ text?: string }>;
                };
              }>;
            };
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              yield text;
            }
          } catch {
            // Skip parse errors for incomplete chunks
          }
        }
      }
    }
  },
};
