import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

// Create/Update tong-quan-va-quy-mo-chuong-trinh.md
const tongQuanFile = path.join(dir, 'tong-quan-va-quy-mo-chuong-trinh.md');
const tongQuanData = {
  title: 'Tổng quan Quy mô, Thành tựu & Triết lý Học qua Thách thức Thực tế (Challenge-Based Learning)',
  question: 'Tổng quan quy mô tuyển sinh, kết quả việc làm và triết lý đào tạo AI in Action',
  category: 'chuong-trinh-hoc',
  priority: 1,
  is_active: true,
  is_verified: true,
  verification_source: 'Infographic Báo cáo Khởi xướng và Thành tựu Chính thức Vingroup & VinUni',
  media_links: [
    { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
  ]
};
const tongQuanContent = `- **Khởi xướng & Mục tiêu quốc gia**: Khởi xướng từ tháng 1/2026 nhằm hưởng ứng Nghị quyết 57-NQ/TW, hướng tới đào tạo **10.000 - 20.000 nhân tài AI** trong vòng 2 năm.
- **Quy mô ấn tượng qua 3 khóa**: Thu hút **~10.000 hồ sơ đăng ký**, tuyển chọn **2.000 học viên** từ **141 trường đại học trong nước** và **20 trường đại học quốc tế**.
- **Kết quả việc làm & Thu nhập**:
  - **100%** học viên Khóa 1 đạt chuẩn năng lực VinUni (373/500) nhận được thư mời làm việc (Offer) từ Tập đoàn Vingroup.
  - **95%** học viên chính thức đảm nhận các vị trí: *Kỹ sư AI, Kỹ sư dữ liệu, Phát triển phần mềm, Quản lý sản phẩm (PM), Phân tích nghiệp vụ (BA)*.
  - Mức lương khởi điểm lên tới **~50.000.000 VNĐ/tháng**.
- **Triết lý đào tạo 4 Thật**: *Bài toán thật | Dữ liệu thật | Chuyên gia thật | Cơ hội việc làm thật*.
- **Phương pháp Challenge-Based Learning**: Đào tạo qua giải quyết thách thức thực tế với **~160 bài toán AI mô phỏng** và **200+ bài toán AI thực tế** thuộc các lĩnh vực: Xe tự hành, Robot, Học tập cá nhân hóa, Dịch thuật đa ngôn ngữ, An ninh mạng, Dữ liệu & Tối ưu vận hành.
- **Quy chế đánh giá 2 tuần/lần**: Cứ mỗi 2 tuần, học viên được chấm điểm toàn diện về năng lực chuyên môn, chất lượng sản phẩm, tinh thần hợp tác, kỷ luật làm việc và hiệu quả thực thi dự án.`;

const newYaml = yaml.dump(tongQuanData, { lineWidth: -1 }).trim();
fs.writeFileSync(tongQuanFile, '---\n' + newYaml + '\n---\n\n' + tongQuanContent + '\n', 'utf8');
console.log('Đã tạo/cập nhật tong-quan-va-quy-mo-chuong-trinh.md');

// Update co-hoi-nghe-nghiep-va-tuyen-dung.md
const coHoiFile = path.join(dir, 'co-hoi-nghe-nghiep-va-tuyen-dung.md');
if (fs.existsSync(coHoiFile)) {
  const raw = fs.readFileSync(coHoiFile, 'utf8');
  const { data } = matter(raw);
  data.title = 'Cơ hội Tuyển dụng Vingroup, Các Vị trí Chuyên môn & Mức lương Khởi điểm ~50 Triệu';
  data.is_verified = true;
  data.verification_source = 'Báo cáo Khởi xướng và Thành tựu Chính thức Vingroup & VinUni';
  const content = `- **Cơ hội tuyển dụng chính thức**: 100% học viên Khóa 1 đạt chuẩn năng lực VinUni (373/500 học viên) đã nhận được thư mời làm việc từ Tập đoàn Vingroup.
- **Các vị trí chuyên môn đảm nhận**: 95% học viên đảm nhận các vị trí chuyên môn đa dạng gồm: **Kỹ sư AI (AI Engineer)**, **Kỹ sư Dữ liệu (Data Engineer)**, **Phát triển Phần mềm (Software Developer)**, **Quản lý Sản phẩm (Product Manager)**, **Phân tích Nghiệp vụ (Business Analyst)**.
- **Mức lương khởi điểm**: Mức lương hấp dẫn lên tới **~50.000.000 VNĐ/tháng** tùy thuộc vào năng lực thực chiến và kết quả dự án.
- **Tiêu chuẩn xét tuyển**: Đánh giá qua quá trình làm dự án thực tế, điểm năng lực chuyên môn (chấm 2 tuần/lần), tinh thần kỷ luật và hiệu quả thực thi.`;
  const y = yaml.dump(data, { lineWidth: -1 }).trim();
  fs.writeFileSync(coHoiFile, '---\n' + y + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật co-hoi-nghe-nghiep-va-tuyen-dung.md');
}
