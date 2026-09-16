import { describe, it, expect } from 'vitest';
import { splitIntentPrefix, looksLikeSmallTalk, type ConverseOutcome } from '../../src/lib/rag/converse';

async function* fromChunks(chunks: string[]): AsyncIterable<string> {
  for (const c of chunks) yield c;
}

async function run(chunks: string[]): Promise<{ text: string; outcome: ConverseOutcome }> {
  const outcome: ConverseOutcome = { conversational: false };
  let text = '';
  for await (const chunk of splitIntentPrefix(fromChunks(chunks), outcome)) text += chunk;
  return { text, outcome };
}

describe('splitIntentPrefix', () => {
  it('bóc nhãn INTENT: chat và không để lộ ra cho người dùng', async () => {
    const { text, outcome } = await run(['INTENT: chat\n', 'Biết chứ, ', 'muốn thử không?']);
    expect(text).toBe('Biết chứ, muốn thử không?');
    expect(text).not.toContain('INTENT');
    expect(outcome.conversational).toBe(true);
  });

  it('bóc nhãn INTENT: course', async () => {
    const { text, outcome } = await run(['INTENT: course\nMình chưa có thông tin này.']);
    expect(text).toBe('Mình chưa có thông tin này.');
    expect(outcome.conversational).toBe(false);
  });

  it('xử lý được nhãn bị cắt vụn qua nhiều chunk', async () => {
    const { text, outcome } = await run(['INT', 'ENT', ':', ' ch', 'at', '\n', 'Xin chào bạn!']);
    expect(text).toBe('Xin chào bạn!');
    expect(text).not.toContain('INTENT');
    expect(outcome.conversational).toBe(true);
  });

  it('không nuốt nội dung khi LLM quên ghi nhãn', async () => {
    const { text } = await run(['Mình là K.AI đây!\n', 'Bạn cần giúp gì nào?']);
    expect(text).toBe('Mình là K.AI đây!\nBạn cần giúp gì nào?');
  });

  it('không treo khi câu trả lời dài mà không có xuống dòng', async () => {
    const long = 'Đây là một câu trả lời khá dài không hề có ký tự xuống dòng nào cả nhé bạn ơi.';
    const { text } = await run([long]);
    expect(text).toBe(long);
  });
});

describe('looksLikeSmallTalk', () => {
  it('nhận ra câu giao tiếp thông thường', () => {
    expect(looksLikeSmallTalk('cậu là AI à')).toBe(true);
    expect(looksLikeSmallTalk('chào bạn')).toBe(true);
    expect(looksLikeSmallTalk('cảm ơn nhé')).toBe(true);
    expect(looksLikeSmallTalk('bạn giúp được gì cho tớ')).toBe(true);
  });

  it('KHÔNG nuốt nhầm câu hỏi thật về chương trình', () => {
    expect(looksLikeSmallTalk('AI in Action là gì')).toBe(false);
    expect(looksLikeSmallTalk('bạn ơi AI in Action là gì vậy')).toBe(false);
    expect(looksLikeSmallTalk('học phí bao nhiêu')).toBe(false);
    expect(looksLikeSmallTalk('deadline assignment 2 là khi nào')).toBe(false);
  });
});
