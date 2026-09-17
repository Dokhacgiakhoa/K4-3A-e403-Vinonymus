# API 4 Role - FE Handoff

Tài liệu này là bản đọc nhanh để FE biết mỗi endpoint phục vụ chức năng nào.
Schema request/response chi tiết theo từng endpoint nằm ở [api-4-roles-schema-detail.md](api-4-roles-schema-detail.md). Contract máy đọc được nằm ở [role-api-schema.md](role-api-schema.md), OpenAPI ở [role-api.openapi.json](role-api.openapi.json), và Postman ở [role-api.postman_collection.json](role-api.postman_collection.json).

## Quy ước chung

- Base URL: `/api/v1`.
- Guest là người chưa đăng nhập, không phải role trong database.
- Role database: `student`, `lecture`, `admin`.
- Endpoint bảo vệ dùng `Authorization: Bearer <accessToken>`.
- Thành công trả `{ "data": ... }`; danh sách có thêm `meta`.
- Lỗi trả `{ "error": { "code": string, "message": string } }`.
- `401`: chưa đăng nhập/token sai; `403`: sai role hoặc tài khoản bị khóa; `404`: không tồn tại/ngoài ownership; `409`: conflict trạng thái hoặc revision.
- Link học viên nhìn thấy phải lấy từ catalog, không lấy từ nội dung LLM.

## Quan hệ với luồng README

README mô tả lát cắt demo cốt lõi, không đăng nhập:

`/personalized-path` -> `POST /api/roadmap` -> validate Zod + luật cứng -> LLM router hoặc baseline -> checklist tối đa 3 việc -> `localStorage`.

Trong code hiện tại, trang tương ứng đang được triển khai tại `/planner` (`codebase/src/app/planner/page.tsx`). `/personalized-path` là tên trong flow README, không phải route Next.js đang tồn tại.

Các endpoint `/api/v1` bên dưới là lớp mở rộng cho tài khoản và vận hành 4 role. Không thay thế luồng Planner cốt lõi trong README. Vì vậy:

- Guest dùng đúng Planner không lưu của README.
- Student có thể dùng lại cùng input nền tảng, thời gian, lab và ghi chú, sau đó lưu roadmap qua API v1 nếu đã đăng nhập.
- Lecture và Admin quản lý catalog metadata/học liệu ở lớp vận hành mở rộng; các link Planner vẫn phải lấy từ catalog.
- Luồng quản trị repo trong README (PR -> CI -> merge -> Vercel -> eval) vẫn là quy trình cập nhật catalog/prompt chuẩn; Admin API không thay thế quy trình đó.

## Guest

### Authentication

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/auth/register` | Đăng ký tài khoản Student; không cho client tự truyền role/tier. |
| `POST` | `/auth/login` | Đăng nhập, nhận access token, refresh token và profile. |
| `POST` | `/auth/refresh` | Đổi refresh token lấy cặp token mới. |
| `GET` | `/catalog/labs` | Xem lab, learning item và link công khai đã được allowlist. |

Planner thử không lưu của Guest dùng endpoint legacy `POST /api/roadmap`, không dùng `/api/v1`, và bắt đầu tại `/personalized-path` theo README. Luật cứng xử lý thời gian dưới 30 phút, lab lạ và yêu cầu ngoài phạm vi trước khi gọi LLM; lỗi provider hoặc thiếu key trả baseline có nhãn `Gợi ý mặc định`.
Guest cũng có thể dùng các API công khai legacy `/api/chat`, `/api/chat/feedback`, `/api/faqs`, `/api/health`.

## Student

### Profile và Mentor

Student đăng nhập sau khi muốn lưu kết quả Planner. Luồng input giữ nguyên README: nền tảng -> số phút + lab -> ghi chú -> tạo lộ trình. API v1 bổ sung bước phân tích/lưu DB, không thay đổi nguyên tắc AI hỏi lại hoặc từ chối.

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/me` | Lấy profile và role hiện tại. |
| `PATCH` | `/me` | Cập nhật display name, nền tảng, mục tiêu và thời gian học. |
| `GET` | `/learning/nodes` | Lấy learning node từ catalog để chọn lab/item. |
| `POST` | `/mentor/analyze` | Phân tích nền tảng, mục tiêu, thời gian và CV text; trả AI hoặc baseline. |
| `POST` | `/mentor/roadmap` | Tạo và lưu roadmap tối đa 3 task; trả `plan`, `clarify` hoặc `refuse`. |

`clarify` và `refuse` là response thành công HTTP 200 nhưng không tạo roadmap mới.

