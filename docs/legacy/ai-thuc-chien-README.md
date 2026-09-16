> ## 📌 Ghi chú cho Mini Hackathon AI (nhóm Vinonymus, K4-3A-e403)
> Codebase này được import nguyên vẹn từ dự án `AI-thuc-chien` đang phát triển riêng, dùng làm nền cho lát cắt dự thi. Trạng thái từng phần **tại thời điểm nộp**:
>
> | Phần | Trạng thái | Ghi chú |
> |---|---|---|
> | `src/lib/rag/*`, `/api/chat` (Chat K.AI, RAG có trích dẫn) | ✅ AI chạy thật | Pipeline 5 tầng, BYOK, có eval (`tests/eval/`) |
> | `src/lib/roadmap-ai-engine.ts`, `ai-mentor-wizard.tsx` (Lộ trình cá nhân hoá) | 🔧 Đang thay bằng AI thật | Hiện là luật if/else tĩnh — lát cắt thi sẽ thay bằng lời gọi LLM thật, giữ luật cũ làm baseline so sánh |
> | `backend-core/`, `database/` (.NET 10 Clean Architecture — auth, ghi danh, chứng chỉ, thanh toán) | ⚠️ **Chưa tích hợp vào lát cắt dự thi** | App Next.js gọi các endpoint này qua `src/lib/api/auth-backend-client.ts` và `curriculum-backend-client.ts`, nhưng có cơ chế tự động fallback khi server .NET không chạy — không cần chạy .NET để demo. Quyết định của nhóm: giữ lại cho giai đoạn phát triển sau, không phải phạm vi chấm của hackathon này |
> | `curriculum/`, `docs/`, `.agent/`, `.agents/` | 📚 Tài liệu/nội dung nền, không phải phần AI của lát cắt | |
>
> Không cần deploy để demo — chạy `npm run dev` và quay màn hình là đủ theo luật hackathon.

---

# AI SFIA Engineering & Learning Hub (AI Thực Chiến)

> 🎓 **VinUni AI in Action • Khóa IV Fellow Edition**  
> **Nền tảng Hợp nhất Tra cứu Khung Năng lực AI chuẩn SFIA L1 - L7, Luyện thi Mô phỏng & Trợ lý Sổ tay AI**  
> Dự án được xây dựng theo **Kiến trúc Doanh nghiệp Hợp nhất (Enterprise Unified Architecture)**, chuẩn hóa theo khung năng lực quốc tế **SFIA 8 (Skills Framework for the Information Age)** và thang đo nhận thức **Bloom's Taxonomy**.

---

## 🏛️ Kiến Trúc Hệ Thống Chuẩn Doanh Nghiệp (Enterprise Architecture)

Dự án đã được tái cấu trúc thành một hệ thống hợp nhất duy nhất với các phân tầng trách nhiệm rõ ràng:

```
AI-thuc-chien/
│
├── frontend/                                # 🌐 TẦNG GIAO DIỆN NGƯỜI DÙNG (Web PWA & UI)
│   ├── public/                              # PWA Manifest, Icons, Service Worker, Static Images
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/                                 # Components: SfiaMatrix, MockTestRunner, AiChat, Profile
│   ├── data/                                # Master Data Store: sfia-data.js (L1-L7, Tests, Roadmaps)
│   └── index.html                           # Giao diện chính React 18 + Tailwind + Prism + Lucide
│
├── backend-core/                            # ⚡ TẦNG XỬ LÝ LÕI & API GATEWAY
│   ├── src/
│   │   ├── api/                             # REST API / SSE Streams endpoints (/api/chat, /api/auth)
│   │   ├── lib/                             # RAG Engine, RRF Hybrid Search, Token Metering, Guardrails
│   │   └── types/                           # Internal Core Type Definitions
│   └── main.py / route.ts
│
├── backend-services/                        # ⚙️ TẦNG VI DỊCH VỤ & BACKGROUND WORKERS
│   ├── rag-ingestion-service/               # Scripts đồng bộ hóa vector, chunking & audit dữ liệu
│   └── curriculum-generator/                # Bộ công cụ sinh giáo trình AI & bài giảng tự động
│
├── database/                                # 🗄️ TẦNG CƠ SỞ DỮ LIỆU & BẢO MẬT RLS
│   ├── migrations/                          # 20260830_commercial_saas_schema.sql (13 bảng + RLS)
│   └── seeds/                               # Dữ liệu hạt giống: SFIA Master Data, Đề thi mô phỏng, Syllabus
│
├── shared/                                  # 📘 HỢP ĐỒNG KỸ THUẬT DÙNG CHUNG (Web, Backend, Mobile App)
│   ├── types/                               # saas.ts (User, Subscriptions, MockTests, Chat)
│   └── constants/                           # SAAS_PLANS, BloomTaxonomy, SFIA Levels
│
├── docs/                                    # 📑 TÀI LIỆU KỸ THUẬT & PHÁP LÝ HỢP NHẤT
│   ├── KIEN-TRUC-SAAS-MOBILE.md             # Đặc tả Single Backend - Multi Client & Mobile App Roadmap
│   └── API-SPECIFICATION.md
│
├── index.html                               # Cổng điều hướng nhanh vào Hub
└── README.md                                # Master Documentation
```

