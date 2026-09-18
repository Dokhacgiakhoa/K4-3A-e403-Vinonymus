# PR: Tích hợp Slide HTML vào menu About (Full Width) và chuyển nội dung About sang trang Home

> **Task:** CP6 Slide Presentation & UX Polish · **Issue:** — · **Branch:** `feat/web-slides-and-home-about`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) · **Hỗ trợ:** Antigravity AI

## 1. Mục tiêu
Phục vụ buổi thuyết trình mốc Checkpoint 6 (CP6) trực tiếp trên nền tảng web:
- Chuyển toàn bộ nội dung giới thiệu chương trình, góc nhìn cựu học viên và ma trận năng lực SFIA 8 từ trang `/about` sang trang chủ `/` (Home), giúp trang chủ đầy đủ thông tin chiều sâu và phễu chuyển đổi.
- Xây dựng component trình chiếu Slide HTML chuyên nghiệp tại menu `/about` hiển thị **full width**, chuẩn tỉ lệ 16:9, điều khiển bằng phím mũi tên / Space / cảm ứng, phóng toàn màn hình (`F`), tích hợp đồng hồ bấm giờ đếm 6 phút (stopwatch phục vụ vòng cụm C2), và nút nhảy nhanh sang `/personalized-path` để Live Demo.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Trang chủ nhúng Program Overview, Alumni Insights & SFIA Matrix | `spec.md` §1, §3 (Mô tả chương trình đào tạo & khung năng lực) |
| Trang Slide HTML full-width tại `/about` | Chuẩn bị mốc CP6, bám sát `docs/hackathon/cp5/demo-slides.html` & `slide-content.md` |
| Bỏ giới hạn độ rộng container cho `/about` | Trải nghiệm trình chiếu sân khấu (Presentation Mode) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/app/layout.tsx` | Nhúng font Montserrat chuẩn quốc tế hỗ trợ tiếng Việt |
| `codebase/src/components/home/home-landing-view.tsx` | Nhúng `ProgramOverviewSection`, `AlumniInsightsSection`, và `SfiaMatrixView` trước phần FAQ |
| `codebase/src/components/presentation/slides-deck-view.tsx` | Tạo mới component trình chiếu 12 slide HTML chuẩn cấu trúc Mở - Thân - Kết, font Montserrat, nền trắng chữ xanh, timer 6 phút (30s/slide), nút Live Demo |
| `codebase/src/app/about/page.tsx` | Cập nhật render `SlidesDeckView` |
| `codebase/src/components/layout/app-shell-layout.tsx` | Bỏ giới hạn `max-w-7xl` / `max-w-screen-2xl` khi ở route `/about` để bung full width |
| `codebase/src/components/layout/main-header.tsx` | Đổi nhãn menu `ABOUT` thành `SLIDES` |
| `codebase/src/components/layout/app-sidebar.tsx` | Bổ sung mục `Slide Thuyết Trình (CP6)` dẫn tới `/about` trên thanh điều hướng sidebar |
| `PR.md` | Bản mô tả PR theo quy ước repo |

## 4. Kiểm thử
- `npm run verify` chạy trong `codebase/`:
  - `next lint`: Hoàn thành, 0 lỗi.
  - `tsc --noEmit`: Typecheck sạch 100%.
  - `vitest run`: 17/17 test files passed, 94/94 tests passed.
  - `audit`: Đã rà soát 53 file FAQ, 0 lỗi, 0 cảnh báo.
  - `next build`: Biên dịch production thành công, 24/24 static pages generated (bao gồm `/` và `/about`).
- Kiểm thử hiển thị và tương tác phím tắt:
  - Phím `→`, `Space`: Chuyển slide tiếp theo.
  - Phím `←`, `Backspace`: Lùi slide trước.
  - Phím `F`: Bật / tắt chế độ toàn màn hình.
  - Phím `T`: Bật / dừng đồng hồ đếm giờ 6 phút.
  - Nút `🚀 Mở Trang Live Demo (/personalized-path)` tại Slide 3 hoạt động chuẩn xác.

## 5. Tài liệu & changelog
- Khớp với kịch bản trình chiếu tại `docs/hackathon/cp5/slide-content.md` và mã nguồn slide `docs/hackathon/cp5/demo-slides.html`.

## 6. Rủi ro / việc còn lại
- Không có rủi ro kỹ thuật.
