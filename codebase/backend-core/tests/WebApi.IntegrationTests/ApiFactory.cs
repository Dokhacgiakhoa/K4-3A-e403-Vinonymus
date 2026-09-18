using System.Net.Http.Headers;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using AIIANotebook.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace AIIANotebook.WebApi.IntegrationTests;

/// <summary>
/// Khởi động API thật (Program.cs, middleware, JWT, policy, endpoint) trong bộ nhớ.
/// Chỉ thay Postgres bằng DB trong bộ nhớ và bộ đếm hạn mức (dùng câu SQL riêng của Postgres) bằng bản giả.
/// </summary>
public class ApiFactory : WebApplicationFactory<Program>
{
    public const string InternalKey = "internal-key-for-integration-tests-000000";
    public const string Password = "matkhau123";
    private readonly string _databaseName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:DefaultConnection", "Host=not-used-in-tests");
        builder.UseSetting("Jwt:Secret", "integration-test-secret-at-least-32-characters");
        builder.UseSetting("Backend:InternalApiKey", InternalKey);

        builder.ConfigureTestServices(services =>
        {
            foreach (var descriptor in services.Where(d =>
                         d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>)
                         || d.ServiceType == typeof(DbContextOptions)
                         || d.ServiceType == typeof(IDbContextOptionsConfiguration<ApplicationDbContext>)).ToList())
            {
                services.Remove(descriptor);
            }
            services.AddDbContext<ApplicationDbContext>(o => o.UseInMemoryDatabase(_databaseName));

            services.RemoveAll<IGuestQuotaStore>();
            services.AddSingleton<IGuestQuotaStore, InMemoryGuestQuotaStore>();
        });
    }

    public async Task<AppUser> SeedUserAsync(
        string email,
        AccountApprovalStatus status = AccountApprovalStatus.Approved,
        UserRole role = UserRole.Visitor)
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var user = new AppUser
        {
            Email = email,
            DisplayName = "Người dùng thử",
            PasswordHash = hasher.Hash(Password),
            ApprovalStatus = status,
            Role = role
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task UpdateUserAsync(Guid userId, Action<AppUser> change)
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var user = await db.Users.SingleAsync(u => u.Id == userId);
        change(user);
        await db.SaveChangesAsync();
    }

    /// <summary>Token hợp lệ về chữ ký cho bất kỳ tài khoản nào, kể cả tài khoản chưa được duyệt.</summary>
    public string TokenFor(AppUser user)
    {
        using var scope = Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<IJwtTokenGenerator>().CreateToken(user);
    }

    public HttpClient ClientWithToken(string token)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }
}

internal static class ServiceCollectionTestExtensions
{
    public static void RemoveAll<T>(this IServiceCollection services)
    {
        foreach (var descriptor in services.Where(d => d.ServiceType == typeof(T)).ToList())
        {
            services.Remove(descriptor);
        }
    }
}

public class InMemoryGuestQuotaStore : IGuestQuotaStore
{
    private readonly Dictionary<string, int> _counts = new();
    private readonly Lock _lock = new();

    public Task<int?> TryConsumeAsync(DateOnly usageDay, string sessionSubject, string ipSubject, int sessionLimit, int ipLimit, CancellationToken cancellationToken)
    {
        lock (_lock)
        {
            var sessionKey = $"{usageDay}:{sessionSubject}";
            var ipKey = $"{usageDay}:{ipSubject}";
            var session = _counts.GetValueOrDefault(sessionKey) + 1;
            var ip = _counts.GetValueOrDefault(ipKey) + 1;
            if (session > sessionLimit || ip > ipLimit) return Task.FromResult<int?>(null);
            _counts[sessionKey] = session;
            _counts[ipKey] = ip;
            return Task.FromResult<int?>(session);
        }
    }
}
