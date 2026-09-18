using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Application.Features.GuestQuota;
using AIIANotebook.Application.Features.Payments;
using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Time.Testing;

namespace AIIANotebook.Application.UnitTests.Common;

/// <summary>
/// Dựng đúng pipeline MediatR như khi chạy thật (validator + behavior + handler),
/// chỉ thay các cổng ra ngoài (DB, băm mật khẩu, token, hạn mức) bằng bản giả.
/// </summary>
public sealed class ApplicationTestHost : IDisposable
{
    private readonly ServiceProvider _provider;
    private readonly IServiceScope _scope;

    public ApplicationTestHost()
    {
        var services = new ServiceCollection();
        services.AddLogging(b => b.SetMinimumLevel(LogLevel.Warning));
        services.AddSingleton<TimeProvider>(Clock);
        services.AddApplicationServices();

        var databaseName = Guid.NewGuid().ToString();
        services.AddDbContext<TestDbContext>(o => o.UseInMemoryDatabase(databaseName));
        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<TestDbContext>());
        services.AddSingleton<ICurrentUserService>(CurrentUser);
        services.AddSingleton<IPasswordHasher, FakePasswordHasher>();
        services.AddSingleton<IJwtTokenGenerator, FakeTokenGenerator>();
        services.AddSingleton<IGuestQuotaStore>(QuotaStore);
        services.Configure<GuestQuotaOptions>(_ => { });
        services.Configure<PaymentOptions>(_ => { });

        _provider = services.BuildServiceProvider(validateScopes: true);
        _scope = _provider.CreateScope();
    }

    public FakeTimeProvider Clock { get; } = new(new DateTimeOffset(2026, 9, 18, 3, 0, 0, TimeSpan.Zero));
    public FakeCurrentUser CurrentUser { get; } = new();
    public FakeGuestQuotaStore QuotaStore { get; } = new();

    public ISender Sender => _scope.ServiceProvider.GetRequiredService<ISender>();
    public TestDbContext Db => _scope.ServiceProvider.GetRequiredService<TestDbContext>();

    public async Task<AppUser> AddUserAsync(
        string email = "hoc.vien@example.com",
        AccountApprovalStatus status = AccountApprovalStatus.Approved,
        UserRole role = UserRole.Visitor,
        bool isActive = true,
        string password = "matkhau123")
    {
        var user = new AppUser
        {
            Email = email,
            DisplayName = "Học viên thử",
            PasswordHash = new FakePasswordHasher().Hash(password),
            ApprovalStatus = status,
            Role = role,
            IsActive = isActive
        };
        Db.Users.Add(user);
        await Db.SaveChangesAsync();
        Db.ChangeTracker.Clear();
        return user;
    }

    public void SignInAs(AppUser user) => CurrentUser.UserId = user.Id;

    public void Dispose()
    {
        _scope.Dispose();
        _provider.Dispose();
    }
}
