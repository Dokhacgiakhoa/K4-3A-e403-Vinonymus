# PR: Tách lớp backend cho chat feedback và đồng bộ tài liệu kiến trúc/API

> **Task:** T4-06 (#24) · **Issue:** #24 · **Branch:** `BE` · **PR:** #47
> **Người thực hiện:** Trần Nhật Minh (`@Minh`) · **Review, gỡ conflict:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code

## 1. Mục tiêu
- Tách `POST /api/chat/feedback` thành các lớp controller → service → repository. Dữ liệu vào được kiểm bằng zod, lỗi DB không lộ ra ngoài.
- Cập nhật `docs/02-kien-truc.md` và `docs/03-api.md` cho khớp code đã build (T4-06). Ghi rõ widget AI Helpdesk và AI Mentor 4 sprint ở `/learning` là mô phỏng.
- Làm gọn `lib/llm/router.ts`, không đổi hành vi: vẫn giữ thứ tự provider, số lần thử lại và cách xử lý key sai.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Feedback backend | Legacy FR-18 (đổi ý đánh giá); `AGENTS.md` bất biến #6 (validate bằng zod), #7 (không tắt RLS: vẫn ghi qua RPC) |
| Tài liệu kiến trúc/API | T4-06; `AGENTS.md` "Code lệch tài liệu → sửa cho khớp" |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/backend/**` | Controller, service, repository Supabase (gọi RPC `submit_feedback`), request/response schema, enum `FeedbackRating`/`FeedbackReason` |
| `codebase/src/app/api/chat/feedback/route.ts` | Chỉ còn gọi controller |
| `codebase/src/types/database.ts` | Thêm kiểu hàm `submit_feedback` theo migration 0014 |
| `codebase/src/lib/llm/router.ts`, `types.ts` | Làm gọn code; bỏ `fpt` khỏi `MODEL_CATALOG` (hằng này hiện không được dùng) |
| `codebase/tests/unit/backend-feedback.test.ts` | 8 unit test cho feedback |
| `codebase/.gitignore` | Bỏ qua `/supabase/.temp/` |
| `docs/02-kien-truc.md`, `docs/03-api.md` | Đồng bộ với code; thêm mục chi tiết `POST /api/chat/feedback` |
| `docs/diagrams/database-class-diagram.mmd` | Sơ đồ lớp DB (chuyển từ `supabase/migrations/`) |
| `README.md`, `spec.md` §9, `docs/hackathon/tasks.md` | Gộp với `main`; T4-06 → ✅ |

**Chỉnh sửa khi review (Khoa):**
- Gỡ conflict với `main` ở 5 file. Riêng `03-api.md`: giữ câu `clarify`/`refuse` đúng nguyên văn code, giữ ví dụ `15/90 phút` của Minh (đúng hơn bản `main`).
- Bỏ kiểu bảng `lecture_documents` khỏi `database.ts`: chưa có migration tạo bảng (bất biến #8) và không có code nào dùng.
- Bỏ script `seed:lectures`: file `scripts/seed-lecture-documents.ts` không tồn tại.
- Chuyển sơ đồ `.mmd` ra khỏi `supabase/migrations/`, vì thư mục này chỉ để chứa SQL.
- Xoá `codebase/docs/04-API-SPEC.md`: bản copy tài liệu legacy, ghi header `X-Openrouter-Key` không có trong code và trỏ tới `src/backend/README.md` không tồn tại. Phần mô tả feedback đã chuyển sang `docs/03-api.md`.

## 4. Kiểm thử
- CI `verify` của nhánh `BE` xanh trước khi gỡ conflict.
- `npm run verify` chạy lại qua hook pre-push sau khi gỡ conflict và sửa.
- **Chưa kiểm thử:** gửi feedback thật lên Supabase từ giao diện. Component chat gọi API chưa được gắn vào trang nào, nên hiện không có đường nào gửi feedback từ UI.

## 5. Tài liệu & changelog
Đã có dòng trong `spec.md` §9 ("Đồng bộ lại tài liệu kiến trúc/API…").

## 6. Rủi ro / việc còn lại
- Nếu cần bảng `lecture_documents`, phải thêm migration SQL trước rồi mới thêm lại kiểu.
- Router bị bỏ các comment giải thích vì sao thử lại lỗi 503/429; nên bổ sung lại một dòng.
- Bỏ `fpt` khỏi `MODEL_CATALOG` chưa ghi lý do; cần xác nhận với Minh.

Closes #24
