import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

// 1. chon-mentor-khoa-hoc.md
const file1 = path.join(dir, 'chon-mentor-khoa-hoc.md');
const content1 = `- **Đăng ký & Cân nhắc chọn Mentor**: Học viên được cung cấp thông tin chuyên môn, định hướng nghiên cứu và dự án tiêu biểu của dàn Mentor để cân nhắc lựa chọn Mentor phù hợp với bài toán của nhóm (ví dụ: các Mentor sở hữu các dự án/repo nguồn mở uy tín).
- **Phê duyệt**: Ban Tổ chức xét duyệt và ghép cặp Mentor dựa trên định hướng kỹ thuật của dự án.`;
const matter1 = {
  question: 'Quy trình tìm hiểu & Đăng ký nguyện vọng chọn Mentor hướng dẫn',
  title: 'Quy trình Tìm hiểu & Đăng ký Nguyện vọng Chọn Mentor Hướng dẫn',
  variants: ['cach chon mentor', 'quy trinh phan chia mentor', 'dang ky mentor vinuni', 'co duoc chon mentor khong'],
  category: 'chuong-trinh-hoc',
  priority: 11,
  is_active: true,
  is_verified: true,
  verification_source: "Phản hồi từ Hoàng Blue's",
  media_links: [
    { type: 'image', url: '/_user_uploaded/media_1786043415599.png', caption: "Phản hồi từ Hoàng Blue's về quy trình cân nhắc chọn Mentor" }
  ]
};
fs.writeFileSync(file1, '---\n' + yaml.dump(matter1, { lineWidth: -1 }).trim() + '\n---\n\n' + content1 + '\n', 'utf8');

// 2. phong-hoc-tu-hoc-24-7.md
const file2 = path.join(dir, 'phong-hoc-tu-hoc-24-7.md');
const content2 = `- **Phòng học tự học 24/7**: VinUni có trang bị phòng học / không gian tự học mở cửa **24/7 tất cả các ngày trong tuần (bao gồm cả Thứ 7 và Chủ Nhật)**.
- **Trang thiết bị**: Đầy đủ bàn làm việc nhóm, ổ cắm điện, đường truyền Internet cáp quang/Wi-Fi 6 tốc độ cao phục vụ các nhóm học tập và thức đêm hoàn thiện dự án.`;
const matter2 = {
  question: 'Quyền truy cập Không gian Tự học & Phòng mở 24/7 cả Thứ 7 và Chủ Nhật',
  title: 'Quyền truy cập Không gian Tự học & Phòng học Mở 24/7 (Bao gồm Thứ 7, Chủ Nhật)',
  variants: ['phong tu hoc 247', 'cho ngoi hoc dem vinuni', 'khong gian tu hoc', 'thu 7 chu nhat co phong hoc khong'],
  category: 'tien-ich',
  priority: 5,
  is_active: true,
  is_verified: true,
  verification_source: "Phản hồi từ Hoàng Blue's",
  media_links: [
    { type: 'image', url: '/_user_uploaded/media_1786043448881.png', caption: "Xác nhận từ Hoàng Blue's về phòng tự học mở 24/7 tại VinUni" }
  ]
};
fs.writeFileSync(file2, '---\n' + yaml.dump(matter2, { lineWidth: -1 }).trim() + '\n---\n\n' + content2 + '\n', 'utf8');

// 3. to-chuc-chuong-trinh-nam-sau.md
const file3 = path.join(dir, 'to-chuc-chuong-trinh-nam-sau.md');
const content3 = `- **Kế hoạch triển khai lâu dài**: Chương trình AI in Action VinUni được khởi xướng từ tháng 1/2026 với kế hoạch dự tính kéo dài **trong 2 năm** nhằm đào tạo 10.000 - 20.000 nhân tài AI.
- **Đợt tuyển sinh các năm sau**: Chương trình liên tục mở các đợt tuyển chọn học viên thường niên cho các khóa tiếp theo.`;
const matter3 = {
  question: 'Kế hoạch mở rộng và tổ chức chương trình AI in Action các năm tiếp theo',
  title: 'Kế hoạch Tổ chức Đợt tuyển sinh các Khóa Tiếp theo (Lộ trình Dự tính 2 Năm)',
  variants: ['sang nam co mo tiep khong', 'ke hoach chuong trinh nam sau', 'vin co to chuc nam sau khong'],
  category: 'chuong-trinh-hoc',
  priority: 3,
  is_active: true,
  is_verified: true,
  verification_source: "Phản hồi từ Hoàng Blue's",
  media_links: [
    { type: 'image', url: '/_user_uploaded/media_1786043497551.png', caption: "Xác nhận lộ trình dự tính 2 năm của chương trình từ Hoàng Blue's" }
  ]
};
fs.writeFileSync(file3, '---\n' + yaml.dump(matter3, { lineWidth: -1 }).trim() + '\n---\n\n' + content3 + '\n', 'utf8');

