import { describe, it, expect } from 'vitest';
import { analyzeFaqIssues, type FaqItem } from '../../scripts/audit-faqs';

function makeFaq(overrides: Partial<FaqItem>): FaqItem {
  return {
    file: 'test.md',
    relPath: 'data/faqs/test.md',
    question: 'Câu hỏi mặc định',
    category: 'quy-dinh',
    priority: 1,
    is_active: true,
    variants: [],
    answer: 'Nội dung trả lời mặc định.',
    raw: '',
    ...overrides,
  };
}

describe('analyzeFaqIssues', () => {
  it('phát hiện CRITICAL khi cùng 1 số điện thoại xuất hiện ở nhiều file khác nhau', () => {
    const faqs = [
      makeFaq({
        file: 'kenh-lien-he.md',
        question: 'Kênh liên hệ hỗ trợ tuyển sinh',
        answer: 'Hotline AI20K: `0979.489.846`.',
      }),
      makeFaq({
        file: 'huong-dan-on-tap.md',
        question: 'Hướng dẫn ôn tập trước kỳ thi',
        answer: 'Trước ngày thi, liên hệ Hotline `0979489846` nếu cần hỗ trợ.',
      }),
    ];

    const issues = analyzeFaqIssues(faqs);
    const critical = issues.filter((i) => i.type === 'CRITICAL');

    expect(critical.length).toBeGreaterThanOrEqual(1);
    expect(critical[0]!.title).toContain('Dữ kiện tham chiếu');
    expect(critical[0]!.file).toContain('kenh-lien-he.md');
    expect(critical[0]!.file).toContain('huong-dan-on-tap.md');
  });

  it('phát hiện CRITICAL khi cùng 1 email xuất hiện ở nhiều file khác nhau', () => {
    const faqs = [
      makeFaq({ file: 'a.md', answer: 'Liên hệ email aithucchien@vinuni.edu.vn để biết thêm.' }),
      makeFaq({ file: 'b.md', answer: 'Gửi phản ánh qua AIthucchien@vinuni.edu.vn nhé.' }),
    ];

    const issues = analyzeFaqIssues(faqs);
    const critical = issues.filter((i) => i.type === 'CRITICAL');

    expect(critical.length).toBe(1);
    expect(critical[0]!.description).toContain('vinunieduvn');
  });

  it('không phát sinh issue nào khi các FAQ độc lập, không trùng dữ kiện', () => {
    const faqs = [
      makeFaq({
        file: 'a.md',
        question: 'Lịch học tuần này ra sao',
        answer: 'Lịch học được cập nhật hàng tuần trên nhóm Facebook chính thức.',
      }),
      makeFaq({
        file: 'b.md',
        question: 'Quy định gửi xe trong campus',
        answer: 'Sinh viên gửi xe tại bãi B2, xuất trình thẻ học viên khi ra vào.',
      }),
    ];

    const issues = analyzeFaqIssues(faqs);
    expect(issues).toEqual([]);
  });
});
