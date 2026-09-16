import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MediaLinkItem {
  type: 'image' | 'link';
  url: string;
  caption?: string;
  title?: string;
}

export interface LocalFaqItem {
  id: string;
  title: string;
  question: string;
  category: string;
  categoryName: string;
  priority: number;
  is_active: boolean;
  is_verified: boolean;
  verification_source: string;
  media_links?: MediaLinkItem[];
  variants: string[];
  answer: string;
}

const CATEGORY_NAME_MAP: Record<string, string> = {
  'thi-dgnl': 'Sơ loại & ĐGNL',
  'chuong-trinh-hoc': 'Chương trình học',
  'tien-ich': 'Tiện ích',
  'quy-dinh': 'Quy định',
};

/**
 * Đọc tất cả file FAQ .md trong data/faqs/
 * Chỉ dùng ở Server-side (API Routes, Server Components, Scripts)
 */
export function getAllLocalFaqs(): LocalFaqItem[] {
  const faqsDir = path.join(process.cwd(), 'data', 'faqs');
  if (!fs.existsSync(faqsDir)) return [];

  const files = fs.readdirSync(faqsDir).filter((f) => f.endsWith('.md'));
  const list: LocalFaqItem[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(faqsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      const categorySlug = data.category || 'quy-dinh';
      const categoryName = CATEGORY_NAME_MAP[categorySlug] || 'Quy định';
      const isVerified = data.is_verified === true;
      const verificationSource = data.verification_source || (isVerified ? 'BTC' : 'Chờ xác thực');
      const rawQuestion = data.question || '';
      const guideTitle = data.title || rawQuestion.replace(/\?$/, '');

      list.push({
        id: file.replace('.md', ''),
        title: guideTitle,
        question: rawQuestion,
        category: categorySlug,
        categoryName,
        priority: typeof data.priority === 'number' ? data.priority : 0,
        is_active: data.is_active !== false,
        is_verified: isVerified,
        verification_source: verificationSource,
        media_links: Array.isArray(data.media_links) ? data.media_links : [],
        variants: Array.isArray(data.variants) ? data.variants : [],
        answer: content.trim(),
      });
    } catch (err) {
      console.error(`Lỗi đọc file FAQ [${file}]:`, err);
    }
  }

  // Sắp xếp theo priority giảm dần (ưu tiên cao lên trước)
  return list.sort((a, b) => b.priority - a.priority);
}
