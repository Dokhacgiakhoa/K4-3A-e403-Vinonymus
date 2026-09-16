import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const USER_UPLOADED_DIR = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\bfe72019-2eff-4312-821e-aff5c5dc3d8e\\.user_uploaded';
const PUBLIC_FAQS_DIR = path.join(process.cwd(), 'public', 'images', 'faqs');
const DATA_FAQS_DIR = path.join(process.cwd(), 'data', 'faqs');
const GUIDEBOOK_PATH = path.join(process.cwd(), 'src', 'components', 'guidebook', 'guidebook-view.tsx');

if (!fs.existsSync(PUBLIC_FAQS_DIR)) {
  fs.mkdirSync(PUBLIC_FAQS_DIR, { recursive: true });
}

// Bảng ánh xạ tệp ảnh gốc -> Tên tệp công khai trong public/images/faqs/ -> FAQ target
const IMAGE_MAPPINGS: Array<{
  sourceMediaName: string;
  targetFilename: string;
  targetFaqFile: string;
  caption: string;
}> = [
  {
    sourceMediaName: 'media_1786049122849.png',
    targetFilename: 've-com-cang-tin-vinuni.png',
    targetFaqFile: 'phieu-an-cang-tin.md',
    caption: 'Xác nhận giá vé cơm tháng 880k/22 buổi & review suất ăn căng tin VinUni từ học viên Khóa 1 (SageBeet752)',
  },
  {
    sourceMediaName: 'media_1786044910992.png',
    targetFilename: 'venture-arena-post.png',
    targetFaqFile: 'venture-arena-cuoc-thi-startup-ai.md',
    caption: 'Bài đăng công bố sự kiện Venture Arena từ Hoàng Blue\'s trong Cộng đồng AI thực chiến',
  },
  {
    sourceMediaName: 'media_1786044921980.png',
    targetFilename: 'venture-arena-tracks.png',
    targetFaqFile: 'venture-arena-cuoc-thi-startup-ai.md',
    caption: 'Chi tiết 3 Chiến tuyến bài toán và cơ chế Startup + Investor 100 điểm',
  },
  {
    sourceMediaName: 'media_1786044709162.png',
    targetFilename: 'review-7-ngay-infographic.png',
    targetFaqFile: 'review-7-ngay-hoc-ai-thuc-chien.md',
    caption: 'Infographic tổng quan Lộ trình 7 ngày học AI Thực chiến - From LLM Foundations to Real-World AI Systems',
  },
  {
    sourceMediaName: 'media_1786044776073.png',
    targetFilename: 'review-7-ngay-post.png',
    targetFaqFile: 'review-7-ngay-hoc-ai-thuc-chien.md',
    caption: 'Bài chia sẻ review trải nghiệm thực tế 7 ngày học AI Thực chiến từ Hoàng Blue\'s',
  },
  {
    sourceMediaName: 'media_1786044842958.png',
    targetFilename: 'kinh-nghiem-chon-teammate-infographic.png',
    targetFaqFile: 'kinh-nghiem-chon-teammate-3-role.md',
    caption: 'Infographic Chiến thuật Chọn Teammate cho 6 Tuần BUILD: Product Lead | Product Engineer | AI Reliability Engineer',
  },
  {
    sourceMediaName: 'media_1786044786675.png',
    targetFilename: 'kinh-nghiem-chon-teammate-post.png',
    targetFaqFile: 'kinh-nghiem-chon-teammate-3-role.md',
    caption: 'Bài chia sẻ kinh nghiệm chọn teammate 3 vai trò từ Hoàng Blue\'s (Top 1 Cohort 2)',
  },
  {
    sourceMediaName: 'media_1786043874399.png',
    targetFilename: 'quy-dinh-doi-lop-nhom-khoa-post.png',
    targetFaqFile: 'quy-dinh-doi-lop-nhom-khoa.md',
    caption: 'Đính chính tuyệt đối 100% không giải quyết cho đổi lớp, nhóm hay khóa từ Admin Lam Luu',
  },
  {
    sourceMediaName: 'media_1786043949608.png',
    targetFilename: 'tien-ich-gym-be-boi-post.png',
    targetFaqFile: 'su-dung-gym-be-boi-vinuni.md',
    caption: 'Thông báo đính chính chưa hỗ trợ tiện ích Gym/Bể bơi VinUni từ Admin Lam Luu',
  },
  {
    sourceMediaName: 'media_1786044370011.png',
    targetFilename: 'phi-gui-xe-the-hoc-vien-post.png',
    targetFaqFile: 'phi-gui-xe-va-the-hoc-vien.md',
    caption: 'Xác nhận gửi xe không mất phí và biển số xe tích hợp Thẻ học viên từ Admin Lam Luu',
  },
  {
    sourceMediaName: 'media_1786043448881.png',
    targetFilename: 'phong-tu-hoc-247-post.png',
    targetFaqFile: 'phong-hoc-tu-hoc-24-7.md',
    caption: 'Xác nhận từ Hoàng Blue\'s về phòng tự học mở 24/7 tại VinUni',
  },
  {
    sourceMediaName: 'media_1786043850402.png',
    targetFilename: 'thuc-tap-hcm-post.png',
    targetFaqFile: 'dia-diem-thuc-tap-hcm.md',
    caption: 'Xác nhận có form đăng ký nguyện vọng thực tập tại TP. Hồ Chí Minh từ Hoàng Blue\'s',
  },
  {
    sourceMediaName: 'media_1786041653067.png',
    targetFilename: 'mang-vneid-khi-mat-cccd-post.png',
    targetFaqFile: 'mang-vneid-khi-mat-cccd.md',
    caption: 'Xác nhận sử dụng VNeID định danh thay thế khi mất CCCD từ Admin Lam Luu',
  },
];

