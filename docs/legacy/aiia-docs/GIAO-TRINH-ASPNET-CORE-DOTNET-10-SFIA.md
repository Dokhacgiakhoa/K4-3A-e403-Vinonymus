# GIÁO TRÌNH CHUYÊN SÂU: ASP.NET CORE (.NET 10) CHUẨN KHUNG NĂNG LỰC SFIA 8

> **Chuẩn Khung Năng Lực Quốc Tế**: SFIA 8 (Skills Framework for the Information Age - Version 8)  
> **Nền Tảng Công Nghệ**: C# 14 & .NET 10 (LTS)  
> **Mục Tiêu**: Xây dựng Nền tảng Khảo thí & AI Hub cấp Doanh nghiệp (Enterprise Scale - 20.000 Học viên).

---

## 🎯 MA TRẬN 4 CẤP ĐỘ NĂNG LỰC SFIA 8

```
┌────────────────────────────────────────────────────────────────────────┐
│ SFIA Level 1: Follow & Fundamentals (Nền Tảng C# & Kiến Trúc Cốt Lõi)   │
├────────────────────────────────────────────────────────────────────────┤
│ SFIA Level 2: Assist & Hands-on Code (EF Core 10, MVC, Razor, Web API) │
├────────────────────────────────────────────────────────────────────────┤
│ SFIA Level 3: Apply & Integration (Security, Identity, JWT & RBAC)     │
├────────────────────────────────────────────────────────────────────────┤
│ SFIA Level 4: Enable & Architecture (Clean Arch, CQRS, Redis, Docker)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📘 PHÂN VÙNG CHI TIẾT THEO 4 CẤP ĐỘ SFIA:

### 🥉 SFIA LEVEL 1: FOLLOW & FUNDAMENTALS (BẬC 1: NỀN TẢNG CỐT LÕI)

#### 1. Nền Tảng C# 14 & .NET 10 Chuyên Sâu:
- **C# OOP & Type System**: Nắm vững OOP nâng cao, Generics, Collections, Delegates, Events và LINQ chuyên sâu.
- **Xử lý Bất Đồng Bộ (Asynchronous Programming)**: Cơ chế hoạt động của `async`/`await`, `Task`, `ValueTask`, `Task.WhenAll`, chống nghẽn luồng (*Thread Starvation*).
- **Dependency Injection (DI) & IoC Container**: Hiểu rõ IoC Container tích hợp sẵn trong .NET và các vòng đời dịch vụ (`Transient`, `Scoped`, `Singleton`).

#### 2. Kiến Trúc & Thành Phần Cốt Lõi của ASP.NET Core:
- **Middleware Pipeline**: Cơ chế xử lý chuỗi Request/Response, cách tạo Custom Middleware xử lý lỗi toàn cục và logging.
- **Cấu hình & Quản lý Môi trường**: Sử dụng `appsettings.json`, User Secrets, biến môi trường (`.env`) và Options Pattern (`IOptions`, `IOptionsSnapshot`).
- **Routing**: Cơ chế định tuyến Conventional Routing và Attribute Routing.
- **Logging**: Tích hợp ILogger mặc định và Serilog structured logging.

---

### 🥈 SFIA LEVEL 2: ASSIST & HANDS-ON CODE (BẬC 2: PHÁT TRIỂN & XỬ LÝ DỮ LIỆU)

#### 3. ASP.NET Core MVC & Razor Pages (Quản Trị Admin & Kế Toán):
- **Mô hình MVC**: Phân tách trách nhiệm giữa Controller, Model và View.
- **Giao diện Razor**: Cú pháp Razor, Tag Helpers, ViewComponents, Partial Views và Layout.
- **Dữ liệu & Xác thực**: Model Binding, Data Annotations và thư viện FluentValidation.
- **Quản lý Trạng Thái**: Session, Cookie, TempData, In-memory Cache.

#### 4. Thao Tác Cơ Sở Dữ Liệu Với EF Core 10 (Entity Framework Core):
- **Tiếp cận CSDL**: Thành thạo Code-First (Tạo Models $\rightarrow$ Migrations $\rightarrow$ Database) và Database-First (`Scaffold-DbContext`).
- **Truy vấn LINQ to Entities Tối Ưu**: Xử lý `.AsNoTracking()`, Eager Loading (`.Include()`), Explicit Loading và Split Queries.
- **Quan hệ Thực thể**: Cấu hình 1-1, 1-N, N-N bằng Fluent API và Data Annotations.
- **Design Pattern Dữ Liệu**: Triển khai Repository Pattern và Unit of Work để trừu tượng hóa tầng dữ liệu và bảo toàn Transaction.

#### 5. Xây Dựng RESTful Web API & Minimal API:
- **Thiết kế Web API Chuẩn RESTful**: Xử lý HTTP Verbs (GET, POST, PUT, PATCH, DELETE) và HTTP Status Codes chuẩn mực.
- **Minimal APIs trong .NET 10**: Cách tiếp cận viết API tinh gọn, tối ưu hiệu năng cho microservices và bài thi trắc nghiệm tốc độ cao.
- **Xử lý Dữ liệu**: Sử dụng DTOs (Data Transfer Objects), ánh xạ tự động với Mapster/AutoMapper.
- **Tài liệu & Test API**: Tích hợp Swagger / OpenAPI Native trong .NET 10.
- **SignalR Real-time Duplex**: Xử lý kênh truyền thông hai chiều thời gian thực phục vụ cập nhật tiến độ học, nộp bài trắc nghiệm và thông báo tức thì.

---

### 🥇 SFIA LEVEL 3: APPLY & INTEGRATION (BẬC 3: AN NINH, BẢO MẬT & THANH TOÁN)

#### 6. Xác Thực & Phân Quyền (Authentication & Authorization):
- **ASP.NET Core Identity**: Quản lý tài khoản 20.000 học viên, phân quyền, hashing mật khẩu, xác thực 2 lớp (2FA).
- **Token-based Authentication**: Cấu hình JWT (JSON Web Token) cho Web API và cơ chế Refresh Token an toàn.
- **Cơ chế Phân Quyền Đa Tầng (Multi-tier RBAC)**:
  - Role-based Authorization (Admin, Lecturer, Student).
  - Policy/Claim-based Authorization (`RequireRole("FinancialAuditor")`, `RequireClaim("Tier", "Pro")`).
- **Bảo Mật Sổ Cái Thanh Toán (VietQR / Webhook)**:
  - Cơ chế Idempotency Key chống thanh toán trùng lặp.
  - Phân luồng **Kiểm soát & Phê duyệt của Con Người (Human-in-the-loop)**, AI tuyệt đối không can thiệp dòng tiền.

---

### 👑 SFIA LEVEL 4: ENABLE & ARCHITECTURE (BẬC 4: KIẾN TRÚC ENTERPRISE & TỐI ƯU HÓA)

#### 7. Nâng Cao, Tối Ưu Hiệu Năng & Triển Khai Doanh Nghiệp:
- **Caching Đa Cấp**: In-Memory Caching và **.NET 10 HybridCache** kết hợp Redis Cache phân tán.
- **Tác Vụ Nền Định Kỳ**: Sử dụng `BackgroundService`, `IHostedService` để quét giao dịch ngân hàng và reset Streak học tập.
- **Kiến Trúc Phần Mềm Doanh Nghiệp**: Clean Architecture (Onion/Hexagonal), CQRS Pattern kết hợp MediatR.
- **Kiểm Thử Phần Mềm (Testing)**: Viết Unit Test với xUnit kết hợp thư viện Mocking (Moq/NSubstitute).
- **Đóng Gói & Triển Khai (Containerization)**: Đóng gói Dockerfile multi-stage build siêu nhẹ (Alpine), cấu hình docker-compose kết nối PostgreSQL & Redis.
- **CI/CD & Cloud Azure**: Thiết lập pipeline tự động hóa kiểm thử và triển khai liên tục lên môi trường Azure Cloud.
