import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');
const file = path.join(dir, 'kinh-nghiem-chon-teammate-3-role.md');

const data = {
  question: 'Kinh nghiệm ghép đội nhóm dự án (Team 3 Roles) cho 6 tuần BUILD từ Top 1 Cohort 2',
  title: 'Chiến thuật Ghép đội nhóm Dự án 6 Tuần (Công thức 3 Roles Bắt buộc & Infographic)',
  variants: [
    'cach chon teammate 6 tuan build',
    'kinh nghiem chon teammate ai in action',
    'cong thuc team 3 nguoi hoang blue',
    'product lead product engineer ai reliability engineer',
    'ghep doi nhom du an'
  ],
  category: 'chuong-trinh-hoc',
  priority: 16,
  is_active: true,
  is_verified: true,
  verification_source: "Chia sẻ kinh nghiệm thực tế & Infographic từ Hoàng Blue's (Team 125 - Top 1 BUILD Phase, Cohort 2)",
  media_links: [
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044842958.png',
      caption: 'Infographic Chiến thuật Chọn Teammate cho 6 Tuần BUILD: Bảo vệ User | Bảo vệ Sản phẩm | Bảo vệ Sự thật'
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044776073.png',
      caption: "Bài chia sẻ kinh nghiệm chọn teammate từ Hoàng Blue's (Top 1 Cohort 2)"
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044786675.png',
      caption: 'Role 1: Product Lead (Bảo vệ User)'
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044803671.png',
      caption: 'Role 2: Product Engineer (Bảo vệ Sản phẩm)'
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044813646.png',
      caption: 'Role 3: AI Systems & Reliability Engineer (Bảo vệ Sự thật)'
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044836159.png',
      caption: 'Tóm tắt công thức Team 3 người hoàn chỉnh'
    }
  ]
};

const content = `- **Tầm quan trọng của giai đoạn 6 Tuần BUILD**: Giai đoạn 6 tuần vừa học vừa làm dự án là chặng đường cực kỳ intensive. Nhiều nhóm ở các khóa trước từng tan vỡ hoặc xung đột vì không hợp cách làm từ đầu. Việc chọn teammate theo đúng mảnh ghép bổ sung cho nhau là yếu tố quyết định cơ hội tuyển dụng và thành công của dự án.
- **Công thức Đội nhóm 3 Vai trò (3 Roles Bắt buộc)**:
  - **1. Product Lead (Bảo vệ User)**:
    - **Phù hợp**: Người non-tech hoặc thiên về Business/UX, tinh tế, giao tiếp tốt và có khả năng thấu hiểu user.
    - **Nhiệm vụ**: Xác định Pain Point thật sự, chọn 1 workflow cốt lõi giải quyết bài toán ("gãi đúng chỗ ngứa"), định nghĩa metric/eval. Không tư duy technical-first hay solution-first.
    - **Thiếu vai trò này**: Team dễ xây lầm những tính năng người dùng không thực sự cần.
  - **2. Product Engineer (Bảo vệ Sản phẩm)**:
    - **Phù hợp**: Vibecoding promax, Full-stack engineer, thích build nhanh nhưng sẵn sàng debug tới cùng.
    - **Nhiệm vụ**: Gánh toàn bộ đường đi end-to-end của sản phẩm (Frontend, Backend/API, Database, Auth, Deploy, tích hợp Model/Tool AI, fix bug khi demo).
    - **Thiếu vai trò này**: Team có ý tưởng rất hay nhưng không thể biến thành sản phẩm thực tế để ship.
  - **3. AI Systems & Reliability Engineer (Bảo vệ Sự thật)**:
    - **Phù hợp**: Người cẩn thận, có tư duy QA/Data/Research, thích tìm lỗi và đòi hỏi minh chứng dữ liệu.
    - **Nhiệm vụ**: Trả lời câu hỏi *"Kết quả AI trả ra có đáng tin để đưa cho user không?"*. Quản lý Eval set, kiểm soát RAG/Data quality, Output schema, Guardrail, Human Review và đo lường Latency/Token cost.
    - **Thiếu vai trò này**: Team có demo giao diện đẹp nhưng sản phẩm thực tế thiếu độ tin cậy và chết ngay sau khi demo.
- **Thông điệp cốt lõi**: *"Chọn teammate không phải là tìm những người giỏi nhất, mà là chọn những người bù đắp được phần mù của nhau và cùng chịu trách nhiệm tới deadline cuối cùng."*`;

fs.writeFileSync(file, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
console.log('Đã tạo thành công kinh-nghiem-chon-teammate-3-role.md');
