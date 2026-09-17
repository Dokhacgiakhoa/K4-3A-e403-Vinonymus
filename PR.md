# PR: Chặn commit file câu trả lời khảo sát gốc

> **Task:** bảo mật dữ liệu (ngoài bảng task) · **Issue:** — · **Branch:** `chore/ignore-raw-survey`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
File `codebase/src/data/survey-responses-raw.json` chứa câu trả lời khảo sát gốc, kèm họ tên, email và số tài khoản nhận thưởng. `AGENTS.md` bất biến #1 cấm commit loại dữ liệu này, và repo đang công khai. PR này thêm file vào `.gitignore` để không ai vô tình commit.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Ignore file khảo sát gốc | `AGENTS.md` bất biến #1; mục "Bảo mật dữ liệu" trong README |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/.gitignore` | Thêm `/src/data/survey-responses-raw.json` |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Đã chạy `git check-ignore` trên máy: file khảo sát gốc được bỏ qua, không còn hiện trong `git status`.
- `npm run verify` chạy qua hook pre-push khi push branch này.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9 vì không đổi sản phẩm.

## 6. Rủi ro / việc còn lại
- Component `codebase/src/components/admin/survey-analytics-view.tsx` (chưa commit) đang `import` thẳng file này. Nếu commit component đó, build trên CI/Vercel sẽ lỗi vì thiếu file. Trước khi commit phải chuyển sang đọc dữ liệu ở server hoặc dùng bản đã ẩn danh với tên file khác.
- 40 dòng trong file này có giờ nộp tăng đều 1 phút 1 giây, nghi là dữ liệu thử; không dùng làm bằng chứng.
