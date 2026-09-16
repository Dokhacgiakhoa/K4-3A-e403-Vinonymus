import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const FAQS_DIR = path.join(process.cwd(), 'data', 'faqs');
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

interface ImageAuditResult {
  faqFile: string;
  faqTitle: string;
  imagePath: string;
  existsOnDisk: boolean;
  fileSizeBytes?: number;
  status: 'VALID_EXTERNAL_EVIDENCE' | 'MISSING_FILE' | 'SUSPECT_OR_UNCERTAIN';
  notes: string;
}

async function auditAllImages() {
  const results: ImageAuditResult[] = [];
  const faqFiles = fs.readdirSync(FAQS_DIR).filter((f) => f.endsWith('.md'));

  for (const file of faqFiles) {
    const filePath = path.join(FAQS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    const title = parsed.data.title || parsed.data.question || file;

    const referencedImages: Array<{ url: string; sourceLocation: string }> = [];

    // 1. Quét media_links từ frontmatter
    if (Array.isArray(parsed.data.media_links)) {
      for (const media of parsed.data.media_links) {
        if (media && media.type === 'image' && media.url) {
          referencedImages.push({ url: media.url, sourceLocation: 'frontmatter media_links' });
        }
      }
    }

    // 2. Quét thẻ Markdown image `![alt](url)`
    const bodyMatches = parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);
    for (const match of bodyMatches) {
      const url = match[2];
      if (url) {
        referencedImages.push({ url, sourceLocation: 'markdown body' });
      }
    }

    // 3. Phân tích từng ảnh
    for (const img of referencedImages) {
      const cleanUrl = img.url.trim();
      let diskPath = '';
      if (cleanUrl.startsWith('/')) {
        diskPath = path.join(process.cwd(), 'public', cleanUrl.slice(1));
      } else {
        diskPath = path.join(process.cwd(), cleanUrl);
      }

      const exists = fs.existsSync(diskPath);
      let stat: fs.Stats | null = null;
      if (exists) {
        stat = fs.statSync(diskPath);
      }

      let status: 'VALID_EXTERNAL_EVIDENCE' | 'MISSING_FILE' | 'SUSPECT_OR_UNCERTAIN' = 'VALID_EXTERNAL_EVIDENCE';
      let notes = '';

      if (!exists) {
        status = 'MISSING_FILE';
        notes = `Tệp không tồn tại trên đĩa (${diskPath})`;
      } else {
        // Kiểm tra kích thước hoặc đường dẫn nghi vấn
        if (cleanUrl.includes('_user_uploaded') || cleanUrl.includes('localhost') || cleanUrl.includes('preview')) {
          status = 'SUSPECT_OR_UNCERTAIN';
          notes = 'Đường dẫn ảnh có dấu hiệu tệp tạm thời UI';
        } else {
          notes = `Kích thước: ${(stat!.size / 1024).toFixed(1)} KB. Tệp nằm trong public/images/faqs/`;
        }
      }

      results.push({
        faqFile: file,
        faqTitle: title,
        imagePath: cleanUrl,
        existsOnDisk: exists,
        fileSizeBytes: stat?.size,
        status,
        notes,
      });
    }
  }

  // Quét danh sách tất cả các ảnh trong public/images/faqs/ xem có ảnh nào chưa được dùng hoặc mồ côi
  const imagesFaqDir = path.join(PUBLIC_IMAGES_DIR, 'faqs');
  let orphanImages: string[] = [];
  if (fs.existsSync(imagesFaqDir)) {
    const allPublicFaqImages = fs.readdirSync(imagesFaqDir);
    const referencedUrls = new Set(results.map((r) => r.imagePath));
    for (const imgFile of allPublicFaqImages) {
      const expectedUrl = `/images/faqs/${imgFile}`;
      if (!referencedUrls.has(expectedUrl)) {
        orphanImages.push(expectedUrl);
      }
    }
  }

  console.log('=== KẾT QUẢ AUDIT KHO ẢNH DỮ LIỆU ===');
  console.log(`Tổng số tệp FAQ đã kiểm tra: ${faqFiles.length}`);
  console.log(`Tổng số đường dẫn ảnh được tham chiếu trong FAQ: ${results.length}`);
  console.log(`Số lượng ảnh mồ côi trong public/images/faqs/: ${orphanImages.length}\n`);

  console.log(JSON.stringify({ results, orphanImages }, null, 2));
}

auditAllImages().catch(console.error);
