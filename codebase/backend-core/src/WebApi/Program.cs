using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Application.Features.Curriculum;
using AIIANotebook.Application.Features.Payments;
using AIIANotebook.Application.Features.Quizzes;
using AIIANotebook.Domain.Enums;
using AIIANotebook.Infrastructure.Persistence;
using AIIANotebook.WebApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Configuration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000", "https://ai-thuc-chien.vn" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 2. Database Context (PostgreSQL EF Core 10)
var connectionString = ResolveConnectionString(builder.Configuration);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseSnakeCaseNamingConvention());

builder.Services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

// Thiếu JWT secret thì dừng ngay khi khởi động, không chạy với khoá mặc định công khai.
AuthWebService.GetJwtSecret(builder.Configuration);

var app = builder.Build();

app.UseCors("FrontendCorsPolicy");

// =========================================================================
// MINIMAL APIS GATEWAY ENDPOINTS
// =========================================================================

// Health Check
app.MapGet("/api/v1/health", () => Results.Ok(new
{
    status = "healthy",
    engine = ".NET 10 LTS (C# 14)",
    architecture = "Clean Architecture Core",
    timestamp = DateTime.UtcNow
}));

// 0. Authentication Endpoints (.NET 10 + BCrypt + JWT)
app.MapPost("/api/v1/auth/register", async (ApplicationDbContext db, RegisterRequest req) =>
{
    var result = await AuthWebService.RegisterAsync(db, req);
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
});

app.MapPost("/api/v1/auth/login", async (ApplicationDbContext db, LoginRequest req, IConfiguration config) =>
{
    var result = await AuthWebService.LoginAsync(db, req, config);
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
});

app.MapGet("/api/v1/auth/me", async (ApplicationDbContext db, HttpContext http, IConfiguration config) =>
{
    var authHeader = http.Request.Headers["Authorization"].FirstOrDefault();
    var userId = AuthWebService.ValidateAndExtractUserId(authHeader, config);
    if (!userId.HasValue)
    {
        return Results.Unauthorized();
    }

    // Chỉ tài khoản đang hoạt động và đã được duyệt mới được coi là đã đăng nhập.
    var user = await AuthWebService.GetActiveApprovedUserAsync(db, userId.Value);
    if (user == null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new { success = true, data = AuthWebService.MapToProfile(user) });
});

app.MapPost("/api/v1/auth/oauth-sync", async (ApplicationDbContext db, OAuthSyncRequest req, HttpContext http, IConfiguration config) =>
{
    // Endpoint này cấp token theo email, nên chỉ server Next.js (có khoá nội bộ) được gọi.
    var internalKey = config["Backend:InternalApiKey"];
    var providedKey = http.Request.Headers["X-Internal-Key"].FirstOrDefault();
    if (string.IsNullOrWhiteSpace(internalKey) || internalKey.Length < 32 ||
        !System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(
            System.Text.Encoding.UTF8.GetBytes(internalKey),
            System.Text.Encoding.UTF8.GetBytes(providedKey ?? string.Empty)))
    {
        return Results.StatusCode(StatusCodes.Status403Forbidden);
    }

    var result = await AuthWebService.OAuthSyncAsync(db, req, config);
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
});

// 0.2 Hạn mức AI Helpdesk cho khách chưa đăng nhập (Next.js gọi, chỉ nhận mã băm SHA-256)
app.MapPost("/api/v1/quota/helpdesk/consume", async (ApplicationDbContext db, ConsumeGuestQuotaRequest req, IConfiguration config) =>
{
    if (!GuestQuotaWebService.IsValidHash(req.SessionHash) || !GuestQuotaWebService.IsValidHash(req.IpHash))
    {
        return Results.BadRequest(new { success = false, message = "Mã phiên không hợp lệ." });
    }

    var result = await GuestQuotaWebService.ConsumeAsync(db, req, config);
    return Results.Ok(new { success = true, data = result });
});

// 0.1 Duyệt tài khoản (chỉ SuperAdmin)
app.MapGet("/api/v1/admin/users", async (ApplicationDbContext db, HttpContext http, IConfiguration config, string? status) =>
{
    if (!await AdminWebService.IsSuperAdminAsync(db, http.Request.Headers["Authorization"].FirstOrDefault(), config))
    {
        return Results.StatusCode(StatusCodes.Status403Forbidden);
    }

    AccountApprovalStatus? filter = Enum.TryParse<AccountApprovalStatus>(status, true, out var parsed) ? parsed : null;
    var users = await AdminWebService.ListUsersAsync(db, filter);
    return Results.Ok(new { success = true, data = users });
});

app.MapPost("/api/v1/admin/users/{id:guid}/approval", async (ApplicationDbContext db, HttpContext http, IConfiguration config, Guid id, SetApprovalRequest req) =>
{
    if (!await AdminWebService.IsSuperAdminAsync(db, http.Request.Headers["Authorization"].FirstOrDefault(), config))
    {
        return Results.StatusCode(StatusCodes.Status403Forbidden);
    }

    if (!Enum.TryParse<AccountApprovalStatus>(req.Status, true, out var status) || status == AccountApprovalStatus.Pending)
    {
        return Results.BadRequest(new { success = false, message = "Trạng thái phải là Approved hoặc Rejected." });
    }

    var profile = await AdminWebService.SetApprovalAsync(db, id, status);
    return profile == null
        ? Results.NotFound(new { success = false, message = "Không tìm thấy tài khoản." })
        : Results.Ok(new { success = true, data = profile });
});

