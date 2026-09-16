import fs from 'fs';
import path from 'path';

const GUIDEBOOK_PATH = path.join(process.cwd(), 'src', 'components', 'guidebook', 'guidebook-view.tsx');

function cleanGuidebookMedia() {
  let content = fs.readFileSync(GUIDEBOOK_PATH, 'utf8');

  // Xóa các phần tử media_links dạng { type: 'image', url: '/_user_uploaded/media_...' ... }
  // 1. Xóa các dòng có url: '/_user_uploaded/media_...' trong mảng media_links
  const lines = content.split('\n');
  const newLines = lines.filter(line => !line.includes('/_user_uploaded/media_'));

  content = newLines.join('\n');

  // Làm sạch mảng media_links rỗng: media_links: [\n    ],
  content = content.replace(/media_links:\s*\[\s*\]\s*,?/g, '');

  fs.writeFileSync(GUIDEBOOK_PATH, content, 'utf8');
  console.log('✅ Đã làm sạch xong media_links tạm thời trong guidebook-view.tsx!');
}

cleanGuidebookMedia();
