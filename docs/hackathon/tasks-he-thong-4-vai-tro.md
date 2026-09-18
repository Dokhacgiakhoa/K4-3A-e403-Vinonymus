# Giao việc: xây hệ thống 4 vai trò

> Cập nhật: 18/9 · Người giao: `@Khoa` (PM).
> File này giao việc **xây sản phẩm** (backend, database, giao diện, AI). Việc nộp checkpoint, slide và thuyết trình vẫn ở [`tasks.md`](tasks.md).
> Trạng thái: ⬜ chưa làm · 🔄 đang làm · ✅ xong · ⛔ bị chặn (ghi lý do ở cột Ghi chú).

## 1. Phân vai

| Mảng | Phụ trách | Làm gì | Không làm |
|---|---|---|---|
| **Backend** (.NET) | `@Khoa` | API trong `codebase/backend-core/` theo Clean Architecture | — |
| **Database** | `@Minh` | Bảng, migration, dữ liệu mẫu, index trong `codebase/database/` | API, đăng nhập, code TypeScript phía server |
| **Giao diện** | `@Thanh` (chính) · `@Duc` hỗ trợ | Màn hình Next.js cho 4 vai trò trong `codebase/src/` | Gọi thẳng database; tự viết logic phân quyền |
| **AI** | `@Duc` (chính) · `@Thanh` hỗ trợ | Prompt, guardrail, eval cho AI Mentor và AI Helpdesk | Gọi LLM ngoài `lib/llm/router.ts` |

**Stack đã chốt:** backend **.NET 10** (Clean Architecture + CQRS) · database **PostgreSQL** (host trên Supabase, chỉ dùng làm database) · giao diện **Next.js**. Không thêm backend thứ hai (TypeScript API hay Supabase Auth). Cần đổi stack thì hỏi `@Khoa` trước.

**4 vai trò trong hệ thống:**

| Vai trò | Tên trong backend (`UserRole`) | Được làm gì |
|---|---|---|
| Viewer — khách chưa đăng nhập | (không có tài khoản) | Xem giới thiệu, danh mục lab; hỏi AI Helpdesk 10 câu/ngày |
| Student — học viên | `Visitor`, `Member` | AI Helpdesk không giới hạn + Lộ trình cá nhân hoá |
| Lecturer — giảng viên | `Lecture` | Tải tài liệu lên để AI Mentor đọc vào thư viện |
| Admin | `SuperAdmin` | Duyệt tài khoản, duyệt tài liệu, khoá/đổi vai trò |

## 2. Cách làm việc (bắt buộc)

1. **Mỗi task một nhánh:** `feat/<mã-task>-<tên-ngắn>`, ví dụ `feat/D-02-lecturer-documents`.
2. **Xong task nào commit task đó.** Commit message tiếng Anh, có mã task: `feat(db): add lecturer document tables (D-02)`. **Không** dồn nhiều task, trăm file, hàng chục nghìn dòng vào một commit hay một PR — không ai review được.
3. **Mỗi PR có `PR.md`** ở gốc repo (mẫu: `.claude/skills/pr-md/SKILL.md`). Không push thẳng vào `main`.
4. **Kiểm tra trước khi push:** giao diện/AI chạy `cd codebase && npm run verify`; backend chạy `cd codebase/backend-core && dotnet test` (CI cũng chạy lại ở job `backend-test`). Ghi kết quả thật vào `PR.md`.
5. **Xong task:** đổi trạng thái trong file này ngay trong PR của task đó.
6. Task bị chặn vì chờ người khác: ghi ⛔ và mã task đang chờ, báo trong nhóm. Không tự làm hộ phần của mảng khác.

---

## 3. Backend — `@Khoa`

