using AIIANotebook.Application;
using AIIANotebook.Infrastructure;
using AIIANotebook.WebApi;
using AIIANotebook.WebApi.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebApiServices(builder.Configuration);

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors(AIIANotebook.WebApi.DependencyInjection.CorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/v1/health", () => Results.Ok(new
{
    status = "healthy",
    engine = ".NET 10 LTS (C# 14)",
    architecture = "Clean Architecture + CQRS (MediatR)",
    timestamp = DateTime.UtcNow
}));

app.MapAuthEndpoints();
app.MapAdminEndpoints();
app.MapGuestQuotaEndpoints();
app.MapCurriculumEndpoints();
app.MapQuizEndpoints();
app.MapPaymentEndpoints();

app.Run();

// Cho phép test tích hợp khởi động API thật qua WebApplicationFactory<Program>.
public partial class Program;
