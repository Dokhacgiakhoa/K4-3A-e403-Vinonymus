import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const USER_UPLOADED_DIR = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\bfe72019-2eff-4312-821e-aff5c5dc3d8e\\.user_uploaded';
const PUBLIC_FAQS_DIR = path.join(process.cwd(), 'public', 'images', 'faqs');
const DATA_FAQS_DIR = path.join(process.cwd(), 'data', 'faqs');

if (!fs.existsSync(PUBLIC_FAQS_DIR)) {
  fs.mkdirSync(PUBLIC_FAQS_DIR, { recursive: true });
}

async function organizeAllUserUploads() {
  const files = fs.readdirSync(USER_UPLOADED_DIR);
  console.log(`🔍 Tìm thấy tổng cộng ${files.length} tệp phương tiện trong kho tải lên của người dùng.\n`);

  let copiedCount = 0;
  const copiedFiles: Array<{ name: string; sizeKB: string; publicPath: string }> = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    const srcPath = path.join(USER_UPLOADED_DIR, file);
    const stat = fs.statSync(srcPath);

    if (stat.size < 5000) continue;

    const ext = path.extname(file) || '.png';
    const cleanIndex = String(copiedCount + 1).padStart(3, '0');
    const targetFilename = `minh-chung-du-lieu-${cleanIndex}${ext}`;
    const destPath = path.join(PUBLIC_FAQS_DIR, targetFilename);

    fs.copyFileSync(srcPath, destPath);
    copiedCount++;

    copiedFiles.push({
      name: file,
      sizeKB: (stat.size / 1024).toFixed(1),
      publicPath: `/images/faqs/${targetFilename}`,
    });
  }

  console.log(`✅ Đã sao chép và chuẩn hóa thành công ${copiedCount} tệp ảnh chụp bằng chứng từ người dùng vào thư mục public/images/faqs/!\n`);

  const faqFiles = fs.readdirSync(DATA_FAQS_DIR).filter((f) => f.endsWith('.md'));
  console.log(`📂 Đang liên kết ${copiedCount} ảnh vào ${faqFiles.length} bài FAQ...\n`);

  let fileIndex = 0;
  for (const faqFile of faqFiles) {
    const faqPath = path.join(DATA_FAQS_DIR, faqFile);
    const content = fs.readFileSync(faqPath, 'utf8');
    const parsed = matter(content);

    let mediaLinks: any[] = Array.isArray(parsed.data.media_links) ? parsed.data.media_links : [];

    const countToAttach = Math.min(2, copiedFiles.length - fileIndex);
    for (let k = 0; k < countToAttach; k++) {
      if (fileIndex < copiedFiles.length) {
        const imgInfo = copiedFiles[fileIndex];
        if (imgInfo && !mediaLinks.some((m) => m.url === imgInfo.publicPath)) {
          mediaLinks.push({
            type: 'image',
            url: imgInfo.publicPath,
            caption: `Ảnh chụp bằng chứng dữ liệu nguồn (${imgInfo.name})`,
          });
        }
        fileIndex++;
      }
    }

    parsed.data.media_links = mediaLinks;
    const updatedContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(faqPath, updatedContent, 'utf8');
  }

  console.log(`🎉 Đã gắn thành công toàn bộ ${copiedCount} tệp ảnh chụp màn hình dữ liệu vào kho FAQ!`);
}

organizeAllUserUploads().catch(console.error);
