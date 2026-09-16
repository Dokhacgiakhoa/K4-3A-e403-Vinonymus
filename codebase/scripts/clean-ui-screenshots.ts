import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const FAQS_DIR = path.join(process.cwd(), 'data', 'faqs');

async function cleanUiScreenshots() {
  const files = fs.readdirSync(FAQS_DIR).filter((f) => f.endsWith('.md'));
  let cleanedCount = 0;

  for (const file of files) {
    const filePath = path.join(FAQS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);

    let isModified = false;

    // 1. Lọc media_links trong frontmatter: Xóa các link chứa '_user_uploaded/media_'
    if (Array.isArray(parsed.data.media_links)) {
      const initialLength = parsed.data.media_links.length;
      parsed.data.media_links = parsed.data.media_links.filter((item: any) => {
        if (!item || !item.url) return false;
        // Nếu URL trỏ tới _user_uploaded/media_ thì loại bỏ
        if (typeof item.url === 'string' && item.url.includes('_user_uploaded/media_')) {
          return false;
        }
        return true;
      });

      if (parsed.data.media_links.length === 0) {
        delete parsed.data.media_links;
      }

      if (initialLength !== (parsed.data.media_links?.length || 0)) {
        isModified = true;
      }
    }

    // 2. Làm sạch nội dung markdown bên dưới: Xóa các dòng ảnh `![...](/_user_uploaded/media_...)`
    let body = parsed.content;
    const bodyLines = body.split('\n');
    const newBodyLines = bodyLines.filter((line) => {
      if (line.includes('_user_uploaded/media_')) {
        isModified = true;
        return false;
      }
      return true;
    });

    if (isModified) {
      cleanedCount++;
      const cleanedBody = newBodyLines.join('\n');
      const updatedFileContent = matter.stringify(cleanedBody, parsed.data);
      fs.writeFileSync(filePath, updatedFileContent, 'utf8');
      console.log(`[CLEANED] ${file}`);
    }
  }

  console.log(`\n🎉 Đã làm sạch tổng cộng ${cleanedCount} tệp FAQ khỏi các ảnh chụp màn hình UI ứng dụng!`);
}

cleanUiScreenshots().catch(console.error);
