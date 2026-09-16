import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DATA_FAQS_DIR = path.join(process.cwd(), 'data', 'faqs');
const GUIDEBOOK_PATH = path.join(process.cwd(), 'src', 'components', 'guidebook', 'guidebook-view.tsx');

function syncGuidebookMedia() {
  const faqFiles = fs.readdirSync(DATA_FAQS_DIR).filter((f) => f.endsWith('.md'));
  const faqMediaMap: Record<string, any[]> = {};

  for (const file of faqFiles) {
    const fileId = file.replace('.md', '');
    const filePath = path.join(DATA_FAQS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);

    if (Array.isArray(parsed.data.media_links) && parsed.data.media_links.length > 0) {
      faqMediaMap[fileId] = parsed.data.media_links;
    }
  }

  let guidebookContent = fs.readFileSync(GUIDEBOOK_PATH, 'utf8');

  for (const [id, mediaLinks] of Object.entries(faqMediaMap)) {
    const mediaLinksJson = JSON.stringify(mediaLinks, null, 6);
    
    // Check if item already has media_links
    const itemRegex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?)(media_links:\\s*\\[[^\\]]*\\],?)?([\\s\\S]*?answer:)`, 'g');

    guidebookContent = guidebookContent.replace(itemRegex, (fullMatch, head, existingMedia, body) => {
      return `${head.trim()}\n    media_links: ${mediaLinksJson},\n    ${body.trim()}`;
    });
  }

  fs.writeFileSync(GUIDEBOOK_PATH, guidebookContent, 'utf8');
  console.log('✅ Đã đồng bộ thành công media_links chính thức vào guidebook-view.tsx!');
}

syncGuidebookMedia();
