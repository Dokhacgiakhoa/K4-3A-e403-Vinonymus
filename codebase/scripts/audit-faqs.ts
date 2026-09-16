import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { normalizeText } from '../src/lib/rag/normalize';

// Tự nạp biến môi trường từ .env.local nếu chưa nạp
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

interface CategoryConfig {
  slug: string;
  name: string;
}

export interface FaqItem {
  file: string;
  relPath: string;
  question: string;
  category: string;
  priority: number;
  is_active: boolean;
  variants: string[];
  answer: string;
  raw: string;
}

export interface IssueItem {
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  file: string;
  title: string;
  description: string;
}

const ALLOWED_CATEGORIES = new Set(['thi-dgnl', 'chuong-trinh-hoc', 'tien-ich', 'quy-dinh']);

// Hàm tính Jaccard similarity giữa 2 chuỗi từ
function calculateWordSimilarity(text1: string, text2: string): number {
  const words1 = new Set(normalizeText(text1).split(/\s+/).filter(Boolean));
  const words2 = new Set(normalizeText(text2).split(/\s+/).filter(Boolean));

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  for (const w of words1) {
    if (words2.has(w)) intersection++;
  }

  const union = new Set([...words1, ...words2]).size;
  return intersection / union;
}

const PHONE_REGEX = /\d{3,4}[.\s]?\d{3}[.\s]?\d{3,4}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Chuẩn hoá số điện thoại về dạng chỉ chữ số để so khớp bất kể cách viết (dấu chấm/khoảng trắng)
function normalizeFact(raw: string): string {
  return raw.replace(/[.\s]/g, '').toLowerCase();
}

// Trích "dữ kiện tham chiếu" (số điện thoại, email) trong nội dung câu trả lời — đây là loại
// thông tin PHẢI có đúng 1 nguồn duy nhất, vì nếu bị chép rải rác ra nhiều FAQ thì khi BTC đổi số/email
// sẽ chỉ sửa được 1 chỗ và các bản sao còn lại âm thầm sai mà không ai biết.
function extractContactFacts(text: string): string[] {
  const facts: string[] = [];
  const phones = text.match(PHONE_REGEX) ?? [];
  const emails = text.match(EMAIL_REGEX) ?? [];
  for (const p of phones) facts.push(normalizeFact(p));
  for (const e of emails) facts.push(normalizeFact(e));
  return facts;
}

