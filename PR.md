# PR: Chuyển backend .NET về đúng Clean Architecture + CQRS

> **Task:** B-01, B-02 trong [`docs/hackathon/tasks-he-thong-4-vai-tro.md`](docs/hackathon/tasks-he-thong-4-vai-tro.md) · **Issue:** — · **Branch:** `refactor/backend-clean-architecture`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Backend .NET có đủ 4 project (Domain, Application, Infrastructure, WebApi) nhưng **nghiệp vụ lại nằm ở WebApi** (`WebApi/Services/*WebService.cs`), gọi thẳng `ApplicationDbContext` và tự đọc header `Authorization` bằng tay. PR này đưa mọi thứ về đúng tầng theo Clean Architecture, như PM đã chốt từ đầu, **không đổi** đường dẫn, mã trạng thái hay tên trường JSON mà giao diện Next.js đang dùng.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Luật "ai được đăng nhập" chuyển vào Domain | Yêu cầu đăng ký phải chờ admin duyệt (README mục Luồng người dùng) |
| CQRS, validator, policy phân quyền | Task B-01 |
| 60 test tự động | Task B-02 |
| Không nhận `userId` từ request | Bản vá lỗ hổng curriculum/payments trước đó (PR #65) — giữ nguyên |

## 3. Thay đổi theo commit (review lần lượt từng commit)
| Commit | Nội dung | Build riêng |
|---|---|---|
| `refactor(domain)` | `AppUser.SignInBlock`, `CanSignIn`, `SetApproval()`; hằng `EnrollmentStatus` | ✅ cả solution |
| `refactor(application)` × 5 | Phần khung (interface, `ValidationBehavior`, `LoggingBehavior`, DI) → Auth + Admin → hạn mức khách → Curriculum → Quiz + Payment | ✅ project Application; ⚠️ cả solution **chưa build** cho tới commit WebApi (WebApi cũ còn gọi class đã bỏ) |
| `refactor(infrastructure)` | `Persistence/` → `Data/`, mỗi bảng một `IEntityTypeConfiguration`; `Identity/` (JWT, BCrypt); `GuestQuotaStore`; `AddInfrastructureServices()` | ✅ project Infrastructure |
| `refactor(webapi)` | `Endpoints/` mỏng gửi MediatR; `AddJwtBearer` + policy `SignedInUser`/`SuperAdmin`; `GlobalExceptionHandler` (ProblemDetails) | ✅ cả solution |
| `test(application)` | 41 test qua đúng pipeline MediatR | ✅ |
| `test(webapi)` | 13 test HTTP bằng `WebApplicationFactory` | ✅ |
| `docs` × 2 | Viết lại `docs/06-backend-dotnet.md` theo thực tế; đánh dấu B-01, B-02 xong | — |

### Hành vi thay đổi (có chủ đích)
| Trước | Sau | Vì sao |
|---|---|---|
| Ghi danh / đánh dấu bài với `moduleId`/`topicId` không tồn tại → lỗi khoá ngoại → 500 | 404 kèm câu thông báo | Lỗi của người gọi không phải lỗi hệ thống |
| Đánh dấu được bài của chuyên đề khác | Bị chặn | Tránh "hoàn thành" chuyên đề bằng bài không thuộc về nó |
| `GET /quizzes/simulation` trả luôn đáp án và lời giải | Không trả đáp án trước khi nộp | Chống xem đáp án. Giao diện hiện không gọi endpoint này |
| Xem chi tiết được chuyên đề chưa xuất bản | Bị ẩn như trong danh sách | Nhất quán |
| Tài khoản ngân hàng VietQR viết cứng trong code | Đọc từ cấu hình `Payments__*` (mặc định giữ giá trị cũ) | Không sửa code khi đổi tài khoản |
| Lỗi 401/403 và lỗi hệ thống có lúc trả body rỗng | Luôn có JSON `{ success, message }`; lỗi theo chuẩn ProblemDetails | Giao diện hiện được câu thông báo |
| JSON sai dạng ở Production → 400 body rỗng | 400 kèm câu "Dữ liệu gửi lên không đúng định dạng…" | Như trên |
| Mã chứng chỉ, mã đơn dùng `Random` | `RandomNumberGenerator` | Mã tra cứu công khai không nên đoán được |

## 4. Kiểm thử (đã chạy thật)
- `dotnet build`: 0 lỗi, 0 cảnh báo.
- `dotnet test`: **60/60 qua** — Domain 6, Application 41, tích hợp HTTP 13. Lần chạy đầu 40/41 do **test viết sai** (tìm cụm "Nội dung bài" trong khi câu khoá nội dung cũng chứa cụm này); đã sửa test cho so khớp chính xác, không sửa code.
- Build lại trên bản sạch (worktree riêng) ở commit Domain và commit WebApi để chắc từng mốc build được như bảng mục 3.
- Chạy thử bản `dotnet publish` Release:
  - Không đặt `Jwt__Secret` → API dừng ngay: `OptionsValidationException: Thiếu cấu hình Jwt:Secret (tối thiểu 32 ký tự)…`.
  - Đủ cấu hình: `GET /api/v1/health` → `healthy`; `GET /api/v1/auth/me` không token → 401 + `WWW-Authenticate: Bearer` + JSON; database không kết nối được → 500 ProblemDetails, không lộ chi tiết lỗi.
- **Chưa** chạy với Postgres thật (Docker trên máy không khởi động được). Câu SQL đếm hạn mức khách giữ nguyên như trước, chưa có test trên Postgres.
- `npm run verify` chạy qua hook pre-push khi push nhánh này.

## 5. Tài liệu & changelog
- `docs/06-backend-dotnet.md` viết lại: bỏ các "trụ cột" chưa có trong code (SignalR, ASP.NET Core Identity, refresh token, microservice, Docker Swarm), thay bằng sơ đồ tầng, luồng một request, bảng mã lỗi, cấu hình, bộ test, bảng "đã có / chưa có".
- Không ghi `spec.md` §9: không đổi tính năng hay chuẩn đạt.

## 6. Rủi ro / việc còn lại
- Thư viện mới: MediatR **12.5.0** (bản cuối giấy phép Apache-2.0; từ 13.x cần license thương mại), FluentValidation 12, JwtBearer 10. Không dùng AutoMapper (bản mới cũng cần license) — ánh xạ DTO viết tay.
- `Application` tham chiếu EF Core để dùng `DbSet` qua `IApplicationDbContext` — cách làm phổ biến trong Clean Architecture .NET; nếu muốn tách hẳn thì thay bằng repository.
- Chưa deploy (task B-03), chưa giới hạn số lần đăng nhập (B-06), chưa có Swagger (B-10).
