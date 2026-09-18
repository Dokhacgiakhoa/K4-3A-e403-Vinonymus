# Clean Architecture trong ASP.NET Core

Trong hệ sinh thái ASP.NET Core, Clean Architecture (còn được gọi là Onion hay Hexagonal Architecture) tổ chức mã nguồn xoay quanh Domain và tuân theo **nguyên tắc phụ thuộc một chiều (Dependency Rule)**: các tầng bên ngoài phụ thuộc vào tầng bên trong, tầng bên trong tuyệt đối không biết gì về tầng bên ngoài.

## Mục lục

1. [Nguyên tắc phụ thuộc giữa các tầng](#nguyên-tắc-phụ-thuộc-giữa-các-tầng)
2. [Cây thư mục dự án chuẩn](#cây-thư-mục-dự-án-chuẩn-directory-structure)
3. [Chi tiết nhiệm vụ từng Project](#chi-tiết-nhiệm-vụ-từng-project)
4. [Ưu điểm khi áp dụng cấu trúc này](#ưu-điểm-khi-áp-dụng-cấu-trúc-này)

> Xem thêm: [Lộ trình kiến thức .NET / C#](dotnet-csharp-learning-roadmap.md), mục 4.

---

## Nguyên tắc phụ thuộc giữa các tầng

```text
Presentation (WebAPI) ───┐
                         ▼
Infrastructure ────► Application ────► Domain (Core)
```

1. **Domain:** Không tham chiếu bất kỳ project nào, không phụ thuộc framework hay thư viện bên thứ ba (kể cả EF Core).
2. **Application:** Chỉ tham chiếu Domain. Chứa business logic, use cases, interfaces.
3. **Infrastructure:** Tham chiếu Application (và Domain qua Application). Hiện thực hóa các interface (EF Core, Email, Cloud Storage, Message Queue).
4. **Presentation (WebAPI):** Tham chiếu Application và Infrastructure (chỉ để cấu hình Dependency Injection tại `Program.cs`).

---

## Cây thư mục dự án chuẩn (Directory Structure)

```text
MySolution/
│
├── src/
│   ├── Core/
│   │   ├── MySolution.Domain/
│   │   │   ├── Common/
│   │   │   │   ├── BaseEntity.cs
│   │   │   │   └── BaseAuditableEntity.cs
│   │   │   ├── Entities/
│   │   │   │   ├── Product.cs
│   │   │   │   └── Order.cs
│   │   │   ├── Enums/
│   │   │   │   └── OrderStatus.cs
│   │   │   ├── Events/
│   │   │   │   └── OrderCreatedEvent.cs
│   │   │   ├── Exceptions/
│   │   │   │   └── ProductNotFoundException.cs
│   │   │   └── ValueObjects/
│   │   │       └── Money.cs
│   │   │
│   │   └── MySolution.Application/
│   │       ├── Common/
│   │       │   ├── Behaviors/
│   │       │   │   ├── ValidationBehavior.cs
│   │       │   │   └── LoggingBehavior.cs
│   │       │   ├── Exceptions/
│   │       │   │   └── ValidationException.cs
│   │       │   ├── Interfaces/
│   │       │   │   ├── IApplicationDbContext.cs
│   │       │   │   ├── IEmailService.cs
│   │       │   │   └── ICurrentUserService.cs
│   │       │   ├── Mappings/
│   │       │   │   └── MappingProfile.cs
│   │       │   └── Models/
│   │       │       └── PaginatedList.cs
│   │       ├── Features/
│   │       │   └── Products/
│   │       │       ├── Commands/
│   │       │       │   ├── CreateProduct/
│   │       │       │   │   ├── CreateProductCommand.cs
│   │       │       │   │   ├── CreateProductCommandHandler.cs
│   │       │       │   │   └── CreateProductCommandValidator.cs
│   │       │       │   └── DeleteProduct/
│   │       │       │       ├── DeleteProductCommand.cs
│   │       │       │       └── DeleteProductCommandHandler.cs
│   │       │       └── Queries/
│   │       │           ├── GetProductsWithPagination/
│   │       │           │   ├── GetProductsWithPaginationQuery.cs
│   │       │           │   └── GetProductsWithPaginationQueryHandler.cs
│   │       │           └── GetProductById/
│   │       │               ├── GetProductByIdQuery.cs
│   │       │               ├── GetProductByIdQueryHandler.cs
│   │       │               └── ProductDto.cs
│   │       └── DependencyInjection.cs
│   │
│   ├── Infrastructure/
│   │   └── MySolution.Infrastructure/
│   │       ├── Data/
│   │       │   ├── Configurations/
│   │       │   │   ├── ProductConfiguration.cs
│   │       │   │   └── OrderConfiguration.cs
│   │       │   ├── Migrations/
│   │       │   ├── ApplicationDbContext.cs
│   │       │   └── ApplicationDbContextInitialiser.cs
│   │       ├── Identity/
│   │       │   ├── ApplicationUser.cs
│   │       │   ├── IdentityService.cs
│   │       │   └── JwtTokenGenerator.cs
│   │       ├── Services/
│   │       │   ├── EmailService.cs
│   │       │   └── DateTimeService.cs
│   │       └── DependencyInjection.cs
│   │
│   └── Presentation/
│       └── MySolution.WebApi/
│           ├── Controllers/
│           │   ├── ApiControllerBase.cs
│           │   ├── ProductsController.cs
│           │   └── AuthController.cs
│           ├── Middlewares/
│           │   └── ExceptionHandlingMiddleware.cs
│           ├── Services/
│           │   └── CurrentUserService.cs
│           ├── appsettings.json
│           ├── appsettings.Development.json
│           └── Program.cs
│
└── tests/
    ├── MySolution.Domain.UnitTests/
    ├── MySolution.Application.UnitTests/
    └── MySolution.WebApi.IntegrationTests/
```

---

## Chi tiết nhiệm vụ từng Project

### 1. `MySolution.Domain` (Cốt lõi — Không phụ thuộc gì)

- **Entities:** Các đối tượng nghiệp vụ cốt lõi (`Product`, `Order`).
- **Value Objects:** Đối tượng định danh bằng giá trị, bất biến (như `Money`, `Address`).
- **Enums & Exceptions:** Trạng thái và lỗi đặc thù của domain.
- **Domain Events:** Sự kiện xảy ra trong domain (ví dụ: `OrderCreatedEvent`).

### 2. `MySolution.Application` (Business Logic & Use Cases)

- **Features (theo hướng Vertical Slice):** Gom nhóm theo thực thể, bên trong chia `Commands` và `Queries` theo mô hình CQRS (dùng MediatR).
- **Interfaces:** Khai báo các hợp đồng (contracts) mà tầng ngoài phải triển khai:
  - `IApplicationDbContext` (để Application gọi truy vấn DB mà không cần biết triển khai EF Core chi tiết).
  - `IEmailService`, `ICurrentUserService`.
- **Behaviors:** Pipeline của MediatR như tự động validate (`ValidationBehavior`) bằng FluentValidation, đo thời gian thực thi, logging.
- **`DependencyInjection.cs`:** Phương thức mở rộng `AddApplicationServices(this IServiceCollection services)` đăng ký MediatR, Validator, AutoMapper.

### 3. `MySolution.Infrastructure` (Hiện thực kỹ thuật)

- **Data Access:** `ApplicationDbContext`, cấu hình bảng qua Fluent API (`IEntityTypeConfiguration<T>`), lưu trữ EF Core Migrations.
- **External Services:** Tích hợp các SDK bên ngoài: SendGrid/SMTP, Stripe/VNPAY, AWS S3, Redis Cache, RabbitMQ.
- **Identity:** Tích hợp ASP.NET Core Identity, sinh và kiểm tra JWT token.
- **`DependencyInjection.cs`:** Phương thức mở rộng `AddInfrastructureServices(...)` đăng ký DbContext, cấu hình Identity, Redis, các service bên ngoài.

### 4. `MySolution.WebApi` (Điểm vào — Entry Point)

- **Controllers / Minimal API Endpoints:** Nhận HTTP request, đẩy sang MediatR (`_mediator.Send(command)`), trả về HTTP status code phù hợp.
- **Middlewares:** `ExceptionHandlingMiddleware` bắt lỗi toàn cục và định dạng kết quả theo chuẩn ProblemDetails (RFC 7807).
- **`Program.cs`:** Đăng ký các tầng bằng các extension method:

```csharp
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebApiServices();
```

---

## Ưu điểm khi áp dụng cấu trúc này

- **Dễ bảo trì và scale:** Logic nghiệp vụ được tách biệt khỏi UI và DB. Khi đổi DB từ SQL Server sang PostgreSQL hay MongoDB, chỉ cần chỉnh sửa ở `Infrastructure`.
- **Khả năng Test cao:** Tầng `Application` và `Domain` hoàn toàn có thể viết Unit Test độc lập mà không cần kết nối cơ sở dữ liệu thật.
- **Rõ ràng theo Use Case:** Khi tìm tính năng `CreateProduct`, lập trình viên chỉ cần mở đúng thư mục `Features/Products/Commands/CreateProduct/` để xem toàn bộ DTO, Validator và Handler.