| ID | Việc | Phụ thuộc | Xong khi | Trạng thái |
|---|---|---|---|---|
| B-01 | Chuyển backend về đúng Clean Architecture: nghiệp vụ ở `Application` (CQRS, MediatR, FluentValidation), EF Core và JWT ở `Infrastructure`, `WebApi` chỉ nhận request | — | Build sạch; đường dẫn và dạng JSON trả về không đổi | ✅ |
| B-02 | Test cho B-01: unit test các use case + test tích hợp gọi HTTP thật (`WebApplicationFactory`) | B-01 | `dotnet test` qua, có test luồng đăng ký → chờ duyệt → duyệt → đăng nhập | ✅ 60 test |
| B-03 | Chọn nơi chạy backend thay Railway, deploy bằng Dockerfile có sẵn, nối database Postgres trên Supabase | D-01 | `GET /api/v1/health` trả `healthy` từ địa chỉ thật | ⬜ |
| B-04 | Tài khoản admin đầu tiên và tài khoản demo cho giám khảo — tạo bằng lệnh vận hành, **không** để mật khẩu trong repo | B-03, D-01 | Đăng nhập được trên web thật; cách tạo ghi trong `docs/06-backend-dotnet.md` | ⬜ |
| B-05 | Nối Vercel với backend: đặt `NEXT_PUBLIC_BACKEND_CORE_URL`, bật chốt đăng nhập | B-03, B-04 | Khách bị giới hạn 10 câu; Student mở được `/personalized-path` | ⬜ |
| B-06 | Giới hạn số lần thử đăng ký/đăng nhập (ASP.NET Rate Limiter) | B-01 | Gửi dồn dập bị trả 429, có test | ⬜ |
| B-07 | API tài liệu giảng viên: tạo nháp → gửi duyệt → admin duyệt → xuất bản → thu hồi; không tự duyệt tài liệu của mình | D-02 | Có test cho từng bước và trường hợp tự duyệt bị chặn | ⬜ |
| B-08 | API tải file tài liệu (PDF, TXT, MD) + xử lý nền: tách đoạn, tạo embedding, lưu vào thư viện | B-07, D-03, A-04 | File tải lên xuất hiện trong kết quả tìm kiếm của thư viện | ⬜ |
| B-09 | API admin: khoá/mở tài khoản, đổi vai trò, xem nhật ký thao tác | D-04 | Có test; admin không tự khoá hay tự hạ quyền mình | ⬜ |
| B-10 | Tài liệu API (OpenAPI/Swagger) để nhóm giao diện đọc | B-01 | Mở được trang tài liệu API khi chạy ở máy | ⬜ |
| B-11 | CI trên GitHub chạy build + `dotnet test` cho backend ở mọi PR vào `main` (job `backend-test` trong `.github/workflows/verify.yml`) | B-02 | Job `backend-test` xanh trên PR | 🔄 |

## 4. Database — `@Minh`

> Migration mới đặt trong `codebase/database/migrations/` theo mẫu tên có sẵn (`YYYYMMDD_mo_ta.sql`). Mỗi migration chạy lại nhiều lần không lỗi (`IF NOT EXISTS`). Đặt tên bảng/cột `snake_case` khớp EF Core (`UseSnakeCaseNamingConvention`).
> PR #69 **không merge nguyên trạng** vì dựng backend TypeScript + Supabase Auth song song với .NET. Phần thiết kế database trong đó (tài liệu giảng viên, lịch sử phiên bản, duyệt, nhật ký, pgvector) được tách sang các task D-02 → D-04 dưới đây.

