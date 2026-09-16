import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

const screenshotUpdates: Record<string, any> = {
  'thoi-gian-hoc-va-thuc-tap.md': {
    title: 'Cấu trúc Lộ trình Đào tạo 12 Tuần & 3 Trụ cột Chuyên sâu (P1, P2, P3)',
    question: 'Chi tiết cấu trúc 3 giai đoạn đào tạo 12 tuần và 3 hướng chuyên sâu',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Cấu trúc 12 tuần (3 Giai đoạn)**:
  - **Giai đoạn 1 (03 tuần - Nền tảng toàn diện)**: Trang bị kiến thức và kỹ năng nền tảng qua 3 trụ cột (P1: AI Business & Product, P2: AI Infrastructure & Data, P3: AI Application).
  - **Giai đoạn 2 (03 tuần - Chuyên sâu theo định hướng)**: Học viên lựa chọn 1 trong 3 hướng chuyên sâu (P1, P2 hoặc P3).
  - **Giai đoạn 3 (06 tuần - Thực chiến tại doanh nghiệp)**: Tham gia dự án thực tế, làm việc theo môi trường chuyên nghiệp của doanh nghiệp đối tác.
- **Hỗ trợ học tập 24/7**: Trong 06 tuần đầu tại VinUni, vào các buổi chiều, tối và cuối tuần, học viên làm dự án mô phỏng với sự hỗ trợ 24/7 qua Discord, Zoom và GitHub.`
  },
  'tro-cap-8-trieu-va-dieu-kien-nhan.md': {
    title: 'Chính sách Tài trợ 100% Học phí & Phụ cấp Sinh hoạt 8 Triệu Đồng/tháng',
    question: 'Thông tin tài trợ học phí và mức phụ cấp hàng tháng cho học viên',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Tài trợ học phí**: Học viên được **miễn 100% học phí** trong suốt thời gian tham gia chương trình.
- **Phụ cấp sinh hoạt**: Nhận khoản phụ cấp **8.000.000 VNĐ/tháng** trong suốt 12 tuần đào tạo.
- **Điều kiện nhận**: Đảm bảo tỷ lệ chuyên cần từ 90% trở lên, nộp bài tập/dự án đúng hạn và đạt đánh giá năng lực từ Mentor & Ban Đào tạo.`
  },
  'bao-luu-khoa-hoc-va-thoi-gian.md': {
    title: 'Chứng chỉ Đào tạo Đồng cấp bởi Đại học VinUni & Tập đoàn Vingroup',
    question: 'Quyền lợi chứng chỉ tốt nghiệp và giá trị pháp lý từ VinUni & Vingroup',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Chứng chỉ tốt nghiệp**: Học viên hoàn thành khóa học được cấp **Chứng chỉ đào tạo do Trường Đại học VinUni và Tập đoàn Vingroup đồng cấp**, đảm bảo uy tín và giá trị danh giá.
- **Cơ hội việc làm**: Học viên tốt nghiệp có cơ hội tuyển dụng trực tiếp vào các P&L của Tập đoàn Vingroup với mức lương hấp dẫn (20 - 50 triệu VNĐ/tháng).
- **Chính sách bảo lưu**: Học viên có lý do chính đáng được Ban Đào tạo xem xét bảo lưu kết quả học tập để hoàn thành ở đợt tiếp theo.`
  }
};

for (const [file, info] of Object.entries(screenshotUpdates)) {
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
  console.log('Đã cập nhật bài viết theo ảnh chụp màn hình chính thức:', file);
}
