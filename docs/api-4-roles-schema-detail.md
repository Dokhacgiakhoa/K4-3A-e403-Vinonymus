# API 4 Role - Chi tiết Schema Endpoint

Tài liệu này là phụ lục schema gửi FE. Base URL là `/api/v1`.

- Request body dùng JSON và `Content-Type: application/json`.
- Thành công luôn bọc trong `{ "data": ... }`.
- List có thêm `meta: { limit, offset, count }`.
- Param `{id}` là UUID. `{itemId}` là chuỗi catalog item.
- Bảo vệ bằng `Authorization: Bearer <accessToken>`.
- Body strict: field ngoài schema bị từ chối.
- Chi tiết OpenAPI máy đọc được nằm ở [role-api.openapi.json](role-api.openapi.json).

## Schema dùng chung

### Profile

```ts
{
  id: string;                 // UUID
  display_name: string;
  role: "student" | "lecture" | "admin";
  tier: "free" | "vip";
  is_active: boolean;
  background: "non_tech" | "tech_base" | "ai" | null;
  goal: string;
  weekly_minutes: number;
  created_at: string;
  updated_at: string;
}
```

### Session

Đăng ký có thể yêu cầu xác nhận email:

```ts
{ requiresEmailConfirmation: true; session: null }
```

Phiên hoạt động:

```ts
{
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
  requiresEmailConfirmation: false;
  user: Profile;
}
```

### Pagination

Query dùng cho list:

```ts
{ limit?: number;  // integer, 1..100, mặc định 20
  offset?: number; // integer, 0..100000, mặc định 0
}
```

Response list:

```ts
{ data: T[]; meta: { limit: number; offset: number; count: number } }
```

`count` là số phần tử của trang hiện tại, không phải tổng số bản ghi.

### Catalog item

```ts
{
  itemId: string;
  title: string;
  url: string; // URL hợp lệ từ catalog
  type: "slide" | "video" | "notebook" | "doc";
  minutes: number;
  level: "basic" | "advanced";
  tags: string[];
  why: string;
}
```

### Roadmap task và Roadmap

```ts
{
  itemId: string;
  title: string;
  url: string;
  type: "slide" | "video" | "notebook" | "doc";
  minutes: number;
  reason: string;
  status: "todo" | "in_progress" | "completed" | "skipped";
  completedAt: string | null;
}
```

```ts
{
  id: string; // UUID
  student_id: string; // UUID
  lab_id: string;
  source: "ai" | "baseline";
  diagnosis: {
    background: "non_tech" | "tech_base" | "ai";
    confidence: "high" | "low";
    summary: string;
  };
  tasks: RoadmapTask[]; // 1..3 phần tử
  created_at: string;
  updated_at: string;
}
```

### Document

Public document trả cho Student:

```ts
{
  id: string;
  title: string;
  summary: string;
  lab_id: string | null;
  item_ids: string[];
  file_type: "pdf" | "text" | "markdown";
  status: "draft" | "processing" | "review" | "published" | "archived" | "failed";
  revision: number;
  published_at: string | null;
}
```

Document đầy đủ cho Lecture/Admin thêm:

```ts
{
  ...PublicDocument;
  owner_id: string;
  source_path: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  qdrant_collection: string; // legacy, không dùng cho pgvector
  storage_bucket: string | null; // null với metadata cũ chưa upload file
  embedding_model: string | null;
  indexed_revision: number | null;
  indexed_at: string | null;
  content_hash: string;
  chunk_count: number;
  review_note: string | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
  approved_revision: number | null;
  deleted_at: string | null;
}
```

### Error

```ts
{
  error: {
    code: string;
    message: string;
    details?: unknown;
  }
}
```

Mã lỗi thường gặp: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `REVISION_CONFLICT`, `REVIEW_REQUIRED`, `SELF_REVIEW`, `INVALID_TRANSITION`, `ARCHIVE_BEFORE_EDIT`, `ARCHIVE_BEFORE_DELETE`, `IDEMPOTENCY_CONFLICT`, `BODY_TOO_LARGE`, `JSON_REQUIRED`, `NOT_CONFIGURED`.

## Guest và Authentication

### `POST /auth/register`

**Role:** public Guest. **Mục đích:** tạo tài khoản Student.

Request:

```ts
{
  email: string;       // email hợp lệ, tối đa 254, server lowercase
  password: string;    // 8..72 ký tự
  displayName: string; // 2..100 ký tự
}
```

Response `201`: `Session`.