// 4. bao-luu-khoa-hoc-va-thoi-gian.md
const file4 = path.join(dir, 'bao-luu-khoa-hoc-va-thoi-gian.md');
const content4 = `- **Chính sách bảo lưu kết quả**: Học viên trúng tuyển (ví dụ: sinh viên năm 3) **hoàn toàn được phép bảo lưu** kết quả trúng tuyển để tham gia các khóa sau.
- **Tần suất mở khóa học**: Các khóa đào tạo thường được tổ chức **cách nhau 6 tuần**.
- **Quy trình thủ tục**: Học viên gửi đơn bảo lưu cho Ban Tổ chức, chương trình sẽ chủ động gửi email hướng dẫn nhập học khi đợt tiếp theo bắt đầu.
- **Chứng chỉ đồng cấp**: Học viên hoàn thành khóa học được cấp Chứng chỉ đào tạo do Trường Đại học VinUni và Tập đoàn Vingroup đồng cấp.`;
const matter4 = {
  question: 'Chính sách bảo lưu kết quả trúng tuyển & Tần suất các khóa đào tạo (cách 6 tuần)',
  title: 'Quy định Bảo lưu Kết quả Trúng tuyển & Tần suất Mở Khóa Đào tạo (Cách nhau 6 Tuần)',
  variants: ['bao luu khoa hoc duoc bao lau', 'do khoa 4 bao luu duoc khong', 'cac khoa cach nhau bao nhieu tuan'],
  category: 'quy-dinh',
  priority: 9,
  is_active: true,
  is_verified: true,
  verification_source: "Phản hồi từ Hoàng Blue's & Trang thông tin VinUni",
  media_links: [
    { type: 'image', url: '/_user_uploaded/media_1786043525332.png', caption: "Phản hồi quy định bảo lưu và tần suất mở khóa 6 tuần từ Hoàng Blue's" }
  ]
};
fs.writeFileSync(file4, '---\n' + yaml.dump(matter4, { lineWidth: -1 }).trim() + '\n---\n\n' + content4 + '\n', 'utf8');

// 5. trai-nganh-hoc-ai-thuc-chien.md
const file5 = path.join(dir, 'trai-nganh-hoc-ai-thuc-chien.md');
const content5 = `- **Yêu cầu đối với học viên Trái ngành (non-tech)**: Chương trình không đòi hỏi bằng cấp đúng ngành Công nghệ Thông tin, nhưng ứng viên thuộc nhóm trái ngành (non-tech) **bắt buộc cần phải tự trang bị kiến thức nền tảng về làm phần mềm (Software Development)**.
- **Nền tảng cần chuẩn bị trước**: Tư duy lập trình cơ bản (Python), kỹ năng thao tác máy tính & môi trường phát triển phần mềm, tư duy logic toán học và khả năng học cùng công cụ AI.`;
const matter5 = {
  question: 'Yêu cầu tư duy lập trình & Hướng dẫn dành cho ứng viên Trái ngành (non-tech)',
  title: 'Yêu cầu Nền tảng Làm Phần mềm & Lộ trình Bổ trợ cho Ứng viên Trái ngành (non-tech)',
  variants: ['trai nganh co hoc ai thuc chien duoc khong', 'non tech hoc ai thuc chien', 'chua biet code co dang ky duoc khong'],
  category: 'thi-dgnl',
  priority: 9,
  is_active: true,
  is_verified: true,
  verification_source: "Phản hồi từ Hoàng Blue's",
  media_links: [
    { type: 'image', url: '/_user_uploaded/media_1786043550066.png', caption: "Tư vấn yêu cầu nền làm phần mềm cho ứng viên trái ngành từ Hoàng Blue's" }
  ]
};
fs.writeFileSync(file5, '---\n' + yaml.dump(matter5, { lineWidth: -1 }).trim() + '\n---\n\n' + content5 + '\n', 'utf8');

console.log('Đã cập nhật xong cả 5 file FAQ từ 5 ảnh chụp màn hình!');
