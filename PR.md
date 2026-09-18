# PR: Tích hợp giao diện quản trị viên và giảng viên

> **Task:** Frontend Admin/Lecture · **Issue:** Chưa gắn issue · **Branch:** `nduc`
> **Người thực hiện:** `nduc` · **Nguồn giao diện:** nhánh `front-back`

## 1. Mục tiêu

- Đưa toàn bộ giao diện quản trị người dùng, tài liệu, nhật ký và số liệu hệ thống vào `/admin`.
- Đưa không gian quản lý vòng đời tài liệu của giảng viên vào `/lecture`.
- Giữ lại báo cáo khảo sát và chức năng quản trị giáo trình đang có trên `main`.
- Thêm chuyển đổi giao diện sáng/tối cho khách và người dùng đã đăng nhập.
- Không đưa bất kỳ thay đổi AI Helpdesk, RAG, dữ liệu riêng tư hay migration của Helpdesk vào PR.

## 2. Truy vết

| Thay đổi | Yêu cầu liên quan |
|---|---|
| Admin xem số liệu, lọc người dùng, đổi vai trò/gói/trạng thái và xem chi tiết | API bốn vai trò: Admin |
| Admin duyệt/xuất bản/lưu trữ/xóa tài liệu và xem nhật ký kiểm toán | API bốn vai trò: Admin |
| Giảng viên tạo/sửa/gửi duyệt tài liệu, xem phiên bản và phản hồi | API bốn vai trò: Lecture |
| Tab Khảo sát và cửa sổ Quản trị giáo trình | Bảo toàn chức năng Admin hiện có trên `main` |
| Route `/lecture`, menu theo vai trò và StaffGuard | Kiểm soát truy cập giao diện theo vai trò |
| Light/dark mode | Yêu cầu review giao diện Admin/Lecture |

## 3. File thay đổi

| Nhóm file | Thay đổi |
|---|---|
| `codebase/src/app/lecture/page.tsx` | Route không gian giảng viên |
| `codebase/src/components/views/lecture/lecture-dashboard-view.tsx` | Màn hình giảng viên |
| `codebase/src/components/views/admin/admin-cockpit-dashboard-view.tsx` | Console Admin và tab Khảo sát |
| `codebase/src/components/staff/document-manager.tsx` | Giao diện vòng đời tài liệu dùng chung |
| `codebase/src/components/staff/staff-guard.tsx` | Xác minh vai trò trước khi hiển thị |
| `codebase/src/lib/api/staff-backend-client.ts`, `codebase/src/types/staff.ts` | Client và kiểu dữ liệu cho API nhân sự |
| `codebase/src/components/theme/*`, `codebase/src/app/layout.tsx`, `codebase/src/app/globals.css`, `codebase/tailwind.config.ts` | Theme sáng/tối và style staff |
| `codebase/src/components/layout/*` | Menu `/lecture`, nút chuyển theme và màu chữ theo theme |

## 4. Kiểm thử thực tế

- `npm run verify`: đạt.
- Lint: đạt; chỉ còn các cảnh báo `<img>` và hook đã tồn tại từ trước.
- TypeScript: đạt, không lỗi.
- Vitest: 19/19 file, 101/101 test đạt.
- FAQ audit: 53 file, 0 lỗi nặng, 0 cảnh báo.
- Production build: đạt; sinh thành công `/admin` và `/lecture`.

## 5. Tài liệu & changelog

- Không đổi `spec.md` hoặc chuẩn đạt CP4.
- Không thay đổi prompt nên không chạy lại golden set.

## 6. Rủi ro / việc còn lại

- Giao diện staff gọi hợp đồng API `/api/v1/me`, `/api/v1/lecture/documents`, `/api/v1/admin/analytics`, `/api/v1/admin/audit` và các endpoint cập nhật tương ứng. Backend `.NET` hiện tại trên `main` chưa có đủ toàn bộ endpoint này; cần ghép backend bốn vai trò tương ứng trước khi các thao tác chạy trọn vẹn trên môi trường deploy.
- PR này không chứa file trong `codebase/data/private-documents/`, khóa môi trường, migration hoặc mã AI Helpdesk.
