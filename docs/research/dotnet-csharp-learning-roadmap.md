# Lộ trình kiến thức .NET / C#

Bản phân rã chi tiết toàn bộ lộ trình kiến thức .NET / C# từ nền tảng đến mức độ thiết kế hệ thống thực chiến.

## Mục lục

1. [Nền tảng ngôn ngữ C# chuyên sâu](#1-nền-tảng-ngôn-ngữ-c-chuyên-sâu)
2. [Cơ sở dữ liệu & Tầng dữ liệu (Data Access)](#2-cơ-sở-dữ-liệu--tầng-dữ-liệu-data-access)
3. [Lập trình Web API với ASP.NET Core](#3-lập-trình-web-api-với-aspnet-core)
4. [Kiến trúc hệ thống & Mẫu thiết kế (Software Architecture)](#4-kiến-trúc-hệ-thống--mẫu-thiết-kế-software-architecture)
5. [Kiểm thử, Triển khai & Xu hướng hiện đại](#5-kiểm-thử-triển-khai--xu-hướng-hiện-đại)

---

## 1. Nền tảng ngôn ngữ C# chuyên sâu

### Hệ thống kiểu dữ liệu & Bộ nhớ

- Phân biệt rõ `Value Type` (lưu trên Stack/Inline) và `Reference Type` (lưu trên Heap).
- Hiểu cơ chế hoạt động của Garbage Collector (GC): thế hệ đối tượng (Gen 0, Gen 1, Gen 2), Large Object Heap (LOH), ép giải phóng tài nguyên qua `IDisposable` và cú pháp `using`.
- Kiểu dữ liệu hiện đại: `record`, `struct`, `readonly struct`, `Span<T>`, `Memory<T>` phục vụ tối ưu bộ nhớ zero-allocation.

### Lập trình hướng đối tượng (OOP) & SOLID

- Encapsulation, Inheritance, Polymorphism, Abstraction: áp dụng vào thiết kế class, `interface`, `abstract class`.
- **S.O.L.I.D:**
  - **Single Responsibility:** Một class chỉ đảm nhận một lý do thay đổi.
  - **Open/Closed:** Mở rộng bằng kế thừa/interface, đóng sửa đổi code cũ.
  - **Liskov Substitution:** Class con thay thế được class cha mà không làm gãy logic.
  - **Interface Segregation:** Chia nhỏ interface, không ép implement method dư thừa.
  - **Dependency Inversion:** Module cấp cao không phụ thuộc module cấp thấp; cả hai phụ thuộc abstraction.

### Functional Features & Xử lý dữ liệu

- `Delegate`, `Func<T>`, `Action<T>`, `Predicate<T>`, biểu thức Lambda.
- LINQ: nắm chắc sự khác biệt giữa `IEnumerable` (bộ nhớ trong) và `IQueryable` (sinh câu lệnh truy vấn xuống DB), cơ chế Deferred Execution (thực thi trễ).
- Pattern Matching, Tuple, Nullable Reference Types (`?`, `!`).

### Lập trình đa luồng & Bất đồng bộ (Async/Await)

- Bản chất `Task` và `Task<T>`, Thread Pool, `SynchronizationContext`.
- Tránh deadlock: hạn chế tối đa `.Result` hoặc `.Wait()`, luôn dùng `await`.
- Quản lý ngắt luồng: truyền và xử lý `CancellationToken` xuyên suốt từ Controller xuống Database.
- Tối ưu hiệu năng: `ValueTask<T>`, `Parallel.ForEachAsync`, `SemaphoreSlim` để giới hạn tài nguyên truy cập đồng thời.

---

## 2. Cơ sở dữ liệu & Tầng dữ liệu (Data Access)

### Entity Framework Core (EF Core)

- **Mô hình tiếp cận:** thực hành thành thạo Code-First, quản lý lược đồ dữ liệu bằng EF Core CLI Migrations (`add-migration`, `update-database`).
- **Cấu hình bảng:** ưu tiên sử dụng Fluent API (tách riêng qua `IEntityTypeConfiguration<T>`) thay vì lạm dụng Data Annotations.
- **Quan hệ thực thể:** 1-1, 1-Nhiều, Nhiều-Nhiều (tự động hoặc qua bảng liên kết trung gian), cấu hình Delete Behaviors (`Cascade`, `Restrict`, `SetNull`).
- **Chiến lược nạp dữ liệu:**
  - Eager Loading: dùng `.Include()` và `.ThenInclude()`.
  - Explicit Loading: `.Entry().Collection().Load()`.
  - Projection: chỉ select những trường cần thiết bằng `.Select(x => new DTO { ... })` để tránh kéo thừa cột từ DB.
- **Tối ưu hóa:** luôn bật `.AsNoTracking()` cho các truy vấn chỉ đọc (read-only), chia nhỏ các truy vấn lớn với `.AsSplitQuery()`.

### Dapper (Micro-ORM)

- Sử dụng Dapper khi cần viết câu lệnh SQL thuần cho các báo cáo nặng, xử lý dữ liệu hàng loạt (bulk inserts/updates) cần tốc độ tối đa.

### Design Patterns tầng dữ liệu

- **Repository Pattern:** trừu tượng hóa truy vấn CRUD để code nghiệp vụ không phụ thuộc trực tiếp vào DB Context.
- **Unit of Work:** quản lý giao dịch (Transaction), đảm bảo tất cả các thao tác ghi của một business flow thành công trọn vẹn hoặc rollback nếu có lỗi.

---

## 3. Lập trình Web API với ASP.NET Core

### Vòng đời ứng dụng & Pipeline

- Cấu hình ứng dụng qua `Program.cs` (Minimal APIs hoặc Controller-based).
- **Middleware:** hiểu thứ tự chạy của các built-in middleware (Routing, Auth, CORS, Static Files) và tự viết Custom Middleware (Global Exception Handling Middleware để chuẩn hóa format lỗi trả về RFC 7807).
- **Dependency Injection (DI):**
  - `Transient`: tạo mới mỗi khi inject.
  - `Scoped`: một thể hiện duy nhất trong suốt một vòng đời HTTP Request.
  - `Singleton`: một thể hiện duy nhất trong toàn bộ thời gian ứng dụng chạy.

### RESTful API Design

- Quy chuẩn đặt tên endpoint (danh từ, số nhiều, quan hệ cha-con).
- Sử dụng chuẩn HTTP Methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) và HTTP Status Codes (`200`, `201`, `204`, `400`, `401`, `403`, `404`, `422`, `500`).
- Model Binding, Data Transfer Objects (DTO), thư viện mapping (`AutoMapper` hoặc `Mapster`).
- Validate request payload bằng FluentValidation.

### Bảo mật & Phân quyền

- **ASP.NET Core Identity:** quản lý User, Role, Password hashing, Token xác nhận email/reset password.
- **JWT (JSON Web Token):** cấu hình Access Token (thời gian ngắn) và Refresh Token (lưu DB/Redis để cấp phát lại).
- **Phân quyền:** phân quyền dựa trên Role (`[Authorize(Roles = "Admin")]`) và phân quyền linh hoạt dựa trên Policy/Claim (`IAuthorizationHandler`, `Requirement`).

### Tính năng phụ trợ quan trọng

- **SignalR:** xử lý truyền thông hai chiều (Two-way Realtime), quản lý Hub, Hub Context, gửi message theo nhóm (Groups) hoặc người dùng cụ thể.
- **Logging:** ghi log có cấu trúc (Structured Logging) với Serilog, xuất log ra Console, File, Seq hoặc Elasticsearch.
- **API Documentation:** tích hợp Swagger/OpenAPI (Swashbuckle/NSwag), cấu hình bảo mật Bearer Token ngay trên UI tài liệu.

---

## 4. Kiến trúc hệ thống & Mẫu thiết kế (Software Architecture)

### Clean Architecture (Onion / Hexagonal)

Tách biệt rõ ràng 4 tầng độc lập, tuân thủ nguyên tắc phụ thuộc đi từ ngoài vào trong:

1. **Domain:** chứa Entity, Value Object, Domain Exceptions, Interface cơ bản (không phụ thuộc bất kỳ thư viện bên ngoài nào).
2. **Application:** chứa Use Cases, DTOs, Validation logic, Interfaces của các dịch vụ ngoài (tích hợp MediatR).
3. **Infrastructure:** triển khai truy cập DB (EF Core DbContext), gọi API bên thứ ba, gửi mail, lưu trữ file.
4. **Presentation / Web API:** Controller, Endpoints, Middlewares, Dependency Injection configurations.

### CQRS (Command Query Responsibility Segregation)

- Tách biệt luồng ghi dữ liệu (Commands) và luồng đọc dữ liệu (Queries).
- Triển khai mẫu Mediator thông qua thư viện MediatR: Command/Query Handler, Pipeline Behaviors (tự động chạy validation, logging, performance monitoring trước khi request chạm handler).

### Caching

- In-memory Cache (`IMemoryCache`) cho dữ liệu cấu hình ít thay đổi.
- Distributed Cache với Redis (`IDistributedCache`) để chia sẻ cache giữa nhiều instances khi scale ứng dụng, áp dụng chiến lược Cache-Aside pattern.

### Xử lý tác vụ nền & Message Queue

- **Chạy nền trong tiến trình:** `BackgroundService`, `IHostedService`, hoặc các scheduler chuyên dụng như Quartz.NET, Hangfire.
- **Giao tiếp bất đồng bộ qua hàng đợi:** sử dụng RabbitMQ hoặc Kafka kết hợp thư viện MassTransit để xử lý các event phân tán, giảm tải cho API chính.

---

## 5. Kiểm thử, Triển khai & Xu hướng hiện đại

### Automated Testing

- **Unit Testing:** dùng xUnit hoặc NUnit.
- **Mocking:** sử dụng `Moq` hoặc `NSubstitute` để giả lập các dependency (Service, Repository).
- **FluentAssertions:** giúp câu lệnh kiểm tra kết quả (assertions) trực quan, tự nhiên hơn.
- **Integration Testing:** sử dụng `WebApplicationFactory<Program>` để kiểm thử toàn bộ luồng từ HTTP Endpoint xuống Database test (kết hợp Docker Testcontainers).

### DevOps & Triển khai

- **Docker:** viết `Dockerfile` nhiều giai đoạn (Multi-stage build) để nén nhẹ kích thước image chạy sản phẩm; cấu hình `docker-compose.yml` chạy kèm SQL Server, Redis, RabbitMQ.
- **CI/CD:** xây dựng luồng tự động build, chạy test và tạo container image với GitHub Actions.

### Microservices & API Gateway

- Giao tiếp nội bộ hiệu năng cao với gRPC (sử dụng Protobuf).
- Quản lý cổng giao tiếp bằng YARP (Yet Another Reverse Proxy) hoặc Ocelot: Rate limiting, Authentication Offloading, Load Balancing.

### Mở rộng AI Backend

- Sử dụng Semantic Kernel của Microsoft để tích hợp mô hình LLM, xây dựng các Agentic workflow, kết nối Semantic Search với Vector Database ngay trong hệ sinh thái C#.
