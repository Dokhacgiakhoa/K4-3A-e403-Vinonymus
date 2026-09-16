import type { ChatPayload } from '../types';

export async function* streamOpenAiCompatible(
  baseUrl: string,
  model: string,
  payload: ChatPayload,
  apiKey: string,
  customHeaders: Record<string, string> = {}
): AsyncIterable<string> {
  const messages = [
    { role: 'system', content: payload.systemPrompt },
    ...(payload.history || []).map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: payload.userPrompt },
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...customHeaders,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
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
            choices?: Array<{
              delta?: { content?: string };
            }>;
          };
          const text = data.choices?.[0]?.delta?.content;
          if (text) {
            yield text;
          }
        } catch {
          // Skip incomplete JSON
        }
      }
    }
  }
}
