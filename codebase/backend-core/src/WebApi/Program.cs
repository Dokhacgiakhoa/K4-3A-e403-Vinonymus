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
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5432;Database=aiia_notebook;Username=postgres;Password=postgres";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseSnakeCaseNamingConvention());

builder.Services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

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
app.MapPost("/api/v1/auth/register", async (ApplicationDbContext db, RegisterRequest req, IConfiguration config) =>
{
    var result = await AuthWebService.RegisterAsync(db, req, config);
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

    var profile = await AuthWebService.GetMeAsync(db, userId.Value);
    if (profile == null)
    {
        return Results.NotFound(new { success = false, message = "Không tìm thấy thông tin người dùng." });
    }

    return Results.Ok(new { success = true, data = profile });
});

app.MapPost("/api/v1/auth/oauth-sync", async (ApplicationDbContext db, OAuthSyncRequest req, IConfiguration config) =>
{
    var result = await AuthWebService.OAuthSyncAsync(db, req, config);
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
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
