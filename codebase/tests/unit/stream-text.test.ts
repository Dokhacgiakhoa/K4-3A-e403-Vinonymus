import { describe, it, expect } from 'vitest';
import { stripImagesFromStream, textToStream } from '../../src/lib/rag/stream-text';

async function* fromChunks(chunks: string[]): AsyncIterable<string> {
  for (const c of chunks) yield c;
}

async function collect(stream: AsyncIterable<string>): Promise<string> {
  let out = '';
  for await (const chunk of stream) out += chunk;
  return out;
}

describe('stripImagesFromStream', () => {
  it('giữ nguyên văn bản không có thẻ ảnh', async () => {
    const out = await collect(fromChunks(['Chào bạn, ', 'deadline là ', '25/09/2026.']));
    expect(out).toBe('Chào bạn, deadline là 25/09/2026.');
  });

  it('loại bỏ thẻ ảnh nằm gọn trong 1 chunk', async () => {
    const out = await collect(
      stripImagesFromStream(fromChunks(['Trước ![anh](/images/a.png) sau']))
    );
    expect(out).toBe('Trước  sau');
    expect(out).not.toContain('![');
  });

  it('loại bỏ thẻ ảnh bị cắt làm đôi giữa 2 chunk', async () => {
    const out = await collect(
      stripImagesFromStream(fromChunks(['Trước ![an', 'h](/images/a.png) sau']))
    );
    expect(out).toBe('Trước  sau');
    expect(out).not.toContain('![');
    expect(out).not.toContain('/images/a.png');
  });

  it('loại bỏ thẻ ảnh bị cắt vụn thành nhiều chunk rất nhỏ', async () => {
    const chunks = '![Hình bằng chứng](/images/faqs/x.png)'.split('');
    const out = await collect(stripImagesFromStream(fromChunks(['Nội dung ', ...chunks, ' hết'])));
    expect(out).toBe('Nội dung  hết');
    expect(out).not.toContain('![');
  });

  it('không nuốt nhầm dấu chấm than bình thường', async () => {
    const out = await collect(stripImagesFromStream(fromChunks(['Tuyệt vời!', ' Chúc bạn thi tốt!'])));
    expect(out).toBe('Tuyệt vời! Chúc bạn thi tốt!');
  });

  it('giữ nguyên link thường (không phải ảnh)', async () => {
    const out = await collect(
      stripImagesFromStream(fromChunks(['Xem [Fanpage](https://facebook.com/x) nhé']))
    );
    expect(out).toBe('Xem [Fanpage](https://facebook.com/x) nhé');
  });

  it('nhả nốt phần đuôi dang dở khi hết stream (không nuốt mất chữ)', async () => {
    const out = await collect(stripImagesFromStream(fromChunks(['Kết thúc bằng ![chưa đóng'])));
    expect(out).toBe('Kết thúc bằng ![chưa đóng');
  });
});

describe('textToStream', () => {
  it('bọc chuỗi cố định thành stream', async () => {
    expect(await collect(textToStream('xin chào'))).toBe('xin chào');
  });
});
