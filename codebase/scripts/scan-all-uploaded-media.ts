import fs from 'fs';
import path from 'path';

const USER_UPLOADED_DIR = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\bfe72019-2eff-4312-821e-aff5c5dc3d8e\\.user_uploaded';
const PUBLIC_FAQS_DIR = path.join(process.cwd(), 'public', 'images', 'faqs');

async function scanAllMediaFiles() {
  const files = fs.readdirSync(USER_UPLOADED_DIR);
  console.log(`Tổng số tệp media trong thư mục .user_uploaded: ${files.length}\n`);

  const fileStats = files.map((file) => {
    const filePath = path.join(USER_UPLOADED_DIR, file);
    const stat = fs.statSync(filePath);
    return {
      name: file,
      sizeKB: (stat.size / 1024).toFixed(1),
      mtime: stat.mtime.toLocaleString('vi-VN'),
    };
  });

  console.log(JSON.stringify(fileStats, null, 2));
}

scanAllMediaFiles().catch(console.error);
