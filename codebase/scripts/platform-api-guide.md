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
| Student | Profile; gợi ý Mentor từ đầu vào; tạo/lưu/xem/xóa roadmap; cập nhật tiến độ; xem metadata học liệu đã duyệt |
| Lecture | CRUD metadata tài liệu của mình; lịch sử phiên bản/review; submit/review/publish/archive |
| Admin | Xem/đổi role/tier/khóa người dùng; quản trị tài liệu toàn hệ thống; audit và thống kê tổng hợp |

Guest là trạng thái chưa đăng nhập, **không phải một role lưu trong DB**.
Role DB là `student | lecture | admin`; `free | vip` là tier, chưa gắn thanh toán hoặc quota.
Admin không tự động giả làm Student; các API học cá nhân yêu cầu role Student.

Kế thừa ý tưởng profile/role, learning node và tiến độ từ backend .NET; triển khai lại bằng TypeScript/Next.js và SQL, không gọi .NET trong API v1. Luồng tài liệu có ràng buộc chủ sở hữu và duyệt phiên bản. Catalog hiện là các lab đã có trong Planner, **không phải toàn bộ giáo trình 35 tuần**.

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

`clarify` hoặc `refuse` là HTTP 200, không lưu roadmap mới. FE kiểm tra `data.status` trước khi truy cập `data.roadmap`.
Gọi tạo roadmap lại tạo một bản mới, không tự ghi đè bản cũ.
Progress là tự đánh dấu và chưa tự mở khóa node hoặc cấp chứng chỉ.

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
- `GET /admin/audit` xem thao tác quản trị/nội dung; `GET /admin/analytics` trả số user, user active, tài liệu published, pending review và roadmap.
- Analytics không phải báo cáo độ chính xác RAG hoặc dashboard doanh thu.

## Quy Ước FE

- Base URL: `http://localhost:3000/api/v1`. Endpoint cũ `/api/*` dùng contract khác.
- Bảo vệ bằng `Authorization: Bearer <accessToken>`; không dùng cookie/.NET token cũ.
- Body JSON, kể cả DELETE tài liệu (`{"revision":1}`). Tối đa 128 KB; input strict, field lạ bị từ chối.
- Request body dùng camelCase, ngoại trừ input Mentor giữ `available_minutes, lab_id, cv_text` theo contract cũ.
- Dữ liệu DB trả snake_case; task có camelCase. OpenAPI mô tả từng field chính xác.
- Thành công: `{"data": ...}`. List có query phân trang thêm `meta:{limit,offset,count}`; default 20, tối đa 100. `count` là số item trang hiện tại, không phải total. Tăng offset; dừng khi count < limit.
- Danh sách versions/reviews chưa phân trang; không có realtime/search tùy ý.
- Lỗi: `{"error":{"code":"REVISION_CONFLICT","message":"..."}}`, validation có thể kèm `details`.
- 400 input sai; 401 chưa đăng nhập/token sai; 403 sai role hoặc account khóa; 404 không tồn tại/khác chủ; 409 conflict; 413 body lớn; 415 sai content-type; 503 thiếu cấu hình/migration hoặc dịch vụ lỗi.
- Register luôn Student. Không truyền role/tier từ form đăng ký; Admin phân quyền sau.
- Nếu `requiresEmailConfirmation=true`: chưa có token, FE yêu cầu xác nhận email rồi login.
- Refresh đổi cặp token; FE thay cả access lẫn refresh token. Logout thu hồi refresh session và chặn access token đang gửi. Access token cũ khác trong cùng phiên có thể còn hiệu lực đến hạn JWT; không claim logout toàn thiết bị.
- Thiếu key/provider lỗi/output không hợp lệ: Mentor trả `source=baseline`. Header LLM dùng chung với Planner cũ, không ghi key vào DB/log.
- Không lưu raw CV vào DB và không log input Mentor; khi có key, văn bản CV được gửi tới provider để phân tích. FE cần thông báo việc này cho người dùng.

## Cài Đặt Và Kiểm Chứng

1. Cài dependency: `npm ci` trong `codebase`.
2. Cấu hình `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` trong env server. Service key không gửi xuống FE.
3. Apply các migration theo thứ tự. Trên DB đã có 0001-0014, thêm **0015, 0016, 0017, 0018, 0019 rồi 0020** trong `codebase/supabase/migrations`; không chỉ chạy riêng migration cuối. Sao lưu/kiểm tra staging trước.
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

Bộ test API dùng Request/Response thật, migrations SQL thật trên PostgreSQL nhúng PGlite, auth fixture; adapter Supabase được test bằng HTTP mock. Smoke HTTP kiểm tra các protected operations còn lại sau khi luồng Quiz được gỡ. Supabase remote cần chạy migration 0020 để thu hồi grant RPC cũ. Embedding/upload thật vẫn chưa chạy end-to-end.

## Chưa Thuộc Đợt Bàn Giao Này

- Upload/download file thực, parse PDF/TXT/MD, chia chunk, embedding, Qdrant, lọc retrieval theo published revision, preview chunk, bộ câu hỏi chuẩn/evaluation RAG.
- Publish hiện chỉ làm **metadata** hiện với Student. Nó không tự đưa tài liệu vào `/api/chat` và không đảm bảo AI trả lời từ học liệu Lecture mới.
- Không thể cam kết "không hallucination". Hiện có catalog allowlist cho roadmap, nguồn/evidence hợp lệ cho gợi ý và quy trình kiểm duyệt metadata; kiểm soát RAG sẽ cần pipeline + eval riêng.
- CV file parsing, chấm năng lực toàn diện, giáo trình dài hạn tự sinh, thanh toán VIP, chứng chỉ, email reset password/MFA, mời tài khoản.
- UI cũ có mock và auth/.NET client riêng; API sẵn để FE nối, chưa có nghĩa toàn bộ trang Next.js đã chuyển sang v1.
- Rate limiting/quota phân tán, giám sát và kiểm thử tải cần hoàn thiện trước khi mở đăng ký/LLM trên production.

Các cột legacy `extracted_content`/`chunk_count` và bảng `knowledge_evaluations`, `student_learning_progress` được giữ để không mất dữ liệu cũ; API mới không dùng làm kho file/vector hoặc tự chuyển progress không có roadmap. Dữ liệu tiến độ mới nằm trong `student_roadmaps.tasks`.
