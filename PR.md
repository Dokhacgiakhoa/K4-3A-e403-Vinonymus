# PR: Đăng ký chờ duyệt, hạn mức AI Helpdesk cho khách, khoá AI Mentor sau đăng nhập

> **Task:** mô hình truy cập (quyết định 17/9) · **Issue:** — · **Branch:** `feat/account-approval-guest-quota`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
- **AI Helpdesk** miễn phí cho khách nhưng giới hạn **10 câu/ngày**. Đăng nhập thì không giới hạn.
- **Đăng nhập mới dùng đủ 2 AI:** tính năng Lộ trình cá nhân hoá (AI Mentor) chỉ dành cho tài khoản đã được duyệt.
- **Đăng ký phải chờ quản trị viên duyệt**, không đăng nhập ngay. Admin duyệt ở trang `/admin/approvals`.
- Vá lỗ hổng: `POST /api/v1/auth/oauth-sync` trước đây cấp token cho **bất kỳ email nào** mà không cần xác thực.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Hạn mức khách, khoá AI Mentor, duyệt tài khoản | `spec.md` phần Phạm vi và §9; `docs/03-api.md` mục 1, 2, 4 |
| Validate đầu vào, không lộ lỗi | `AGENTS.md` bất biến #6 và mục Code (thông báo lỗi tiếng Việt, không lộ stack trace) |
| Bỏ JWT secret khỏi repo | `AGENTS.md` bất biến #1, #7 |
| Migration SQL | `AGENTS.md` bất biến #8 (`codebase/database/migrations/`) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| **Backend .NET** | |
| `backend-core/src/Core/Domain/Enums/AccountApprovalStatus.cs`, `Entities/AppUser.cs` | Trạng thái Chờ duyệt / Đã duyệt / Từ chối; mặc định Chờ duyệt |
| `backend-core/src/WebApi/Services/AuthWebService.cs` | Đăng ký không cấp token; đăng nhập và `/auth/me` chặn tài khoản chưa duyệt; secret bắt buộc lấy từ cấu hình (≥ 32 ký tự); lỗi không lộ chi tiết; mật khẩu tối thiểu 8 ký tự |
| `backend-core/src/WebApi/Services/AdminWebService.cs` | Liệt kê tài khoản theo trạng thái, duyệt/từ chối; quyền SuperAdmin đọc từ DB |
| `backend-core/src/WebApi/Services/GuestQuotaWebService.cs` | Bộ đếm lượt khách theo ngày (giờ VN), chỉ nhận mã băm |
| `backend-core/src/WebApi/Program.cs` | Endpoint admin, endpoint đếm lượt, khoá nội bộ cho `oauth-sync`, đọc `DATABASE_URL`, dừng khi thiếu JWT secret |
| `backend-core/src/WebApi/appsettings*.json` | Bỏ secret và mật khẩu khỏi file chung; secret riêng cho môi trường dev; CORS thêm 2 domain web thật |
| `backend-core/Dockerfile`, `.dockerignore` | Đóng gói để deploy |
| `backend-core/tests/Domain.UnitTests/AccountApprovalUnitTests.cs` | 2 test |
| `database/migrations/20260917_*.sql` | Cột `approval_status` (tài khoản cũ coi như đã duyệt); bảng `guest_quota_usage` |
| **Next.js** | |
| `src/lib/server/backend.ts`, `session.ts`, `guest-quota.ts` | Gọi backend từ server; xác thực token qua `/auth/me` (nhớ 60 giây); đếm lượt khách, rơi về bộ nhớ khi chưa có backend |
| `src/app/api/chat/route.ts` | Khách hết lượt → `429 GUEST_QUOTA_EXCEEDED`; header số lượt còn lại |
| `src/app/api/roadmap/route.ts` | `401 LOGIN_REQUIRED` khi đã cấu hình backend mà chưa đăng nhập |
| `src/app/api/auth/callback/[provider]/route.ts` | Gửi `X-Internal-Key` khi gọi `oauth-sync` |
| `src/lib/api/auth-backend-client.ts` | Header xác thực; API admin duyệt tài khoản |
| `src/components/auth/auth-modal.tsx` | Đăng ký xong báo "chờ duyệt", không tự đăng nhập; **bỏ tài khoản demo và mật khẩu ghi cứng** |
| `src/components/chat/chat-box.tsx` | Gửi token; hiện "Còn X/10 câu miễn phí hôm nay" và nút đăng nhập; báo khi hết lượt |
| `src/components/planner/study-planner.tsx` | Gửi token; màn "Tính năng dành cho học viên đã đăng nhập" |
| `src/app/admin/approvals/page.tsx`, `src/components/admin/account-approval-view.tsx` | Trang duyệt tài khoản |
| `src/components/layout/app-sidebar.tsx` | Mục "Lộ trình cá nhân hoá"; mục "Duyệt tài khoản" cho admin |
| `tests/unit/guest-access.test.ts` | 11 test |
| `.env.example`, `README.md`, `spec.md`, `docs/03-api.md`, `docs/06-backend-dotnet.md`, `eval/run_results.md` | Tài liệu |

## 4. Kiểm thử
- `dotnet build`: qua. `dotnet test`: 5/5 qua.
- `npm run verify`: qua (78 test).
- **Trên máy, chưa có backend:**
  - Gửi 11 câu cùng một phiên tới `/api/chat` → 10 câu đầu 200 (số lượt còn lại giảm 9 → 0), câu thứ 11 trả `429`.
  - Chatbox hiện "Còn 9/10 câu hỏi miễn phí hôm nay"; nút đăng nhập mở modal phủ toàn màn hình.
- **Trên máy, có cấu hình địa chỉ backend** (backend không chạy):
  - `/api/roadmap` không có token hoặc token sai → `401 LOGIN_REQUIRED`.
  - Trang `/personalized-path` hiện màn yêu cầu đăng nhập.
  - Giả lập người dùng có token sai → bấm "Tạo lộ trình" → quay về màn đăng nhập, không dùng gợi ý mặc định.
  - `/admin/approvals` báo "Không kết nối được máy chủ tài khoản".
- **Chưa kiểm thử:** luồng thật đăng ký → chờ duyệt → admin duyệt → đăng nhập với backend và Postgres đang chạy. Docker Desktop trên máy không khởi động được, Railway hết hạn dùng thử.

## 5. Tài liệu & changelog
Đã ghi `spec.md` §9. Chuẩn đạt §7 không đổi.

## 6. Rủi ro / việc còn lại
- **Chưa deploy backend.** Trên web thật hiện tại:
  - không ai đăng nhập được, vì tài khoản demo ghi cứng đã bị bỏ;
  - Lộ trình cá nhân hoá vẫn mở cho mọi người;
  - hạn mức khách đếm trong bộ nhớ nên chỉ chặn được một phần.
- **Khi deploy backend:**
  - đặt `Jwt__Secret` mới (không dùng lại secret cũ từng nằm trong repo);
  - chạy 5 file migration;
  - tạo tài khoản admin và tài khoản demo đã duyệt cho giám khảo;
  - đặt `NEXT_PUBLIC_BACKEND_CORE_URL` trên Vercel. Nếu không đặt được biến môi trường thì sửa địa chỉ mặc định trong code.
- **Các endpoint `curriculum/*`** của backend nhận `userId` từ request mà không kiểm tra token. Cần sửa trước khi mở backend ra internet.
- **OAuth** bị tắt cho tới khi hai phía có cùng `BACKEND_INTERNAL_API_KEY` / `Backend__InternalApiKey`.
