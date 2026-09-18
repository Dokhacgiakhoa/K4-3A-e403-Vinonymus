using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Common.Extensions;

public static class UserQueryExtensions
{
    /// <summary>
    /// Token hợp lệ chưa đủ: tài khoản bị khoá, bị từ chối hay còn chờ duyệt sau khi cấp token
    /// thì vẫn phải bị coi là chưa đăng nhập. Luôn đọc lại từ DB để thu hồi quyền có hiệu lực ngay.
    /// </summary>
    public static async Task<AppUser?> FindSignedInUserAsync(this DbSet<AppUser> users, Guid? userId, CancellationToken cancellationToken)
    {
        if (!userId.HasValue) return null;
        var user = await users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId.Value, cancellationToken);
        return user is { CanSignIn: true } ? user : null;
    }
}
