# 06 — Backend .NET (tài khoản, duyệt tài khoản, hạn mức khách, khoá học)

> **Trạng thái (18/9):** đã chuyển về đúng Clean Architecture + CQRS (MediatR), có 60 test tự động. **Chưa deploy** (tài khoản Railway hết hạn dùng thử) — task B-03 trong [`hackathon/tasks-he-thong-4-vai-tro.md`](hackathon/tasks-he-thong-4-vai-tro.md).
> - Next.js gọi backend qua `src/lib/api/*-backend-client.ts` (trình duyệt) và `src/lib/server/*` (server). Chưa cấu hình địa chỉ backend thì app không bắt đăng nhập.
> - Danh sách endpoint và biến môi trường: [`03-api.md`](03-api.md) mục 4. Refactor 18/9 **không đổi** đường dẫn, mã trạng thái hay tên trường JSON.
> - Schema: chạy lần lượt các file trong `codebase/database/migrations/`.

## 1. Kiến trúc

Một ứng dụng duy nhất (monolith), chia 4 tầng. Tầng ngoài phụ thuộc tầng trong, tầng trong không biết gì về tầng ngoài.

```text
WebApi ──► Infrastructure ──► Application ──► Domain
   └───────────────────────────►┘
```

| Tầng | Thư mục | Chứa gì | Phụ thuộc |
|---|---|---|---|
| **Domain** | `src/Core/Domain/` | Thực thể (`AppUser`, `CurriculumModule`…), enum, **luật nghiệp vụ gắn với thực thể** — ví dụ ai được đăng nhập (`AppUser.SignInBlock`), chuyển trạng thái duyệt (`AppUser.SetApproval`) | Không phụ thuộc gì |
| **Application** | `src/Core/Application/` | Use case theo CQRS: mỗi việc là một command/query + handler + validator trong `Features/<Mảng>/Commands|Queries/<Việc>/`. Interface cho thế giới bên ngoài trong `Common/Interfaces/` | Domain; MediatR, FluentValidation, EF Core (chỉ `DbSet`) |
| **Infrastructure** | `src/Infrastructure/` | `Data/`: `ApplicationDbContext`, cấu hình từng bảng (`Configurations/*Configuration.cs`), bộ đếm hạn mức. `Identity/`: tạo JWT, băm mật khẩu BCrypt | Application; Npgsql, BCrypt, JWT |
| **WebApi** | `src/WebApi/` | `Endpoints/`: nhận request → gửi MediatR → trả JSON. `Security/`: policy phân quyền. `Middlewares/`: xử lý lỗi chung. `Program.cs` chỉ đăng ký 3 tầng | Application, Infrastructure (chỉ để đăng ký DI) |

### Một request đi qua những đâu

Ví dụ học viên ghi danh khoá học (`POST /api/v1/curriculum/enroll`):

1. **JwtBearer** kiểm tra chữ ký và hạn của token.
2. **Policy `SignedInUser`** đọc lại tài khoản trong DB: phải đang hoạt động và đã được duyệt. Khoá hay từ chối tài khoản có hiệu lực ngay, không chờ token hết hạn.
3. **Endpoint** (`Endpoints/CurriculumEndpoints.cs`) đọc body thành `EnrollCourseCommand` và gửi MediatR.
4. **`ValidationBehavior`** chạy validator; sai thì dừng, trả 400.
5. **Handler** (`EnrollCourseCommandHandler`) lấy người dùng từ token qua `ICurrentUserService` — **không bao giờ** nhận `userId` từ request.
6. Lỗi chưa lường trước → **`GlobalExceptionHandler`** trả ProblemDetails (RFC 7807) kèm `success`/`message`, không lộ stack trace.

### Mã lỗi

| Trường hợp | Mã | Nội dung |
|---|---|---|
| Không có token, token sai hoặc hết hạn | 401 | `{ success: false, message }` + header `WWW-Authenticate: Bearer` |
| Token hợp lệ nhưng tài khoản chờ duyệt / bị từ chối / bị khoá | 401 | Như trên — frontend dựa vào 401 để xoá token cũ |
| Đã đăng nhập hợp lệ nhưng thiếu vai trò (ví dụ không phải SuperAdmin) | 403 | `{ success: false, message }` |
| Dữ liệu sai (validator) hoặc JSON sai dạng | 400 | ProblemDetails + `success: false`, `message` (câu tiếng Việt đầu tiên), `errors` |
| Lỗi hệ thống | 500 | ProblemDetails, câu chung chung; chi tiết chỉ ghi vào log server |

