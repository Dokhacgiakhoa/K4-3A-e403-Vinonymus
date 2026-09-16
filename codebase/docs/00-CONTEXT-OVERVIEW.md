# TỔNG QUAN BỐI CẢNH & QUYẾT ĐỊNH KIẾN TRÚC DỰ ÁN (MASTER CONTEXT & ADRs)

> **Tài liệu Bối cảnh Gốc & Lịch sử Quyết định Kiến trúc**  
> Dự án: **AI SFIA Engineering & Community Hub (`AI-thuc-chien`)**  
> Phiên bản: **2026 Enterprise Edition**

---

## 📖 1. LỊCH SỬ HỢP NHẤT & SỨ MỆNH DỰ ÁN

- **Bối cảnh hình thành**: Dự án hợp nhất toàn diện từ 2 repository tiền thân:
  1. `1000 hours Human Learning with AI`: Hệ thống tài liệu 1000 giờ học AI chuyên sâu.
  2. `AIIA-Notebook`: Sổ tay học viên tra cứu và Trợ lý AI RAG.
- **Sứ mệnh hiện tại**: Nâng cấp thành **Nền Tảng Tri Thức & Khung Năng Lực Kỹ Sư AI Mở Chuẩn SFIA 8 Quốc Tế** phục vụ cộng đồng Kỹ sư AI Việt Nam, loại bỏ các chi tiết cá nhân hóa để mang tính chất giáo dục mở và đào tạo chuyên sâu.

---

## 🏛️ 2. DANH SÁCH QUYẾT ĐỊNH KIẾN TRÚC QUAN TRỌNG (ADRs)

### ADR-01: Kiến Trúc Phân Tầng Hợp Nhất (Clean Modular Architecture)
- **Quyết định**: Xóa bỏ hoàn toàn các thư mục rải rác để gộp thành 6 tầng chuẩn: `frontend/`, `backend-core/`, `backend-services/`, `database/`, `shared/`, `docs/`.
- **Lý do**: Tách bạch trách nhiệm (Separation of Concerns), dễ bảo trì, sẵn sàng mở rộng sang Mobile App Native (React Native/Expo).

### ADR-02: Mô Hình Single Backend - Multi Client
- **Quyết định**: Web PWA (Next.js 15) và Mobile App (sau này) dùng chung 1 Backend API Gateway duy nhất trên nền tảng Supabase PostgreSQL + REST API/SSE Streaming.
- **Lý do**: Tránh phân mảnh logic nghiệp vụ, đồng bộ dữ liệu người dùng đa thiết bị.

### ADR-03: Cam Kết Bảo Mật Tuyệt Đối & 100% Mock Assessments (NDA Compliance)
- **Quyết định**: Toàn bộ ngân hàng đề thi và câu hỏi là mô phỏng học thuật độc lập 100% do cộng đồng tự biên soạn từ nguồn mở quốc tế (Stanford, DeepLearning.AI, PyTorch).
- **Lý do**: Tuân thủ tuyệt đối thỏa thuận bảo mật thông tin (NDA) và đạo đức nghề nghiệp, bảo vệ dự án trước mọi rủi ro pháp lý.

### ADR-04: Bảo Mật Khóa API Phía Client (Zero Server-side Key Storage)
- **Quyết định**: Khóa API người dùng tự mang (BYO Key) chỉ tồn tại trong vòng đời request, tuyệt đối không lưu trữ trong database hay log server.
- **Lý do**: Loại bỏ rủi ro rò rỉ dữ liệu nhạy cảm của người dùng.