// Tách riêng phần phân tích chéo (không đọc đĩa) để có thể unit test bằng fixture thuần,
// không cần tạo file .md thật trên đĩa.
export function analyzeFaqIssues(faqs: FaqItem[]): IssueItem[] {
  const issues: IssueItem[] = [];

  for (let i = 0; i < faqs.length; i++) {
    for (let j = i + 1; j < faqs.length; j++) {
      const faqA = faqs[i]!;
      const faqB = faqs[j]!;

      // Check: độ tương đồng giữa câu hỏi A và câu hỏi B
      const simQQ = calculateWordSimilarity(faqA.question, faqB.question);
      if (simQQ > 0.75) {
        issues.push({
          type: 'WARNING',
          file: `${faqA.file} ↔ ${faqB.file}`,
          title: 'Câu hỏi chính có nguy cơ trùng lặp / xung đột',
          description: `Độ tương đồng câu hỏi ${Math.round(simQQ * 100)}% giữa "${faqA.question}" và "${faqB.question}".`,
        });
      }

      // Check: variant nào bị trùng lặp giữa 2 FAQ
      for (const varA of faqA.variants) {
        for (const varB of faqB.variants) {
          const simVar = calculateWordSimilarity(varA, varB);
          if (simVar > 0.9) {
            issues.push({
              type: 'WARNING',
              file: `${faqA.file} ↔ ${faqB.file}`,
              title: 'Biến thể câu hỏi (variants) bị trùng',
              description: `Biến thể "${varA}" trong ${faqA.file} trùng khớp gần như 100% với "${varB}" trong ${faqB.file}.`,
            });
          }
        }
      }

      // Check: nội dung câu trả lời (answer body) trùng lặp — bắt được cả trường hợp 2 FAQ
      // có câu hỏi khác hẳn nhau nhưng phần thân bài lặp lại cùng một khối thông tin
      // (vd cùng chép lại đoạn hotline/địa điểm đã có sẵn ở FAQ khác).
      const simAnswer = calculateWordSimilarity(faqA.answer, faqB.answer);
      if (simAnswer > 0.4) {
        issues.push({
          type: 'WARNING',
          file: `${faqA.file} ↔ ${faqB.file}`,
          title: 'Nội dung câu trả lời có khả năng trùng lặp',
          description: `Độ tương đồng nội dung thân bài ${Math.round(simAnswer * 100)}% giữa 2 FAQ — kiểm tra xem có đang chép lại thông tin đã có ở FAQ kia không (nên trỏ qua \`related_questions\` thay vì lặp lại).`,
        });
      }
    }
  }

  // Check: dữ kiện tham chiếu (số điện thoại, email) xuất hiện ở nhiều hơn 1 file — đây phải luôn
  // có đúng 1 nguồn duy nhất, nếu không sẽ lệch dữ liệu khi BTC đổi số/email mà chỉ sửa được 1 chỗ.
  const factToFiles = new Map<string, Set<string>>();
  for (const faq of faqs) {
    for (const fact of extractContactFacts(faq.answer)) {
      if (!factToFiles.has(fact)) factToFiles.set(fact, new Set());
      factToFiles.get(fact)!.add(faq.file);
    }
  }
  for (const [fact, files] of factToFiles) {
    if (files.size > 1) {
      issues.push({
        type: 'CRITICAL',
        file: [...files].join(' ↔ '),
        title: 'Dữ kiện tham chiếu (SĐT/email) bị nhân bản ra nhiều file',
        description: `Giá trị "${fact}" xuất hiện trong nội dung trả lời của ${files.size} file FAQ khác nhau. Gộp về đúng 1 FAQ nguồn (vd \`kenh-lien-he-va-ho-tro-tuyen-sinh.md\`), các FAQ còn lại trỏ qua \`related_questions\` thay vì chép lại.`,
      });
    }
  }

  return issues;
}