| ID | Việc | Phụ thuộc | Xong khi | Trạng thái |
|---|---|---|---|---|
| D-01 | Dựng database cho backend .NET trên Supabase: chạy các migration trong `codebase/database/migrations/` lên project Supabase; tạo tài khoản database riêng cho backend (không dùng tài khoản quản trị); đề xuất tách schema riêng để không lẫn với bảng FAQ/RAG đang có | — | `@Khoa` duyệt đề xuất; backend kết nối và đọc được bảng `users` | ⬜ |
| D-02 | Bảng tài liệu giảng viên: `lecture_documents`, lịch sử phiên bản, lịch sử duyệt (lấy thiết kế từ PR #69, đổi sang Postgres thuần, bỏ phần Supabase Auth) | D-01 | Migration chạy được; sơ đồ database cập nhật | ⬜ |
| D-03 | Lưu nội dung tài liệu cho AI Mentor đọc: bảng đoạn văn (chunk) + cột vector (pgvector) + index tìm kiếm | D-02, A-04 (chốt số chiều vector) | Truy vấn tìm 5 đoạn gần nhất chạy được trên dữ liệu mẫu | ⬜ |
| D-04 | Nhật ký thao tác (ai làm gì, lúc nào) cho duyệt tài khoản và tài liệu | D-01 | Migration chạy được; có index theo thời gian | ⬜ |
| D-05 | Dữ liệu mẫu: chuyên đề + bài học khớp catalog lab hiện có; kiểm tra lại 3 file seed đang có, bỏ phần trùng | D-01 | Seed chạy trên database trống không lỗi, chạy lần 2 không nhân đôi dữ liệu | ⬜ |
| D-06 | Cập nhật sơ đồ database (`docs/diagrams/database-class-diagram.mmd`) theo đúng các bảng đang có | D-02 → D-04 | Sơ đồ khớp migration | ⬜ |

## 5. Giao diện — `@Thanh` (chính), `@Duc` hỗ trợ

> Giao diện chỉ gọi backend qua `codebase/src/lib/api/*`. Quyền thật do backend kiểm tra; giao diện chỉ ẩn/hiện cho đúng vai trò.

| ID | Việc | Phụ thuộc | Xong khi | Trạng thái |
|---|---|---|---|---|
| U-01 | Menu theo vai trò: đọc vai trò từ `GET /api/v1/auth/me`, ánh xạ `Visitor`/`Member` → Student, `Lecture` → Lecturer, `SuperAdmin` → Admin; bỏ cách phân loại cũ Free/Pro/Admin (`tier`, `plan` trong `lib/client-storage.ts`, cờ `isPro` trong `components/layout/app-sidebar.tsx`) | — | Mỗi vai trò chỉ thấy menu của mình | ⬜ |
| U-02 | Sửa mục menu "Lộ Trình AI Mentor" trong `app-sidebar.tsx` đang dẫn tới wizard giả (`/learning?mode=ai_roadmap`) → trỏ về `/personalized-path` | — | Bấm menu mở đúng tính năng thật | ⬜ |
| U-03 | Viewer: hiện số câu AI Helpdesk còn lại trong ngày; hết lượt thì mời đăng ký | — | Câu thông báo đúng khi còn và khi hết lượt | ⬜ |
| U-04 | Đăng ký: báo rõ "tài khoản đang chờ duyệt"; đăng nhập bằng tài khoản chờ duyệt/bị từ chối hiện đúng câu backend trả về | — | Thử đủ 3 trạng thái: chờ duyệt, bị từ chối, đã duyệt | ⬜ |
| U-05 | Lecturer: danh sách tài liệu của mình, tạo nháp, gửi duyệt | B-07 | Làm hết một lượt trên máy với backend chạy thật | ⬜ |
| U-06 | Lecturer: tải file tài liệu lên, xem trạng thái xử lý | B-08 | File tải lên chuyển sang "đã xử lý" | ⬜ |
| U-07 | Admin: màn hình duyệt tài liệu (xem, duyệt, yêu cầu sửa, xuất bản, thu hồi) | B-07 | Làm hết một lượt với 1 tài liệu mẫu | ⬜ |
| U-08 | Admin: khoá/mở tài khoản, đổi vai trò, xem nhật ký | B-09 | Làm hết một lượt; tự khoá mình bị chặn | ⬜ |

## 6. AI — `@Duc` (chính), `@Thanh` hỗ trợ

> Mọi lời gọi LLM đi qua `codebase/src/lib/llm/router.ts`. Đổi prompt nào phải chạy lại golden set và ghi một dòng vào `eval/run_results.md`. Link hiển thị cho học viên chỉ lấy từ catalog.

| ID | Việc | Phụ thuộc | Xong khi | Trạng thái |
|---|---|---|---|---|
| A-01 | Sửa các case golden set đang lỗi (xem `eval/run_results.md`), không đổi chuẩn đạt trong `spec.md` §7 | — | Số đạt mới ghi vào `eval/run_results.md`, kể cả khi không tăng | ⬜ |
| A-02 | AI Mentor nhiệm vụ 3: đọc CV → sinh bài test năng lực (hiện đang là quy tắc cố định) — thiết kế prompt, schema đầu ra, thêm case vào golden set | — | Có ≥5 case eval cho phần này, có số đo thật | ⬜ |
| A-03 | AI Mentor nhiệm vụ 4: điểm bài test → lộ trình lấy tài liệu từ thư viện | A-02 | Lộ trình chỉ chứa tài liệu có trong thư viện; có case eval | ⬜ |
| A-04 | Chốt cách đọc tài liệu giảng viên: chia đoạn thế nào, dùng model embedding nào, **bao nhiêu chiều vector** (để Minh làm D-03) | — | Ghi quyết định vào `docs/04-ai-pipeline.md`; báo `@Minh` và `@Khoa` | ⬜ |
| A-05 | AI Helpdesk trả lời từ thư viện tài liệu giảng viên (ngoài FAQ đang có), có trích nguồn | B-08, D-03 | Câu hỏi về tài liệu mới tải lên được trả lời đúng, kèm nguồn | ⬜ |
| A-06 | Kiểm tra chống "lệnh trong dữ liệu" cho CV và tài liệu tải lên (ví dụ CV có câu "bỏ qua hướng dẫn") | A-02, A-05 | Có case eval riêng, AI không làm theo lệnh trong dữ liệu | ⬜ |

---

## 7. Thứ tự nên làm

Việc làm được ngay, không chờ ai: **B-01, B-02, D-01, D-05, U-01 → U-04, A-01, A-02, A-04**.

```mermaid
flowchart LR
    D01[D-01 Database trên Supabase] --> B03[B-03 Deploy backend] --> B04[B-04 Tài khoản admin/demo] --> B05[B-05 Bật đăng nhập trên web]
    D01 --> D02[D-02 Bảng tài liệu] --> B07[B-07 API tài liệu] --> U05[U-05 Lecturer] & U07[U-07 Admin duyệt tài liệu]
    A04[A-04 Chốt embedding] --> D03[D-03 Chunk + vector]
    D02 --> D03 --> B08[B-08 Tải file + xử lý nền] --> U06[U-06 Lecturer tải file] & A05[A-05 Helpdesk đọc thư viện]
    D01 --> D04[D-04 Nhật ký] --> B09[B-09 API admin] --> U08[U-08 Admin khoá/đổi vai trò]
    A02[A-02 CV → bài test] --> A03[A-03 Điểm → lộ trình]
```
