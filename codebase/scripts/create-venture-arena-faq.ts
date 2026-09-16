import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');
const file = path.join(dir, 'venture-arena-cuoc-thi-startup-ai.md');

const data = {
  question: 'Sự kiện Venture Arena: Mô hình cuộc thi Startup & Đầu tư cược điểm (Build - Pitch - Invest)',
  title: 'Sự kiện Venture Arena & 3 Chiến tuyến Bài toán Đột phá (Build - Pitch - Invest)',
  variants: [
    'venture arena la gi',
    'cuoc thi venture arena vinuni',
    '3 chien tuyen venture arena',
    'co che 100 diem dau tu venture arena',
    'build pitch invest ai thuc chien'
  ],
  category: 'chuong-trinh-hoc',
  priority: 17,
  is_active: true,
  is_verified: true,
  verification_source: "Bài đăng chính thức từ Hoàng Blue's trong Cộng đồng AI thực chiến Vingroup - VinUni",
  media_links: [
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044910992.png',
      caption: "Bài đăng công bố sự kiện Venture Arena từ Hoàng Blue's"
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044921980.png',
      caption: 'Chi tiết 3 Chiến tuyến bài toán và cơ chế Startup + Investor 100 điểm'
    }
  ]
};

const content = `- **Bản chất sự kiện Venture Arena**: Là đấu trường đưa học viên (hơn 1.000 học viên K3 & K4) bước ra khỏi vùng an toàn của người chỉ biết build code để đối mặt với thị trường thực tế: khảo sát user, tìm pain point sâu sắc và đưa sản phẩm kiểm chứng trước người dùng thật.
- **3 Chiến tuyến Bài toán chính**:
  - **Chiến tuyến 1**: Cải tiến AI Tutor trên nền tảng VLearn.
  - **Chiến tuyến 2**: Xây dựng Trợ lý học viên chuyên dụng cho cộng đồng Discord.
  - **Chiến tuyến 3**: Tự khai phá cơ hội mới dựa trên khai thác nguồn dữ liệu thực tế (chatlog AI Tutor ẩn danh, transcript bài giảng...).
- **Cơ chế Vai trò Kép (Startup & Investor)**:
  - **Mỗi team đóng vai Startup**: Trực tiếp xây dựng sản phẩm (Build) và thuyết trình giá trị (Pitch) trước hội đồng & thị trường.
  - **Mỗi team đóng vai Investor**: Được cấp **100 điểm** để trực tiếp đánh giá và đặt cược (Invest) vào giải pháp xuất sắc của các đội nhóm khác.
- **Thông điệp hành động**: *"Build with evidence. Pitch with conviction. Invest with purpose."* (Xây dựng dựa trên minh chứng thực tế, thuyết trình bằng sự thuyết phục, đầu tư có mục đích rõ ràng).`;

fs.writeFileSync(file, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
console.log('Đã tạo thành công venture-arena-cuoc-thi-startup-ai.md');
