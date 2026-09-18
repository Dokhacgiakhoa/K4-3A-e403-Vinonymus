# PR: Tái thiết kế Slide 1 chuẩn Bìa Keynote và hoàn thiện nội dung Pitching cho BGK

> **Task:** CP6 Slide Presentation & UX Polish · **Issue:** — · **Branch:** `feat/web-slides-and-home-about`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) · **Hỗ trợ:** Antigravity AI

## 1. Mục tiêu
Theo phản hồi trực tiếp của diễn giả và đóng vai trò Nhà đầu tư / Ban giám khảo chấm thi Hackathon:
- **Tái thiết kế toàn diện Slide 1 (Trang bìa):**
  - Giới thiệu đầy đủ thông tin định danh: Tên dự án (**Adaptive Learning System**), Đề tài (Mini Hackathon AI · Track E Làn mở AI20K · Phòng E403 · Cụm C2), Tên nhóm (**Vinonymus - Khoá 4 - Lớp 3A**), Tên giải pháp (**AI Mentor & AI Helpdesk**), Tuyên ngôn giá trị (Slogan).
  - Bổ sung hiệu ứng nền mỹ thuật ánh sáng xanh mờ ảo (Aesthetic Glow Accents / Radial Mesh) tạo chiều sâu và đẳng cấp bài thuyết trình.
  - Thay thế các ô số liệu thô sơ bằng 4 khối định vị dự án chiến lược: *Bài toán thực tế*, *Mô hình sản phẩm 2 AI*, *Lát cắt chấm thi (Demo Scope)*, và *Hiệu quả kinh tế Unit Economics*.
  - Bổ sung đầy đủ danh sách 4 thành viên cùng chuyên môn đảm nhiệm theo luật Vibe-Coding.
- **Loại bỏ toàn bộ nhãn thời gian nội bộ / ghi chú nháp:**
  - Xoá sạch các dòng chữ hiển thị thời gian tập dượt (`~1.5 Phút`, `30s thao tác`, `Live Demo (60-80s)`) vốn chỉ dành cho diễn giả nhẩm nháp chứ không phải nội dung để Ban giám khảo chấm điểm.
  - Tối ưu hóa các luận điểm trình bày sắc bén dựa trên việc khai phá trực tiếp từ khảo sát 82 học viên (Google Sheet) và 13.494 lượt chat thực tế.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Trang bìa chuẩn Keynote / BGK (Định danh dự án, 4 trụ cột, thành viên) | Đóng vai Nhà đầu tư & BGK chấm thi CP6 |
| Xoá nhãn thời gian diễn tập nội bộ trên tất cả các slide | Nâng cao tính chuyên nghiệp của bài Pitching |
| Dữ liệu khảo sát n = 82 học viên (Google Sheet) | `spec.md` §1 & `docs/research/survey-data-review.md` |
| Dữ liệu khai phá 13.494 lượt chat VLearn LMS | `docs/research/evidence-mining.md` |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/components/presentation/slides-deck-view.tsx` | • Tinh chỉnh toàn bộ hệ thống mũi tên: tạo component `FlowArrow` dùng icon SVG `ArrowRight` với stroke đậm `stroke-[2.75]`, căn giữa hoàn hảo và có màu sắc đồng bộ, thay thế hoàn toàn các ký tự text mũi tên mảnh và lệch baseline.<br/>• Sửa Slide 1: Xử lý triệt để việc lặp từ giữa Thẻ 1 ("Bội Thực & Lạc Lối Tự Học") và Thẻ 3 ("AI Mentor Ra Quyết Định"); bọc 4 thành viên đội ngũ trong các thẻ chip bo tròn gọn gàng.<br/>• Sửa Slide 2: Thiết kế lại tiêu đề 3 trụ cột dạng pill-badge không bị ngắt chữ "Thực Chứng"; bổ sung các vòng tròn mũi tên kết nối trực quan giữa Cột I ➔ Cột II ➔ Cột III.<br/>• Sửa Slide 4: Chuyển thẻ Action AI sang tông màu Emerald (Xanh lá) đối xứng Đỏ/Xanh lá sắc nét.<br/>• Sửa Slide 6: Cập nhật thẻ AI Helpdesk sang tông màu Indigo/Tím phân vai rành mạch với AI Mentor.<br/>• Sửa Slide 7 & 8: Thay icon bảo vệ Guardrail dạng khiên, nâng cấp nút CTA "🚀 MỞ TRANG DEMO THẬT" với gradient, vòng sáng `ring-4` nổi bật.<br/>• Sửa Slide 10: Tách chỉ số `< 4.800đ` thành stat callout lớn tạo điểm nhấn tài chính bền vững. |
| `PR.md` | Cập nhật tài liệu PR theo quy ước |

## 4. Kiểm thử
- `npm run verify` / `tsc --noEmit` & `vitest run` chạy trong `codebase/`:
  - `tsc --noEmit`: Typecheck sạch 100% (0 lỗi).
  - `vitest run`: 17/17 test files passed, 94/94 tests passed.
- Browser Subagent (`/browser`) đã review toàn diện 12 slides tại `http://localhost:3000/about`:
  - Đã khắc phục triệt để lỗi mũi tên mảnh, lệch baseline và ngắt dòng xấu.
  - Phân tầng màu sắc, độ tương phản (Contrast) và khoảng đệm (Paddings) đạt chuẩn UX/UI thuyết trình.
  - Slide 1 hết sạch hiện tượng lặp từ giữa Bài toán thực tế và Lát cắt chấm thi.
  - Nút CTA mở live demo nổi bật, kích hoạt chuyển tiếp mượt mà.

## 5. Tài liệu & changelog
- Khớp với `spec.md`, `README.md` và tinh thần phản biện của mốc CP6.

## 6. Rủi ro / việc còn lại
- Không có rủi ro kỹ thuật. Sẵn sàng cho buổi pitching E403.
