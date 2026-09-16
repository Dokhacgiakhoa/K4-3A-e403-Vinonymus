'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Coffee,
  FileText,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/chat/markdown-renderer';
import { stripMediaFromMarkdown } from '@/lib/utils/clean-markdown';
import type { MediaLinkItem } from '@/lib/faqs';

export interface GuidebookFaq {
  id: string;
  title?: string;
  question: string;
  category: string;
  categoryName: string;
  icon: string;
  answer: string;
  is_verified?: boolean;
  verification_source?: string;
  media_links?: MediaLinkItem[];
}

const FAQS_DATA: GuidebookFaq[] = [
  {
    id: 'kenh-lien-he-va-ho-tro-tuyen-sinh',
    title: 'Danh bạ Kênh Liên hệ & Hỗ trợ Tuyển sinh Chính thức từ VinUni',
    question: 'Các kênh thông tin liên hệ chính thức hỗ trợ thí sinh và học viên',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    is_verified: true,
    verification_source: 'Trang web & Fanpage Facebook chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' },
      { type: 'link', url: 'https://www.facebook.com/DaotaoNhantaiAIthucchien/', title: 'Fanpage Facebook chính thức AI in Action' },
      { type: 'link', url: 'https://www.facebook.com/groups/2125430681651241', title: 'Facebook Group chính thức AI in Action' }
    ],
    answer: `- **Hotline AI20K chính thức**: \`0979.489.846\`
- **Cán bộ tư vấn tuyển sinh (Ms. Phương Thảo)**: \`0388.339.478\`
- **Email tiếp nhận**: \`aithucchien@vinuni.edu.vn\`
- **Fanpage Facebook chính thức**: \`https://www.facebook.com/DaotaoNhantaiAIthucchien/\`
- **Facebook Group chính thức**: \`https://www.facebook.com/groups/2125430681651241\`
- **Form Đăng ký Trực tuyến**: \`https://docs.google.com/forms/d/e/1FAIpQLSeGwZvkzSxvuQk74ARPhMCDqVXU8DyT-DcM4-9alMhJWg3TJw/viewform\``
  },
  {
    id: 'gioi-han-do-tuoi-dang-ky',
    question: 'Điều kiện độ tuổi & Hồ sơ sơ loại tham gia chương trình',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    answer: `Chương trình **AI thực chiến VinUni** không giới hạn độ tuổi đăng ký của ứng viên.

- **Đối tượng tuyển sinh**: Học sinh, sinh viên các trường Đại học/Cao đẳng, hoặc người đã đi làm muốn học chuyên sâu về AI.
- **Yêu cầu độ tuổi**: Không phân biệt tuổi tác hay năm học.
- **Tiêu chí sơ loại**: Đạt yêu cầu về tư duy logic, mong muốn học hỏi và cam kết tham gia đầy đủ thời lượng đào tạo (12 tuần).`
  },
  {
    id: 'trai-nganh-hoc-ai-thuc-chien',
    question: 'Yêu cầu tư duy lập trình & Hướng dẫn cho học viên Trái ngành (non-tech)',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    answer: `Chương trình AI thực chiến đòi hỏi ứng viên cần có **nền tảng căn bản về phát triển phần mềm (Software Engineering)**.

Nếu bạn thuộc nhóm học viên **trái ngành (non-tech)**:
1. **Trang bị bắt buộc**: Cần tự tích lũy trước kiến thức lập trình cơ bản (ưu tiên **Python**), tư duy logic toán học và nguyên lý hoạt động của các mô hình AI/LLM.
2. **Khuyến nghị tự học**: Nên hoàn thành các bài học nhập môn lập trình Python trước khi bước vào các bài Lab thực chiến nâng cao tại VinUni.`
  },
  {
    id: 'yeu-cau-tieng-anh',
    title: 'Yêu cầu Năng lực Tiếng Anh đối với Tài liệu & Giáo trình',
    question: 'Yêu cầu năng lực Tiếng Anh đối với tài liệu học tập & làm việc với Mentor',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    is_verified: true,
    verification_source: 'Phản hồi từ Hoàng Blue\'s',
    
    answer: `- **Mức độ yêu cầu Tiếng Anh**: Không bắt buộc phải quá giỏi Tiếng Anh giao tiếp vì **slide bài giảng và lời giảng của thầy cô được trình bày bằng Tiếng Việt**.
- **Yêu cầu từ vựng chuyên ngành**: Học viên **bắt buộc cần học thuộc và nắm vững các từ vựng Tiếng Anh chuyên ngành** AI/CNTT, vì các thuật ngữ chuyên môn sẽ xuất hiện và được sử dụng rất nhiều trên slide cũng như trong lời giảng.`
  },
  {
    id: 'cau-truc-bai-thi-dgnl',
    title: 'Quy trình Tuyển chọn 2 Vòng & Cấu trúc Chi tiết Bài thi Đánh giá Năng lực (ĐGNL)',
    question: 'Quy trình 2 vòng tuyển chọn học viên và bài kiểm tra ĐGNL đầu vào',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni & Chia sẻ kinh nghiệm từ Chuyên gia Luc Vu',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' },
    ],
    answer: `- **Quy trình 2 Vòng tuyển chọn học viên**:
  - **Vòng 1 (Xét hồ sơ trực tuyến)**: Ứng viên nộp hồ sơ online gồm CV, thông tin nền tảng học thuật - kỹ thuật, và hồ sơ năng lực (nếu có).
  - **Vòng 2 (Đánh giá năng lực đầu vào)**: Ứng viên tham gia bài kiểm tra năng lực trực tiếp tại **Trường Đại học VinUni (Vinhomes Ocean Park, Hà Nội)**. Hiện tại chương trình chưa tổ chức thi online.
- **Cấu trúc & Hình thức Bài thi ĐGNL (90 Phút)**:
  - **Thời lượng**: **90 phút**.
  - **Dạng bài**: Trắc nghiệm, đọc đoạn code ngắn và tự luận xử lý tình huống thực tế.
  - **4 Nhóm nội dung kiểm tra**:
    - **Nhóm 1 (Toán – Định lượng)**: Đánh giá tư duy toán học và tính toán số liệu.
    - **Nhóm 2 (Lập trình – Dữ liệu)**: Đánh giá kiến thức nền tảng Python, SQL và đọc hiểu code.
    - **Nhóm 3 (Kiến thức & Tư duy Sản phẩm AI)**: Đánh giá am hiểu về ML/LLM/RAG/AI Agent và tư duy phát triển sản phẩm.
    - **Nhóm 4 (Logic – Đạo đức – Hành vi)**: Đánh giá tư duy logic, đạo đức AI và khả năng ra quyết định trong bối cảnh thực tế.`
  },
  {
    id: 'chuan-bi-vat-dung-khi-di-thi-dgnl',
    title: 'Danh mục Vật dụng Cần chuẩn bị & Quy định Trang phục khi Dự thi ĐGNL',
    question: 'Những vật dụng cần mang theo và trang phục khi đi thi Đánh giá Năng lực',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    is_verified: true,
    verification_source: 'Bài đăng Fanpage Facebook chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://www.facebook.com/DaotaoNhantaiAIthucchien/posts/pfbid02q4rbT2SVskJW9jHm5Zqq1RejafvRXiYQAuisobCHKSgizHHnyNrXJxQBFrXCdtaPl', title: 'Bài đăng hướng dẫn chuẩn bị đi thi ĐGNL trên Fanpage chính thức' },
    ],
    answer: `- **Giấy tờ tùy thân bắt buộc**: Mang theo Căn cước công dân (CCCD) gốc hoặc các giấy tờ tùy thân theo hướng dẫn trong email (hoặc ứng dụng VNeID).
- **Đồ dùng cá nhân**: Bút viết (bút bi, bút chì, tẩy) phục vụ làm bài thi.
- **Trang phục quy định**: Mặc trang phục lịch sự, chuyên nghiệp.
- **Thời gian có mặt**: **Có mặt trước giờ thi 45 phút** tại địa điểm thi (Trường Đại học VinUni) để làm thủ tục check-in, nhận chỗ ngồi và ổn định tâm lý.
- **Tinh thần & Kiến thức**: Ôn tập kỹ kiến thức nền tảng, giữ tinh thần thoải mái và tập trung cao nhất để hoàn thành bài đánh giá đạt kết quả tốt.`
  },
  {
    id: 'doi-ngu-giang-vien-va-mentor',
    title: 'Đội ngũ Ban Quản trị, Giảng viên, Lab Coaches & Mentor Chuyên gia',
    question: 'Danh sách đội ngũ giảng viên, hội đồng chuyên gia và mentor đồng hành',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    answer: `- **Ban Quản trị & Học thuật**: GS.TS. Dương Nguyên Vũ (Tổng phụ trách), PGS.TS. Phạm Ngọc Nam (Giám đốc Học thuật), Bà Nguyễn Hồng Hà (Giám đốc Vận hành), PGS.TS. Đinh Ngọc Thạnh, TS. Lê Duy Dũng.
- **Đội ngũ Giảng viên & Chuyên gia**: Các Tiến sĩ, Thạc sĩ, Google Developer Experts (GDE), Chuyên gia AI từ Google Research, Amazon, FPT, Techcombank, TPBank, MSB, Obello, Trusted AI...
- **Đội ngũ Lab Coaches & Mentor**: Hơn 40 chuyên gia là Engineering Manager, Senior AI Engineer, Founder & CTO các tập đoàn công ty công nghệ lớn đồng hành hướng dẫn 1-on-1.`
  },
  {
    id: 'de-thi-mau-va-bao-mat',
    question: 'Kỳ thi Đánh giá Năng lực (ĐGNL) — Đề thi mẫu & Quy định bảo mật đề',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    answer: `- **Đề thi mẫu**: Ban Tổ chức không công bố công khai đề thi mẫu ĐGNL.
- **Nội dung kiểm tra**: Bài thi thiết kế để đánh giá tư duy logic phần mềm, khả năng giải quyết vấn đề và kiến thức căn bản về công nghệ/AI.
- **Quy định bảo mật**: Thí sinh tuân thủ tuyệt đối quy định không chụp ảnh, lưu trữ hoặc chia sẻ đề thi ra ngoài dưới mọi hình thức.`
  },
  {
    id: 'xin-nghi-buoi-khai-giang',
    question: 'Hoàn thành thủ tục nhập học & Hướng dẫn trường hợp vắng mặt buổi Khai giảng',
    category: 'thi-dgnl',
    categoryName: 'Sơ loại & ĐGNL',
    icon: 'FileText',
    answer: `- **Thông báo trúng tuyển**: Sau khi đạt vòng thi ĐGNL, thí sinh nhận email xác nhận trúng tuyển và hướng dẫn nhập học từ Ban Tổ chức.
- **Tham dự Khai giảng**: Buổi Khai giảng là sự kiện quan trọng để phổ biến quy chế, chia sẻ lộ trình và ghép đội nhóm.
- **Trường hợp bất khả kháng**: Nếu vắng mặt vì lý do chính đáng, học viên cần xin phép Ban Tổ chức trước ít nhất 24h để nhận lại tài liệu và hướng dẫn bổ sung.`
  },
  {
    id: 'tong-quan-va-quy-mo-chuong-trinh',
    title: 'Tổng quan Quy mô, Thành tựu & Triết lý Học qua Thách thức Thực tế (Challenge-Based Learning)',
    question: 'Tổng quan quy mô tuyển sinh, kết quả việc làm và triết lý đào tạo AI in Action',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Infographic Báo cáo Khởi xướng và Thành tựu Chính thức Vingroup & VinUni',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    answer: `- **Khởi xướng & Mục tiêu quốc gia**: Khởi xướng từ tháng 1/2026 nhằm hưởng ứng Nghị quyết 57-NQ/TW, hướng tới đào tạo **10.000 - 20.000 nhân tài AI** trong vòng 2 năm.
- **Quy mô ấn tượng qua 3 khóa**: Thu hút **~10.000 hồ sơ đăng ký**, tuyển chọn **2.000 học viên** từ **141 trường đại học trong nước** và **20 trường đại học quốc tế**.
- **Kết quả việc làm & Thu nhập**:
  - **100%** học viên Khóa 1 đạt chuẩn năng lực VinUni (373/500) nhận được thư mời làm việc (Offer) từ Tập đoàn Vingroup.
  - **95%** học viên chính thức đảm nhận các vị trí: *Kỹ sư AI, Kỹ sư dữ liệu, Phát triển phần mềm, Quản lý sản phẩm (PM), Phân tích nghiệp vụ (BA)*.
  - Mức lương khởi điểm lên tới **~50.000.000 VNĐ/tháng**.
- **Triết lý đào tạo 4 Thật**: *Bài toán thật | Dữ liệu thật | Chuyên gia thật | Cơ hội việc làm thật*.
- **Phương pháp Challenge-Based Learning**: Đào tạo qua giải quyết thách thức thực tế với **~160 bài toán AI mô phỏng** và **200+ bài toán AI thực tế** thuộc các lĩnh vực: Xe tự hành, Robot, Học tập cá nhân hóa, Dịch thuật đa ngôn ngữ, An ninh mạng, Dữ liệu & Tối ưu vận hành.
- **Quy chế đánh giá 2 tuần/lần**: Cứ mỗi 2 tuần, học viên được chấm điểm toàn diện về năng lực chuyên môn, chất lượng sản phẩm, tinh thần hợp tác, kỷ luật làm việc và hiệu quả thực thi dự án.`
  },
  {
    id: 'thoi-gian-hoc-va-thuc-tap',
    title: 'Cấu trúc Lộ trình Đào tạo 12 Tuần & 3 Trụ cột Chuyên sâu (P1, P2, P3)',
    question: 'Chi tiết cấu trúc 3 giai đoạn đào tạo 12 tuần và 3 hướng chuyên sâu',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    answer: `- **Cấu trúc 12 tuần (3 Giai đoạn)**:
  - **Giai đoạn 1 (03 tuần - Nền tảng toàn diện)**: Trang bị kiến thức và kỹ năng nền tảng qua 3 trụ cột (P1: AI Business & Product, P2: AI Infrastructure & Data, P3: AI Application).
  - **Giai đoạn 2 (03 tuần - Chuyên sâu theo định hướng)**: Học viên lựa chọn 1 trong 3 hướng chuyên sâu (P1, P2 hoặc P3).
  - **Giai đoạn 3 (06 tuần - Thực chiến tại doanh nghiệp)**: Tham gia dự án thực tế, làm việc theo môi trường chuyên nghiệp của doanh nghiệp đối tác.
- **Hỗ trợ học tập 24/7**: Trong 06 tuần đầu tại VinUni, vào các buổi chiều, tối và cuối tuần, học viên làm dự án mô phỏng với sự hỗ trợ 24/7 qua Discord, Zoom và GitHub.`
  },
  {
    id: 'khung-nang-luc-sfia-va-blooms-taxonomy',
    title: "Khung Năng lực AI Tích hợp SFIA & Bloom's Taxonomy (L1 đến L7)",
    question: "Khung năng lực AI tích hợp chuẩn SFIA & Bloom's Taxonomy từ L1 đến L7",
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Trang web chính thức VinUni AI in Action',
    media_links: [
      { type: 'link', url: 'https://vinuni.edu.vn/aithucchien/', title: 'Trang thông tin chính thức VinUni AI in Action' }
    ],
    answer: `- **7 Cấp độ Khung Năng lực AI (Tham chiếu SFIA & Bloom's Taxonomy)**:
  - **L1 (Nhận biết)**: Sử dụng Prompt và Template có sẵn.
  - **L2 (Hiểu)**: Hỗ trợ gán nhãn dữ liệu và tạo Chatbot cơ bản.
  - **L3 (Áp dụng)**: Xây dựng MVP & AI pipeline cơ bản.
  - **L4 (Phân tích)**: Đồng hành xây dựng AI Agent complex, RAG, dataset.
  - **L5 (Đánh giá)**: Tư vấn thiết kế & triển khai Agentic AI (Khung tham chiếu doanh nghiệp).
  - **L6 (Tạo mới)**: Xây dựng Framework AI & Tối ưu hóa quy mô (Khung tham chiếu doanh nghiệp).
  - **L7 (Chiến lược)**: Định hướng tầm nhìn & Tiêu chuẩn AI toàn diện (Khung tham chiếu doanh nghiệp).
- **Tiêu chí & Đối tượng đào tạo thực hành (Tập trung L0 đến L4)**:
  - **Level 0 (Khởi đầu)**: Cho người mới bắt đầu từ L0, Non-Tech, học sinh, sinh viên làm quen AI và lập trình.
  - **Level 2 -> 3 (Khóa Cơ bản)**: Dành cho học viên đã có kiến thức AI cơ bản, đã học Prompt/LLM hoặc làm project nhỏ, mong muốn củng cố nền tảng bài bản và nâng cao năng lực thực chiến qua bài toán thực tế.
  - **Level 3 -> 4 (Khóa Nâng cao)**: Dành cho học viên đã có nền tảng AI tốt, có kinh nghiệm xây dựng sản phẩm/project AI, mong muốn nâng cao năng lực phát triển sản phẩm AI và giải quyết bài toán doanh nghiệp.`
  },
  {
    id: 'co-hoi-cho-background-business-trong-ai',
    title: 'Lợi thế & Cơ hội Nhận Offer cho Ứng viên Nền tảng Business (Phi Lập trình)',
    question: 'Cơ hội tiếp thu bài học & nhận offer việc làm cho ứng viên có nền tảng Business',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Phản hồi từ Chuyên gia Luc Vu',
    
    answer: `- **Lợi thế của ứng viên nền tảng Business**:
  - Chương trình chia làm 3 định hướng (P1: AI Business & Product, P2: AI Infrastructure & Data, P3: AI Application).
  - Ứng viên có nền tảng Business sở hữu lợi thế lớn về thấu hiểu người dùng, xác định bài toán thực tế, thiết kế sản phẩm, đo lường hiệu quả và làm cầu nối giữa khối Kỹ thuật và Nghiệp vụ.
- **Yêu cầu kỹ năng và mức độ đào tạo**:
  - Chương trình không phải "no-code" hoàn toàn. Học viên cần tự trang bị trước kiến thức cơ bản về Python, SQL, Git/GitHub, Pandas, gọi API và các khái niệm cốt lõi (LLM, RAG, AI Agent).
  - Đánh giá dựa trên kết quả Lab hàng ngày, dự án Build thực tế, bài thi giữa kỳ, quá trình thực tập doanh nghiệp, mức độ chuyên cần và thái độ.
- **Cơ hội nhận Offer chính thức**:
  - Không có hạn ngạch cố định (như đồn đoán 20 người). Học viên có thành tích học tập vượt trội, thể hiện tốt trong dự án thực tế đều có cơ hội tuyển dụng vào các P&L thuộc Tập đoàn Vingroup.`
  },
  {
    id: 'thoi-gian-hoc-trong-tuan',
    question: 'Lịch học cố định hàng tuần (Khung giờ 9h00 - 18h00, Từ Thứ 2 đến Thứ 6)',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `Lịch sinh hoạt và học tập trực tiếp tại trường trong 6 tuần đầu tiên:

- **Tần suất**: **5 ngày/tuần** (Từ Thứ 2 đến Thứ 6).
- **Khung giờ làm việc & học tập**: **9h00 sáng đến 18h00 chiều**.
- **Mô hình hoạt động**: Kết hợp giữa bài giảng lý thuyết, thời gian tự thực hành Lab và thảo luận nhóm cùng Mentor.`
  },
  {
    id: 'venture-arena-cuoc-thi-startup-ai',
    title: 'Sự kiện Venture Arena & 3 Chiến tuyến Bài toán Đột phá (Build - Pitch - Invest)',
    question: 'Sự kiện Venture Arena: Mô hình cuộc thi Startup & Đầu tư cược điểm (Build - Pitch - Invest)',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Bài đăng chính thức từ Hoàng Blue\'s trong Cộng đồng AI thực chiến Vingroup - VinUni',
    
    answer: `- **Bản chất sự kiện Venture Arena**: Đấu trường đưa học viên (hơn 1.000 học viên K3 & K4) bước ra khỏi vùng an toàn để đóng vai Startup & Investor: khảo sát user, tìm pain point sâu sắc và đưa sản phẩm kiểm chứng trước người dùng thật.
- **3 Chiến tuyến Bài toán**:
  - **Chiến tuyến 1**: Cải tiến AI Tutor trên nền tảng VLearn.
  - **Chiến tuyến 2**: Xây dựng Trợ lý học viên chuyên dụng cho Discord.
  - **Chiến tuyến 3**: Tự khai phá cơ hội mới từ nguồn dữ liệu thực tế (chatlog AI Tutor ẩn danh, transcript bài giảng...).
- **Cơ chế Vai trò Kép (Startup & Investor)**: Mỗi team vừa đóng vai **Startup** để xây dựng (Build) và thuyết trình (Pitch), vừa đóng vai **Investor** có **100 điểm** để đặt cược (Invest) vào giải pháp của các đội khác.
- **Thông điệp cốt lõi**: *"Build with evidence. Pitch with conviction. Invest with purpose."*`
  },
  {
    id: 'kinh-nghiem-chon-teammate-3-role',
    title: 'Chiến thuật Ghép đội nhóm Dự án 6 Tuần (Công thức 3 Roles Bắt buộc & Infographic)',
    question: 'Kinh nghiệm ghép đội nhóm dự án (Team 3 Roles) cho 6 tuần BUILD từ Top 1 Cohort 2',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Chia sẻ kinh nghiệm thực tế & Infographic từ Hoàng Blue\'s (Team 125 - Top 1 BUILD Phase, Cohort 2)',
    
    answer: `- **Ý nghĩa của 6 Tuần BUILD**: Giai đoạn 6 tuần vừa học vừa làm dự án rất intensive. Nhiều team ở các khóa trước từng tan vỡ do không hợp mindset. Chọn đúng teammate bổ trợ mảnh ghép là yếu tố quyết định.
- **Công thức Đội nhóm 3 Vai trò (3 Roles Bắt buộc)**:
  - **1. Product Lead (Bảo vệ User)**: Thiên về UX/Business. Tập trung xác định Pain Point thật sự và chọn 1 workflow giải quyết tốt nhất ("gãi đúng chỗ ngứa").
  - **2. Product Engineer (Bảo vệ Sản phẩm)**: Full-stack / Vibecoding. Gánh toàn bộ đường đi end-to-end (Frontend, Backend, Database, Deploy, Tích hợp Model/Tool AI, Sửa bug).
  - **3. AI Systems & Reliability Engineer (Bảo vệ Sự thật)**: Tư duy QA/Data/Research. Chủ của câu hỏi *"Kết quả AI trả ra có đáng tin để đưa cho user không?"*. Quản lý Eval set, RAG quality, Guardrail, Latency & Model Cost.
- **Thông điệp cốt lõi**: *"Chọn teammate không phải chọn người giỏi nhất, mà chọn những người bù đắp được phần mù của nhau và cùng chịu trách nhiệm tới deadline cuối cùng."*`
  },
  {
    id: 'review-7-ngay-hoc-ai-thuc-chien',
    title: 'Tổng hợp Trải nghiệm 7 Ngày học AI Thực chiến & Bộ Đề ôn tập Trắc nghiệm kiến thức',
    question: 'Tổng hợp trải nghiệm 7 ngày đầu học AI Thực chiến & Triết lý thiết kế sản phẩm AI',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Bài đăng review thực tế & Infographic từ Hoàng Blue\'s trong Cộng đồng AI thực chiến Vingroup - VinUni',
    media_links: [
      { type: 'link', url: 'https://edu-gap.hoangblue.dev/?set=week1-day1', title: 'Bộ 7 đề ôn tập kiến thức trắc nghiệm 7 ngày học AI Thực chiến (Hoàng Blue\'s)' },
    ],
    answer: `- **Tổng quan & Tư duy sản phẩm**: Chương trình đào tạo toàn diện cách tư duy như một Product Owner / Founder: từ Problem Scoping, Product Design, quy trình phát triển sản phẩm, survey đến phỏng vấn user. Đội ngũ Mentor đa dạng góc nhìn: AI Engineer, System Architect (SA), Business Analyst (BA), Project Manager (PM), Product Owner (PO), C-level...
- **Lộ trình kiến thức 7 ngày trọng tâm**:
  - **Ngày 1 (LLM Foundation)**: Kiến trúc Transformer, Tokenization, Attention. Bản chất LLM sinh output dựa trên xác suất.
  - **Ngày 2 (Problem Scoping for AI)**: *"Đừng bắt đầu bằng model. Hãy bắt đầu bằng bài toán, dữ liệu, người dùng và tiêu chí đánh giá"*.
  - **Ngày 3 (ReAct Agent Pattern)**: Luồng Thought -> Action -> Observation -> Decision. Xây dựng Guardrails, Function Schema và Debug Trace.
  - **Ngày 4 (Prompt Engineering & Tool Calling)**: *"AI system không nên tin mọi thứ được đưa vào context"*. Context Engineering, Prompt Boundary, Token Budget, Memory, Sub-agent.
  - **Ngày 5 (AI Product Design Under Uncertainty)**: *"Phần mềm truyền thống lỗi như một con bug. Sản phẩm AI lỗi như một vấn đề niềm tin"*. Confidence UI, Editable Plan, Human Review.
  - **Ngày 6 (Hackathon Day)**: Thực chiến Prototype, SPEC, Demo trực quan và User Flow.
  - **Ngày 7 (Data Foundation for RAG)**: Pipeline Raw Knowledge -> Chunking -> Embedding -> Vector Store -> Retrieval -> Grounded Answer.
- **Thông điệp cốt lõi**: *"DON'T JUST LEARN PROMPTS. LEARN HOW TO BUILD RELIABLE AI SYSTEMS."*`
  },
  {
    id: 'lich-hoc-buoi-sang',
    question: 'Quy định mốc thời gian bắt đầu ca học sáng',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Giờ có mặt**: Ca học buổi sáng của học viên chính thức bắt đầu từ **9h00**.
- **Yêu cầu đúng giờ**: Học viên nên đến trước 10-15 phút để chuẩn bị máy tính, kết nối mạng và điểm danh tại lớp.`
  },
  {
    id: 'cong-cu-va-kien-thuc-can-thiet',
    question: 'Bộ công cụ AI Coding khuyến nghị (Claude Code, Antigravity) & Tư duy lập trình',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `1. **Bộ công cụ AI Coding khuyến nghị**:
   - **Lựa chọn mạnh nhất / Ưu tiên số 1**: Claude Code (dùng Claude 3.7 Sonnet / Pro).
   - **Lựa chọn tối ưu chi phí cho học viên**: Antigravity (Google Antigravity IDE / CLI).
   - **Công cụ bổ trợ**: Cursor, VS Code kết hợp với GitHub Copilot.

2. **Kỹ năng tư duy cốt lõi**:
   - Khả năng phân tích tài liệu đặc tả yêu cầu phần mềm (SRS).
   - Kỹ năng ra lệnh (Prompt Engineering) và vận hành Agentic Workflow.`
  },
  {
    id: 'chon-mentor-khoa-hoc',
    question: 'Quy trình tìm hiểu & Đăng ký nguyện vọng chọn Mentor hướng dẫn',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Tìm hiểu thông tin**: Học viên được cung cấp thông tin chuyên môn, định hướng nghiên cứu và các dự án tiêu biểu của dàn Mentor.
- **Đăng ký nguyện vọng**: Học viên gửi danh sách nguyện vọng Mentor phù hợp với bài toán của nhóm.
- **Phê duyệt**: Ban Tổ chức xét duyệt và ghép cặp Mentor dựa trên định hướng kỹ thuật của dự án.`
  },
  {
    id: 'de-tai-lam-nhom',
    question: 'Định hướng đề tài dự án nhóm 6 tuần đầu từ Bài toán Doanh nghiệp',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Định hướng**: Đề tài nhóm là một Dự án xây dựng sản phẩm AI thực tế làm xuyên suốt trong 6 tuần đầu.
- **Nguồn bài toán**: Đề bài lấy trực tiếp từ nhu cầu thực tế của các doanh nghiệp đối tác hoặc bài toán công nghiệp hiện đại.
- **Sản phẩm đầu ra**: Hệ thống/ứng dụng hoàn chỉnh có thể demo và sẵn sàng đưa vào chạy thử nghiệm.`
  },
  {
    id: 'deadline-assignment-1',
    question: 'Mốc thời gian nộp bài đánh giá Assignment 1 & Quy định nộp LMS',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Thời gian hạn chót**: Hạn nộp chính thức của **Assignment 1** là **23:59 ngày 25/09/2026**.
- **Kênh nộp bài**: Nộp qua cổng thông tin LMS của chương trình.
- **Quy định trễ hạn**: Bài nộp quá hạn bị trừ 10% tổng số điểm cho mỗi ngày nộp muộn.`
  },
  {
    id: 'lich-office-hours',
    question: 'Lịch Office Hours giải đáp thắc mắc chuyên môn cùng Trợ giảng & Mentor',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Thời gian diễn ra**: Được bố trí cố định hàng tuần giữa các giờ học chính thức.
- **Mục đích**: Học viên gặp trực tiếp Trợ giảng (TA) và Mentor để được hỗ trợ sửa lỗi code (debug), tham vấn kiến trúc dự án và vượt qua các rào cản kỹ thuật.`
  },
  {
    id: 'hinh-thuc-thuc-tap-6-tuan',
    question: 'Hình thức triển khai 6 tuần Thực tập full-time tại Doanh nghiệp / Đối tác',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Thời lượng**: 6 tuần cuối cùng của khóa học.
- **Hình thức**: Thực tập **full-time** trực tiếp tại các công ty công nghệ, tập đoàn đối tác hoặc các viện nghiên cứu.
- **Yêu cầu**: Học viên tham gia vào dự án thật của doanh nghiệp dưới sự giám sát của Trưởng bộ phận/Mentor doanh nghiệp.`
  },
  {
    id: 'dia-diem-thuc-tap-hcm',
    title: 'Chính sách & Quy trình Đăng ký Thực tập tại TP. Hồ Chí Minh',
    question: 'Sắp xếp địa điểm thực tập tại khu vực TP. Hồ Chí Minh & các chi nhánh',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Phản hồi từ Hoàng Blue\'s',
    
    answer: `- **Chính sách thực tập tại TP. Hồ Chí Minh**: Ban Tổ chức có chuẩn bị **Form đăng ký nguyện vọng thực tập tại TP. Hồ Chí Minh** dành riêng cho các học viên từ miền Nam ra học và có định hướng quay về thực tập.
- **Thời gian đăng ký**: Form nguyện vọng được mở vào khoảng tuần thứ 4 của khóa học để Ban Đào tạo phân bổ danh sách.`
  },
  {
    id: 'thuc-tap-tai-research-lab-vinuni',
    question: 'Cơ hội thực tập nghiên cứu tại VinUni Research Lab dành cho học viên xuất sắc',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Tiêu chuẩn xét chọn**: Dành cho các học viên đạt thành tích xuất sắc và có nguyện vọng đi sâu theo hướng nghiên cứu công nghệ lõi/AI xuất bản.
- **Quyền lợi**: Làm việc trực tiếp với các Giáo sư, Nhà nghiên cứu hàng đầu tại VinUni và tham gia phát triển các đề tài công bố quốc tế.`
  },
  {
    id: 'phan-chia-khoa-3-va-khoa-4',
    question: 'Lộ trình phân chia các Khóa đào tạo tiếp theo (Khóa 3 & Khóa 4)',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    answer: `- **Phân đợt tuyển sinh**: Các Khóa tiếp theo (Khóa 3, Khóa 4) được mở theo từng đợt cố định trong năm.
- **Tính kế thừa**: Học viên hoàn thành xuất sắc khóa trước có cơ hội đăng ký làm Trợ giảng (TA) hoặc Mentor đồng hành cùng các khóa sau.`
  },
  {
    id: 'to-chuc-chuong-trinh-nam-sau',
    title: 'Kế hoạch Tổ chức Đợt tuyển sinh các Khóa Tiếp theo (Lộ trình Dự tính 2 Năm)',
    question: 'Kế hoạch mở rộng và tổ chức chương trình AI in Action các năm tiếp theo',
    category: 'chuong-trinh-hoc',
    categoryName: 'Chương trình học',
    icon: 'GraduationCap',
    is_verified: true,
    verification_source: 'Phản hồi từ Hoàng Blue\'s',
    
    answer: `- **Kế hoạch triển khai lâu dài**: Chương trình AI in Action VinUni được khởi xướng từ tháng 1/2026 với kế hoạch dự tính kéo dài **trong 2 năm** nhằm đào tạo 10.000 - 20.000 nhân tài AI.
- **Đợt tuyển sinh các năm sau**: Chương trình liên tục mở các đợt tuyển chọn học viên thường niên cho các khóa tiếp theo.`
  },
  {
    id: 'nhan-ao-phong-va-the-hoc-vien',
    question: 'Tiếp nhận Thẻ học viên & Áo phông độc quyền chương trình AI in Action',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    answer: `- **Thời gian bàn giao**: Học viên tiếp nhận thẻ học viên và áo phông độc quyền tại tuần đầu tiên của khóa học.
- **Tác dụng của Thẻ học viên**: Sử dụng để điểm danh, quẹt thẻ ra vào cổng campus, gửi xe và truy cập các khu vực tiện ích nội khu VinUni.`
  },
  {
    id: 'tro-cap-8-trieu-va-dieu-kien-nhan',
    title: 'Chính sách Trợ cấp Sinh hoạt 8.000.000 VNĐ & Điều kiện Giải ngân',
    question: 'Chính sách Trợ cấp sinh hoạt 8.000.000 VNĐ & Điều kiện nhận',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    answer: `Chương trình cung cấp khoản **Trợ cấp sinh hoạt lên tới 8.000.000 VNĐ/học viên**:

- **Điều kiện xét duyệt**:
  - Đảm bảo tỷ lệ chuyên cần từ 90% trở lên trong suốt giai đoạn đào tạo.
  - Nộp đầy đủ và đúng hạn các bài Assignment/Project theo tiến độ yêu cầu.
  - Đạt đánh giá năng lực hoàn thành dự án từ Mentor và Ban Đào tạo.
- **Tiến độ giải ngân**: Khoản trợ cấp được chi trả trực tiếp qua tài khoản ngân hàng sau khi hoàn thành các cột mốc đào tạo.`
  },
  {
    id: 'phieu-an-cang-tin',
    title: 'Thông tin Phục vụ Ăn uống, Giá vé cơm tháng & Kinh nghiệm Căng tin VinUni',
    question: 'Thông tin giá vé cơm tháng, chất lượng suất ăn & kinh nghiệm ăn uống tại Căng tin VinUni',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    is_verified: true,
    verification_source: 'Thảo luận thực tế Khóa 1 (Học viên SageBeet752) - Cộng đồng AI thực chiến Vingroup - VinUni',
    media_links: [
      { type: 'image', url: '/images/faqs/ve-com-cang-tin-vinuni.png', caption: 'Xác nhận giá vé cơm tháng 880k/22 buổi & review suất ăn căng tin VinUni từ học viên Khóa 1' }
    ],
    answer: `- **Giá vé cơm tháng**: Gói suất ăn trưa theo tháng tại căng tin VinUni có giá **880.000 VNĐ / tháng** cho **22 buổi ăn** (trung bình khoảng 40.000 VNĐ/suất).
- **Cơ chế bấm lỗ & Mẹo dùng chung tiết kiệm**: Thẻ áp dụng hình thức bấm lỗ (ăn bữa nào tính bữa đó). Học viên có thể rủ bạn bè ăn cùng và bấm lỗ chung trên 1 thẻ tháng để tối ưu chi phí cực kỳ tiết kiệm.
- **Chất lượng suất ăn & Lời khuyên địa điểm**: Chất lượng cơm căng tin ổn định. Học viên Khóa 1 khuyến nghị nên ăn trực tiếp tại căng tin trường vì thời gian nghỉ trưa ngắn và quanh khu vực trường không có hàng quán phù hợp.
- **Gợi ý ăn sáng & Nước uống**: Buổi sáng học viên có thể mua bánh mì tại quán bên cạnh căng tin (ngon, đầy đủ chất dinh dưỡng), đồ uống tự chuẩn bị tùy nhu cầu cá nhân.
- **Quy trình mua & Chi phí**: Mua trực tiếp tại căng tin trường (không có app hay website bán online). Chi phí suất ăn do học viên tự chi trả (Ban Tổ chức không cấp phát phiếu ăn miễn phí).`
  },
  {
    id: 'an-uong-buoi-toi-va-xe-dap-free',
    question: 'Tiện ích ăn tối, Xe đạp điện VinFast di chuyển nội khu miễn phí',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    answer: `- **Hỗ trợ ăn tối**: Học viên ở lại tăng cường tự học hoặc chạy dự án buổi tối được hỗ trợ suất ăn nhẹ/ăn tối tại khu vực quy định.
- **Di chuyển nội khu**: Miễn phí di chuyển bằng hệ thống xe đạp/xe đạp điện VinFast trong khuôn viên campus VinUni bằng cách quẹt Thẻ học viên.`
  },
  {
    id: 'phi-gui-xe-va-the-hoc-vien',
    title: 'Quy định Bãi gửi xe Hầm VinUni (Miễn phí 0đ & Biển số Tích hợp Thẻ học viên)',
    question: 'Hướng dẫn gửi xe máy/ô tô & Đăng ký vé xe bằng Thẻ học viên',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    is_verified: true,
    verification_source: 'Xác nhận từ Quản trị viên Lam Luu',
    
    answer: `- **Chi phí gửi xe**: **Hoàn toàn KHÔNG MẤT PHÍ** khi gửi xe máy/ô tô tại hầm gửi xe VinUni.
- **Cơ chế tích hợp Thẻ học viên**: Biển số xe được tích hợp trực tiếp vào Thẻ học viên AI in Action để quẹt thẻ ra vào tự động.
- **Trường hợp quên thẻ hoặc đổi phương tiện**: Nếu quên thẻ, học viên lấy vé ngày tạm thời (vẫn không mất phí). Nếu chuyển đổi từ xe buýt sang xe máy, học viên nhắn tin báo Ban Tổ chức để cập nhật thông tin biển số xe lên hệ thống.`
  },
  {
    id: 'phong-hoc-tu-hoc-24-7',
    title: 'Quyền truy cập Không gian Tự học & Phòng học Mở 24/7 (Bao gồm Thứ 7, Chủ Nhật)',
    question: 'Quyền truy cập Không gian Tự học & Phòng mở 24/7 cả Thứ 7 và Chủ Nhật',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    is_verified: true,
    verification_source: 'Phản hồi từ Hoàng Blue\'s',
    
    answer: `- **Phòng học tự học 24/7**: VinUni có trang bị phòng học / không gian tự học mở cửa **24/7 tất cả các ngày trong tuần (bao gồm cả Thứ 7 và Chủ Nhật)**.
- **Trang thiết bị**: Đầy đủ bàn làm việc nhóm, ổ cắm điện, đường truyền Internet cáp quang/Wi-Fi 6 tốc độ cao phục vụ các nhóm học tập và thức đêm hoàn thiện dự án.`
  },
  {
    id: 'su-dung-thu-vien-phong-lab',
    question: 'Quyền truy cập Thư viện hiện đại & Phòng máy tính AI chuyên dụng',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    answer: `- **Thư viện số**: Học viên được cấp tài khoản truy cập hàng ngàn đầu sách, tạp chí khoa học quốc tế về AI/CS.
- **Phòng Máy tính AI**: Trang bị máy dàn GPU hiệu năng cao hỗ trợ huấn luyện mô hình và thực hành dự án phức tạp.`
  },
  {
    id: 'su-dung-gym-be-boi-vinuni',
    title: 'Quy định Sử dụng Tổ hợp Thể thao Gym & Bể bơi VinUni (Chưa hỗ trợ)',
    question: 'Đặc quyền trải nghiệm Tổ hợp Thể thao (Gym, Bể bơi bốn mùa VinUni)',
    category: 'tien-ich',
    categoryName: 'Tiện ích',
    icon: 'Coffee',
    is_verified: true,
    verification_source: 'Đính chính từ Quản trị viên Lam Luu & Hoàng Blue\'s',
    
    answer: `- **Tiện ích Thể thao VinUni (Gym, Bể bơi, Sân thể thao)**: Hiện tại cơ sở vật chất này **chưa thể hỗ trợ phục vụ cho Học viên AI in Action** (do thời gian hè nhà trường tiến hành bảo trì và công suất chưa đáp ứng).
- **Giải pháp thay thế**: Học viên có thể sử dụng các tiện ích thể thao tương tự thuộc nội khu Ocean Park khi hoàn thành đăng ký tạm trú trên ứng dụng VNeID.`
  },
  {
    id: 'noi-quy-va-van-hoa-hoc-tap',
    question: 'Nội quy và văn hóa học tập của chương trình AI Thực chiến',
    category: 'quy-dinh',
    categoryName: 'Quy định',
    icon: 'ShieldCheck',
    is_verified: true,
    verification_source: 'Bài đăng Admin Lam Luu',
    media_links: [
      { type: 'link', url: 'https://www.facebook.com/groups/congdongaithucchien/posts/2230106597850315', title: 'Bài đăng chính thức trên Facebook Group của Admin Lam Luu' },
      { type: 'image', url: '/images/faqs/noi-quy-van-hoa-hoc-tap-post.png', caption: 'Bài đăng Nội quy & Văn hóa học tập - Admin Lam Luu' },
      { type: 'image', url: '/images/faqs/noi-quy-van-hoa-hoc-tap-infographic.png', caption: 'Infographic Nội quy & Văn hóa học tập' },
      { type: 'image', url: '/images/faqs/noi-quy-van-hoa-hoc-tap-comment.png', caption: 'Comment Hỗ trợ & Phản ánh - Admin Lam Luu' }
    ],
    answer: `- **Tuân thủ giờ học & Tác phong**: Đi học đúng giờ, mặc trang phục lịch sự, giữ trật tự và đóng góp ý kiến trên tinh thần xây dựng.
- **Nghiêm cấm chất kích thích**: Không sử dụng rượu, bia, thuốc lá và các chất kích thích khác trong campus Trường Đại học VinUni.
- **Tôn trọng quyền riêng tư**: Không tự ý đăng tải, chia sẻ công khai hình ảnh, video hoặc thông tin cá nhân của người khác khi chưa có sự đồng ý.
- **Kênh phản ánh & Hỗ trợ**: Ý kiến đóng góp hoặc phản ánh vấn đề phát sinh vui lòng liên hệ trực tiếp BTC qua Zalo/Discord/Email. Các phản ánh cá nhân khuyến khích gửi ẩn danh hoặc trao đổi riêng để bảo mật.`
  },
  {
    id: 'quy-dinh-doi-lop-nhom-khoa',
    title: 'Quy định Tuyệt đối Không cho phép Xin Đổi lớp, Đổi nhóm hoặc Chuyển khóa',
    question: 'Quy trình đăng ký chuyển lớp, đổi nhóm dự án hoặc chuyển khóa học',
    category: 'quy-dinh',
    categoryName: 'Quy định',
    icon: 'ShieldCheck',
    is_verified: true,
    verification_source: 'Đính chính chính thức từ Quản trị viên Lam Luu',
    
    answer: `- **Quy định tuyệt đối về chuyển đổi**: Ban Tổ chức **100% không giải quyết việc xin chuyển lớp, đổi nhóm hay đổi khóa** dưới bất kỳ hình thức nào.
- **Mục tiêu quy định**: Học viên học và thực tập hoàn toàn theo sự sắp xếp ngẫu nhiên của Ban Tổ chức nhằm trải nghiệm môi trường thực tế, xây dựng kỹ năng làm việc nhóm với những bạn mới và mở rộng mạng lưới networking.`
  },
  {
    id: 'bao-luu-khoa-hoc-va-thoi-gian',
    title: 'Quy định Bảo lưu Kết quả Trúng tuyển & Tần suất Mở Khóa Đào tạo (Cách nhau 6 Tuần)',
    question: 'Chính sách bảo lưu kết quả trúng tuyển & Tần suất các khóa đào tạo (cách 6 tuần)',
    category: 'quy-dinh',
    categoryName: 'Quy định',
    icon: 'ShieldCheck',
    is_verified: true,
    verification_source: 'Phản hồi từ Hoàng Blue\'s & Trang thông tin VinUni',
    
    answer: `- **Chính sách bảo lưu kết quả**: Học viên trúng tuyển (ví dụ: sinh viên năm 3) **hoàn toàn được phép bảo lưu** kết quả trúng tuyển để tham gia các khóa sau.
- **Tần suất mở khóa học**: Các khóa đào tạo thường được tổ chức **cách nhau 6 tuần**.
- **Quy trình thủ tục**: Học viên gửi đơn bảo lưu cho Ban Tổ chức, chương trình sẽ chủ động gửi email hướng dẫn nhập học khi đợt tiếp theo bắt đầu.
- **Chứng chỉ đồng cấp**: Học viên hoàn thành khóa học được cấp Chứng chỉ đào tạo do Trường Đại học VinUni và Tập đoàn Vingroup đồng cấp.`
  }
];

