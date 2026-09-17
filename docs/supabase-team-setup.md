# Hướng dẫn kết nối Supabase cho team

## 1. Cấu hình biến môi trường

Tạo `codebase/.env.local` từ file mẫu và điền các biến sau:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

`SUPABASE_SERVICE_ROLE_KEY` chỉ được dùng ở server hoặc script vận hành. Không đặt biến này trong Client Component, không dùng tiền tố `NEXT_PUBLIC_`, không commit `.env.local` và không đưa key vào log. Nếu cần chia sẻ cho team, gửi qua kênh riêng cho đúng người có quyền và thu hồi/đổi key khi không còn cần.

## 2. Áp dụng database

Project đã có các migration nền `0001`–`0014`. Chạy tiếp các file trong `codebase/supabase/migrations/` theo thứ tự:

```text
0015_platform_roles_and_lecture_documents.sql
0016_four_role_workflows.sql
0017_review_hardening.sql
0018_platform_identity_and_material_metadata.sql
0019_lecture_material_vectors.sql
0020_retire_quiz_workflows.sql
```

Schema sau migration gồm `auth.users` + `public.profiles` cho Student/Lecture/Admin, metadata tài liệu trong `lecture_documents`, Storage bucket riêng tư `lecture-materials`, và chunk embedding trong `lecture_document_chunks` (`vector(768)`). Guest không có row trong `profiles`.

Nếu chạy trên database đã có `lecture_documents` legacy, migration 0015 nâng cấp additive và giữ lại dữ liệu cũ. Không xóa bảng cũ hoặc chạy `reset` trên project dùng chung.

## 3. Chạy ứng dụng và kiểm tra API

```powershell
cd codebase
npm ci
npm run dev
```

Kiểm tra tự động:

```powershell
npm run verify          # lint, typecheck, API contract, test, audit, build
npm run test:platform   # 53 operation 4-role trên PostgreSQL nhúng
npm run test:api-smoke  # health, catalog, protected endpoints và Planner HTTP
```

API v1 dùng `Authorization: Bearer <accessToken>`, response thành công bọc trong `{ data: ... }`. Register public luôn tạo Student; chỉ Admin mới đổi role qua API.

## 4. Tài khoản kiểm tra

Tạo tài khoản qua Supabase Auth hoặc `POST /api/v1/auth/register`. Sau khi Auth user tồn tại, profile Student được tạo tự động. Để provision Lecture/Admin, dùng thao tác vận hành có kiểm soát và đặt `auth.users.raw_app_meta_data.platform_role` thành `lecture` hoặc `admin`; không tin trường `role` do client gửi.

Kiểm tra từng role theo thứ tự:

1. `POST /api/v1/auth/login` để lấy access token.
2. `GET /api/v1/me` để xác nhận profile và role.
3. Student g?i `/mentor/*`, `/learning/*`.
4. Lecture g?i `/lecture/documents/*`.
5. Admin gọi `/admin/users`, `/admin/documents`, `/admin/audit`, `/admin/analytics`.

Không chạy toàn bộ Postman collection bằng một lần Run All vì collection có thao tác archive, delete và logout.

## 5. Giới hạn hiện tại

Các migration đã chuẩn bị Storage và pgvector. API hiện tại vẫn nhận metadata tài liệu; endpoint multipart upload, parse PDF/TXT/Markdown, chunking và gọi embedding chưa được nối vào workflow Lecture. Vì vậy `lecture_document_chunks` có thể chưa có dữ liệu dù schema đã sẵn sàng.