Không nhận `role` hoặc `tier` từ client; account mới luôn là `student`.

### `POST /auth/login`

**Role:** public Guest.

Request:

```ts
{ email: string; password: string }
```

Response `200`: `Session`.

### `POST /auth/refresh`

**Role:** public, dùng refresh token.

Request:

```ts
{ refreshToken: string } // 1..4096 ký tự
```

Response `200`: `Session` mới. FE phải thay cả access token và refresh token.

### `POST /auth/logout`

**Role:** `student | lecture | admin`. **Mục đích:** revoke phiên hiện tại.

Request: không body.

Response `200`:

```ts
{ data: { loggedOut: true } }
```

### `GET /catalog/labs`

**Role:** public Guest. **Mục đích:** lấy catalog lab và link allowlist.

Request: không body/query.

Response `200`:

```ts
{ data: Array<{
  labId: string;
  title: string;
  description: string;
  items: CatalogItem[];
}> }
```

## Student

### `GET /me`

**Role:** `student | lecture | admin`.

Request: không body/query.

Response `200`: `Profile`.

### `PATCH /me`

**Role:** `student | lecture | admin`.

Request: ít nhất một field:

```ts
{
  displayName?: string;       // 2..100
  background?: "non_tech" | "tech_base" | "ai";
  goal?: string;              // tối đa 500
  weeklyMinutes?: number;     // integer, 0..10080
}
```

Response `200`: `Profile`.

### `GET /learning/nodes`

**Role:** `student`.

Request: không body/query.

Response `200`: `CatalogItem[]` với thêm `labId: string`.

### `POST /mentor/analyze`

**Role:** `student`. **Mục đích:** chẩn đoán nền tảng trước khi tạo roadmap.

Request:

```ts
{
  background: "non_tech" | "tech_base" | "ai";
  goal: string;              // 1..500
  available_minutes: number; // integer, 0..600
  note?: string;             // mặc định "", tối đa 2000
  cv_text?: string;          // mặc định "", tối đa 20000
}
```

Response `200`:

```ts
{
  source: "ai" | "baseline";
  background: "non_tech" | "tech_base" | "ai";
  goal: string;
  availableMinutes: number;
  summary: string;
  evidence: string[];
  recommendedLabId: string;
  requiresAssessment: true;
  cvTextProvided: boolean;
  nextStep: {
    endpoint: "/api/v1/mentor/roadmap";
    body: {
      background: "non_tech" | "tech_base" | "ai";
      available_minutes: number;
      lab_id: string;
      note: string;
    };
  };
}
```

### `POST /mentor/roadmap`

**Role:** `student`. **Mục đích:** tạo và lưu roadmap.

Request:

```ts
{
  background: "non_tech" | "tech_base" | "ai";
  available_minutes: number; // integer, 0..600
  lab_id: string;             // 1..120, phải có trong catalog
  note?: string;              // mặc định "", tối đa 500
}
```

Response `200`: một trong ba dạng:

```ts
{ status: "plan"; message: string; roadmap: Roadmap }
{ status: "clarify"; question: string }
{ status: "refuse"; message: string }
```

`clarify` và `refuse` không tạo row roadmap mới.

### `GET /mentor/roadmaps`

**Role:** `student`.

Query: `Pagination`.

Response `200`: `Roadmap[]` + `meta`.

### `GET /mentor/roadmaps/{id}`

**Role:** `student`.

Path: `{id: UUID}`.

Response `200`: `Roadmap` thuộc Student hiện tại.

### `DELETE /mentor/roadmaps/{id}`

**Role:** `student`.

Path: `{id: UUID}`. Body: không có.

Response `200`:

```ts
{ data: { id: string; deleted: true } }
```

### `PATCH /mentor/roadmaps/{id}/tasks/{itemId}`

**Role:** `student`.

Path: `{id: UUID, itemId: string, 1..150}`.

Request:

```ts
{ status: "todo" | "in_progress" | "completed" | "skipped" }
```

Response `200`: `Roadmap` đã cập nhật.

### `GET /learning/progress`

**Role:** `student`.

Query: `Pagination`.

Response `200`:

```ts
Array<{
  roadmap_id: string;
  lab_id: string;
  tasks: RoadmapTask[];
  updated_at: string;
}>
```

### `POST /learning/progress`

**Role:** `student`.

Request:

```ts
{
  roadmapId: string; // UUID
  nodeId: string;    // 1..120
  status: "todo" | "in_progress" | "completed" | "skipped";
}
```