async function organizeScreenshots() {
  console.log('🚀 Đang sao chép và gắn các ảnh chụp màn hình bằng chứng chính thức...\n');

  // 1. Sao chép các file ảnh vào public/images/faqs/
  for (const item of IMAGE_MAPPINGS) {
    const srcPath = path.join(USER_UPLOADED_DIR, item.sourceMediaName);
    const destPath = path.join(PUBLIC_FAQS_DIR, item.targetFilename);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[COPIED] ${item.sourceMediaName} -> /images/faqs/${item.targetFilename}`);
    } else {
      console.warn(`[WARNING] Không tìm thấy tệp nguồn: ${srcPath}`);
    }
  }

  // 2. Cập nhật media_links và nội dung phần 3 trong các file FAQ markdown
  for (const item of IMAGE_MAPPINGS) {
    const faqPath = path.join(DATA_FAQS_DIR, item.targetFaqFile);
    if (!fs.existsSync(faqPath)) continue;

    const content = fs.readFileSync(faqPath, 'utf8');
    const parsed = matter(content);

    const publicUrl = `/images/faqs/${item.targetFilename}`;

    // Cập nhật mảng media_links
    let mediaLinks: any[] = Array.isArray(parsed.data.media_links) ? parsed.data.media_links : [];
    
    // Xóa trùng nếu có
    mediaLinks = mediaLinks.filter((m) => m.url !== publicUrl);
    mediaLinks.push({
      type: 'image',
      url: publicUrl,
      caption: item.caption,
    });

    parsed.data.media_links = mediaLinks;

    // Cập nhật body markdown
    let body = parsed.content.trim();
    if (!body.includes(publicUrl)) {
      if (!body.includes('---')) {
        body += `\n\n---\n### Hình ảnh chứng minh & Trích dẫn gốc:\n- **${item.caption}**:\n![${item.caption}](${publicUrl})`;
      } else {
        body += `\n- **${item.caption}**:\n![${item.caption}](${publicUrl})`;
      }
    }

    const updatedContent = matter.stringify(body, parsed.data);
    fs.writeFileSync(faqPath, updatedContent, 'utf8');
    console.log(`[UPDATED FAQ] ${item.targetFaqFile}`);
  }

  console.log('\n🎉 Đã hoàn tất tổ chức lại toàn bộ ảnh bằng chứng thực tế vào public/images/faqs/!');
}

organizeScreenshots().catch(console.error);
