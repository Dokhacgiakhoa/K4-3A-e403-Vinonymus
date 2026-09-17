# PR: Vá lỗ hổng curriculum/payments nhận userId từ trình duyệt

> **Task:** bảo mật backend .NET · **Issue:** — · **Branch:** `fix/curriculum-auth`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Các endpoint `curriculum/*` và `payments/vietqr` nhận `userId` từ query hoặc body mà không kiểm tra token. Ai biết (hoặc đoán được) mã người dùng khác đều có thể:
- ghi danh hoặc huỷ ghi danh thay họ;
- đổi tiến độ học của họ;
- xem chứng chỉ của họ;
- tạo hoá đơn đứng tên họ.

PR này cho backend **lấy người dùng từ token** (tài khoản đang hoạt động và đã được duyệt) và bỏ hẳn `userId` khỏi request.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Xác định người dùng từ token | Việc còn lại ghi trong PR #64; `AGENTS.md` bất biến #6 |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `backend-core/src/WebApi/Program.cs` | Thêm hàm lấy người dùng hiện tại từ token. Các thao tác ghi danh, huỷ ghi danh, đánh dấu tiến độ, xem chứng chỉ, tạo hoá đơn trả `401` nếu chưa đăng nhập. Xem danh sách và chi tiết chuyên đề vẫn mở; có token thì kèm tiến độ của chính người đó |
| `backend-core/src/Core/Application/Features/Curriculum/CurriculumFullDtos.cs` | Bỏ `UserId` khỏi `EnrollCourseRequest`, `ToggleTopicProgressRequest` |
| `CreatePaymentDto` (trong `Program.cs`) | Bỏ `UserId` |
| `src/lib/api/curriculum-backend-client.ts` | Gửi kèm token; bỏ tham số `userId` |
| `src/lib/client-storage.ts` | Gọi hàm ghi danh và huỷ ghi danh theo tham số mới |
| `docs/03-api.md`, `docs/06-backend-dotnet.md` | Cập nhật bảng endpoint; bỏ ghi chú lỗ hổng |

`SubmitQuizRequest` vẫn còn trường `UserId` nhưng không được dùng để đọc hay ghi dữ liệu nào, nên giữ nguyên.

## 4. Kiểm thử
- `dotnet build`: qua. `dotnet test`: 5/5 qua.
- `npm run verify`: qua (78 test).
- **Chưa kiểm thử:** gọi thật các endpoint với backend và Postgres đang chạy (backend chưa deploy, Docker trên máy không khởi động được).

## 5. Tài liệu & changelog
Không ghi `spec.md` §9 vì không đổi tính năng được chấm.

## 6. Rủi ro / việc còn lại
- Người chưa đăng nhập bấm ghi danh: trình duyệt vẫn lưu vào `localStorage` như trước, còn lời gọi đồng bộ lên backend trả `401` và bị bỏ qua.
