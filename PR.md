# PR: Add audit log for account and document actions

> **Task:** D-04 · **Issue:** #87 · **Branch:** `feat/D-04-audit-log`
> **Người thực hiện:** Trần Nhật Minh (`@Minh`) · **Hỗ trợ:** —

## 1. Mục tiêu

Thêm bảng audit append-only trong schema `app` để ghi ai thực hiện thao tác gì,
lên tài nguyên nào và lúc nào. Thiết kế dùng `app.users`, không phụ thuộc
Supabase Auth; role backend chỉ được đọc và thêm log, không được sửa/xoá.

## 2. Truy vết

| Thay đổi | Yêu cầu liên quan |
|---|---|
| `app.platform_audit` và index thời gian | D-04 / #87; D-01 / #84 |
| Actor FK và loại tài nguyên account/document | D-02 / #85 |

## 3. File thay đổi

| File | Thay đổi |
|---|---|
| `codebase/database/migrations/20260918_platform_audit.sql` | Tạo audit log, CHECK/FK, index thời gian/resource/actor và quyền append-only. |
| `docs/diagrams/database-class-diagram.mmd` | Bổ sung `PlatformAudit` và `AuditResourceType`. |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Cập nhật trạng thái D-04. |
| `PR.md` | Ghi kiểm thử thật của PR này. |

## 4. Kiểm thử

- Migration chạy thành công 2 lần liên tiếp trên Supabase.
- Bảng `app.platform_audit` và index `idx_platform_audit_created_at` tồn tại.
- Kết nối bằng role `aiia_backend`: ghi 2 log mẫu (`account.approve`,
  `document.submit`) và đọc đúng thứ tự thời gian mới nhất trước.
- Dữ liệu kiểm thử đã được xoá bằng admin sau khi xác minh; không ghi secret vào
  repository/log.

## 5. Tài liệu & changelog

- Sơ đồ database khớp migration mới.

## 6. Rủi ro / việc còn lại

- API gọi audit log sẽ được tích hợp trong các task backend duyệt tài khoản/tài liệu.
- Log được thiết kế append-only ở quyền ứng dụng; thao tác xoá khẩn cấp cần DBA.

Closes #87
