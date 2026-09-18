# D-01 — Supabase cho backend .NET

## Đề xuất cần @Khoa duyệt

Dùng chung một Supabase project để không phát sinh thêm hạ tầng, nhưng tách dữ
liệu theo schema:

| Schema | Chủ sở hữu | Nội dung |
|---|---|---|
| `public` | Next.js/RAG hiện có | FAQ, embedding, log và RPC cũ |
| `app` | backend .NET | `users`, giáo trình, ghi danh, bài kiểm tra, thanh toán và quota |

EF Core đã đặt default schema là `app`; vì vậy API .NET sẽ không vô tình đọc
hoặc ghi vào các bảng RAG. Đây là đề xuất D-01 đang chờ @Khoa phê duyệt trước
khi áp dụng lên project dùng chung.

## Áp dụng lần đầu trên Supabase

Chỉ người có quyền quản trị database thực hiện các bước này. Không đưa mật khẩu
vào Git, PR, Discord hoặc log CI.

Project cũ đã có `.env.local` với `SUPABASE_DB_URL`, nhưng đây là secret vận hành
và không được sao chép vào project mới. Chuỗi cũ hiện trỏ tới direct host không
phân giải được; hãy lấy lại connection string mới từ Supabase **Connect** sau
khi xác nhận project còn hoạt động. Không dùng tài khoản `postgres` cũ làm tài
khoản chạy backend.

1. Trong Supabase SQL Editor, chạy lần lượt năm file trong
   `codebase/database/migrations/` theo thứ tự tên. Migration đầu tạo schema
   `app`; các migration sau đặt `search_path` là `app, public`.
2. Tạo một mật khẩu dài, ngẫu nhiên trong password manager của nhóm. Trong SQL
   Editor, thay đúng **một lần** giá trị placeholder rồi chạy:

   ```sql
   create role aiia_backend login password '<GENERATED_SECRET>'
     nosuperuser nocreatedb nocreaterole noinherit nobypassrls;

   grant usage on schema app to aiia_backend;
   grant select, insert, update, delete on all tables in schema app to aiia_backend;
   grant usage, select on all sequences in schema app to aiia_backend;
   alter default privileges in schema app
     grant select, insert, update, delete on tables to aiia_backend;
   alter default privileges in schema app
     grant usage, select on sequences to aiia_backend;
   ```

   Role này không có quyền `CREATEDB`, `CREATEROLE`, `SUPERUSER`, `BYPASSRLS`,
   cũng không được cấp quyền trên schema `public`.
3. Lấy **direct connection string** từ Supabase (không phải service-role key),
   thay username bằng `aiia_backend`, rồi đặt secret trên host backend:

   ```text
   ConnectionStrings__DefaultConnection=Host=...;Port=5432;Database=postgres;Username=aiia_backend;Password=...;Ssl Mode=Require
   ```

   Không đặt biến này trong `appsettings*.json` hoặc `.env.example`.

## Kiểm thử bàn giao

Từ đúng môi trường đã đặt secret, chạy:

```powershell
cd codebase/backend-core
dotnet run --project src/WebApi
```

Sau đó gọi endpoint đọc dữ liệu cần xác thực hoặc dùng truy vấn kiểm tra bằng
role backend:

```sql
select current_user, table_schema, table_name
from information_schema.tables
where table_schema = 'app' and table_name = 'users';

select count(*) from app.users;
```

Kết quả mong đợi: `current_user = aiia_backend`, nhìn thấy `app.users`, và
truy vấn `count(*)` thành công. Khi hoàn tất, ghi đúng kết quả thực tế (không có
connection string) vào `PR.md` và chuyển D-01 sang ✅.

## Tái sử dụng từ dự án cũ

Đã đối chiếu `K4-A3-e403-Vinonymus`: ba migration nền (`core`, `auth`,
`curriculum`) và cấu hình EF Core/Npgsql đã có thể tái sử dụng, đồng thời dự án
mới đã bổ sung migration approval và guest quota. Không sao chép các thay đổi
chưa commit của dự án cũ, nên tránh trộn code Next.js cũ vào backend .NET mới.
