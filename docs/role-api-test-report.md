# Báo Cáo Kiểm Thử API 4 Role

Ngày chạy: 17/09/2026. Backend TypeScript/Next.js, không chạy .NET.
Bộ bàn giao: [53 thao tác / 43 route files](role-api-schema.md), [OpenAPI](role-api.openapi.json), [Postman](role-api.postman_collection.json).

## Kết Quả Đã Chạy

| Lệnh trong codebase | Kết quả |
|---|---|
| `npm run verify` | Exit 0: lint, typecheck, api:check, test, FAQ audit, production build |
| `npm test` trong verify | 85/85 tests, 17 test files |
| `npm run test:platform` | 23/23 tests trong 4 files; gồm migration 0017 và kiểm thử Lecture không tự review/publish |
| `npm run api:check` | 53 operation/43 path, artifact khớp registry |
| OpenAPI validation trong contract.test.ts | Swagger Parser xác nhận OpenAPI 3.0 hợp lệ |
| Postman contract tests | Đủ request cho registry; tất cả body mẫu parse qua schema |
| `npm run test:api-smoke` | HTTP thật: health, catalog, 49 protected operation trả 401 khi thiếu token, malformed JSON 400, Planner baseline trả plan 1-3 task |
| FAQ audit | 53 file, 0 lỗi, 0 cảnh báo nội dung |
| `npm run eval -- baseline` | **17/20 (85%), exit 1**; ba lỗi Planner đã có từ trước, không sửa quality bar |
| `npm audit --json` | **7 cảnh báo dependency: 4 high, 3 moderate, 0 critical** |

Build chạy thành công trên Next.js 15.5.25 sau khi nâng giới hạn bản vá tối thiểu lên 15.5.24.
Đã xử lý cảnh báo critical Next.js trên Windows theo [advisory chính thức](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36).
Chưa nâng major Vitest hoặc thay toàn bộ dependency để tránh trộn migration công cụ vào luồng nghiệp vụ này. Kiểm tra và xử lý cảnh báo còn lại trước production.
Lint/build còn warning UI cũ về img và React hook dependency; không có lỗi chặn build.
`npm run audit` của repo là audit **nội dung FAQ**, không đồng nghĩa `npm audit` bảo mật dependency.

## Phạm Vi Integration

`src/backend/platform/platform.test.ts` áp dụng migrations **0015, 0016 và 0017 thật** trên PostgreSQL nhúng PGlite, rồi gọi controller HTTP Request/Response thực:

- Cả 53 thao tác có ít nhất một response thành công và được kiểm tra bằng response schema.
- Guest không gọi được protected API; mỗi role không phù hợp đều bị từ chối.
- Trigger đăng ký luôn Student dù metadata cố truyền Admin.
- Profile không cho tự đổi role/tier.
- Student chỉ truy cập roadmap/attempt của mình; task phải nằm trong roadmap.
- Lecture không đọc/sửa tài liệu hoặc quiz của Lecture khác.
- Draft/review/archived không hiện với Student; không lộ source_path/content_hash trong chi tiết học liệu Student.
- Lecture không được tự review/publish tài liệu của mình; reviewer là Lecture khác hoặc Admin. Publish phải đúng revision đã được duyệt; sửa bản published bị chặn; sửa tạo version và hủy phê duyệt cũ.
- Quiz ẩn đáp án trước nộp; server tính điểm; chống nộp trùng; retry cùng request sau archive/delete trả lại kết quả đã lưu.
- Admin đổi role/khóa có hiệu lực ngay, không tự hạ quyền/khóa mình; lưu audit.
- RLS chặn đọc/ghi trực tiếp từ authenticated dù đã có table grants; RPC chỉ cho service_role, vẫn kiểm tra actor role.
- Audit insert lỗi làm rollback cả mutation.
- Body quá lớn, JSON lỗi, MIME/type không khớp, field lạ, UUID lỗi và catalog reference sai đều bị chặn.

`dependencies.test.ts` mock HTTP transport của Supabase SDK: signup không ép xác nhận email, không cấp role cao; login/refresh không làm mất service key của RPC; khóa account; signout và token denylist; fail closed khi DB/config lỗi.

`mentor.test.ts` dùng LLM mock: kiểm tra catalog ID, evidence phải trích đúng input, không trả URL bịa từ model, malformed/provider failure về baseline.

`contract.test.ts` đối chiếu OpenAPI/Postman/route exports với registry. Các test này không đo chất lượng model thật.

## Giới Hạn Cần Phân Biệt

- Không apply migration lên Supabase remote, không tạo/khóa user thật và không kiểm thử SMTP/email confirmation end-to-end.
- Smoke test dùng server Next production local với config/key ngoài bị vô hiệu; không gọi nhà cung cấp AI.
- Không kiểm thử live LLM trong lượt này. Baseline golden-set còn lỗi G06 (thiếu aps-pair), G14 và G15 (chưa hỏi lại khi nền tảng và ghi chú mâu thuẫn).
- Không upload bytes, không parse PDF, không ghi/read Qdrant. Duyệt metadata không phải đánh giá tính đúng của nội dung hoặc chống hallucination toàn diện.
- Không xác nhận UI cũ đã nối API mới; FE cần thay client/mock theo contract.
- Không đo tải lớn hoặc race nhiều connection Supabase thực. DB dùng row/advisory lock và transaction; integration local không thay thế load/concurrency test staging.
- Trước production cần staging E2E, xử lý dependency warnings, rate limiting/quota, quan sát lỗi và chính sách lưu/xóa dữ liệu.

## Cách Chạy Lại

```bash
cd codebase
npm ci
npm run verify
npm run test:api-smoke
npm run eval -- baseline
```

Test platform không cần Docker, remote DB hoặc API key. Smoke tự chọn cổng localhost trống và dừng đúng process test khi xong.
Migration, env và bootstrap Admin nằm trong [hướng dẫn FE](role-api-schema.md#cài-đặt-và-kiểm-chứng).
