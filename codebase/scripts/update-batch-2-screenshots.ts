import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

// 1. Update bao-luu-khoa-hoc-va-thoi-gian.md
const file1 = path.join(dir, 'bao-luu-khoa-hoc-va-thoi-gian.md');
if (fs.existsSync(file1)) {
  const raw = fs.readFileSync(file1, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Xác nhận từ Quản trị viên Lam Luu & Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043585429.png',
    caption: 'Xác nhận quy định hoàn lại trợ cấp sinh hoạt khi bảo lưu giữa chừng từ Admin Lam Luu'
  });
  const content = `- **Chính sách bảo lưu kết quả trúng tuyển**: Học viên trúng tuyển (như sinh viên năm 3) được phép bảo lưu kết quả để nhập học các khóa sau (các khóa thường cách nhau 6 tuần).
- **Quy định bảo lưu trong quá trình đang học**: Nếu đang trong thời gian học mà có lý do bất khả kháng đột xuất được Ban Tổ chức chấp nhận, học viên được bảo lưu sang khóa sau. **Lưu ý bắt buộc**: Học viên có trách nhiệm **hoàn lại toàn bộ khoản trợ cấp sinh hoạt đã nhận**.
- **Chứng chỉ đào tạo**: Hoàn thành chương trình được cấp Chứng chỉ đào tạo do Đại học VinUni và Tập đoàn Vingroup đồng cấp.`;
  fs.writeFileSync(file1, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật bao-luu-khoa-hoc-va-thoi-gian.md');
}

// 2. Update co-hoi-nghe-nghiep-va-tuyen-dung.md
const file2 = path.join(dir, 'co-hoi-nghe-nghiep-va-tuyen-dung.md');
if (fs.existsSync(file2)) {
  const raw = fs.readFileSync(file2, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Phản hồi từ Hoàng Blue's & Báo cáo Khởi xướng Vingroup";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043679522.png',
    caption: "Xác nhận đánh giá cực cao từ nhà tuyển dụng và cơ hội job Intern/Fresher từ Hoàng Blue's"
  });
  const content = `- **Cơ hội việc làm & Đánh giá từ Nhà tuyển dụng**: Các nhà tuyển dụng đánh giá cực kỳ cao học viên tốt nghiệp chương trình AI in Action vì toàn bộ kiến thức được truyền dạy đều là kinh nghiệm thực chiến từ dàn Mentor lâu năm.
- **Cơ hội Intern/Fresher & Tuyển dụng Vingroup**: Cơ hội nhận job Intern/Fresher rất tốt. 100% học viên Khóa 1 đạt chuẩn năng lực VinUni (373/500) nhận Offer từ Vingroup với 95% làm đúng chuyên môn (AI Engineer, Data Engineer, Software Dev, PM, BA) và mức lương lên tới **~50.000.000 VNĐ/tháng**.`;
  fs.writeFileSync(file2, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật co-hoi-nghe-nghiep-va-tuyen-dung.md');
}

// 3. Update quy-dinh-di-muon-va-chuyen-can.md
const file3 = path.join(dir, 'quy-dinh-di-muon-va-chuyen-can.md');
if (fs.existsSync(file3)) {
  const raw = fs.readFileSync(file3, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Xác nhận từ Quản trị viên Lam Luu & Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043740003.png',
    caption: 'Quy định điểm danh khi đi muộn và ảnh hưởng điểm chuyên cần từ Admin Lam Luu'
  });
  const content = `- **Chính sách điểm danh & Đi muộn**: Học viên có thể được du di/linh động nếu đi muộn một vài buổi có lý do, tuy nhiên **tất cả các buổi đi muộn vẫn bị ghi nhận điểm danh**.
- **Lưu ý quan trọng**: Học viên **không nên đi muộn thường xuyên** vì sẽ ảnh hưởng trực tiếp đến điểm chuyên cần (cần đạt từ 90% trở lên) và điều kiện nhận trợ cấp sinh hoạt.`;
  fs.writeFileSync(file3, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật quy-dinh-di-muon-va-chuyen-can.md');
}

// 4. Update quy-trinh-chon-cong-ty-thuc-tap.md
const file4 = path.join(dir, 'quy-trinh-chon-cong-ty-thuc-tap.md');
if (fs.existsSync(file4)) {
  const raw = fs.readFileSync(file4, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Phản hồi từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043805451.png',
    caption: "Hướng dẫn quy trình chọn công ty thực tập từ danh sách trường cung cấp từ Hoàng Blue's"
  });
  const content = `- **Hình thức phân bổ công ty thực tập**: Nhà trường sẽ cung cấp danh sách (List công ty đối tác) để học viên chủ động đăng ký lựa chọn công ty phù hợp với định hướng.
- **Mô hình làm việc**: Học viên thực tập **full-time** tại công ty đã chọn trong 6 tuần cuối của khóa học.`;
  fs.writeFileSync(file4, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật quy-trinh-chon-cong-ty-thuc-tap.md');
}

// 5. Update tu-van-thue-tro-hoc-va-thuc-tap.md
const file5 = path.join(dir, 'tu-van-thue-tro-hoc-va-thuc-tap.md');
if (fs.existsSync(file5)) {
  const raw = fs.readFileSync(file5, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Lời khuyên thực tế từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043805451.png',
    caption: "Khuyên nên thuê trọ gần VinUni từ đầu do khối lượng học tập nhiều từ Hoàng Blue's"
  });
  const content = `- **Tư vấn vị trí thuê nhà trọ**: Học viên nên **thuê trọ ở gần VinUni ngay từ đầu** (như khu đô thị Ocean Park) để thuận tiện di chuyển trong suốt cả 12 tuần.
- **Lý do**: Khối lượng học tập và dự án rất nhiều, địa điểm thực tập và VinUni nằm gần nhau nên ở gần trường sẽ tiết kiệm thời gian di chuyển, tránh mệt mỏi và kịp giờ tham gia các buổi học/thảo luận tối.`;
  fs.writeFileSync(file5, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật tu-van-thue-tro-hoc-va-thuc-tap.md');
}

// 6. Update dia-diem-thuc-tap-hcm.md
const file6 = path.join(dir, 'dia-diem-thuc-tap-hcm.md');
if (fs.existsSync(file6)) {
  const raw = fs.readFileSync(file6, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Phản hồi từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043850402.png',
    caption: "Xác nhận có form đăng ký nguyện vọng thực tập tại TP. Hồ Chí Minh từ Hoàng Blue's"
  });
  const content = `- **Chính sách thực tập tại TP. Hồ Chí Minh**: Ban Tổ chức có chuẩn bị **Form đăng ký nguyện vọng thực tập tại TP. Hồ Chí Minh** dành riêng cho các học viên từ miền Nam ra học và có định hướng quay về thực tập.
- **Thời gian đăng ký**: Form nguyện vọng được mở vào khoảng tuần thứ 4 của khóa học để Ban Đào tạo phân bổ danh sách.`;
  fs.writeFileSync(file6, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật dia-diem-thuc-tap-hcm.md');
}
