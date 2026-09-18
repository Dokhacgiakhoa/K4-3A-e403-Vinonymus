# PR: Prepare isolated Supabase database for .NET backend

> **Task:** D-01 · **Issue:** #84 · **Branch:** `feat/D-01-supabase-dotnet-database`
> **Người thực hiện:** Trần Nhật Minh (`@Minh`) · **Hỗ trợ:** —

## 1. Mục tiêu

Tách bảng nghiệp vụ của backend .NET vào schema `app`, không lẫn với FAQ/RAG
hiện có ở `public`. Chuẩn bị quy trình tạo role `aiia_backend` theo nguyên tắc
ít quyền và kết nối backend mà không đưa secret vào repo.

## 2. Truy vết

| Thay đổi | Yêu cầu liên quan |
|---|---|
| Schema `app`, migration và role backend | D-01 / #84 |

## 3. File thay đổi

| File | Thay đổi |
|---|---|
| `codebase/database/migrations/*.sql` | Đặt migration .NET vào schema `app`. |
| `codebase/backend-core/src/Infrastructure/Data/*` | EF Core mặc định dùng `app`; quota SQL chỉ rõ schema. |
| `docs/supabase-dotnet-setup.md` | Đề xuất, lệnh vận hành và kiểm thử bàn giao. |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Cập nhật trạng thái D-01. |

## 4. Kiểm thử

- Kết nối pooler Supabase thật bằng chuỗi admin được cung cấp (secret không ghi
  vào repo/log): thành công.
- 5/5 migration áp dụng thành công; role `aiia_backend` tạo và cấp quyền trên
  schema `app` thành công.
- Kiểm thử bằng role backend: `current_user=aiia_backend`, `users_count=0`,
  `app_table_count=11`.
- `dotnet restore` thành công; test .NET chạy từ thư mục tạm ngoài OneDrive:
  Domain `6/6`, Application `41/41`, WebApi Integration `13/13` — tổng `60/60`.
- Guard tĩnh cho migration và wiring EF Core: pass.

## 5. Tài liệu & changelog

- Thêm `docs/supabase-dotnet-setup.md`.

## 6. Rủi ro / việc còn lại

- Cần @Khoa duyệt đề xuất schema `app` trên PR; không còn thao tác database nào
  cần tài khoản quản trị để bàn giao.

Closes #84
