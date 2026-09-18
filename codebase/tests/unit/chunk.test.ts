import { describe, it, expect } from 'vitest';
import { chunkMarkdown } from '../../src/lib/rag/chunk';

describe('chunkMarkdown', () => {
  it('không bao giờ cắt một bảng markdown làm đôi', () => {
    const markdownWithTable = `
# Đề cương môn học
## Đánh giá

| Thành phần | Tỉ lệ | Hạn nộp |
|---|---|---|
| Assignment 1 | 20% | Tuần 4 |
| Assignment 2 | 30% | Tuần 8 |
| Project cuối kỳ | 50% | Tuần 14 |

Nội dung khác sau bảng.
`;

    const chunks = chunkMarkdown(markdownWithTable, 20); // targetSize nhỏ để test
    const tableChunk = chunks.find((c) => c.content.includes('| Assignment 1 |'));

    expect(tableChunk).toBeDefined();
    expect(tableChunk?.content).toContain('| Thành phần | Tỉ lệ | Hạn nộp |');
    expect(tableChunk?.content).toContain('| Project cuối kỳ | 50% | Tuần 14 |');
    expect(tableChunk?.headingPath).toBe('Đề cương môn học > Đánh giá');
  });

  it('gắn đúng headingPath cho các đoạn văn', () => {
    const markdown = `
# Chương 1
## Giới thiệu
Đây là nội dung giới thiệu.

### Chi tiết
Đây là nội dung chi tiết.
`;

    const chunks = chunkMarkdown(markdown);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]?.headingPath).toBe('Chương 1 > Giới thiệu');
  });

  it('chia c? paragraph ??n qu? d?i v? ??ng ng??ng token', () => {
    const chunks = chunkMarkdown(`# B?i h?c\n\n${'A'.repeat(5_000)}`, 800);

    expect(chunks.length).toBeGreaterThan(1);
    expect(Math.max(...chunks.map((chunk) => chunk.tokenCount))).toBeLessThanOrEqual(800);
  });
});