export function auditLocalFaqs(): { faqs: FaqItem[]; issues: IssueItem[]; summaryReport: string } {
  const faqsDir = path.join(process.cwd(), 'data', 'faqs');
  const issues: IssueItem[] = [];
  const faqs: FaqItem[] = [];

  if (!fs.existsSync(faqsDir)) {
    return {
      faqs: [],
      issues: [{ type: 'CRITICAL', file: 'data/faqs', title: 'Thư mục không tồn tại', description: 'Không tìm thấy thư mục data/faqs/' }],
      summaryReport: 'Thư mục data/faqs/ không tồn tại.',
    };
  }

  const files = fs.readdirSync(faqsDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(faqsDir, file);
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const raw = fs.readFileSync(filePath, 'utf8');

    try {
      const { data, content } = matter(raw);

      // Check 1: Frontmatter có đúng cấu trúc không
      if (!data.question || typeof data.question !== 'string' || !data.question.trim()) {
        issues.push({
          type: 'CRITICAL',
          file: relPath,
          title: 'Thiếu câu hỏi chính (question)',
          description: 'Trường frontmatter `question` bị trống hoặc không hợp lệ.',
        });
      }

      if (!data.category || !ALLOWED_CATEGORIES.has(data.category)) {
        issues.push({
          type: 'CRITICAL',
          file: relPath,
          title: 'Category không hợp lệ',
          description: `Chuyên mục \`${data.category}\` không nằm trong 4 slug chuẩn: thi-dgnl, chuong-trinh-hoc, tien-ich, quy-dinh.`,
        });
      }

      if (typeof data.priority !== 'number') {
        issues.push({
          type: 'WARNING',
          file: relPath,
          title: 'Thiếu priority hoặc sai kiểu dữ liệu',
          description: 'Trường `priority` nên là số nguyên từ 1 đến 10.',
        });
      }

      if (data.is_active === undefined) {
        issues.push({
          type: 'WARNING',
          file: relPath,
          title: 'Thiếu is_active',
          description: 'Nên khai báo `is_active: true` trong frontmatter.',
        });
      }

      if (!content || !content.trim()) {
        issues.push({
          type: 'CRITICAL',
          file: relPath,
          title: 'Nội dung trả lời bị trống',
          description: 'Phần body câu trả lời markdown không có chữ nào.',
        });
      }

      faqs.push({
        file,
        relPath,
        question: data.question || '',
        category: data.category || 'quy-dinh',
        priority: typeof data.priority === 'number' ? data.priority : 0,
        is_active: data.is_active !== false,
        variants: Array.isArray(data.variants) ? data.variants : [],
        answer: content.trim(),
        raw,
      });
    } catch (err) {
      issues.push({
        type: 'CRITICAL',
        file: relPath,
        title: 'Lỗi parse YAML Frontmatter',
        description: err instanceof Error ? err.message : String(err),
      });
    }
  }

  issues.push(...analyzeFaqIssues(faqs));

  // Tổng hợp báo cáo Markdown
  let report = `# BÁO CÁO KIỂM TRA CHÉO & RÀ SOÁT KHO FAQ (FAQ AUDIT REPORT)\n\n`;
  report += `**Thời gian quét**: ${new Date().toISOString()}\n`;
  report += `**Tổng số file FAQ kiểm tra**: ${faqs.length}\n`;
  report += `**Tổng số cảnh báo/lỗi phát hiện**: ${issues.length}\n\n`;

  report += `## 📊 Phân bố theo Chuyên mục (Categories)\n\n`;
  for (const catSlug of ALLOWED_CATEGORIES) {
    const count = faqs.filter((f) => f.category === catSlug).length;
    report += `- **\`${catSlug}\`**: ${count} file FAQ\n`;
  }

  report += `\n## 🚨 Danh sách Vấn đề & Cảnh báo phát hiện\n\n`;

  if (issues.length === 0) {
    report += `🎉 **Hoàn hảo! Không phát hiện lỗi cấu trúc hay mâu thuẫn trùng lặp nào.**\n`;
  } else {
    report += `| Mức độ | File liên quan | Vấn đề | Chi tiết |\n`;
    report += `|---|---|---|---|\n`;
    for (const issue of issues) {
      const badge = issue.type === 'CRITICAL' ? '🛑 LỖI NẶNG' : issue.type === 'WARNING' ? '⚠️ CẢNH BÁO' : 'ℹ️ THÔNG TIN';
      report += `| ${badge} | \`${issue.file}\` | ${issue.title} | ${issue.description} |\n`;
    }
  }

  return { faqs, issues, summaryReport: report };
}

async function runAuditScript() {
  console.log('=== BẮT ĐẦU QUÉT KIỂM TRA CHÉO NỘI DUNG FAQ (scripts/audit-faqs.ts) ===\n');

  const { faqs, issues, summaryReport } = auditLocalFaqs();

  console.log(`📁 Đã rà soát: ${faqs.length} file FAQ.`);
  console.log(`🔍 Kết quả: ${issues.filter((i) => i.type === 'CRITICAL').length} Lỗi nặng, ${issues.filter((i) => i.type === 'WARNING').length} Cảnh báo.\n`);

  // Lưu file báo cáo vào docs/reports/faq-audit-report.md
  const reportDir = path.join(process.cwd(), 'docs', 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, 'faq-audit-report.md');
  fs.writeFileSync(reportPath, summaryReport, 'utf8');

  console.log(`📄 Đã xuất báo cáo chi tiết tại: ${path.relative(process.cwd(), reportPath)}`);

  const criticalCount = issues.filter((i) => i.type === 'CRITICAL').length;
  if (criticalCount > 0) {
    console.error(`\n🛑 ${criticalCount} LỖI NẶNG — chặn build. Xem chi tiết ở report trên hoặc ${path.relative(process.cwd(), reportPath)}.`);
    process.exit(1);
  }

  console.log('\n=== HOÀN THÀNH QUÉT RÀ SOÁT FAQ ===');
}

if (require.main === module) {
  runAuditScript().catch((err) => {
    console.error('Lỗi khi chạy script audit-faqs:', err);
    process.exit(1);
  });
}
