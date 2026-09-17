# API 4 Role - Bàn Giao FE

Nguồn sinh: `codebase/src/backend/platform/endpoints.ts`, `schemas.ts`, `responses.ts` và `codebase/scripts/platform-api-guide.md`.
Chạy `npm run api:generate` trong `codebase` để cập nhật. Không sửa trực tiếp file sinh.

- [OpenAPI 3.0: request/response, field bắt buộc, enum, lỗi](role-api.openapi.json)
- [Postman collection: 53 thao tác, body mẫu, tự lưu token/ID](role-api.postman_collection.json)
- [API công khai cũ: Planner, Chat SSE, FAQ, feedback, survey, health](api-schema.md)

## Phạm Vi Đã Implement

| Role | Tính năng và dữ liệu thực |
|---|---|
| Guest | Xem catalog, FAQ, thử Planner không lưu, Chat công khai trên nguồn cũ, đăng ký/đăng nhập |
| Student | Profile; gợi ý Mentor từ đầu vào; tạo/lưu/xem/xóa roadmap; cập nhật tiến độ; xem metadata học liệu đã duyệt; làm quiz và xem kết quả |
| Lecture | CRUD metadata tài liệu của mình; lịch sử phiên bản/review; submit/review/publish/archive; CRUD và xuất bản quiz |
| Admin | Xem/đổi role/tier/khóa người dùng; quản trị tài liệu toàn hệ thống; dùng API Lecture để quản trị quiz; audit và thống kê tổng hợp |

Guest là trạng thái chưa đăng nhập, **không phải một role lưu trong DB**.
Role DB là `student | lecture | admin`; `free | vip` là tier, chưa gắn thanh toán hoặc quota.
Admin không tự động giả làm Student; các API học cá nhân yêu cầu role Student.

Kế thừa ý tưởng profile/role, learning node, tiến độ và quiz từ backend .NET; triển khai lại bằng TypeScript/Next.js và SQL, không gọi .NET trong API v1. Luồng tài liệu có ràng buộc chủ sở hữu và duyệt phiên bản. Catalog hiện là các lab đã có trong Planner, **không phải toàn bộ giáo trình 35 tuần**.

## Bốn Luồng Chính

### 1. Guest

`GET /catalog/labs` -> xem lab và item -> `POST /api/roadmap` thử kế hoạch (route cũ, không prefix v1) -> đăng ký -> xác nhận email nếu được yêu cầu -> đăng nhập.

Guest không lưu roadmap, không sửa progress và không đọc học liệu Lecture.
Chat/FAQ cũ vẫn công khai như trước; không chịu phân quyền tài liệu v1.

### 2. Student

1. `POST /auth/login` -> lưu access/refresh token -> `GET /me`.
2. `PATCH /me` lưu nền tảng, mục tiêu và thời gian học.
3. `POST /mentor/analyze` nhận `background, goal, available_minutes, note, cv_text`. Chỉ nhận văn bản CV, chưa đọc file CV.
4. Đầu ra gồm `source, summary, evidence, recommendedLabId, requiresAssessment, nextStep`. Đây là gợi ý định hướng, không phải chứng nhận năng lực; baseline không bịa điểm mạnh/điểm yếu.
5. `POST /mentor/roadmap` với body trong `nextStep`. Với `status=plan`, API **lưu DB** và trả `data.roadmap.id`, diagnosis cùng 1-3 task lấy từ catalog.
6. `GET /mentor/roadmaps` và `GET /mentor/roadmaps/{id}` mở lại. Mỗi task có `itemId, title, url, type, minutes, reason, status, completedAt`.
7. `PATCH /mentor/roadmaps/{id}/tasks/{itemId}` với `{"status":"completed"}`. Đọc tổng hợp tại `GET /learning/progress`. Không cập nhật node không thuộc roadmap.
8. `GET /learning/documents`, `GET /learning/documents/{id}` xem mô tả và item liên quan, mở **link catalog** để học.
9. `GET /quizzes` -> `GET /quizzes/{id}` -> `POST /quizzes/{id}/submissions` -> xem `GET /quizzes/submissions` và `/{id}`.

