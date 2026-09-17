# PR: Đổi trang /planner thành "Lộ trình cá nhân hoá" và dùng đúng tên AI Mentor

> **Task:** đặt tên sản phẩm · **Issue:** — · **Branch:** `feat/ai-mentor-route`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
- **AI Mentor là tên của AI**, không phải tên trang. AI Mentor làm 4 việc:
  1. đọc thông tin học viên;
  2. đọc tài liệu giảng viên tải lên để đưa vào thư viện;
  3. phân tích CV để ra bài test năng lực;
  4. phân tích điểm test để xây lộ trình học.
- Trang được chấm đổi tên thành **Lộ trình cá nhân hoá (Personalized Learning Path)**, là điểm khác biệt chính của sản phẩm. Địa chỉ mới: `/personalized-path`.
- Link cũ `/planner` (đã nộp ở CP2–CP4 và có trong video) tự chuyển sang trang mới. `/ai-mentor` (tên tạm trong nhánh này) cũng tự chuyển.
- README và spec ghi rõ trạng thái thật của 4 việc; thay từ "lát cắt dự thi" bằng "phần được chấm" cho dễ hiểu.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Tên trang, route, chữ hiển thị | `spec.md` phần Phạm vi, §4 |
| Trạng thái thật 4 việc của AI Mentor | Luật đề "ghi rõ phần nào mock"; `AGENTS.md` bất biến #10 |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/app/planner/` → `codebase/src/app/personalized-path/` | Đổi route; tiêu đề trang "Lộ trình cá nhân hoá" |
| `codebase/next.config.ts` | Chuyển hướng `/planner` và `/ai-mentor` → `/personalized-path` |
| `codebase/src/components/planner/study-planner.tsx` | Tiêu đề, dòng phụ "Personalized Learning Path · AI Mentor đề xuất cho bạn", bước 4 "Lộ trình", nút "Tạo lộ trình", nhãn trên cùng dễ hiểu hơn |
| `codebase/src/app/api/roadmap/route.ts` | Nhãn log `[Planner:]` → `[AIMentor:]` |
| `codebase/public/export-flowchart.html`, `codebase/scripts/google-apps-script.js` | Đổi tên hiển thị / comment |
| `.github/CODEOWNERS` | Đường dẫn route mới |
| `README.md`, `spec.md`, `AGENTS.md`, `docs/00–05, 07`, `eval/run_results.md` | Dùng đúng tên; bảng 4 việc của AI Mentor; đường dẫn mới |

**Không đổi:** tên file và biến trong code (`planner-catalog.ts`, `baseline-planner.ts`, `PlannerInput`…), để không làm hỏng bộ test và bộ chạy eval. Prompt (`PLANNER_SYSTEM_PROMPT`) cũng giữ nguyên, vì đổi prompt thì phải chạy lại bộ 20 câu thử.

## 4. Kiểm thử
- Dev server, trình duyệt:
  - `/personalized-path` hiển thị tiêu đề tab "Lộ trình cá nhân hoá | K.AI Labs", 4 bước đúng tên.
  - `/planner` và `/ai-mentor` tự chuyển về `/personalized-path`.
  - Chạy hết một lượt (Non-tech, 60 phút, chưa có key) → ra 3 việc với nhãn "Gợi ý mặc định".
- `npm run verify` chạy qua hook pre-push.
- **Chưa kiểm thử:** lượt có API key thật trên trang mới (logic gọi AI không đổi).

## 5. Tài liệu & changelog
Đã ghi `spec.md` §9. Chuẩn đạt §7 không đổi.

## 6. Rủi ro / việc còn lại
- Menu sidebar "Lộ Trình AI Mentor" vẫn trỏ tới wizard mô phỏng ở `/learning`, chưa trỏ tới `/personalized-path`.
- Giao diện theo vai trò (viewer / học viên / giảng viên / admin) chưa khớp thiết kế: code đang chia theo gói Free/Pro/Admin và chưa có giao diện giảng viên.
- Việc 2 và 3 của AI Mentor chưa làm.
- Sau khi merge cần kiểm tra Vercel đã deploy bản mới (xem nhánh production trong Vercel).