---

## 🎯 6 Phân Hệ Cốt Lõi Trên Giao Diện Web PWA

1. 📊 **[SFIA Matrix Explorer]**: Ma trận so sánh 7 cấp độ năng lực (L1: Follow $\to$ L7: Set Strategy) kèm bộ lọc và tìm kiếm từ khóa toàn cục.
2. 🎓 **[Curriculum Details]**: Đào sâu từng Level: Mục tiêu đào tạo, Lý thuyết chuyên sâu, Kỹ năng thực chiến, Code mẫu và Dự án Capstone.
3. 📝 **[Luyện Thi Mô Phỏng (Mock Tests)]**: Đề thi trắc nghiệm học thuật mô phỏng chuẩn SFIA L1-L7, đồng hồ đếm ngược, chấm điểm tự động và giải thích chi tiết gốc rễ.
4. 🗺️ **[Learning Roadmaps]**: Lộ trình 12 ngày bứt phá (L3 $\to$ L4) với Progress Tracker & Mô hình 12 tuần thực chiến (3 + 3 + 6).
5. 💻 **[Tech Stack & Architecture]**: 4 nhóm công nghệ AI cốt lõi & Sơ đồ tương tác Enterprise Agentic RAG Pipeline.
6. 🤖 **[Chat Sổ Tay AI RAG]**: Trợ lý AI hỏi đáp kỹ thuật với bộ chọn mô hình linh hoạt (Claude 3.7 Sonnet, GPT-4o, DeepSeek R1), trích dẫn tài liệu nguồn và trừ ví token trực tiếp.

---

## ⚠️ Tuyên Bố Pháp Lý & Miễn Trừ Trách Nhiệm (Legal Disclaimer)

1. **Dự án học thuật độc lập**: Đây là nền tảng nghiên cứu và chia sẻ tri thức học thuật cá nhân độc lập nhằm mục đích hệ thống hóa kiến thức kỹ thuật AI theo Khung Năng lực Công nghệ Thông tin Quốc tế **SFIA 8** và thang đo nhận thức **Bloom's Taxonomy**.
2. **Không đại diện chính thức (Unofficial)**: Website này **hoàn toàn KHÔNG phải là trang web chính thức** và không có bất kỳ ủy quyền, liên kết pháp lý hay phát ngôn đại diện nào cho Đại học VinUni hay Tập đoàn Vingroup.
3. **Bài test hoàn toàn là mô phỏng (100% Academic Mock Simulations)**: Tất cả các bài kiểm tra đánh giá, câu hỏi trắc nghiệm và kịch bản thực hành trên nền tảng này là **tài liệu mô phỏng học thuật độc lập** do tác giả tự biên soạn dựa trên các tài liệu mã nguồn mở công khai (SFIA Foundation, DeepLearning.AI, Stanford CS224N, PyTorch, HuggingFace). Nền tảng **tuyệt đối KHÔNG trích xuất, sao chép hoặc tiết lộ bất kỳ đề thi, câu hỏi hay tài liệu bảo mật nội bộ nào** từ bất kỳ chương trình đào tạo nào.
4. **Bảo lưu bản quyền & Tuân thủ NDA**: Tác giả tuân thủ nghiêm ngặt các thỏa thuận bảo mật thông tin (NDA) và đạo đức nghề nghiệp.

---

## 🚀 Hướng Dẫn Khởi Chạy Ứng Dụng

```bash
# Sử dụng Python HTTP Server nội bộ
python -m http.server 3000

# Truy cập trình duyệt:
# http://localhost:3000/
# hoặc: http://localhost:3000/frontend/index.html
```
