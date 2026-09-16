import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

const updates: Record<string, any> = {
  'cau-truc-bai-thi-dgnl.md': {
    title: 'Quy trình Tuyển chọn 2 Vòng & Nội dung Bài thi Đánh giá Năng lực (ĐGNL)',
    question: 'Quy trình 2 vòng tuyển chọn học viên và bài kiểm tra ĐGNL đầu vào',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Quy trình 2 Vòng tuyển chọn học viên**:
  - **Vòng 1 (Xét hồ sơ trực tuyến)**: Ứng viên nộp hồ sơ online gồm CV, thông tin nền tảng học thuật - kỹ thuật, và hồ sơ năng lực (nếu có).
  - **Vòng 2 (Đánh giá năng lực đầu vào)**: Ứng viên tham gia bài kiểm tra năng lực bao gồm tư duy logic, lập trình và dữ liệu cơ bản, cùng xử lý tình huống thực tiễn.
- **Thông báo bài kiểm tra**: Thí sinh qua vòng xét hồ sơ sẽ nhận thông báo chi tiết về bài kiểm tra đầu vào từ Ban Tổ chức qua Email.`
  },
  'doi-ngu-giang-vien-va-mentor.md': {
    title: 'Đội ngũ Ban Quản trị, Giảng viên, Lab Coaches & Mentor Chuyên gia',
    question: 'Danh sách đội ngũ giảng viên, hội đồng chuyên gia và mentor đồng hành',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    content: `- **Ban Quản trị & Học thuật**: GS.TS. Dương Nguyên Vũ (Tổng phụ trách), PGS.TS. Phạm Ngọc Nam (Giám đốc Học thuật), Bà Nguyễn Hồng Hà (Giám đốc Vận hành), PGS.TS. Đinh Ngọc Thạnh, TS. Lê Duy Dũng.
- **Đội ngũ Giảng viên & Chuyên gia**: Các Tiến sĩ, Thạc sĩ, Google Developer Experts (GDE), Chuyên gia AI từ Google Research, Amazon, FPT, Techcombank, TPBank, MSB, Obello, Trusted AI...
- **Đội ngũ Lab Coaches & Mentor**: Hơn 40 chuyên gia là Engineering Manager, Senior AI Engineer, Founder & CTO các tập đoàn công ty công nghệ lớn đồng hành hướng dẫn 1-on-1.`
  }
};

for (const [file, info] of Object.entries(updates)) {
  const p = path.join(dir, file);
  const raw = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const { data } = matter(raw);
  
  data.title = info.title;
  data.question = info.question;
  data.category = 'thi-dgnl';
  data.priority = 14;
  data.is_active = true;
  data.is_verified = info.is_verified;
  data.verification_source = info.verification_source;
  data.media_links = info.media_links;
  
  const newYaml = yaml.dump(data, { lineWidth: -1 }).trim();
  const newContent = '---\n' + newYaml + '\n---\n\n' + info.content.trim() + '\n';
  fs.writeFileSync(p, newContent, 'utf8');
  console.log('Đã cập nhật bài viết tuyển chọn & mentor:', file);
}