Response `200`: `Roadmap` đã cập nhật.

### `GET /learning/documents`

**Role:** `student`.

Query: `Pagination`.

Response `200`: `PublicDocument[]` + `meta`; chỉ tài liệu `published`.

### `GET /learning/documents/{id}`

**Role:** `student`.

Path: `{id: UUID}`.

Response `200`: `PublicDocument`. Không trả `source_path`, `content_hash`, `extracted_content` hoặc thông tin nội bộ.

## Lecture

### Document request dùng chung

Các endpoint tạo document dùng body:

```ts
{
  title: string;             // 1..255
  summary: string;           // 1..2000
  labId: string;             // 1..120, phải có catalog
  itemIds: string[];         // 1..30, không trùng và thuộc lab
  sourcePath: string;        // 1..500
  fileName: string;          // 1..255
  fileType: "pdf" | "text" | "markdown";
  mimeType: "application/pdf" | "text/plain" | "text/markdown";
  fileSizeBytes?: number;    // integer, 0..100000000
  contentHash: string;       // SHA-256 lowercase 64 ký tự
}
```

`fileType` phải khớp `mimeType`. Đây là metadata-only; server chưa nhận file bytes.

### `GET /lecture/documents`

**Role:** `lecture | admin`.

Query: `Pagination` và `status?` trong `draft | processing | review | published | archived | failed`.

Response `200`: `DocumentSummary[]` + `meta`.

### `POST /lecture/documents`

**Role:** `lecture | admin`.

Request: `DocumentInput`.

Response `201`: `Document`.

### `GET /lecture/documents/{id}`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Response `200`: `Document`; Lecture chỉ đọc tài liệu của mình, Admin đọc được toàn hệ thống.

### `PUT /lecture/documents/{id}`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Request: `DocumentInput` + `{ revision: positive integer }`.

Response `200`: `Document` mới với revision tăng 1.

### `DELETE /lecture/documents/{id}`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Request: `{ revision: positive integer }`.

Response `200`: `Document` đã xóa mềm. Document published phải archive trước.

### `POST /lecture/documents/{id}/submit`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Request: `{ revision: positive integer }`.

Response `200`: `Document` trạng thái `review`.

### `POST /lecture/documents/{id}/review`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Request:

```ts
{
  revision: number;
  decision: "approved" | "rejected" | "needs_changes";
  note: string; // 1..2000
}
```

Response `200`: `Document`. Lecture owner tự review sẽ nhận `409 SELF_REVIEW`.

### `POST /lecture/documents/{id}/publish`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Request: `{ revision: positive integer }`.

Response `200`: `Document` trạng thái `published`. Phải có review approved đúng revision.

### `POST /lecture/documents/{id}/archive`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Request: `{ revision: positive integer }`.

Response `200`: `Document` trạng thái `archived`.

### `GET /lecture/documents/{id}/versions`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Response `200`:

```ts
Array<{
  id: string;
  document_id: string;
  revision: number;
  snapshot: Document;
  created_at: string;
}>
```

### `GET /lecture/documents/{id}/reviews`

**Role:** `lecture | admin`.

Path: `{id: UUID}`.

Response `200`:

```ts
Array<{
  id: string;
  document_id: string;
  reviewer_id: string;
  decision: "approved" | "rejected" | "needs_changes";
  note: string | null;
  revision: number | null;
  created_at: string;
}>
```

## Admin

### `GET /admin/users`

**Role:** `admin`.

Query:

```ts
{
  limit?: number;
  offset?: number;
  role?: "student" | "lecture" | "admin";
}
```

Response `200`: `Profile[]` + `meta`.

### `GET /admin/users/{id}`

**Role:** `admin`.

Path: `{id: UUID}`. Response `200`: `Profile`.

### `PATCH /admin/users/{id}/role`

**Role:** `admin`.

Path: `{id: UUID}`.

Request:

```ts
{ role: "student" | "lecture" | "admin"; tier?: "free" | "vip" }
```

Response `200`: `Profile`. Admin không được tự đổi role; không được hạ Admin cuối cùng.

### `PATCH /admin/users/{id}/status`

**Role:** `admin`.

Path: `{id: UUID}`.

Request: `{ isActive: boolean }`.

Response `200`: `Profile`. Admin không được tự khóa tài khoản của mình.

### `GET /admin/documents`

**Role:** `admin`.

Query: `Pagination`.

Response `200`: `DocumentSummary[]` + `meta`.

### `GET /admin/documents/{id}`

