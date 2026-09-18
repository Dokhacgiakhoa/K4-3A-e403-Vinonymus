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
| `codebase/src/components/presentation/slides-deck-view.tsx` | Thiết kế lại Slide 1 (Trang bìa) chuẩn Keynote với đầy đủ tên dự án, nhóm Vinonymus, giải pháp 2 AI, 4 trụ cột định vị, nền ambient glow, danh sách thành viên; xoá bỏ toàn bộ nhãn thời gian nội bộ trên các slide |
| `PR.md` | Cập nhật tài liệu PR theo quy ước |

## 4. Kiểm thử
- `npm run verify` chạy trong `codebase/`:
  - `tsc --noEmit`: Typecheck sạch 100%.
  - `vitest run`: 17/17 test files passed, 94/94 tests passed.
  - `audit`: 53/53 FAQ files verified (0 lỗi, 0 cảnh báo).
- Kiểm tra trực tiếp trên trình duyệt `http://localhost:3000/about`:
  - Slide 1 hiển thị bìa dự án hoành tráng, chuyên nghiệp, cân đối và đầy đủ thông tin.
  - Không còn bất kỳ nhãn thời gian nội bộ gây phản cảm cho người xem.
  - Phím tắt `F` (Fullscreen), `Space` / `→` (Next), `←` (Prev), `T` (Timer 6 phút) hoạt động trơn tru.

## 5. Tài liệu & changelog
- Khớp với `spec.md`, `README.md` và tinh thần phản biện của mốc CP6.

## 6. Rủi ro / việc còn lại
- Không có rủi ro kỹ thuật.
