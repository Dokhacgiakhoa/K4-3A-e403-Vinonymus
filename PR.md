# PR: Viết lại luồng người dùng trong README theo 4 vai trò

> **Task:** làm rõ luồng người dùng · **Issue:** — · **Branch:** `docs/readme-four-role-flows`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Mục "Luồng người dùng" trong README trước đây chỉ mô tả **một** luồng (học viên mở `/personalized-path`), và ghi sai rằng trang đó "không cần đăng nhập" — sai từ khi thêm phần bắt đăng nhập và duyệt tài khoản.

PR này viết lại thành **4 luồng theo vai trò**: Viewer (chưa đăng nhập) · Student · Lecturer · Admin, kèm tình trạng thật của từng vai trò (cái nào đã làm, cái nào chưa có giao diện, cái nào chờ deploy).

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| 4 vai trò | `backend-core/src/Core/Domain/Enums/UserRole.cs` (`Visitor` / `Member` / `Lecture` / `SuperAdmin`) |
| Hạn mức khách 10 câu/ngày | `codebase/src/lib/server/guest-quota.ts` (`GUEST_DAILY_LIMIT`) |
| Bắt đăng nhập chỉ khi có backend | `codebase/src/lib/server/session.ts` (`isLoginEnforced`) |
| Duyệt tài khoản | `codebase/src/app/admin/approvals/page.tsx`, `backend-core/src/WebApi/Services/AdminWebService.cs` |
| Sơ đồ API 4 vai trò đã có sẵn | `role-flow.mmd` |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `README.md` | Mục "Luồng người dùng": thêm bảng 4 vai trò + sơ đồ Mermaid tổng, đổi luồng cũ thành mục con "Luồng Student — phần được chấm". Mục "Luồng vận hành (quản trị)": bỏ câu "không có giao diện admin" (đã sai vì có `/admin/approvals`) và bỏ chữ "lát cắt dự thi" |
| `docs/05-ui-flow.md` | Sửa câu "`/personalized-path` không cần đăng nhập" thành mô tả đúng: dành cho Student, chỉ mở tự do khi chưa khai báo backend |
| `docs/02-kien-truc.md` | Chú thích cây thư mục: "(không cần đăng nhập)" → "(vai trò Student)" |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Cú pháp sơ đồ Mermaid mới: đã render kiểm tra, kết quả `valid: true`, `diagramType: flowchart`.
- Đối chiếu từng dòng trong bảng vai trò với code thật (các file ở mục 2) trước khi viết — không ghi vai trò nào là "đã làm" nếu chưa có code.
- `npm run verify` chạy qua hook pre-push (PR này chỉ đổi tài liệu, không đổi code).

## 5. Tài liệu & changelog
Không ghi `spec.md` §9: không đổi sản phẩm hay chuẩn đạt, chỉ mô tả đúng cái đang có.

## 6. Rủi ro / việc còn lại
- **Lecturer chưa có giao diện.** README ghi rõ là ❌, nhưng đây vẫn là lỗ hổng lớn nhất so với mô tả sản phẩm (nhiệm vụ 2 của AI Mentor: đọc tài liệu giảng viên tải lên). Thư viện hiện do nhóm soạn tay trong `planner-catalog.ts`.
- Vai trò trong Next.js (`client-storage.ts`: `student` / `community` / `admin`, gói `free` / `pro`) **chưa khớp** 4 vai trò của backend. Chưa gộp lại trong PR này vì đụng vào luồng tài khoản đang chạy.
- Việc bắt đăng nhập chỉ bật khi có `NEXT_PUBLIC_BACKEND_CORE_URL`; backend .NET chưa deploy nên web thật vẫn chạy mở.
