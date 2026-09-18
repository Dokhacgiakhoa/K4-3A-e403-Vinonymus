using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;

namespace AIIANotebook.Application.UnitTests.Common;

public class FakeCurrentUser : ICurrentUserService
{
    public Guid? UserId { get; set; }
}

// Băm giả, đủ để kiểm tra handler gọi đúng; thuật toán thật (BCrypt) nằm ở Infrastructure.
public class FakePasswordHasher : IPasswordHasher
{
    public string Hash(string password) => "hashed:" + password;
    public bool Verify(string password, string passwordHash) => passwordHash == "hashed:" + password;
}

public class FakeTokenGenerator : IJwtTokenGenerator
{
    public string CreateToken(AppUser user) => "token-for-" + user.Id;
}

public class FakeGuestQuotaStore : IGuestQuotaStore
{
    private readonly Dictionary<string, int> _counts = new();

    public Task<int?> TryConsumeAsync(DateOnly usageDay, string sessionSubject, string ipSubject, int sessionLimit, int ipLimit, CancellationToken cancellationToken)
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
