import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

// 1. Update yeu-cau-tieng-anh.md
const file1 = path.join(dir, 'yeu-cau-tieng-anh.md');
if (fs.existsSync(file1)) {
  const raw = fs.readFileSync(file1, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Phản hồi từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043630455.png',
    caption: "Xác nhận slide dùng Tiếng Việt và bắt buộc học từ vựng Tiếng Anh chuyên ngành từ Hoàng Blue's"
  });
  const content = `- **Mức độ yêu cầu Tiếng Anh**: Không bắt buộc phải quá giỏi Tiếng Anh giao tiếp vì **slide bài giảng và lời giảng của thầy cô được trình bày bằng Tiếng Việt**.
- **Yêu cầu từ vựng chuyên ngành**: Học viên **bắt buộc cần học thuộc các từ vựng Tiếng Anh chuyên ngành** AI/CNTT, vì các thuật ngữ chuyên môn sẽ xuất hiện và được sử dụng rất nhiều trên slide cũng như trong lời giảng.`;
  fs.writeFileSync(file1, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật yeu-cau-tieng-anh.md');
}

// 2. Update de-tai-lam-nhom.md
const file2 = path.join(dir, 'de-tai-lam-nhom.md');
if (fs.existsSync(file2)) {
  const raw = fs.readFileSync(file2, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Phản hồi từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043679522.png',
    caption: "Xác nhận đề tài nhóm là 1 project AI thực hiện 6 tuần từ đề bài doanh nghiệp từ Hoàng Blue's"
  });
  const content = `- **Định hướng đề tài nhóm**: Đề tài nhóm là **1 Project về AI** thực tế, các nhóm sinh viên làm việc nhóm liên tục xuyên suốt trong 6 tuần đầu tiên.
- **Nguồn bài toán**: Đề bài dự án thường được **lấy trực tiếp từ các đề bài / bài toán thực tế của doanh nghiệp đối tác**.`;
  fs.writeFileSync(file2, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật de-tai-lam-nhom.md');
}

// 3. Update tro-cap-them-tu-doanh-nghiep-thuc-tap.md
const file3 = path.join(dir, 'tro-cap-them-tu-doanh-nghiep-thuc-tap.md');
if (fs.existsSync(file3)) {
  const raw = fs.readFileSync(file3, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Xác nhận từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043740003.png',
    caption: "Đính chính không có khoản trợ cấp thêm từ nơi thực tập từ Hoàng Blue's"
  });
  const content = `- **Chính sách trợ cấp tại doanh nghiệp**: Trong thời gian thực tập 6 tuần tại doanh nghiệp, học viên **không nhận thêm khoản trợ cấp nào từ nơi thực tập** (chỉ hưởng duy nhất khoản Trợ cấp sinh hoạt 8.000.000 VNĐ/tháng do VinUni chi trả).`;
  fs.writeFileSync(file3, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật tro-cap-them-tu-doanh-nghiep-thuc-tap.md');
}

// 4. Update ngon-ngu-bai-thi-khao-sat-dgnl.md
const file4 = path.join(dir, 'ngon-ngu-bai-thi-khao-sat-dgnl.md');
if (fs.existsSync(file4)) {
  const raw = fs.readFileSync(file4, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Xác nhận từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043779287.png',
    caption: "Xác nhận ngôn ngữ bài thi khảo sát ĐGNL bằng Tiếng Việt từ Hoàng Blue's"
  });
  const content = `- **Ngôn ngữ bài thi khảo sát**: Bài thi khảo sát Đánh giá Năng lực (ĐGNL) đầu vào của chương trình được thực hiện hoàn toàn bằng **Tiếng Việt**.`;
  fs.writeFileSync(file4, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật ngon-ngu-bai-thi-khao-sat-dgnl.md');
}

// 5. Update thoi-gian-hoc-va-thuc-tap.md
const file5 = path.join(dir, 'thoi-gian-hoc-va-thuc-tap.md');
if (fs.existsSync(file5)) {
  const raw = fs.readFileSync(file5, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Phản hồi từ Hoàng Blue's";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786043606319.png',
    caption: "Xác nhận chia đôi 6 tuần học + 6 tuần thực tập trong tổng số 12 tuần từ Hoàng Blue's"
  });
  const content = `- **Phân bổ thời lượng 12 tuần chương trình**:
  - **06 tuần học tập trực tiếp tại VinUni**: Trang bị nền tảng chuyên sâu, học 3 trụ cột và thực hiện Dự án nhóm về AI.
  - **06 tuần thực tập full-time tại Doanh nghiệp**: Trực tiếp tham gia giải quyết dự án thực tế tại các tập đoàn, doanh nghiệp đối tác.
- **Hỗ trợ học tập 24/7**: Trong 06 tuần học tại VinUni, học viên được hỗ trợ liên tục qua Discord, Zoom và phòng học mở 24/7.`;
  fs.writeFileSync(file5, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật thoi-gian-hoc-va-thuc-tap.md');
}
