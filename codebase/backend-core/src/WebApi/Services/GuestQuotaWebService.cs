using System.Text.RegularExpressions;
using AIIANotebook.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.WebApi.Services;

public record ConsumeGuestQuotaRequest(string SessionHash, string IpHash);
public record GuestQuotaResultDto(bool Allowed, int Limit, int Remaining);

public static partial class GuestQuotaWebService
{
    [GeneratedRegex("^[a-f0-9]{64}$")]
    private static partial Regex Sha256HexRegex();

    public static bool IsValidHash(string? value) => value != null && Sha256HexRegex().IsMatch(value);

    public static async Task<GuestQuotaResultDto> ConsumeAsync(ApplicationDbContext db, ConsumeGuestQuotaRequest req, IConfiguration config)
    {
        var sessionLimit = config.GetValue("GuestQuota:SessionDailyLimit", 10);
        // Cả lớp học có thể dùng chung một IP, nên hạn mức theo IP cao hơn nhiều.
        var ipLimit = config.GetValue("GuestQuota:IpDailyLimit", 200);
        var day = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7));

        await using var tx = await db.Database.BeginTransactionAsync();
        var sessionCount = await IncrementAsync(db, day, "s:" + req.SessionHash);
        var ipCount = await IncrementAsync(db, day, "i:" + req.IpHash);

        if (sessionCount > sessionLimit || ipCount > ipLimit)
        {
            // Lượt bị từ chối không được tính vào hạn mức.
            await tx.RollbackAsync();
            return new GuestQuotaResultDto(false, sessionLimit, 0);
        }

        await tx.CommitAsync();
        return new GuestQuotaResultDto(true, sessionLimit, Math.Max(0, sessionLimit - sessionCount));
    }

    private static async Task<int> IncrementAsync(ApplicationDbContext db, DateOnly day, string key)
    {
        // subject_hash giới hạn 64 ký tự: băm lại khoá có tiền tố để giữ đúng độ dài.
        var subject = Convert.ToHexStringLower(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(key)));
        var rows = await db.Database.SqlQuery<int>($"""
            INSERT INTO guest_quota_usage (usage_day, subject_hash, used_count, updated_at)
            VALUES ({day}, {subject}, 1, NOW())
            ON CONFLICT (usage_day, subject_hash)
            DO UPDATE SET used_count = guest_quota_usage.used_count + 1, updated_at = NOW()
            RETURNING used_count AS "Value"
            """).ToListAsync();
        return rows.Single();
    }
}