`clarify` hoặc `refuse` là HTTP 200, không lưu roadmap mới. FE kiểm tra `data.status` trước khi truy cập `data.roadmap`.
Gọi tạo roadmap lại tạo một bản mới, không tự ghi đè bản cũ.
Progress là tự đánh dấu; quiz chưa tự mở khóa node hoặc cấp chứng chỉ.

Ví dụ roadmap:
```json
{
  "background": "tech_base",
  "available_minutes": 60,
  "lab_id": "lab-prompt-tool-calling",
  "note": "Tôi mới làm quen Colab"
}
```

Cấu trúc trả về khi tạo được:
```text
data: {
  status: "plan",
  message: string,
  roadmap: {
    id: UUID, student_id: UUID, lab_id: string,
    source: "ai" | "baseline", diagnosis: {...},
    tasks: [{itemId, title, url, type, minutes, reason, status, completedAt}],
    created_at, updated_at
  }
}
```

### 3. Lecture

`POST /lecture/documents` -> `GET /lecture/documents/{id}` -> sửa `PUT` nếu cần -> `POST /{id}/submit` -> `POST /{id}/review` -> `POST /{id}/publish`.

- `draft -> review -> approved_revision = revision -> published`.
- Review `needs_changes` đưa về draft; `rejected` đưa về failed.
- Lecture không được tự duyệt hoặc tự xuất bản tài liệu của mình; Lecture khác hoặc Admin có thể duyệt mọi tài liệu. Đây là chính sách review độc lập hiện tại.
- `GET /{id}/versions` xem snapshot metadata; `GET /{id}/reviews` xem người duyệt, revision và nhận xét.
- Trước khi sửa/xóa bản published phải `POST /{id}/archive`; sửa làm tăng revision, về draft và hủy phê duyệt cũ.
- Mỗi thao tác sửa/review/publish/archive/delete cần `revision` đang đọc. Bản cũ trả 409.
- `DELETE` là xóa mềm; dữ liệu lịch sử và audit vẫn còn. Không thể truy cập tài liệu đã xóa qua API thường.
- Quiz: `POST /lecture/quizzes` -> `PUT /{id}` nếu cần -> `POST /{id}/publish`. Archive trước khi sửa/xóa. Quiz không có bước review riêng.

