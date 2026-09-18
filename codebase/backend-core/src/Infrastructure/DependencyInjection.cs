using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Application.Features.GuestQuota;
using AIIANotebook.Application.Features.Payments;
using AIIANotebook.Infrastructure.Data;
using AIIANotebook.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AIIANotebook.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Chuỗi kết nối chỉ được đọc khi DbContext được tạo lần đầu, để test thay được DB mà không cần Postgres.
        services.AddDbContext<ApplicationDbContext>(options => options
            .UseNpgsql(ConnectionStringResolver.Resolve(configuration))
            .UseSnakeCaseNamingConvention());
        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IGuestQuotaStore, GuestQuotaStore>();

        // Thiếu hoặc quá ngắn JWT secret thì dừng ngay khi khởi động, không chạy với khoá yếu.
        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .Validate(o => o.Secret.Length >= JwtOptions.MinSecretLength,
                $"Thiếu cấu hình Jwt:Secret (tối thiểu {JwtOptions.MinSecretLength} ký tự). Đặt biến môi trường Jwt__Secret.")
            .ValidateOnStart();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, BcryptPasswordHasher>();

        services.AddOptions<GuestQuotaOptions>()
            .Bind(configuration.GetSection(GuestQuotaOptions.SectionName))
            .Validate(o => o.SessionDailyLimit > 0 && o.IpDailyLimit >= o.SessionDailyLimit, "Hạn mức khách không hợp lệ.")
            .ValidateOnStart();
        services.AddOptions<PaymentOptions>().Bind(configuration.GetSection(PaymentOptions.SectionName));

        return services;
    }
}