## 2. Cấu hình

| Biến môi trường | Bắt buộc | Ghi chú |
|---|---|---|
| `ConnectionStrings__DefaultConnection` hoặc `DATABASE_URL` | Có | `DATABASE_URL` dạng `postgresql://user:pass@host:port/db` được tự chuyển đổi |
| `Jwt__Secret` | Có | ≥ 32 ký tự. Thiếu hoặc ngắn hơn thì API **không khởi động**. Secret cũ từng bị commit nên không dùng lại |
| `Jwt__Issuer`, `Jwt__Audience`, `Jwt__ExpiryMinutes` | Không | Mặc định `AIIANotebookBackend`, `AIIANotebookFrontend`, 10080 phút |
| `Backend__InternalApiKey` | Không | ≥ 32 ký tự, trùng `BACKEND_INTERNAL_API_KEY` bên Next.js. Bỏ trống = tắt đăng nhập Google/GitHub |
| `Cors__AllowedOrigins__0`, `__1`… | Không | Mặc định trong `appsettings.json` |
| `GuestQuota__SessionDailyLimit`, `GuestQuota__IpDailyLimit` | Không | Mặc định 10 và 200 câu/ngày |
| `Payments__BankId`, `Payments__AccountNumber`, `Payments__AccountName` | Không | Tài khoản nhận tiền VietQR; mặc định là tài khoản mẫu, **phải đặt** trước khi thu tiền thật |

Chạy ở máy dùng `appsettings.Development.json`.

## 3. Chạy và kiểm tra

```bash
cd codebase/backend-core
dotnet test                                   # 60 test: Domain 6 · Application 41 · tích hợp HTTP 13
dotnet run --project src/WebApi               # cần Postgres theo appsettings.Development.json
docker build -t vinonymus-backend .           # image để deploy
```

| Bộ test | Kiểm tra gì | Cần gì |
|---|---|---|
| `tests/Domain.UnitTests` | Luật đăng nhập, chuyển trạng thái duyệt | Không |
| `tests/Application.UnitTests` | Từng use case qua đúng pipeline MediatR (validator + behavior + handler): đăng ký → chờ duyệt → duyệt → đăng nhập, hạn mức khách theo ngày Việt Nam, ghi danh, tiến độ, cấp chứng chỉ | Không — DB trong bộ nhớ |
| `tests/WebApi.IntegrationTests` | Khởi động API thật trong bộ nhớ, gọi HTTP như frontend: mã trạng thái, tên trường JSON, token giả / bị khoá / chờ duyệt, ProblemDetails | Không — chỉ thay Postgres và bộ đếm hạn mức |

Chưa có test chạy trên Postgres thật (câu SQL đếm hạn mức khách dùng cú pháp riêng của Postgres). Cần Docker để thêm Testcontainers.

## 4. Đã có và chưa có

| Hạng mục | Tình trạng |
|---|---|
| Clean Architecture 4 tầng, CQRS (MediatR 12.5), FluentValidation, cấu hình bảng bằng Fluent API | ✅ |
| JWT Bearer chuẩn ASP.NET Core, phân quyền bằng policy đọc lại trạng thái tài khoản từ DB | ✅ |
| ProblemDetails (RFC 7807) cho mọi lỗi | ✅ |
| Test tự động 3 tầng | ✅ 60 test |
| Deploy | ❌ task B-03 |
| Refresh token, đăng xuất thu hồi token | ❌ Token sống 7 ngày; khoá tài khoản thì chặn ngay nhờ policy đọc DB |
| Giới hạn số lần thử đăng nhập | ❌ task B-06 |
| Tài liệu giảng viên, tải file, thư viện cho AI Mentor | ❌ task B-07, B-08 |
| Swagger / OpenAPI | ❌ task B-10 |
| ASP.NET Core Identity | Không dùng — tự quản lý bằng BCrypt + JWT, đủ cho phạm vi hiện tại |
| Microservice | Không — một ứng dụng chia module; khi cần có thể tách một mảng (ví dụ xử lý tài liệu) ra service riêng mà không phải viết lại |
