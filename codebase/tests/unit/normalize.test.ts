import { describe, it, expect } from 'vitest';
import { normalizeText, expandQuery } from '../../src/lib/rag/normalize';

describe('normalizeText', () => {
  it('loại bỏ dấu thanh và giữ nguyên từ gốc', () => {
    expect(normalizeText('Deadline Assignment 2 là khi nào?')).toBe('deadline assignment 2 la khi nao?');
  });

  it('xử lý chữ đ và Đ hoa/thường', () => {
    expect(normalizeText('ĐỀ CƯƠNG môn học')).toBe('de cuong mon hoc');
  });

  it('xử lý nhiều khoảng trắng thừa', () => {
    expect(normalizeText('  nhiều   khoảng   trắng  ')).toBe('nhieu khoang trang');
  });

  it('trả về chuỗi rỗng khi input rỗng', () => {
    expect(normalizeText('')).toBe('');
  });
});

describe('expandQuery', () => {
  it('mở rộng từ viết tắt cơ bản', () => {
    expect(expandQuery('a2 ddl')).toBe('a2 ddl assignment 2 deadline');
  });

  it('giữ nguyên nếu không có từ viết tắt nào', () => {
    expect(expandQuery('lich hoc')).toBe('lich hoc');
  });
});
