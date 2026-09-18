using System.Security.Claims;
using System.Text;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Enums;
using AIIANotebook.Infrastructure.Identity;
using AIIANotebook.WebApi.Middlewares;
using AIIANotebook.WebApi.Security;
using AIIANotebook.WebApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AIIANotebook.WebApi;

public static class DependencyInjection
{
    public const string CorsPolicy = "FrontendCorsPolicy";

    public static IServiceCollection AddWebApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? ["http://localhost:3000"];
        services.AddCors(options => options.AddPolicy(CorsPolicy, policy => policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()));

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
        services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
            .Configure<IOptions<JwtOptions>>((bearer, jwtOptions) =>
            {
                var jwt = jwtOptions.Value;
                // Giữ nguyên tên claim "sub" thay vì đổi sang tên dài kiểu SOAP của .NET.
                bearer.MapInboundClaims = false;
                bearer.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Secret)),
                    ValidateIssuer = true,
                    ValidIssuer = jwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwt.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(5),
                    NameClaimType = ClaimTypes.Name
                };
            });

        services.AddAuthorizationBuilder()
            .AddPolicy(AuthorizationPolicies.SignedInUser, policy => policy
                .RequireAuthenticatedUser()
                .AddRequirements(new AccountAccessRequirement()))
            .AddPolicy(AuthorizationPolicies.SuperAdmin, policy => policy
                .RequireAuthenticatedUser()
                .AddRequirements(new AccountAccessRequirement(), new AccountAccessRequirement(UserRole.SuperAdmin)));
        services.AddScoped<IAuthorizationHandler, AccountAccessHandler>();
        services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationMiddlewareResultHandler, ApiAuthorizationResultHandler>();

        services.AddProblemDetails();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        // Luôn ném lỗi khi JSON sai dạng (kể cả Production) để GlobalExceptionHandler trả câu thông báo rõ ràng.
        services.Configure<RouteHandlerOptions>(options => options.ThrowOnBadRequest = true);

        return services;
    }
}
