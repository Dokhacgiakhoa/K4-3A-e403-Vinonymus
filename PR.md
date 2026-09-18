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

- Chưa chạy migration/kết nối Supabase: workspace không có Supabase CLI, project
  Supabase đang đăng nhập hoặc connection string cho role backend.
- `dotnet test --no-restore` đã thử chạy nhưng máy hiện không cài .NET SDK
  (`dotnet` không được nhận diện), nên chưa có kết quả test .NET.
- Guard tĩnh cho 5 migration và wiring EF Core: pass. `git diff --check` toàn
  repo bị chặn bởi các đường dẫn legacy vượt giới hạn Windows, không liên quan
  đến thay đổi D-01.

## 5. Tài liệu & changelog

- Thêm `docs/supabase-dotnet-setup.md`.

## 6. Rủi ro / việc còn lại

- Cần @Khoa duyệt schema `app`, quyền quản trị project Supabase để chạy migration
  và tạo role, sau đó kiểm thử backend đọc `app.users`.

Closes #84
