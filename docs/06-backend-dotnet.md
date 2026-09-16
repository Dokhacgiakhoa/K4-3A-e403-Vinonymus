# 06 — Backend .NET (chưa tích hợp)

> ⚠️ **Không thuộc lát cắt dự thi.** Nhóm quyết định giữ code trong `codebase/backend-core/` và `codebase/database/` cho giai đoạn sau.
> - App Next.js gọi backend này qua `src/lib/api/auth-backend-client.ts` và `curriculum-backend-client.ts` (mặc định `http://localhost:5000`), có **fallback tự động** khi .NET không chạy.
> - Không cần chạy .NET để demo.
> - `appsettings.json` đang ghi cứng JWT secret và mật khẩu Postgres dev — phải chuyển sang biến môi trường trước khi dùng thật.
>
> Nội dung bên dưới là README gốc của `backend-core/`.

---

## AIIA BACKEND CORE (.NET 10 LTS - C# 14)

> **HẠT NHÂN TRUNG TÂM (SYSTEM ANCHOR)** CỦA NỀN TẢNG AI THỰC CHIẾN (AIIA).
> Tuân thủ nghiêm ngặt **Clean Architecture** và bộ khung 6 Trụ Cột Tri Thức Chuyên Sâu.

---

## 🏛️ 6 TRỤ CỘT KIẾN THỨC CỐT LÕI (CORE KNOWLEDGE PILLARS)

### 1. Nền Tảng C# & Tư Duy Lập Trình Chuyên Sâu
* **Lập trình hướng đối tượng (OOP):** Kế thừa (Inheritance), Đóng gói (Encapsulation), Đa hình (Polymorphism), Trừu tượng hóa (Abstraction) và trọn bộ 5 nguyên lý **SOLID**.
* **Xử lý bất đồng bộ (Asynchronous Programming):** Cơ chế chuyên sâu của sync/wait, Task, ValueTask, giải phóng Thread Pool và tối ưu hóa I/O throughput.
* **LINQ & Generic Collections:** Truy vấn dữ liệu hiệu năng cao, tối ưu phân bổ bộ nhớ (Allocation-free), kiểm soát chặt chẽ Deferred Execution (tránh gọi nhiều lần không cần thiết).

### 2. Kiến Trúc Ứng Dụng & Design Patterns
* **Clean Architecture:** Phân tách 4 lớp độc lập: Domain (Core Entity/Enums) $\leftarrow$ Application (Use Cases/DTOs) $\leftarrow$ Infrastructure (EF Core/PostgreSQL) $\leftarrow$ WebApi (Minimal APIs/Presentation).
* **Mô hình 3 lớp truyền thống:** Áp dụng luồng chuẩn **Controller - Service - Repository** khi cần mở rộng module.
* **Design Patterns cốt lõi:**
  * **Repository & Unit of Work:** Trừu tượng hóa truy cập dữ liệu, cô lập DbContext và đảm bảo tính toàn vẹn Transaction ACID.
  * **CQRS (Command Query Responsibility Segregation):** Tách biệt luồng Command (Ghi/Cập nhật) và Query (Đọc) để tối ưu hiệu suất.
  * **Dependency Injection (DI):** Kiểm soát chính xác vòng đời dịch vụ (Transient, Scoped, Singleton), ngăn ngừa Memory Leak và Captive Dependencies.

### 3. Cơ Sở Dữ Liệu & Entity Framework Core (EF Core 10)
* **EF Core Code-First:** Thiết kế Entity thuần C#, cấu hình Fluent API mapping schema snake_case, quản lý Migrations (database/migrations/).
* **Tối ưu truy vấn:** Tuyệt đối phòng ngừa lỗi kinh điển **N+1**, áp dụng .AsNoTracking() cho 100% truy vấn chỉ đọc (Read-only queries), giám sát câu lệnh SQL phát sinh.
* **Scaffolding:** Khả năng sinh mã tự động nhanh cho CRUD, Schema và API endpoints.

### 4. Xây Dựng Web API & MVC
* **RESTful Web API & Minimal APIs:** Thiết kế chuẩn RESTful, Model Validation tự động, định dạng phản hồi chuẩn hóa (success, data, message), tích hợp Swagger / OpenAPI Native trong .NET 10.
* **ASP.NET Core MVC:** Luồng điều hướng Controller - View, truyền dữ liệu an toàn qua ViewModel và Razor Pages.
* **SignalR:** Kênh truyền thông hai chiều thời gian thực (Real-time duplex) phục vụ chấm điểm thi, cập nhật tiến độ học tập và thông báo hệ thống.

### 5. Bảo Mật & Xác Thực (Security & Identity)
* **ASP.NET Core Identity:** Quản lý học viên, phân quyền đa tầng theo vai trò (**Role-based**) và chính sách (**Policy-based / Claim-based**).
* **JWT (JSON Web Token):** Cấp phát Bearer Token, mã hóa an toàn, phân tách Access Token ngắn hạn và Refresh Token bảo mật.

### 6. Triển Khai Nâng Cao & DevOps
* **Containerization:** Đóng gói ứng dụng .NET 10 bằng Multi-stage Dockerfile siêu nhẹ (Alpine Base), tối ưu kích thước image production.
* **CI/CD & Cloud:** Pipeline tự động hóa kiểm thử (xUnit) và triển khai lên hạ tầng Cloud Azure / Docker Swarm.
* **Microservices & Load Balancing:** Tư duy phân rã microservice độc lập, kết nối với Python FastAPI AI Services và cân bằng tải khi mở rộng quy mô 20.000+ học viên.

---

## 📂 CẤU TRÚC THƯ MỤC BACKEND CORE

```
backend-core/
├── AIIANotebook.slnx             # Solution configuration (.NET 10)
├── src/
│   ├── Core/
│   │   ├── Domain/               # Lớp thực thể hạt nhân (Entities, Enums, ValueObjects)
│   │   └── Application/          # Lớp nghiệp vụ & use case (Interfaces, DTOs, Queries, Commands)
│   ├── Infrastructure/           # Lớp công nghệ & cơ sở hạ tầng (EF Core, Npgsql, Repositories)
│   └── WebApi/                   # Lớp cổng giao tiếp (Minimal APIs, Endpoints, DI Configuration)
└── tests/                        # Kiểm thử tự động (Unit Tests, Integration Tests)
```
