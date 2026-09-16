# ARCHITECTURAL-IMPACT-MATRIX.md — MA TRẬN PHÂN TÍCH TÁC ĐỘNG HỆ THỐNG (AIIA)

> **MỤC ĐÍCH**: Bản đặc tả này đóng vai trò là la bàn định vị cho toàn bộ kỹ sư & AI Agent. Mọi yêu cầu tính năng, sửa đổi giao diện hay logic nghiệp vụ PHẢI được đối chiếu qua ma trận này trước khi chạm vào bất kỳ dòng code nào, đảm bảo tính toàn vẹn và không tạo ra các tính năng rời rạc.

---

## 🏛️ 1. MA TRẬN 4 PHÂN HỆ GIAO DIỆN & QUYỀN HẠN (RBAC & VIEW MODES)

| Phân hệ / User Mode | Shell Điều Hướng | Giao Diện / Trang Chính | Dữ Liệu & Tính Năng Được Phép | Điều Cấm Tuyệt Đối |
| :--- | :--- | :--- | :--- | :--- |
| **1. Guest (Chưa đăng nhập)** | `MainHeader` ngang trên đỉnh (`HOME`, `ABOUT`, `LEARNING`, `TEST`, `INSTRUCTION`, `CONTACT`). | Landing Page (`/`), Thư Viện Mở (`/learning`), Trang Giới Thiệu (`/about`). | Xem ma trận SFIA, tra cứu thư viện mở, làm test mô phỏng mẫu, nút CTA Đăng ký / Đăng nhập. | **CẤM** hiển thị Sidebar trái (`AppSidebar`). Không lưu streak dài hạn vào DB. |
| **2. Free Member (Học viên Miễn phí)** | **Sidebar Trái Phẳng (`AppSidebar`)**. Ẩn hoàn toàn MainHeader ngang. | Bàn học cá nhân (`/account`), Danh sách 19 chuyên đề, Cây kỹ năng Gamification (`/learning?mode=gamified`). | Bộ đếm 1000h cá nhân, Streak học tập, lưu lịch sử làm bài test, thẻ nâng cấp Pro VIP (`pro-upgrade-card.tsx`). | **CẤM** truy cập phòng Lab chuyên sâu cấp L4, không có AI Mentor 1-on-1 cá nhân hóa 4 Sprints. |
| **3. Pro VIP (Học viên Đã Trả Phí)** | **Sidebar Trái Cybernetic Dark** kèm huy hiệu Crown VIP. | Executive Cockpit, `/learning?mode=ai_roadmap`, Bộ 12 Đề Lab thực chiến kèm script chấm tự động. | **AI Mentor 1-on-1** (`AIMentorWizard.tsx`), 4 Sprints cá nhân hóa, quyền truy cập Full Labs & Private repos. | **TUYỆT ĐỐI 0%** banner quảng cáo, nút mời mua gói hoặc từ ngữ "phi lợi nhuận". |
| **4. Admin (Quản trị viên)** | Sidebar trái có thêm menu **Quản Trị (`/admin`)**. | Admin Cockpit Dashboard (`/admin`). | Nạp & đóng gói giáo trình AI, duyệt thanh toán VietQR (Human-in-the-loop), quản trị học viên. | Không can thiệp sửa trực tiếp dữ liệu thô mà không qua audit logs. |

---

## 🔄 2. MA TRẬN DỮ LIỆU CỐT LÕI (CORE DATA SPINES & DEPENDENCIES)

Khi một tính năng chạm vào một trong các trục dữ liệu dưới đây, bắt buộc phải đồng bộ tất cả các thành phần phụ thuộc:

```
                  ┌──────────────────────────────────────────────┐
                  │          NGƯỜI DÙNG & PHÂN HẠNG              │
                  │  Guest ➔ Free Member ➔ Pro VIP ➔ Admin       │
                  └──────────────────────┬───────────────────────┘
                                         │
     ┌───────────────────────────────────┼───────────────────────────────────┐
     ▼                                   ▼                                   ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│     KHUNG SFIA (v8)     │ │   GAMIFICATION & TIME   │ │    AI TWIN ENGINES      │
│  - 5 Levels: L0 ➔ L4    │ │  - Bộ đếm 1000 giờ      │ │  - AI Mentor 1-on-1     │
│  - 19 Chuyên Đề Động    │ │  - Streak Tracker       │ │    (Lộ trình 4 Sprints) │
│  - 19 Đề Lab 1:1        │ │  - Focus Mode (F11)     │ │  - AI Helpdesk 24/7     │
│  - 5 Bài Đánh Giá       │ │  - Học Vượt Ải          │ │    (Widget góc phải)    │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

### Chi tiết các trục dữ liệu:
1. **Trục Giáo Trình (`allModules`)**:
   - Nguồn sự thật: `AI_FOR_EVERYONE_MODULES` (L0) + `SFIA_COMMUNITY_DATA.curriculumModules` (L1-L4).
   - Quy tắc: Mọi con số chuyên đề hiển thị trên UI (`CurriculumView`, `HomeLandingView`, `AboutView`) **PHẢI LẤY ĐỘNG** từ `allModules.length`, **CẤM HARDCODE** số tĩnh.
2. **Trục Gamification & Focus**:
   - Focus Mode: Quản lý tập trung qua `FocusModeStore` (`focus-mode-controller.tsx`). Nút bấm trên Header, Sidebar hay Banner đều lắng nghe chung 1 store.
   - 1000 Giờ Tự Học: Lưu qua `study-timer.ts` và đồng bộ vào `clientStorage`.
3. **Trục Phân Biệt Hai Trợ Lý AI**:
   - `AIMentorWizard.tsx`: Chẩn đoán trình độ học viên và tạo lộ trình 4 Sprints cá nhân hóa. Chỉ nằm trong Pro Cockpit hoặc trang `/learning?mode=ai_roadmap`.
   - `FloatingAiWidget.tsx`: Widget nổi ở góc dưới bên phải màn hình mọi trang để giải đáp thắc mắc kỹ thuật nhanh 24/7.

---

## 📋 3. QUY TRÌNH 4 BƯỚC PHÂN TÍCH TÁC ĐỘNG BẮT BUỘC (PRE-IMPACT PROTOCOL)

Trước khi viết bất kỳ dòng code nào cho một yêu cầu mới, Agent phải tự trả lời 4 câu hỏi:

1. **Định Vị (Where)**: Yêu cầu này nằm ở phân hệ nào? (`Guest`, `Free`, `Pro`, hay `Admin`)? Thuộc route nào?
2. **Liên Kết (Connection)**: Tính năng này ăn khớp với luồng học tập nào đã có? (Có liên quan đến Streak, 1000h, SFIA Matrix, Mock Tests, hay AI Mentor không?)
3. **Mâu Thuẫn Nghiệp Vụ (Conflict Check)**: Thay đổi này có mâu thuẫn với business model không? (Ví dụ: có gói trả phí thì tuyệt đối không ghi "phi lợi nhuận"; gói Pro thì không hiển thị nút mời mua).
4. **Tác Động Chéo (Regression Check)**: Sửa component này có làm lệch layout, vỡ props, hay sai lệch dữ liệu ở các view khác không?