// 1. Curriculum Modules (SFIA L0 - L4) - Hỗ trợ lọc theo Track (NonTech, TechBase, AiBase, Universal)
app.MapGet("/api/v1/curriculum/modules", async (ApplicationDbContext db, Guid? userId, string? track) =>
{
    var modules = await CurriculumWebService.GetModulesAsync(db, userId, track);
    return Results.Ok(new { success = true, data = modules });
});

// 1.1 Curriculum Module Detail & Topics (Coursera Standard)
app.MapGet("/api/v1/curriculum/modules/{id:guid}", async (ApplicationDbContext db, Guid id, Guid? userId) =>
{
    var detail = await CurriculumWebService.GetModuleDetailAsync(db, id, userId);
    if (detail == null) return Results.NotFound(new { success = false, message = "Không tìm thấy chuyên đề." });
    return Results.Ok(new { success = true, data = detail });
});

// 1.2 Enroll Course (0đ)
app.MapPost("/api/v1/curriculum/enroll", async (ApplicationDbContext db, EnrollCourseRequest req) =>
{
    var success = await CurriculumWebService.EnrollCourseAsync(db, req.UserId, req.ModuleId);
    return Results.Ok(new { success, message = "Ghi danh khóa học thành công." });
});

// 1.3 Unenroll Course
app.MapPost("/api/v1/curriculum/unenroll", async (ApplicationDbContext db, EnrollCourseRequest req) =>
{
    var success = await CurriculumWebService.UnenrollCourseAsync(db, req.UserId, req.ModuleId);
    return Results.Ok(new { success, message = "Đã hủy ghi danh khóa học." });
});

// 1.4 Toggle Topic Progress
app.MapPost("/api/v1/curriculum/progress/toggle", async (ApplicationDbContext db, ToggleTopicProgressRequest req) =>
{
    var success = await CurriculumWebService.ToggleTopicProgressAsync(db, req.UserId, req.ModuleId, req.TopicId);
    return Results.Ok(new { success, message = "Cập nhật tiến độ bài học thành công." });
});

// 1.5 Get Certificate
app.MapGet("/api/v1/curriculum/certificates", async (ApplicationDbContext db, Guid userId, Guid moduleId) =>
{
    var cert = await CurriculumWebService.GetCertificateAsync(db, userId, moduleId);
    if (cert == null) return Results.NotFound(new { success = false, message = "Chưa có chứng chỉ cho chuyên đề này." });
    return Results.Ok(new { success = true, data = cert });
});

// 2. Mock Test Simulation (NDA Compliant)
app.MapGet("/api/v1/quizzes/simulation", (int? level) =>
{
    var sfiaLevel = (level.HasValue && Enum.IsDefined(typeof(SFIALevel), level.Value)) 
        ? (SFIALevel)level.Value 
        : SFIALevel.L1;

    var questions = QuizService.GetSimulationMockQuestions(sfiaLevel);
    return Results.Ok(new { success = true, level = sfiaLevel.ToString(), data = questions });
});

// 3. Submit Quiz & Evaluation
app.MapPost("/api/v1/quizzes/submit", (SubmitQuizRequest request) =>
{
    var questions = QuizService.GetSimulationMockQuestions(SFIALevel.L1);
    var result = QuizService.EvaluateSubmission(request, questions);
    return Results.Ok(new { success = true, data = result });
});

// 4. Payments VietQR Invoice (Pro Upgrade)
app.MapPost("/api/v1/payments/vietqr", (CreatePaymentDto dto) =>
{
    var invoice = PaymentService.GenerateVietQrInvoice(dto.UserId, dto.AmountVnd, dto.PlanName);
    return Results.Ok(new { success = true, data = invoice });
});

app.Run();

public record CreatePaymentDto(Guid UserId, decimal AmountVnd, string PlanName);
public record SetApprovalRequest(string Status);

public partial class Program
{
    // Railway cấp DATABASE_URL dạng postgresql://user:pass@host:port/db, Npgsql cần dạng key=value.
    static string ResolveConnectionString(IConfiguration config)
    {
        var configured = config.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrWhiteSpace(configured)) return configured;

        var url = config["DATABASE_URL"];
        if (string.IsNullOrWhiteSpace(url))
        {
            throw new InvalidOperationException("Thiếu chuỗi kết nối: đặt ConnectionStrings__DefaultConnection hoặc DATABASE_URL.");
        }

        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':', 2);
        var builder = new Npgsql.NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = uri.AbsolutePath.TrimStart('/'),
            Username = Uri.UnescapeDataString(userInfo[0]),
            Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty
        };
        return builder.ConnectionString;
    }
}
