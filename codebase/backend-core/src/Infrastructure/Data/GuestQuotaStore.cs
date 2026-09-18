using AIIANotebook.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Infrastructure.Data;

public class GuestQuotaStore(ApplicationDbContext db) : IGuestQuotaStore
{
    public async Task<int?> TryConsumeAsync(
        DateOnly usageDay,
        string sessionSubject,
        string ipSubject,
        int sessionLimit,
        int ipLimit,
        CancellationToken cancellationToken)
    {
        await using var tx = await db.Database.BeginTransactionAsync(cancellationToken);
        var sessionCount = await IncrementAsync(usageDay, sessionSubject, cancellationToken);
        var ipCount = await IncrementAsync(usageDay, ipSubject, cancellationToken);

        if (sessionCount > sessionLimit || ipCount > ipLimit)
        {
            await tx.RollbackAsync(cancellationToken);
            return null;
        }

        await tx.CommitAsync(cancellationToken);
        return sessionCount;
    }

    // Một câu UPSERT nguyên tử: nhiều request cùng lúc không đếm trùng hay đếm sót.
    private async Task<int> IncrementAsync(DateOnly day, string subject, CancellationToken cancellationToken)
    {
        var rows = await db.Database.SqlQuery<int>($"""
            INSERT INTO guest_quota_usage (usage_day, subject_hash, used_count, updated_at)
            VALUES ({day}, {subject}, 1, NOW())
            ON CONFLICT (usage_day, subject_hash)
            DO UPDATE SET used_count = guest_quota_usage.used_count + 1, updated_at = NOW()
            RETURNING used_count AS "Value"
            """).ToListAsync(cancellationToken);
        return rows.Single();
    }
}
