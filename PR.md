# PR: Rà soát văn phong và số liệu trên slide pitch

> **Task:** Chuẩn bị pitch · **Issue:** — · **Branch:** `docs/slides-wording-review`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) · **Hỗ trợ:** Claude Code

## 1. Mục tiêu

Rà soát toàn bộ 12 slide HTML (`/about`) để:

- Văn phong tự nhiên với người nghe Việt Nam: bớt từ phóng đại ("đột phá", "tuyệt đối",
  "siêu", "chặn đứng", "100%"), bớt câu Hán Việt dịch từ tiếng Anh, bớt chêm tiếng Anh
  (Non-tech/Tech-base, Happy Path, Unit Economics, Zero Cost-of-Error…).
- Bỏ từ ngữ thiếu tôn trọng người học ("van xin", "kẻ gian").
- Sửa số liệu và khẳng định không có nguồn hoặc đã cũ, để giám khảo hỏi lại vẫn trả lời được.

Bố cục giao diện giữ nguyên, chỉ đổi chữ.

## 2. Truy vết

| Thay đổi | Nguồn đối chiếu |
|---|---|
| Bỏ "< 4.800đ/học viên" và "biên lợi nhuận > 85%", thay bằng "gọi AI một lần mỗi lộ trình" | Không có nguồn trong `spec.md`, `docs/`, `eval/` |
| Bỏ "Zero Cost-of-Error / An toàn tuyệt đối", thay bằng "AI đề xuất, học viên quyết định" | `spec.md` mục Automation: cost-of-error được đánh giá là cao |
| Slide 9: G02 đã sửa; bộ 50 case AI 44/50 (88%), baseline 50/50 | `eval/run_results.md` §9 (PR #111) |
| Slide 11: bài test từ CV đã có bản đầu; database tài liệu giảng viên đã có | PR #112, #115 (A-02, A-03), #116–#118 (D-02–D-04) |
| Phân vai slide 1 và 12 | Phân vai chốt 18/9 trong `docs/hackathon/tasks-he-thong-4-vai-tro.md` |
| "15–30 phút gom link" thay cho "15–25 phút" | `spec.md`: 77% ở mức 15–30 phút |

## 3. File thay đổi

| File | Thay đổi |
|---|---|
| `codebase/src/components/presentation/slides-deck-view.tsx` | Viết lại chữ trên 12 slide và tiêu đề trong mục lục; rút ngắn tiêu đề và chữ trong thẻ để không tràn khung ở 1366×768 |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử

- `npx tsc --noEmit`: không lỗi.
- Chạy `npm run dev`, mở `/about` ở 1366×768, xem lần lượt 12 slide: không tràn khung.
  Bản sửa đầu làm footer slide 1 bị che; đã rút gọn chữ trong thẻ và kiểm tra lại.
- `npm run verify` chạy qua pre-push hook.

## 5. Tài liệu & changelog

- Không đổi `spec.md`; slide được sửa cho khớp tài liệu hiện có.

## 6. Rủi ro / việc còn lại

- Nếu nhóm có bảng tính chi phí AI trên mỗi học viên, có thể thêm lại con số chi phí kèm nguồn.
- Slide 9 cần cập nhật tiếp khi 6 case AI còn trượt (G01, G19, G27, G28, G29, G47) được sửa.
- Kịch bản nói trong tài liệu pitch (nếu còn dùng "4.800đ", "95%", "ca trượt duy nhất") cần sửa cho khớp.