### Roadmap và progress

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/mentor/roadmaps` | Liệt kê roadmap của Student hiện tại. |
| `GET` | `/mentor/roadmaps/{id}` | Xem một roadmap thuộc Student hiện tại. |
| `DELETE` | `/mentor/roadmaps/{id}` | Xóa roadmap cá nhân. |
| `PATCH` | `/mentor/roadmaps/{id}/tasks/{itemId}` | Đánh dấu task `todo`, `in_progress` hoặc `completed`. |
| `GET` | `/learning/progress` | Xem tổng hợp tiến độ các roadmap cá nhân. |
| `POST` | `/learning/progress` | Alias cập nhật progress bằng `roadmapId` và `nodeId`. |

Server kiểm tra roadmap, task và ownership; Student không thể cập nhật task tự tạo hoặc roadmap của người khác.

### Học liệu

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/learning/documents` | Liệt kê metadata tài liệu đã published. |
| `GET` | `/learning/documents/{id}` | Xem metadata tài liệu published, không lộ path/hash nội bộ. |

## Lecture

Lecture thuộc luồng vận hành mở rộng, không nằm trên happy path của Guest Planner. Lecture chuẩn bị metadata tài liệu để Admin hoặc Lecture khác kiểm duyệt; sau khi publish, Student có thể thấy metadata học liệu trong luồng học.

### Quản lý tài liệu metadata

Các endpoint dưới đây quản lý metadata, chưa upload bytes hoặc parse file.
Lecture chỉ đọc/sửa tài liệu của mình; Admin được truy cập toàn hệ thống.

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/lecture/documents` | Liệt kê tài liệu của Lecture; Admin có thể xem toàn bộ. |
| `POST` | `/lecture/documents` | Tạo bản nháp metadata PDF/TXT/Markdown. |
| `GET` | `/lecture/documents/{id}` | Xem chi tiết metadata trong phạm vi ownership. |
| `PUT` | `/lecture/documents/{id}` | Sửa metadata, tăng revision và tạo version snapshot. |
| `DELETE` | `/lecture/documents/{id}` | Xóa mềm tài liệu chưa published. |

### Review và publication

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/lecture/documents/{id}/submit` | Chuyển bản nháp sang trạng thái chờ review. |
| `POST` | `/lecture/documents/{id}/review` | Lecture khác hoặc Admin duyệt/reject/request changes revision hiện tại. |
| `POST` | `/lecture/documents/{id}/publish` | Lecture khác hoặc Admin publish revision đã approved. |
| `POST` | `/lecture/documents/{id}/archive` | Thu hồi tài liệu khỏi danh sách Student. |
| `GET` | `/lecture/documents/{id}/versions` | Xem lịch sử snapshot metadata. |
| `GET` | `/lecture/documents/{id}/reviews` | Xem lịch sử quyết định review. |

Workflow tài liệu:

`draft -> review -> approved revision -> published`

Lecture không được tự review hoặc tự publish tài liệu của mình. Mọi mutation cần gửi `revision` hiện tại; revision cũ trả `409`.

## Admin

Admin thuộc luồng quản trị mở rộng. README vẫn giữ quy trình catalog/prompt qua PR, CI, CODEOWNERS và eval; các endpoint Admin dưới đây phục vụ quản lý user và nội dung metadata trong hệ thống v1.

### Quản lý user

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/admin/users` | Liệt kê profile, phân trang và lọc theo role. |
| `GET` | `/admin/users/{id}` | Xem profile người dùng. |
| `PATCH` | `/admin/users/{id}/role` | Đổi role/tier cho user khác. |
| `PATCH` | `/admin/users/{id}/status` | Khóa hoặc mở tài khoản user khác. |

Admin không được tự đổi role hoặc tự khóa tài khoản của mình.

### Moderation tài liệu

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/admin/documents` | Liệt kê toàn bộ tài liệu để moderation. |
| `GET` | `/admin/documents/{id}` | Xem chi tiết tài liệu bất kỳ. |
| `POST` | `/admin/documents/{id}/review` | Review revision tài liệu. |
| `POST` | `/admin/documents/{id}/publish` | Publish revision đã approved. |
| `POST` | `/admin/documents/{id}/archive` | Archive tài liệu khỏi Student. |
| `DELETE` | `/admin/documents/{id}` | Xóa mềm tài liệu chưa published. |

### Audit và analytics

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/admin/audit` | Xem nhật ký thao tác user và tài liệu. |
| `GET` | `/admin/analytics` | Xem số user, active user, tài liệu published, pending review và roadmap. |

## Không thuộc contract hiện tại

- Upload/download file bytes và signed URL.
- Parse PDF/TXT/Markdown, chunking, embedding, Qdrant và RAG vào Chat.
- Password reset, MFA, thanh toán VIP và chứng chỉ.
- Rate limit phân tán production.

## Nguồn contract

- Registry triển khai: `codebase/src/backend/platform/endpoints.ts`
- Route: `codebase/src/app/api/v1/`
- Test: `codebase/src/backend/platform/`
- Schema đầy đủ: [role-api-schema.md](role-api-schema.md)
- Schema chi tiết từng endpoint: [api-4-roles-schema-detail.md](api-4-roles-schema-detail.md)
- Sơ đồ Guest: [guest-flow.mmd](guest-flow.mmd)
- Sơ đồ Student: [student-flow.mmd](student-flow.mmd)
- Sơ đồ Lecture: [lecture-flow.mmd](lecture-flow.mmd)
- Sơ đồ Admin: [admin-flow.mmd](admin-flow.mmd)
