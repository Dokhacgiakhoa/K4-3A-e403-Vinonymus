# PR: Tích hợp Slide HTML vào menu About (Full Width) và nâng cấp nội dung Pitching sắc bén

> **Task:** CP6 Slide Presentation & UX Polish · **Issue:** — · **Branch:** `feat/web-slides-and-home-about`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) · **Hỗ trợ:** Antigravity AI

## 1. Mục tiêu
Phục vụ buổi thuyết trình mốc Checkpoint 6 (CP6) trực tiếp trên nền tảng web:
- Chuyển toàn bộ nội dung giới thiệu chương trình, góc nhìn cựu học viên và ma trận năng lực SFIA 8 từ trang `/about` sang trang chủ `/` (Home), giúp trang chủ đầy đủ thông tin chiều sâu và phễu chuyển đổi.
- Xây dựng component trình chiếu Slide HTML chuyên nghiệp tại menu `/about` hiển thị **full width**, chuẩn tỉ lệ 16:9, điều khiển bằng phím mũi tên / Space / cảm ứng, phóng toàn màn hình (`F`), tích hợp đồng hồ bấm giờ đếm 6 phút (stopwatch phục vụ vòng cụm C2), và nút nhảy nhanh sang `/personalized-path` để Live Demo.
- **Nâng cấp nội dung slide từ dạng "báo cáo checklist" sang kịch bản Pitching thuyết phục đỉnh cao theo 3 trụ cột:**
  1. **Làm rõ vấn đề:** Kể câu chuyện thực tế "Cơn ác mộng 21:00" của người học đi làm, 3 tầng nỗi đau dựa trên khảo sát 82 học viên (93% phân mảnh gom link, 50% rảnh < 1 tiếng, 87% mù mờ), và nghịch lý của AI Chatbot hiện tại (phân tích 13.494 tin nhắn VLearn: 99.87% thụ động ngồi chờ, 0.13% chủ động, học viên van xin tóm tắt chiếm 8.8%).
  2. **Đưa ra giải pháp:** Định vị đột phá "Action AI thay vì Chatbot nói nhiều", mô hình 2 AI tương hỗ (AI Mentor chạy ngầm ra quyết định và AI Helpdesk 24/7 ở tiền sảnh), trải nghiệm 30 giây tối giản và nguyên tắc an toàn Zero Cost-of-Error.
  3. **Chứng minh giải pháp & Kinh doanh:** Trực quan hoá 2 kịch bản Live Demo (chuẩn 60 phút Lab 3 và Anti-cheat từ chối làm hộ lab), đo lường 95% Quality Bar, mổ xẻ trung thực ca trượt duy nhất G02, mở rộng 50 case kiểm thử khách hàng kép, bài toán kinh tế Unit Economics < 4.800đ/học viên/tháng, phễu 4 vai trò qua duyệt Admin, và tích hợp Discord Activity (+5 XP).

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Trang chủ nhúng Program Overview, Alumni Insights & SFIA Matrix | `spec.md` §1, §3 (Mô tả chương trình đào tạo & khung năng lực) |
| Trang Slide HTML full-width tại `/about` | Chuẩn bị mốc CP6, bám sát `docs/hackathon/cp5/demo-slides.html` & `slide-content.md` |
| Bỏ giới hạn độ rộng container cho `/about` | Trải nghiệm trình chiếu sân khấu (Presentation Mode) |
| Bổ sung 3 trụ cột Pitching sâu sắc (Vấn đề -> Giải pháp -> Chứng minh) | Phản ánh đúng chiều sâu từ `README.md`, `spec.md`, và dữ liệu khảo sát thực tế |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/app/layout.tsx` | Nhúng font Montserrat chuẩn quốc tế hỗ trợ tiếng Việt |
| `codebase/src/components/home/home-landing-view.tsx` | Nhúng `ProgramOverviewSection`, `AlumniInsightsSection`, và `SfiaMatrixView` trước phần FAQ |
| `codebase/src/components/presentation/slides-deck-view.tsx` | Xây dựng lại toàn bộ 12 slide với phong cách Pitching sắc bén, phân chia rõ ràng Tổng - Phân - Hợp, tương phản trực quan, số liệu khảo sát 82 học viên & 13.494 chats, live demo 2 kịch bản, 50 case eval và unit economics |
| `codebase/src/app/about/page.tsx` | Cập nhật render `SlidesDeckView` |
| `codebase/src/components/layout/app-shell-layout.tsx` | Bỏ header/footer/widget khi ở `/about` để bung trọn vẹn toàn màn hình trình chiếu |
| `codebase/src/components/layout/main-header.tsx` | Đổi nhãn menu `ABOUT` thành `SLIDES` |
| `codebase/src/components/layout/app-sidebar.tsx` | Bổ sung mục `Slide Thuyết Trình (CP6)` dẫn tới `/about` trên thanh điều hướng sidebar |
| `PR.md` | Cập nhật chi tiết PR theo quy ước repo |

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
  - Nút `🚀 Mở Trang Live Demo (/personalized-path)` tại Slide 8 hoạt động chuẩn xác.
- Endpoint `http://localhost:3000/about` trả về mã `200 OK`.

## 5. Tài liệu & changelog
- Khớp với kịch bản trình chiếu tại `docs/hackathon/cp5/slide-content.md`, `README.md`, `spec.md` và mã nguồn slide `docs/hackathon/cp5/demo-slides.html`.

## 6. Rủi ro / việc còn lại
- Không có rủi ro kỹ thuật.
