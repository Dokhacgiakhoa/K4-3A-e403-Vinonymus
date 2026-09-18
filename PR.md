# PR: Tích hợp báo cáo phân tích khảo sát học viên sạch và ẩn danh hóa vào Admin Cockpit

> **Task:** Admin Survey Analytics · **Issue:** — · **Branch:** `feat/admin-survey-analytics`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) · **Hỗ trợ:** Antigravity AI

## 1. Mục tiêu
Nâng cấp bảng điều khiển Admin Cockpit (`/admin`) để trực quan hóa toàn bộ kết quả phân tích thực nghiệm từ khảo sát học viên Khóa 4 (Track E Evidence). Tích hợp engine làm sạch dữ liệu (Data Cleansing Engine), khử trùng lặp, lọc các bản ghi thử nghiệm, và đóng gói tập dữ liệu mẫu đã ẩn danh hóa 100% thông tin cá nhân (PII) theo đúng Bất biến #1 của repo.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Giao diện phân tích khảo sát Admin | `spec.md` §1 (Evidence khảo sát học viên n = 82, n = 51 sạch) |
| Engine làm sạch và ẩn danh hóa PII | `AGENTS.md` Bất biến #1 (Không commit PII, email, số tài khoản) |
| Tích hợp vào Admin Cockpit View | `codebase/src/components/views/admin/admin-cockpit-dashboard-view.tsx` |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/components/views/admin/admin-cockpit-dashboard-view.tsx` | Chuyển đổi khu vực mock thanh toán sang nhúng component `<SurveyAnalyticsView />` và cập nhật 4 thẻ KPI khảo sát thực tế |
| `codebase/src/components/admin/survey-analytics-view.tsx` | Component hiển thị báo cáo khảo sát (chỉ số làm sạch, biểu đồ phân phối, xếp hạng nỗi đau & tính năng, xuất CSV) |
| `codebase/src/data/survey-cleaned-sample.json` | Bộ dữ liệu khảo sát mẫu đã làm sạch và ẩn danh hóa 100% PII |
| `codebase/src/lib/survey/data-cleaner.ts` | Engine làm sạch dữ liệu, khử trùng lặp, tính toán KPI và biểu đồ phân phối |
| `codebase/tests/unit/data-cleaner.test.ts` | 5 unit test kiểm thử logic làm sạch dữ liệu và ẩn danh hóa an toàn |
| `.claude/launch.json` | Cấu hình chạy local dev server |
| `PR.md` | Bản mô tả PR theo quy ước repo |

## 4. Kiểm thử
- `npm run verify` chạy trong `codebase/`:
  - `next lint`: Hoàn thành, 0 lỗi.
  - `tsc --noEmit`: Typecheck sạch 100%.
  - `vitest run`: 17/17 test files passed, 94/94 tests passed (bao gồm cả 5 test mới trong `data-cleaner.test.ts`).
  - `audit`: Đã rà soát 53 file FAQ, 0 lỗi.
  - `next build`: Biên dịch production thành công, 24/24 static pages generated.
- Kiểm thử hiển thị không phụ thuộc file gitignored `survey-responses-raw.json`.

## 5. Tài liệu & changelog
- Dữ liệu và phương pháp làm sạch khớp với ghi chú trong `docs/research/survey-data-review.md` và `spec.md` §1.

## 6. Rủi ro / việc còn lại
- Không có. File raw JSON chứa PII vẫn được giữ nguyên trong `.gitignore` không bị rò rỉ.
