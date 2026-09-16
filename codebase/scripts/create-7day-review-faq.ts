import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const dir = path.join(process.cwd(), 'data', 'faqs');
const file = path.join(dir, 'review-7-ngay-hoc-ai-thuc-chien.md');

const data = {
  question: 'Tổng hợp trải nghiệm 7 ngày đầu học AI Thực chiến & Triết lý thiết kế sản phẩm AI',
  title: 'Tổng hợp Trải nghiệm 7 Ngày học AI Thực chiến & Bộ Đề ôn tập Trắc nghiệm kiến thức',
  variants: [
    '7 ngay hoc ai thuc chien',
    'review 7 ngay hoc vinuni',
    'triet ly thiet ke san pham ai',
    'bo de trac nghiem 7 ngay ai thuc chien',
    'de on tap week1 day1 hoang blue'
  ],
  category: 'chuong-trinh-hoc',
  priority: 15,
  is_active: true,
  is_verified: true,
  verification_source: "Bài đăng review thực tế từ Hoàng Blue's trong Cộng đồng AI thực chiến Vingroup - VinUni",
  media_links: [
    {
      type: 'link',
      url: 'https://edu-gap.hoangblue.dev/?set=week1-day1',
      title: "Bộ 7 đề ôn tập kiến thức trắc nghiệm 7 ngày học AI Thực chiến (Hoàng Blue's)"
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044629191.png',
      caption: "Bài đăng chia sẻ 7 ngày học AI Thực chiến và bộ đề trắc nghiệm từ Hoàng Blue's"
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044637992.png',
      caption: 'Review chi tiết Ngày 1 (LLM Foundation) & Ngày 2 (Problem Scoping)'
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044645267.png',
      caption: 'Review chi tiết Ngày 3 (ReAct Agent Pattern)'
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044654223.png',
      caption: 'Review chi tiết Ngày 4 (Prompt Engineering & Tool Calling)'
    },
    {
      type: 'image',
      url: '/_user_uploaded/media_1786044661899.png',
      caption: 'Review chi tiết Ngày 5 (AI Product Design Under Uncertainty)'
    }
  ]
};

const content = `- **Tổng quan chương trình**: Chương trình không chỉ dạy kỹ thuật AI Agent hay gọi API đơn thuần, mà đào tạo toàn diện cách tư duy như một Product Owner / Founder: từ Problem Scoping, Product Design, quy trình phát triển sản phẩm, survey đến phỏng vấn user.
- **Đội ngũ Mentor**: Dàn Mentor đa dạng background chuyên sâu: AI Engineer, System Architect (SA), Business Analyst (BA), Project Manager (PM), Product Owner (PO), C-level... mang lại góc nhìn đa chiều về xây dựng sản phẩm.
- **Lộ trình kiến thức 5 ngày trọng tâm**:
  - **Ngày 1 (LLM Foundation)**: Hiểu góc rễ kiến trúc Transformer, Tokenization, Attention. Bản chất LLM sinh output dựa trên xác suất (không "hiểu" như con người), từ đó nắm rõ giới hạn của mô hình khi context bị nhiễu hoặc thiếu.
  - **Ngày 2 (Problem Scoping for AI)**: *"Đừng bắt đầu bằng model. Hãy bắt đầu bằng bài toán, dữ liệu, người dùng và tiêu chí đánh giá"*. Không phải bài toán nào cũng cần LLM hay Agent; ưu tiên kết hợp rule-based và chỉ áp dụng Agent cho các workflow thật sự cần tự ra quyết định.
  - **Ngày 3 (ReAct Agent Pattern)**: Vận hành luồng Thought -> Action -> Observation -> Decision. Xây dựng Guardrails và Debug Trace để kiểm soát hệ thống, giải quyết rủi ro lặp vô hạn, tool trả kết quả sai hoặc dùng tool sai ngữ cảnh.
  - **Ngày 4 (Prompt Engineering & Tool Calling)**: *"AI system không nên tin mọi thứ được đưa vào context"*. Tập trung vào Context Engineering, Prompt Boundary, Token Budget, Memory Safety và cơ chế Human Approval cho các hành động có rủi ro.
  - **Ngày 5 (AI Product Design Under Uncertainty)**: Triết lý cốt lõi: *"Phần mềm truyền thống lỗi như một con bug. Sản phẩm AI lỗi như một vấn đề niềm tin"*. Thiết kế UI/UX thích ứng xác suất: Confidence UI, Editable Plan, Human Review, Feedback Loop và Failure Mode Library.
- **Bộ đề ôn tập trắc nghiệm**: Học viên có thể truy cập bộ 7 đề ôn tập trắc nghiệm kiến thức 7 ngày tại link trắc nghiệm chính thức.`;

fs.writeFileSync(file, '---\n' + yaml.dump(data, { lineWidth: -1 }).trim() + '\n---\n\n' + content + '\n', 'utf8');
console.log('Đã tạo thành công review-7-ngay-hoc-ai-thuc-chien.md');
