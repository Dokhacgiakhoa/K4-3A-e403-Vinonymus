import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

const officialUpdates: Record<string, any> = {
  'thoi-gian-hoc-va-thuc-tap.md': {
    title: 'Cấu trúc Lộ trình Đào tạo 12 Tuần (3W Nền tảng + 3W Chuyên sâu + 6W Thực tập)',
    question: 'Cấu trúc và Lộ trình Đào tạo 12 tuần của chương trình AI Thực chiến',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' },
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/wp-content/uploads/2026/06/20K-AI-Handbook-ver2.1.pdf', title: 'Tải Sổ tay Học viên AI in Action (PDF)' }
    ],
    content: `- **Giai đoạn 1 (03 tuần - Nền tảng toàn diện)**: Thực học về tư duy AI, đạo đức AI, kỹ năng AI và giải quyết vấn đề bằng trợ lý AI cùng giảng viên VinUni.
- **Giai đoạn 2 (03 tuần - Chuyên môn nâng cao)**: Đào sâu kiến thức theo định hướng chuyên môn và làm dự án mô phỏng tại VinUni với hỗ trợ 24/7 qua Discord/Zoom/GitHub.
- **Giai đoạn 3 (06 tuần - Thực chiến doanh nghiệp)**: Thực tập full-time triển khai dự án AI thật tại các công ty/tập đoàn đối tác hoặc VinUni Research Lab.`
  },
  'tro-cap-8-trieu-va-dieu-kien-nhan.md': {
    title: 'Chính sách Trợ cấp Sinh hoạt 8.000.000 VNĐ/tháng & Miễn 100% Học phí',
    question: 'Chính sách tài trợ học phí & Khoản trợ cấp sinh hoạt 8.000.000 VNĐ/tháng',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Tài trợ học phí**: Học viên được **miễn 100% học phí** trong suốt thời gian đào tạo.
- **Trợ cấp sinh hoạt**: Nhận khoản phụ cấp **8.000.000 VNĐ/tháng** trực tiếp qua tài khoản ngân hàng trong suốt thời gian tham gia.
- **Điều kiện xét duyệt & giải ngân**:
  - Đảm bảo tỷ lệ chuyên cần từ 90% trở lên.
  - Hoàn thành đúng hạn các bài Assignment/Dự án theo yêu cầu.
  - Đạt đánh giá năng lực từ Mentor và Ban Đào tạo.`
  },
  'co-hoi-nghe-nghiep-va-tuyen-dung.md': {
    title: 'Cơ hội Việc làm tại Vingroup & Mức lương Tuyển dụng Đầu ra (20 - 50 triệu/tháng)',
    question: 'Cơ hội tuyển dụng vào Tập đoàn Vingroup và mức lương đầu ra',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Tuyển dụng trực tiếp**: Học viên tốt nghiệp có cơ hội được tuyển dụng trực tiếp vào các P&L (công ty thành viên) thuộc **Tập đoàn Vingroup**.
- **Mức lương đầu ra**: Thu nhập cạnh tranh đặc biệt hấp dẫn từ **20.000.000 VNĐ đến 50.000.000 VNĐ/tháng** phụ thuộc vào năng lực thực chiến.
- **Đào tạo nâng cao**: Học viên xuất sắc tiếp tục được tuyển chọn tham gia các khóa đào tạo nâng cao dành cho chuyên gia và lãnh đạo dự án AI.`
  },
  'timeline-tuyen-sinh-khoa-4.md': {
    title: 'Lộ trình Mốc Thời gian Tuyển sinh & Khai giảng Khóa IV chính thức',
    question: 'Lịch trình nộp hồ sơ, thi đánh giá năng lực và khai giảng Khóa 4',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Thời gian nộp hồ sơ (dự kiến)**: Từ **01/07/2026 đến 15/08/2026**.
- **Thi Đánh giá Năng lực đầu vào (dự kiến)**:
  - **Đợt 1**: 15/08/2026 – 16/08/2026.
  - **Đợt 2**: 22/08/2026.
- **Thời gian khai giảng (dự kiến)**: **10/09/2026**.`
  },
  'kenh-lien-he-va-ho-tro-tuyen-sinh.md': {
    title: 'Danh bạ Kênh Liên hệ & Hỗ trợ Tuyển sinh Chính thức từ VinUni',
    question: 'Các kênh thông tin liên hệ chính thức hỗ trợ thí sinh và học viên',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' },
      { type: 'link', url: 'https://www.facebook.com/DaotaoNhantaiAIthucchien/', title: 'Fanpage Facebook chính thức AI in Action' },
      { type: 'link', url: 'https://www.facebook.com/groups/2125430681651241', title: 'Facebook Group chính thức AI in Action' }
    ],
    content: `- **Hotline AI20K chính thức**: \`0979.489.846\`
- **Cán bộ tư vấn tuyển sinh (Ms. Phương Thảo)**: \`0388.339.478\`
- **Email tiếp nhận**: \`aithucchien@vinuni.edu.vn\`
- **Fanpage Facebook**: \`https://www.facebook.com/DaotaoNhantaiAIthucchien/\`
- **Facebook Group**: \`https://www.facebook.com/groups/2125430681651241\`
- **Form Đăng ký Trực tuyến**: \`https://docs.google.com/forms/d/e/1FAIpQLSeGwZvkzSxvuQk74ARPhMCDqVXU8DyT-DcM4-9alMhJWg3TJw/viewform\``
  },
  'gioi-han-do-tuoi-dang-ky.md': {
    title: 'Đối tượng Dự tuyển & Tiêu chuẩn Năng lực Khung SFIA',
    question: 'Điều kiện đối tượng và yêu cầu năng lực dự tuyển chương trình',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Đối tượng học thuật**: Sinh viên năm cuối hoặc đã tốt nghiệp Đại học/Cao đẳng/Trung cấp các ngành gần hoặc liên quan (Khoa học máy tính, Kỹ thuật phần mềm, CNTT, An toàn thông tin, Phân tích dữ liệu...).
- **Đối tượng không đúng chuyên ngành**: Ứng viên cần có nền tảng toán học, tư duy logic và kinh nghiệm thực tế về lập trình/dữ liệu/phần mềm.
- **Tiêu chuẩn năng lực**: Chương trình thiết kế chuẩn hóa theo **Khung năng lực SFIA toàn cầu** (Level 2 đến Level 4).`
  }
};

for (const [file, info] of Object.entries(officialUpdates)) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) continue;
  const raw = fs.readFileSync(p, 'utf8');
  const { data } = matter(raw);
  
  data.title = info.title;
  data.question = info.question;
  data.is_verified = info.is_verified;
  data.verification_source = info.verification_source;
  data.media_links = info.media_links;
  
  const newYaml = yaml.dump(data, { lineWidth: -1 }).trim();
  const newContent = '---\n' + newYaml + '\n---\n\n' + info.content.trim() + '\n';
  fs.writeFileSync(p, newContent, 'utf8');
  console.log('Đã cập nhật bài viết chính thức từ VinUni Web:', file);
}
