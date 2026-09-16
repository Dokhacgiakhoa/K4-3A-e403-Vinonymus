---
trigger: always_on
---

# AIIA_PROJECT_CONVENTIONS.md — BỘ QUY TẮC CỐT LÕI DỰ ÁN AI THỰC CHIẾN (AIIA)

> **QUY TẮC BẮT BUỘC:** Đọc và tuân thủ tuyệt đối các quy ước dưới đây trong mọi phiên làm việc với codebase `AI-thuc-chien`. Không được vi phạm trong bất kỳ hoàn cảnh nào.

---

## 🏛️ 1. MÔ HÌNH 3 KHUNG GIAO DIỆN TÁCH BIỆT HOÀN TOÀN

1. **Khách Vãng Lai (`Guest` — Chưa đăng nhập)**:
   - **Khung vỏ điều hướng**: Top Header ngang truyền thống (`MainHeader`). Tuyệt đối **KHÔNG hiển thị Sidebar trái**.
   - **Nội dung**: Landing page giới thiệu nền tảng, 12 modules mở, bài test mẫu và nút CTA đăng ký để kích hoạt bộ đếm 1000h và lưu Streak.
2. **Thành Viên Miễn Phí (`Free` — Đã đăng nhập)**:
   - **Khung vỏ điều hướng**: **Sidebar Bên Trái Phẳng (`AppSidebar`)**. Tuyệt đối **KHÔNG hiển thị Top Header ngang của khách**.
   - **Nội dung**: Bàn học cá nhân (`FreeMemberDashboardView`) với bộ đếm Streak, giờ tích lũy 1000h, cây tiến độ 12 modules SFIA (L1-L4) và thẻ nâng cấp Pro VIP.
3. **Học Viên Trả Phí Pro (`Pro VIP` — Đã thanh toán / cấp quyền Pro)**:
   - **Khung vỏ điều hướng**: **Sidebar Bên Trái Cybernetic Dark** đẳng cấp kèm huy hiệu Crown VIP.
   - **Nội dung**: Executive Cockpit (`ProCockpitDashboardView`) với **AI Mentor 1-on-1** ghim nổi trên đầu trang, bảng 4 Sprints lộ trình cá nhân hóa, 12 Đề Lab thực chiến kèm script chấm điểm. **Tuyệt đối 0% banner quảng cáo hay nút mời mua gói**.
4. **Quản Trị Viên (`Admin` — Quyền System Administrator)**:
   - **Khung vỏ điều hướng**: Sidebar bên trái có thêm mục menu **Quản Trị Hệ Thống (`/admin`)**.
   - **Nội dung**: Bảng điều khiển quản trị (`AdminCockpitDashboardView`): Nạp & Đóng gói giáo trình AI (`CurriculumIngestionModal`), Kiểm soát duyệt thanh toán VietQR (Human in the loop), Quản lý 20,000 học viên.

---

## 🎨 2. QUY CHUẨN POP-UP & NÚT BẤM (BUTTON UX STANDARDS)

1. **Bố cục lựa chọn trong Pop-up**:
   - Tất cả các pop-up có lựa chọn phải xếp các nút **ngang hàng nhau (`flex-row`)**, tuyệt đối **không xếp chồng cái trên cái dưới**.
2. **Vị trí và màu sắc nút hành động**:
   - Nút thoát / dừng / hủy luôn luôn nằm ở **bên phải cùng**.
   - Nút này bắt buộc có **nền đỏ chữ trắng** (`bg-red-600 hover:bg-red-500 text-white`).
3. **Quy tắc nội dung nút đỏ**:
   - Nút đỏ luôn phải có **nhiều chữ hơn** và mô tả rõ hành động (ví dụ: `"Dừng Và Thoát Toàn Màn Hình"` thay vì chỉ ghi `"Thoát"`).
4. **Hiệu ứng nền**:
   - Sử dụng phong cách **Glassmorphism** (`backdrop-blur-md` hoặc `backdrop-blur-xl`), độ mờ vừa phải để người dùng vẫn nhìn thấy được nội dung nền bên dưới.

---

## 🚫 3. DANH MỤC THUẬT NGỮ CẤM & QUY CHUẨN TỪ NGỮ

1. **Tuyệt đối CẤM từ `Duolingo` / `Doulingo`**:
   - Không được đưa từ này vào bất kỳ file code, giao diện hay comment nào.
   - Thay thế bằng: `"AI Gamification Tương Tác"`, `"Cây Kỹ Năng Gamification"`, `"Micro-Quiz"`.
2. **Tuyệt đối CẤM từ `Học bổng`**:
   - Khoản tiền 8.000.000 VNĐ hỗ trợ học viên CHỈ ĐƯỢC GỌI LÀ `"Trợ cấp sinh hoạt"` hoặc `"Khoản trợ cấp"`.
3. **Chuẩn tên viết tắt & nhãn thương hiệu**:
   - Viết tắt: Luôn viết hoa toàn bộ `SFIA`, phiên bản ghi là `v8` hoặc `SFIA (v8)`.
   - Tiêu đề thương hiệu: `TỰ HỌC AI`, nhãn `K.AI Labs`, mô tả `Chuẩn khung năng lực SFIA (v8)`.
   - Cấp độ giáo trình: Cố định từ `Level 1` đến `Level 4` (12 Modules & 12 Assignments chuẩn SFIA v8).

---

## ⚙️ 4. KIẾN TRÚC PHÂN TẦNG 4 LỚP (CLEAN ARCHITECTURE CORE)

1. **Backend Core (`backend-core/`)**:
   - Phát triển trên **C# .NET 10**, Clean Architecture (Domain, Application, Infrastructure, WebAPI).
   - Đóng vai trò là **Hạt nhân trung tâm (Anchor)** của toàn hệ thống, quản lý User, Tier, Transaction và Auth.
2. **Backend Microservice (`backend-microservice/`)**:
   - Phát triển trên **Python FastAPI**, chuyên trách tác vụ AI: Hybrid RAG (Qdrant HNSW + BM25), Multi-Agent LangGraph, OCR thẩm định CV.
3. **Frontend Client (`frontend/` & `src/`)**:
   - Phát triển trên **Next.js 15 PWA**, React 19, Tailwind CSS.
4. **Database & Storage (`database/`)**:
   - **PostgreSQL 16** (Relational DB 3NF) + **Qdrant** (Vector Engine triệu chiều).

---

## 🤖 5. PHÂN BIỆT RÕ RÀNG AI MENTOR VÀ AI HELPDESK

1. **AI Mentor 1-on-1 (`AIMentorWizard.tsx`)**:
   - Nằm tại trang `/learning?mode=ai_roadmap` hoặc trong Pro Cockpit.
   - Nhiệm vụ: Chẩn đoán năng lực học viên, gợi ý và xây dựng **Lộ trình 4 Sprints độc bản** cá nhân hóa.
2. **AI Helpdesk 24/7 (`FloatingAiWidget.tsx`)**:
   - Widget ghim nổi ở góc dưới bên phải màn hình trên tất cả các trang.
   - Nhiệm vụ: Trợ lý hỏi đáp trực tuyến 24/7 về Toán Transformer, Qdrant, LangGraph, và thắc mắc kỹ thuật.
