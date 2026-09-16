import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

// 1. Update quy-dinh-doi-lop-nhom-khoa.md
const file1 = path.join(dir, 'quy-dinh-doi-lop-nhom-khoa.md');
if (fs.existsSync(file1)) {
  const raw = fs.readFileSync(file1, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = 'Đính chính chính thức từ Quản trị viên Lam Luu';
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043874399.png',
    caption: 'Đính chính tuyệt đối 100% không giải quyết cho đổi lớp, nhóm hay khóa từ Admin Lam Luu'
  });
  const content = `- **Quy định tuyệt đối về chuyển đổi**: Ban Tổ chức **100% không giải quyết việc xin chuyển lớp, đổi nhóm hay đổi khóa** dưới bất kỳ hình thức nào.
- **Mục tiêu quy định**: Học viên học và thực tập hoàn toàn theo sự sắp xếp ngẫu nhiên của Ban Tổ chức nhằm trải nghiệm môi trường thực tế, xây dựng kỹ năng làm việc nhóm với những bạn mới và mở rộng mạng lưới networking.`;
  fs.writeFileSync(file1, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật quy-dinh-doi-lop-nhom-khoa.md');
}

// 2. Update lich-hoc-buoi-sang.md
const file2 = path.join(dir, 'lich-hoc-buoi-sang.md');
if (fs.existsSync(file2)) {
  const raw = fs.readFileSync(file2, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = 'Xác nhận từ Quản trị viên Lam Luu';
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043902002.png',
    caption: 'Xác nhận mốc thời gian học buổi sáng bắt đầu từ 9h00 từ Admin Lam Luu'
  });
  const content = `- **Mốc thời gian học buổi sáng**: Khung giờ bắt đầu ca học buổi sáng luôn được ấn định **từ 9h00 trở đi** (trừ khi có các thông báo đặc biệt khác từ Ban Tổ chức).
- **Khuyến nghị**: Học viên nên có mặt trước 10-15 phút để chuẩn bị máy tính, hạ tầng kết nối và điểm danh.`;
  fs.writeFileSync(file2, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật lich-hoc-buoi-sang.md');
}

// 3. Update su-dung-gym-be-boi-vinuni.md
const file3 = path.join(dir, 'su-dung-gym-be-boi-vinuni.md');
if (fs.existsSync(file3)) {
  const raw = fs.readFileSync(file3, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Đính chính từ Quản trị viên Lam Luu & Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043949608.png',
    caption: 'Thông báo đính chính chưa hỗ trợ tiện ích Gym/Bể bơi VinUni từ Admin Lam Luu'
  });
  const content = `- **Tiện ích Thể thao VinUni (Gym, Bể bơi, Sân thể thao)**: Hiện tại cơ sở vật chất này **chưa thể hỗ trợ phục vụ cho Học viên AI in Action** (do thời gian hè nhà trường tiến hành bảo trì và công suất chưa đáp ứng).
- **Giải pháp thay thế**: Học viên có thể sử dụng các tiện ích thể thao tương tự thuộc nội khu Ocean Park khi hoàn thành đăng ký tạm trú trên ứng dụng VNeID.`;
  fs.writeFileSync(file3, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật su-dung-gym-be-boi-vinuni.md');
}

// 4. Update phan-chia-khoa-3-va-khoa-4.md
const file4 = path.join(dir, 'phan-chia-khoa-3-va-khoa-4.md');
if (fs.existsSync(file4)) {
  const raw = fs.readFileSync(file4, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = 'Xác nhận từ Quản trị viên Lam Luu';
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786044010055.png',
    caption: 'Xác nhận cơ chế chia ngẫu nhiên Khóa 3 và Khóa 4 cùng khai giảng từ Admin Lam Luu'
  });
  const content = `- **Cơ chế phân chia ngẫu nhiên (Random)**: Ban Tổ chức sẽ chia ngẫu nhiên học viên trúng tuyển thành 2 Khóa (Khóa 3 và Khóa 4) với sĩ số 500 học viên/khóa để tiện công tác quản lý.
- **Lịch Khai giảng & Học tập**: Cả 2 khóa cùng tham gia Lễ Khai giảng và Định hướng chung vào buổi sáng. Từ buổi chiều ngày khai giảng trở đi, lịch học của 2 khóa sẽ tách riêng.`;
  fs.writeFileSync(file4, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật phan-chia-khoa-3-va-khoa-4.md');
}

// 5. Update xin-nghi-buoi-khai-giang.md
const file5 = path.join(dir, 'xin-nghi-buoi-khai-giang.md');
if (fs.existsSync(file5)) {
  const raw = fs.readFileSync(file5, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = 'Xác nhận từ Quản trị viên Lam Luu';
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786044037621.png',
    caption: 'Hướng dẫn thủ tục xin nghỉ do lý do bất khả kháng từ Admin Lam Luu'
  });
  const content = `- **Trường hợp đến muộn/vắng mặt Khai giảng do sự cố bất khả kháng** (ốm đau, tai nạn, ngã xe): Thủ tục nhập học vẫn tiến hành bình thường. Học viên truy cập email học viên để làm theo hướng dẫn xin nghỉ và đến trường nhận thẻ + áo phông sau.
- **Khuyên dùng**: Học viên cần có minh chứng sự cố chính đáng và cố gắng sắp xếp đi học ca chiều nếu điều kiện sức khỏe cho phép.`;
  fs.writeFileSync(file5, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật xin-nghi-buoi-khai-giang.md');
}