**Role:** `admin`.

Path: `{id: UUID}`. Response `200`: `Document`.

### `POST /admin/documents/{id}/review`

**Role:** `admin`.

Path: `{id: UUID}`.

Request: `ReviewInput`.

Response `200`: `Document`.

### `POST /admin/documents/{id}/publish`

**Role:** `admin`.

Path: `{id: UUID}`. Request: `{ revision: positive integer }`.

Response `200`: `Document` published.

### `POST /admin/documents/{id}/archive`

**Role:** `admin`.

Path: `{id: UUID}`. Request: `{ revision: positive integer }`.

Response `200`: `Document` archived.

### `DELETE /admin/documents/{id}`

**Role:** `admin`.

Path: `{id: UUID}`. Request: `{ revision: positive integer }`.

Response `200`: `Document` xóa mềm. Published phải archive trước.

### `GET /admin/audit`

**Role:** `admin`.

Query: `Pagination`.

Response `200`:

```ts
Array<{
  id: string;
  actor_id: string | null;
  action: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}> + meta
```

### `GET /admin/analytics`

**Role:** `admin`.

Request: không body/query.

Response `200`:

```ts
{
  users: number;
  activeUsers: number;
  publishedDocuments: number;
  pendingReviews: number;
  roadmaps: number;
}
```

## Lỗi và quy tắc FE

| HTTP | Code | Khi nào |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | Body/query/path sai schema hoặc field lạ. |
| 401 | `UNAUTHENTICATED` | Thiếu/sai/hết hạn Bearer token. |
| 403 | `FORBIDDEN`, `ACCOUNT_DISABLED` | Sai role hoặc tài khoản bị khóa. |
| 404 | `NOT_FOUND` | Không tồn tại hoặc ngoài ownership. |
| 409 | `REVISION_CONFLICT`, `SELF_REVIEW`, `REVIEW_REQUIRED`, `INVALID_TRANSITION`, `IDEMPOTENCY_CONFLICT`, `ARCHIVE_BEFORE_EDIT`, `ARCHIVE_BEFORE_DELETE` | Conflict trạng thái, revision hoặc thao tác không hợp lệ. |
| 413 | `BODY_TOO_LARGE` | Body lớn hơn 128 KB. |
| 415 | `JSON_REQUIRED` | Thiếu `Content-Type: application/json` cho endpoint có body. |
| 503 | `NOT_CONFIGURED`, `DATABASE_UNAVAILABLE`, `AUTH_UNAVAILABLE` | Thiếu cấu hình hoặc dịch vụ phụ thuộc lỗi. |

FE nên xử lý `409` bằng cách tải lại resource và hiển thị hành động tiếp theo; không tự ghi đè revision mới.

## Lưu trữ cho luồng Lecture upload

Migration `0018` và `0019` giữ hồ sơ tài khoản trong `public.profiles` (khóa ngoại tới `auth.users`), file trong bucket Storage riêng tư `lecture-materials`, metadata trong `public.lecture_documents`, và embedding trong `public.lecture_document_chunks`. Guest không có hàng `profiles`; đăng ký công khai luôn là Student. Chỉ metadata do Supabase Admin API ghi vào `auth.users.raw_app_meta_data.platform_role` mới có thể khởi tạo Lecture/Admin; `raw_user_meta_data.role` không cấp quyền.

Trên project đã có migration `0001`–`0014`, chạy tiếp `0015`, `0016`, `0017`, `0018`, `0019` theo đúng thứ tự. `0016` backfill Auth user thành Student, `0018` đồng bộ các tài khoản staff đã được provision bằng app metadata. Mỗi file chỉ chạy một lần và cần kiểm tra kết quả trước khi dùng API 4 role.

Mỗi chunk có `document_id`, `revision`, `ordinal`, `content` và `embedding vector(768)`. Hàm `search_lecture_document_chunks` chỉ trả chunk của tài liệu `published`, chưa xóa và có `indexed_revision = revision`; chỉ `service_role` được gọi. Cột `qdrant_collection` được giữ để không làm hỏng API cũ, nhưng không tham gia truy xuất mới.

Các endpoint `/lecture/materials`, `/lecture/materials/upload` trong workflow là luồng đích; API v1 hiện vẫn chỉ nhận metadata qua `/lecture/documents`. Việc nhận bytes, trích xuất PDF/TXT/MD, tạo embedding và ghi `indexed_revision` cần được triển khai trước khi coi workflow upload đã chạy được.
