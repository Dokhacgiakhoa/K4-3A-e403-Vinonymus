import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');

// 1. Update khung-nang-luc-sfia-va-blooms-taxonomy.md
const file1 = path.join(dir, 'khung-nang-luc-sfia-va-blooms-taxonomy.md');
if (fs.existsSync(file1)) {
  const raw = fs.readFileSync(file1, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = "Phản hồi từ Quản trị viên Lam Luu & Website chính thức";
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786044314160.png',
    caption: 'Thông báo phân hóa năng lực theo khung SFIA từ Khóa 5&6 từ Admin Lam Luu'
  });
  const content = `- **Khung Năng lực SFIA (Skills Framework for the Information Age)**: Thang đánh giá năng lực công nghệ & AI tiêu chuẩn quốc tế giúp phân bậc kỹ năng và lộ trình phát triển.
- **Lộ trình phân hóa bài thi từ Khóa 5 & 6**: Từ **Khóa 5 & Khóa 6 trở đi**, chương trình bắt đầu phân hóa bài kiểm tra năng lực và sắp xếp lớp học theo Khung SFIA. Sau khi làm bài thi ĐGNL, học viên sẽ được xếp bậc năng lực để phân vào khóa học bài bản tương ứng (Level 2->3 hoặc Level 3->4).
- **Lời khuyên tuyển sinh**: Ban Tuyển sinh khuyên học viên trúng tuyển nên ưu tiên nhập học càng sớm càng tốt ("Ăn cỗ đi trước lội nước theo sau") để nắm bắt cơ hội việc làm sớm.`;
  fs.writeFileSync(file1, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật khung-nang-luc-sfia-va-blooms-taxonomy.md');
}

// 2. Create/Update ky-cam-ket-va-hop-dong-ekyc.md
const file2 = path.join(dir, 'ky-cam-ket-va-hop-dong-ekyc.md');
const matter2 = {
  question: 'Thủ tục ký cam kết tham gia chương trình và hợp đồng đào tạo (Ký EKYC Online)',
  title: 'Thủ tục Ký Cam kết & Hợp đồng Đào tạo EKYC Trực tuyến (UN Sustainable Goals)',
  variants: ['ky cam ket khi nao', 'ky hop dong bang gi', 'ekyc online vinuni', 'ky giay hay ky online'],
  category: 'quy-dinh',
  priority: 8,
  is_active: true,
  is_verified: true,
  verification_source: 'Xác nhận từ Quản trị viên Lam Luu',
  media_links: [
    { type: 'image', url: '/_user_uploaded/media_1786044343363.png', caption: 'Xác nhận ký cam kết và hợp đồng qua EKYC online hưởng ứng UN Sustainable Goals từ Admin Lam Luu' }
  ]
};
const content2 = `- **Hình thức ký kết**: Tất cả các thủ tục ký Cam kết tham gia chương trình và Hợp đồng đào tạo được thực hiện **trực tuyến qua EKYC online** (không in ấn văn bản giấy).
- **Lý do & Ý nghĩa**: Trường Đại học VinUni thực hiện mục tiêu Phát triển Bền vững của Liên Hợp Quốc (UN Sustainable Goals - giảm thiểu rác thải giấy và bảo vệ môi trường). Học viên kiểm tra thông tin và thực hiện thao tác ký điện tử trên hệ thống học viên.`;
fs.writeFileSync(file2, '---\n' + yaml.dump(matter2, { lineWidth: -1 }).trim() + '\n---\n\n' + content2 + '\n', 'utf8');
console.log('Đã tạo/cập nhật ky-cam-ket-va-hop-dong-ekyc.md');

// 3. Update phi-gui-xe-va-the-hoc-vien.md
const file3 = path.join(dir, 'phi-gui-xe-va-the-hoc-vien.md');
if (fs.existsSync(file3)) {
  const raw = fs.readFileSync(file3, 'utf8');
  const { data } = matter(raw);
  data.is_verified = true;
  data.verification_source = 'Xác nhận từ Quản trị viên Lam Luu';
  if (!data.media_links) data.media_links = [];
  data.media_links.push({
    type: 'image',
    url: '/_user_uploaded/media_1786044370011.png',
    caption: 'Xác nhận gửi xe không mất phí và biển số xe tích hợp Thẻ học viên từ Admin Lam Luu'
  });
  const content = `- **Chi phí gửi xe**: **Hoàn toàn KHÔNG MẤT PHÍ** khi gửi xe máy/ô tô tại hầm gửi xe VinUni.
- **Cơ chế tích hợp Thẻ học viên**: Biển số xe được tích hợp trực tiếp vào Thẻ học viên AI in Action để quẹt thẻ ra vào tự động.
- **Trường hợp quên thẻ hoặc đổi phương tiện**: Nếu quên thẻ, học viên lấy vé ngày tạm thời (vẫn không mất phí). Nếu chuyển đổi từ xe buýt sang xe máy, học viên nhắn tin báo Ban Tổ chức để cập nhật thông tin biển số xe lên hệ thống.`;
  fs.writeFileSync(file3, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
  console.log('Đã cập nhật phi-gui-xe-va-the-hoc-vien.md');
}
