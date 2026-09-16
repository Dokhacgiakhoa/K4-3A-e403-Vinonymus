# ĐẶC TẢ THIẾT KẾ & KIẾN TRÚC CSS TOKENS (DESIGN SYSTEM & UI/UX ARCHITECTURE)

> **Tài liệu Đặc tả Hệ thống Thiết kế Chuẩn Doanh nghiệp & Khoa Học Thị Giác**  
> Dự án: **AI in Action (AI SFIA Engineering & Community Hub)**  
> Tiêu chuẩn: **Semantic Design Tokens, GSAP Motion, Be Vietnam Pro Typography & Cyber Cursor Architecture**

---

## 🧭 1. CẤU TRÚC TUYẾN ĐƯỜNG ĐA TRANG (MULTI-PAGE APP ROUTER)

Hệ thống Next.js 15 App Router phân cấp rõ ràng 6 phân vùng chính:

1. **`/` (HOME)**: Trang chủ tổng quan, Hero 3D Showcase, 4 Feature Cards, 3 Trụ cột sứ mệnh, FAQ & Newsletter.
2. **`/about` (ABOUT)**: Ma trận năng lực SFIA 8 từ L1 đến L7 và Thang đo nhận thức Bloom's Taxonomy.
3. **`/learning` (LEARNING)**: 7 Chuyên đề Giáo trình Kỹ thuật Chuyên sâu từ Toán Transformer đến vLLM Serving.
4. **`/test` (TEST)**: Phòng thi thử trực tuyến 100% Mock Simulation có chấm điểm và phân tích tự động.
5. **`/instruction` (INSTRUCTION)**: Trung tâm Hướng dẫn Sử dụng & Khai thác toàn diện nền tảng cho Kỹ sư AI.
6. **`/contact` (CONTACT)**: Trợ lý AI K.AI Hybrid RAG 24/7 và Kênh kết nối cộng đồng.

---

## 🎨 2. BẢNG MÀU MIDNIGHT SLATE NAVY (VISUAL ERGONOMICS PALETTE)

Hệ thống màu sắc được chuẩn hóa theo khoa học thị giác (Visual Ergonomics), chống mỏi mắt cho người học và đọc tài liệu kỹ thuật dài, kiểm soát tập trung qua biến `:root` trong `src/app/globals.css`:

```css
:root {
  /* Primary & Tech Accents */
  --brand-primary: #10b981;          /* Emerald Green - Chỉ số & Trạng thái hoàn thành */
  --brand-primary-hover: #059669;
  --brand-primary-light: #34d399;
  --brand-secondary: #38bdf8;        /* Sky Blue Neon - Điểm nhấn công nghệ cốt lõi */
  --brand-secondary-light: #7dd3fc;
  --brand-accent: #f59e0b;           /* Amber Gold - Thông báo học thuật & Miễn trừ */
  --brand-accent-light: #fbbf24;
  
  /* Surfaces & Backgrounds */
  --background: #0b1329;             /* Midnight Slate Navy - Dịu mắt, độ sâu cao */
  --foreground: #f8fafc;             /* Off-white - Trắng ngà không chói lóa */
  --brand-surface-white: #ffffff;    /* Trắng sứ cao cấp cho Card nghỉ */
  --brand-surface-dark: rgba(15, 23, 42, 0.75);
  --brand-surface-card: rgba(19, 30, 58, 0.7);
  --brand-surface-glass: rgba(11, 19, 41, 0.65);
  
  /* Borders */
  --brand-border-subtle: rgba(56, 189, 248, 0.25);
  --brand-border-glow: rgba(56, 189, 248, 0.5);
  
  /* Typography */
  --text-main: #f8fafc;
  --text-sub: #cbd5e1;
  --text-muted: #94a3b8;
}
```

---

## ✍️ 3. CHUẨN MỰC TYPOGRAPHY TIẾNG VIỆT VỚI FONT `Be Vietnam Pro`

- **Bộ font chính**: `Be Vietnam Pro` (Google Fonts với subsets `vietnamese`, `latin`).
- **Khoảng cách ký tự (Letter Spacing)**: `letter-spacing: 0.01em` (khoảng cách dương thoáng đãng, triệt tiêu 100% va chạm dấu mũ và dấu thanh).
- **Độ giãn dòng (Line Height)**: `line-height: 1.7` (chuẩn Editorial Reading cho giáo trình dài).
- **Phân cấp độ đậm (Font Weights Hierarchy)**:
  - **Tiêu đề lớn (H1, H2, Hero Title)**: `font-bold` (700) kết hợp `uppercase tracking-wide`.
  - **Tiêu đề phụ & Card Title**: `font-semibold` (600).
  - **Thanh Menu & Nhãn Badge**: `font-medium` (500) hoặc `font-bold` (trạng thái Active).
  - **Nội dung đoạn văn & Mô tả**: `font-normal` (400) thanh thoát, mượt mà và dễ chịu cho mắt.

---

## 🔘 4. THANH ĐIỀU HƯỚNG TRƯỢT KHUNG TRẮNG (SLIDING WHITE PILL NAVIGATION)

- **Khung trắng chuyển động lướt mượt mà**: Một khối `absolute bg-white rounded-full` tự động đo đạc tọa độ `offsetLeft` và `offsetWidth` của tab active và lướt sang vị trí mới với đường cong lò xo `cubic-bezier(0.25, 1, 0.5, 1)`.
- **Trạng thái Active**: Nền Trắng Sứ (`bg-white`) + Chữ Đen Đậm (`text-slate-950 font-bold`) tạo độ tương phản tức thì.
- **Menu In Hoa Toàn Bộ**: `HOME` • `ABOUT` • `LEARNING` • `TEST` • `INSTRUCTION` • `CONTACT`.
- **Nút Hành Động**: `[MIỄN TRỪ NDA]` và `[TÀI KHOẢN]` (mở Auth Modal).

---

## 🎴 5. LƯỚI 4 THẺ TÍNH NĂNG ĐỔI MÀU ĐỘNG (HOVER MORPHING FEATURE CARDS)

- **Trạng thái nghỉ (Resting State)**: Tất cả 4 thẻ đều sở hữu **Màu Trắng Sứ Kính Mờ (`interactive-feature-card`)** cao cấp, sáng sủa, tinh khiết.
- **Trạng thái khi Hover (Hover Morph State)**:
  - Nền chuyển mượt sang **Gradient Xanh Lam Thẫm Midnight Slate (`from-[#1e293b] to-[#0f172a]`)**.
  - Màu chữ chuyển sang trắng sáng.
  - Biểu tượng xoay nhẹ $4^\circ$, phóng to $1.1\times$ và phát sáng hào quang viền Neon Sky Blue.
  - Thẻ nâng nhẹ 3D bồng bềnh (`translateY(-6px) scale(1.02)`).

---

## 🌊 6. HỆ THỐNG POP-UP NỔI BỒNG BỀNH RỘNG RÃI (GSAP SPRING FLOAT MODAL)

- **Mở rộng 50% chiều ngang (`max-w-4xl`)**: Bố cục lưới 3 cột thông thoáng.
- **Không che đen nền (Zero Blackout)**: Khung modal nổi bồng bềnh trực tiếp trong suốt trên trang web.
- **Hiệu ứng GSAP Spring Pop**: Xuất hiện với độ nảy lò xo 3D (`ease: back.out(1.6)`).
- **Dao động bồng bềnh liên tục (Ambient Float)**: Tự động dao động nhẹ 3D (`ease: sine.inOut`).
