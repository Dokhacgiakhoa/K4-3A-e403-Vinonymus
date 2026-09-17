# API 4 Role - FE Handoff

Tài liệu này là bản đọc nhanh để FE biết mỗi endpoint phục vụ chức năng nào.
Contract chi tiết về schema request/response nằm ở [role-api-schema.md](role-api-schema.md), OpenAPI ở [role-api.openapi.json](role-api.openapi.json), và Postman ở [role-api.postman_collection.json](role-api.postman_collection.json).

## Quy ước chung

- Base URL: `/api/v1`.
- Guest là người chưa đăng nhập, không phải role trong database.
- Role database: `student`, `lecture`, `admin`.
- Endpoint bảo vệ dùng `Authorization: Bearer <accessToken>`.
- Thành công trả `{ "data": ... }`; danh sách có thêm `meta`.
- Lỗi trả `{ "error": { "code": string, "message": string } }`.
- `401`: chưa đăng nhập/token sai; `403`: sai role hoặc tài khoản bị khóa; `404`: không tồn tại/ngoài ownership; `409`: conflict trạng thái hoặc revision.
- Link học viên nhìn thấy phải lấy từ catalog, không lấy từ nội dung LLM.

## Guest

### Authentication

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/auth/register` | Đăng ký tài khoản Student; không cho client tự truyền role/tier. |
| `POST` | `/auth/login` | Đăng nhập, nhận access token, refresh token và profile. |
| `POST` | `/auth/refresh` | Đổi refresh token lấy cặp token mới. |
| `GET` | `/catalog/labs` | Xem lab, learning item và link công khai đã được allowlist. |

Planner thử không lưu của Guest dùng endpoint legacy `POST /api/roadmap`, không dùng `/api/v1`.
Guest cũng có thể dùng các API công khai legacy `/api/chat`, `/api/chat/feedback`, `/api/faqs`, `/api/health`.

## Student

### Profile và Mentor

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

### Học liệu và quiz

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/learning/documents` | Liệt kê metadata tài liệu đã published. |
| `GET` | `/learning/documents/{id}` | Xem metadata tài liệu published, không lộ path/hash nội bộ. |
| `GET` | `/quizzes` | Liệt kê quiz đã published. |
| `GET` | `/quizzes/{id}` | Xem đề quiz; không trả đáp án đúng/giải thích trước khi nộp. |
| `POST` | `/quizzes/{id}/submissions` | Nộp bài, server chấm điểm và lưu attempt; `requestId` chống nộp trùng. |
| `GET` | `/quizzes/submissions` | Liệt kê lịch sử attempt của Student hiện tại. |
| `GET` | `/quizzes/submissions/{id}` | Xem điểm và giải thích của attempt thuộc Student hiện tại. |

## Lecture

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

### Soạn quiz

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/lecture/quizzes` | Liệt kê quiz do Lecture soạn; Admin xem toàn bộ. |
| `POST` | `/lecture/quizzes` | Tạo quiz có câu hỏi, đáp án đúng và giải thích. |
| `GET` | `/lecture/quizzes/{id}` | Xem quiz đầy đủ trong phạm vi ownership/quyền Admin. |
| `PUT` | `/lecture/quizzes/{id}` | Sửa quiz và tăng revision. |
| `DELETE` | `/lecture/quizzes/{id}` | Xóa mềm quiz đã archive. |
| `POST` | `/lecture/quizzes/{id}/publish` | Publish quiz để Student làm. |
| `POST` | `/lecture/quizzes/{id}/archive` | Ngừng nhận bài cho quiz. |

Quiz Lecture không có bước review độc lập; cần archive trước khi sửa/xóa quiz đã publish.

## Admin

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

Admin dùng nhóm `/lecture/quizzes` để quản trị quiz vì các route Lecture cho phép cả Admin.

### Audit và analytics

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/admin/audit` | Xem nhật ký thao tác user, tài liệu và quiz. |
| `GET` | `/admin/analytics` | Xem số user, active user, tài liệu published, pending review, roadmap và quiz attempt. |

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
- Sơ đồ luồng: [four-role-flows.mmd](four-role-flows.mmd)