const CATEGORIES_LIST = [
  { id: 'thi-dgnl', name: 'Sơ loại & ĐGNL', icon: FileText },
  { id: 'chuong-trinh-hoc', name: 'Chương trình học', icon: GraduationCap },
  { id: 'tien-ich', name: 'Tiện ích', icon: Coffee },
  { id: 'quy-dinh', name: 'Quy định', icon: ShieldCheck },
];

interface GuidebookViewProps {
  onAskAi: (question: string) => void;
}

export function GuidebookView({ onAskAi }: GuidebookViewProps) {
  const [selectedCat, setSelectedCat] = useState('thi-dgnl');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [faqsList, setFaqsList] = useState<GuidebookFaq[]>(FAQS_DATA);

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqsList(data.faqs);
        }
      })
      .catch(() => {});
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqsList.filter((faq) => faq.category === selectedCat);
  }, [faqsList, selectedCat]);

  return (
    <div className="h-full flex flex-col bg-slate-950/40 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">


      {/* 2. RESPONSIVE CATEGORY NAVIGATION (Chia đều 4 Chủ đề chuẩn ở mọi thiết bị) */}
      <div className="bg-slate-950/40 border-b border-slate-800/60 p-2.5 sm:p-3 shrink-0 backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {CATEGORIES_LIST.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/90 to-blue-600/90 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/50 font-bold backdrop-blur-md'
                    : 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 border border-slate-800/60 backdrop-blur-sm'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SCROLLABLE FAQ CONTENT AREA (Duy nhất khu vực này được cuộn dọc với custom-scrollbar màu tối) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 md:p-4 space-y-3 bg-transparent pb-28 lg:pb-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-900/30 rounded-2xl border border-slate-800/60 backdrop-blur-md">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Không tìm thấy thông tin phù hợp</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Thử tìm từ khóa khác hoặc bấm nút dưới đây để gửi câu hỏi cho K.AI nhé!
            </p>
            <button
              onClick={() => onAskAi('Hỏi thêm thông tin chương trình')}
              className="mt-2 inline-flex items-center gap-2 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Hỏi K.AI ngay
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden backdrop-blur-md ${
                  isOpen
                    ? 'bg-slate-900/70 border-cyan-500/50 shadow-xl shadow-cyan-950/30'
                    : 'bg-slate-900/35 border-slate-800/60 hover:border-cyan-500/30 hover:bg-slate-900/60'
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-3.5 flex items-start justify-between gap-3 text-left group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                        {faq.categoryName}
                      </span>
                      {faq.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded" title={faq.verification_source || 'Nguồn BTC'}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          Đã xác thực
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400/90 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                          Chưa xác thực
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                      {faq.title || faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Accordion Body Answer */}
                {isOpen && (
                  <div className="px-3.5 pb-4 border-t border-slate-800/60 pt-3 space-y-3">
                    <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed">
                      <MarkdownRenderer content={stripMediaFromMarkdown(faq.answer)} />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/40">
                      <span className="text-[10px] text-slate-500">Quy chế chính thức AI in Action</span>
                      <button
                        onClick={() => onAskAi(faq.question)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-medium rounded-lg transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Hỏi K.AI về mục này
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