Body metadata mẫu (không có multipart/file bytes):
```json
{
  "title": "Prompt handbook",
  "summary": "Tài liệu tham khảo về cấu trúc prompt",
  "labId": "lab-prompt-tool-calling",
  "itemIds": ["ptc-prompt-basics"],
  "sourcePath": "lecture/handbook.md",
  "fileName": "handbook.md",
  "fileType": "markdown",
  "mimeType": "text/markdown",
  "fileSizeBytes": 100,
  "contentHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

`contentHash` do client cung cấp cho metadata, **server chưa xác minh bytes**. `sourcePath` là định danh nguồn, không phải URL download đã được ký và server không fetch nó.
Loại file: `pdf/application/pdf`, `text/text/plain`, `markdown/text/markdown`.
PUT gửi đủ metadata như tạo mới, cộng `revision`; không phải partial PATCH.

### 4. Admin

`GET /admin/users?role=student` -> `GET /admin/users/{id}` -> `PATCH /{id}/role` hoặc `PATCH /{id}/status`.

- Không tự đổi role hoặc khóa chính mình; không xóa tài khoản bằng endpoint này.
- Khóa/đổi role có hiệu lực ở request bảo vệ tiếp theo vì server đọc profile mới mỗi lần.
- Duyệt nội dung: `GET /admin/documents` -> chi tiết -> review -> publish/archive/delete.
- Có thể tạo/sửa nội dung và quản trị quiz qua `/lecture/*` vì các route đó cũng cho phép Admin.
- `GET /admin/audit` xem thao tác quản trị/nội dung; `GET /admin/analytics` trả số user, user active, tài liệu published, pending review, roadmap, quiz attempt.
- Analytics không phải báo cáo độ chính xác RAG hoặc dashboard doanh thu.

## Quy Ước FE

- Base URL: `http://localhost:3000/api/v1`. Endpoint cũ `/api/*` dùng contract khác.
- Bảo vệ bằng `Authorization: Bearer <accessToken>`; không dùng cookie/.NET token cũ.
- Body JSON, kể cả DELETE tài liệu/quiz (`{"revision":1}`). Tối đa 128 KB; input strict, field lạ bị từ chối.
- Request body dùng camelCase, ngoại trừ input Mentor giữ `available_minutes, lab_id, cv_text` theo contract cũ.
- Dữ liệu DB trả snake_case; task/câu hỏi/kết quả quiz có camelCase. OpenAPI mô tả từng field chính xác.
- Thành công: `{"data": ...}`. List có query phân trang thêm `meta:{limit,offset,count}`; default 20, tối đa 100. `count` là số item trang hiện tại, không phải total. Tăng offset; dừng khi count < limit.
- Danh sách versions/reviews chưa phân trang; không có realtime/search tùy ý.
- Lỗi: `{"error":{"code":"REVISION_CONFLICT","message":"..."}}`, validation có thể kèm `details`.
- 400 input sai; 401 chưa đăng nhập/token sai; 403 sai role hoặc account khóa; 404 không tồn tại/khác chủ; 409 conflict; 413 body lớn; 415 sai content-type; 503 thiếu cấu hình/migration hoặc dịch vụ lỗi.
- Register luôn Student. Không truyền role/tier từ form đăng ký; Admin phân quyền sau.
- Nếu `requiresEmailConfirmation=true`: chưa có token, FE yêu cầu xác nhận email rồi login.
- Refresh đổi cặp token; FE thay cả access lẫn refresh token. Logout thu hồi refresh session và chặn access token đang gửi. Access token cũ khác trong cùng phiên có thể còn hiệu lực đến hạn JWT; không claim logout toàn thiết bị.
- Quiz trước khi nộp không chứa `correctOption/explanation`. Sau khi nộp trả điểm và giải thích; dùng để luyện tập, không phải đề thi bí mật chống gian lận.
- `requestId` quiz là UUID do FE tạo cho mỗi lần nộp, giữ nguyên khi retry cùng bài/cùng revision/cùng đáp án.
- Thiếu key/provider lỗi/output không hợp lệ: Mentor trả `source=baseline`. Header LLM dùng chung với Planner cũ, không ghi key vào DB/log.
- Không lưu raw CV vào DB và không log input Mentor; khi có key, văn bản CV được gửi tới provider để phân tích. FE cần thông báo việc này cho người dùng.

## Cài Đặt Và Kiểm Chứng

1. Cài dependency: `npm ci` trong `codebase`.
2. Cấu hình `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` trong env server. Service key không gửi xuống FE.
3. Apply các migration theo thứ tự. Trên DB đã có 0001-0014, thêm **0015, 0016 rồi 0017** trong `codebase/supabase/migrations`; không chỉ chạy riêng migration cuối. Sao lưu/kiểm tra staging trước.
4. Supabase bật email/password; cấu hình email confirmation và SMTP theo môi trường. Migration tạo trigger profile Student cho tài khoản mới và backfill user cũ thiếu profile.
5. Khởi tạo Admin đầu tiên trong Supabase SQL Editor bằng tài khoản vận hành DB, chọn đúng UUID của tài khoản đã đăng ký:
```sql
update public.profiles
set role = 'admin', updated_at = now()
where id = '<UUID tài khoản admin do bạn kiểm soát>'::uuid;
```
6. Từ đó Admin dùng API để nâng role Lecture/Admin khác. Không có endpoint public tự cấp quyền.
7. `npm run dev`; import Postman, đặt baseUrl, lần lượt nhập email/password và login từng tài khoản để lưu token đúng role. Theo thứ tự luồng ở trên, không Run All toàn collection (nó chứa cả archive/delete/logout). Với thao tác `/me` bằng role khác, đổi bearer token mặc định Student.
8. `npm run verify` chạy lint/typecheck/unit/integration/FAQ audit/build; `npm run api:check` kiểm tra tài liệu sinh không lệch registry.

Bộ test API dùng Request/Response thật, migrations SQL thật trên PostgreSQL nhúng PGlite, auth fixture; adapter Supabase được test bằng HTTP mock. Có test thành công cho đủ 53 thao tác và ma trận từ chối sai role, dữ liệu khác chủ, review độc lập/revision, chấm quiz, khóa tài khoản, RPC server-only. **Không tương đương kiểm thử end-to-end trên Supabase remote/SMTP/provider AI thật**; migration remote không được tự apply trong lượt làm này.

## Chưa Thuộc Đợt Bàn Giao Này

- Upload/download file thực, parse PDF/TXT/MD, chia chunk, embedding, Qdrant, lọc retrieval theo published revision, preview chunk, bộ câu hỏi chuẩn/evaluation RAG.
- Publish hiện chỉ làm **metadata** hiện với Student. Nó không tự đưa tài liệu vào `/api/chat` và không đảm bảo AI trả lời từ học liệu Lecture mới.
- Không thể cam kết "không hallucination". Hiện có catalog allowlist cho roadmap, nguồn/evidence hợp lệ cho gợi ý và quy trình kiểm duyệt metadata; kiểm soát RAG sẽ cần pipeline + eval riêng.
- CV file parsing, chấm năng lực toàn diện, giáo trình dài hạn tự sinh, thanh toán VIP, chứng chỉ, email reset password/MFA, mời tài khoản.
- UI cũ có mock và auth/.NET client riêng; API sẵn để FE nối, chưa có nghĩa toàn bộ trang Next.js đã chuyển sang v1.
- Rate limiting/quota phân tán, giám sát và kiểm thử tải cần hoàn thiện trước khi mở đăng ký/LLM trên production.

Các cột legacy `extracted_content`/`chunk_count` và bảng `knowledge_evaluations`, `student_learning_progress` được giữ để không mất dữ liệu cũ; API mới không dùng làm kho file/vector hoặc tự chuyển progress không có roadmap. Dữ liệu tiến độ mới nằm trong `student_roadmaps.tasks`.

## Danh sách endpoint v1

Tất cả path bên dưới có tiền tố /api/v1. Guest = công khai; tài khoản đã đăng nhập cũng gọi được API công khai.

| Method | Path | Role | Tính năng / mục đích | Body | Data trả về | File route |
|---|---|---|---|---|---|---|
| POST | `/auth/register` | guest | Auth: Đăng ký Student; xác nhận email theo cấu hình Supabase | Xem `register` trong OpenAPI | `Session` | [route.ts](../codebase/src/app/api/v1/auth/register/route.ts) |
| POST | `/auth/login` | guest | Auth: Đăng nhập và lấy token cùng profile | Xem `login` trong OpenAPI | `Session` | [route.ts](../codebase/src/app/api/v1/auth/login/route.ts) |
| POST | `/auth/refresh` | guest | Auth: Đổi refresh token lấy phiên mới | Xem `refresh` trong OpenAPI | `Session` | [route.ts](../codebase/src/app/api/v1/auth/refresh/route.ts) |
| POST | `/auth/logout` | student, lecture, admin | Auth: Thu hồi refresh token của phiên hiện tại và chặn access token | Không | `LoggedOut` | [route.ts](../codebase/src/app/api/v1/auth/logout/route.ts) |
| GET | `/me` | student, lecture, admin | Profile: Lấy profile và quyền hiện tại | Không | `Profile` | [route.ts](../codebase/src/app/api/v1/me/route.ts) |
| PATCH | `/me` | student, lecture, admin | Profile: Sửa thông tin cá nhân và mục tiêu học | Xem `updateMe` trong OpenAPI | `Profile` | [route.ts](../codebase/src/app/api/v1/me/route.ts) |
| GET | `/catalog/labs` | guest | Guest: Danh sách lab, nội dung học và link đã kiểm chứng | Không | `Catalog` | [route.ts](../codebase/src/app/api/v1/catalog/labs/route.ts) |
| GET | `/learning/nodes` | student | Learning: Danh sách node từ catalog dùng tạo roadmap | Không | `Nodes` | [route.ts](../codebase/src/app/api/v1/learning/nodes/route.ts) |
| POST | `/mentor/analyze` | student | Mentor: Phân tích nền tảng, mục tiêu và văn bản CV; trả nhãn AI hoặc baseline | Xem `analyze` trong OpenAPI | `Analysis` | [route.ts](../codebase/src/app/api/v1/mentor/analyze/route.ts) |
| POST | `/mentor/roadmap` | student | Mentor: Tạo và lưu roadmap tối đa 3 task; trả clarify/refuse nếu chưa thể tạo | Xem `createRoadmap` trong OpenAPI | `RoadmapResult` | [route.ts](../codebase/src/app/api/v1/mentor/roadmap/route.ts) |
| GET | `/mentor/roadmaps` | student | Mentor: Lịch sử roadmap của chính Student | Không | `RoadmapList` | [route.ts](../codebase/src/app/api/v1/mentor/roadmaps/route.ts) |
| GET | `/mentor/roadmaps/{id}` | student | Mentor: Đọc roadmap đã lưu | Không | `Roadmap` | [route.ts](../codebase/src/app/api/v1/mentor/roadmaps/[id]/route.ts) |
| DELETE | `/mentor/roadmaps/{id}` | student | Mentor: Xóa roadmap cá nhân | Không | `Deleted` | [route.ts](../codebase/src/app/api/v1/mentor/roadmaps/[id]/route.ts) |
| PATCH | `/mentor/roadmaps/{id}/tasks/{itemId}` | student | Progress: Cập nhật task thuộc roadmap của mình | Xem `task` trong OpenAPI | `Roadmap` | [route.ts](../codebase/src/app/api/v1/mentor/roadmaps/[id]/tasks/[itemId]/route.ts) |
| GET | `/learning/progress` | student | Progress: Tiến độ theo từng roadmap cá nhân | Không | `ProgressList` | [route.ts](../codebase/src/app/api/v1/learning/progress/route.ts) |
| POST | `/learning/progress` | student | Progress: Cập nhật node có thật trong roadmap (alias của PATCH task) | Xem `updateProgress` trong OpenAPI | `Roadmap` | [route.ts](../codebase/src/app/api/v1/learning/progress/route.ts) |
| GET | `/learning/documents` | student | Learning: Danh sách tài liệu đã xuất bản | Không | `DocumentList` | [route.ts](../codebase/src/app/api/v1/learning/documents/route.ts) |
| GET | `/learning/documents/{id}` | student | Learning: Đọc thông tin học liệu đã xuất bản; không lộ đường dẫn nội bộ | Không | `PublicDocument` | [route.ts](../codebase/src/app/api/v1/learning/documents/[id]/route.ts) |
| GET | `/lecture/documents` | lecture, admin | Lecture documents: Lecture xem tài liệu của mình; Admin xem toàn bộ | Không | `DocumentList` | [route.ts](../codebase/src/app/api/v1/lecture/documents/route.ts) |
| POST | `/lecture/documents` | lecture, admin | Lecture documents: Tạo bản nháp metadata học liệu PDF/TXT/MD; chưa upload file | Xem `createDocument` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/route.ts) |
| GET | `/lecture/documents/{id}` | lecture, admin | Lecture documents: Đọc chi tiết tài liệu trong phạm vi sở hữu | Không | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/route.ts) |
| PUT | `/lecture/documents/{id}` | lecture, admin | Lecture documents: Sửa metadata và tạo phiên bản mới; phải archive bản published trước | Xem `updateDocument` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/route.ts) |
| DELETE | `/lecture/documents/{id}` | lecture, admin | Lecture documents: Xóa mềm tài liệu; giữ lịch sử và audit | Xem `deleteDocument` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/route.ts) |
| POST | `/lecture/documents/{id}/submit` | lecture, admin | Document review: Đưa bản nháp vào hàng chờ review | Xem `submitDocument` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/submit/route.ts) |
| POST | `/lecture/documents/{id}/review` | lecture, admin | Document review: Lecture khác hoặc Admin ghi quyết định duyệt cho đúng revision | Xem `reviewDocument` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/review/route.ts) |
| POST | `/lecture/documents/{id}/publish` | lecture, admin | Document review: Lecture khác hoặc Admin xuất bản đúng revision đã được duyệt | Xem `publishDocument` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/publish/route.ts) |
| POST | `/lecture/documents/{id}/archive` | lecture, admin | Document review: Thu hồi tài liệu khỏi danh sách Student | Xem `archiveDocument` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/archive/route.ts) |
| GET | `/lecture/documents/{id}/versions` | lecture, admin | Document review: Lịch sử metadata theo revision | Không | `VersionList` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/versions/route.ts) |
| GET | `/lecture/documents/{id}/reviews` | lecture, admin | Document review: Lịch sử quyết định duyệt | Không | `ReviewList` | [route.ts](../codebase/src/app/api/v1/lecture/documents/[id]/reviews/route.ts) |
| GET | `/quizzes` | student | Student quiz: Danh sách quiz đã xuất bản | Không | `QuizList` | [route.ts](../codebase/src/app/api/v1/quizzes/route.ts) |
| GET | `/quizzes/{id}` | student | Student quiz: Đề quiz không chứa đáp án hoặc giải thích | Không | `StudentQuiz` | [route.ts](../codebase/src/app/api/v1/quizzes/[id]/route.ts) |
| POST | `/quizzes/{id}/submissions` | student | Student quiz: Chấm trên server và lưu kết quả; requestId chống nộp trùng | Xem `submitQuiz` trong OpenAPI | `Attempt` | [route.ts](../codebase/src/app/api/v1/quizzes/[id]/submissions/route.ts) |
| GET | `/quizzes/submissions` | student | Student quiz: Lịch sử làm bài của chính Student | Không | `AttemptList` | [route.ts](../codebase/src/app/api/v1/quizzes/submissions/route.ts) |
| GET | `/quizzes/submissions/{id}` | student | Student quiz: Đọc điểm và lời giải của lần nộp bài | Không | `Attempt` | [route.ts](../codebase/src/app/api/v1/quizzes/submissions/[id]/route.ts) |
| GET | `/lecture/quizzes` | lecture, admin | Lecture quiz: Danh sách quiz do mình soạn; Admin xem toàn bộ | Không | `QuizList` | [route.ts](../codebase/src/app/api/v1/lecture/quizzes/route.ts) |
| POST | `/lecture/quizzes` | lecture, admin | Lecture quiz: Soạn quiz với đáp án và giải thích | Xem `createQuiz` trong OpenAPI | `Quiz` | [route.ts](../codebase/src/app/api/v1/lecture/quizzes/route.ts) |
| GET | `/lecture/quizzes/{id}` | lecture, admin | Lecture quiz: Đọc đề và đáp án trong phạm vi sở hữu | Không | `Quiz` | [route.ts](../codebase/src/app/api/v1/lecture/quizzes/[id]/route.ts) |
| PUT | `/lecture/quizzes/{id}` | lecture, admin | Lecture quiz: Sửa quiz và tăng revision | Xem `updateQuiz` trong OpenAPI | `Quiz` | [route.ts](../codebase/src/app/api/v1/lecture/quizzes/[id]/route.ts) |
| DELETE | `/lecture/quizzes/{id}` | lecture, admin | Lecture quiz: Xóa mềm quiz đã ngừng xuất bản | Xem `deleteQuiz` trong OpenAPI | `Quiz` | [route.ts](../codebase/src/app/api/v1/lecture/quizzes/[id]/route.ts) |
| POST | `/lecture/quizzes/{id}/publish` | lecture, admin | Lecture quiz: Xuất bản đề quiz | Xem `publishQuiz` trong OpenAPI | `Quiz` | [route.ts](../codebase/src/app/api/v1/lecture/quizzes/[id]/publish/route.ts) |
| POST | `/lecture/quizzes/{id}/archive` | lecture, admin | Lecture quiz: Ngừng nhận bài cho quiz | Xem `archiveQuiz` trong OpenAPI | `Quiz` | [route.ts](../codebase/src/app/api/v1/lecture/quizzes/[id]/archive/route.ts) |
| GET | `/admin/users` | admin | Admin users: Danh sách profile có phân trang và lọc role | Không | `ProfileList` | [route.ts](../codebase/src/app/api/v1/admin/users/route.ts) |
| GET | `/admin/users/{id}` | admin | Admin users: Chi tiết profile người dùng | Không | `Profile` | [route.ts](../codebase/src/app/api/v1/admin/users/[id]/route.ts) |
| PATCH | `/admin/users/{id}/role` | admin | Admin users: Đổi role/tier; cấm tự đổi role | Xem `userRole` trong OpenAPI | `Profile` | [route.ts](../codebase/src/app/api/v1/admin/users/[id]/role/route.ts) |
| PATCH | `/admin/users/{id}/status` | admin | Admin users: Khóa/mở tài khoản; có hiệu lực trên request tiếp theo | Xem `userStatus` trong OpenAPI | `Profile` | [route.ts](../codebase/src/app/api/v1/admin/users/[id]/status/route.ts) |
| GET | `/admin/documents` | admin | Admin content: Toàn bộ tài liệu để quản trị | Không | `DocumentList` | [route.ts](../codebase/src/app/api/v1/admin/documents/route.ts) |
| GET | `/admin/documents/{id}` | admin | Admin content: Chi tiết tài liệu của bất kỳ Lecture nào | Không | `Document` | [route.ts](../codebase/src/app/api/v1/admin/documents/[id]/route.ts) |
| POST | `/admin/documents/{id}/review` | admin | Admin content: Duyệt tài liệu đang review | Xem `adminReview` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/admin/documents/[id]/review/route.ts) |
| POST | `/admin/documents/{id}/publish` | admin | Admin content: Xuất bản tài liệu đã được duyệt | Xem `adminPublish` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/admin/documents/[id]/publish/route.ts) |
| POST | `/admin/documents/{id}/archive` | admin | Admin content: Thu hồi tài liệu khỏi Student | Xem `adminArchive` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/admin/documents/[id]/archive/route.ts) |
| DELETE | `/admin/documents/{id}` | admin | Admin content: Xóa mềm tài liệu chưa published | Xem `adminDelete` trong OpenAPI | `Document` | [route.ts](../codebase/src/app/api/v1/admin/documents/[id]/route.ts) |
| GET | `/admin/audit` | admin | Admin audit: Nhật ký thao tác role, tài liệu và quiz | Không | `AuditList` | [route.ts](../codebase/src/app/api/v1/admin/audit/route.ts) |
| GET | `/admin/analytics` | admin | Admin analytics: Số user, tài liệu published, review, roadmap và lượt quiz | Không | `Analytics` | [route.ts](../codebase/src/app/api/v1/admin/analytics/route.ts) |
