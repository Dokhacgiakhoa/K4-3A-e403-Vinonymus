using AIIANotebook.Domain.Enums;
using AIIANotebook.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.WebApi.Services;

public static class AdminWebService
{
    public static async Task<bool> IsSuperAdminAsync(ApplicationDbContext db, string? authHeader, IConfiguration config)
    {
        var userId = AuthWebService.ValidateAndExtractUserId(authHeader, config);
        if (!userId.HasValue) return false;

        // Đọc quyền từ DB thay vì từ claim, để thu hồi quyền có hiệu lực ngay.
        var user = await AuthWebService.GetActiveApprovedUserAsync(db, userId.Value);
        return user?.Role == UserRole.SuperAdmin;
    }

    public static async Task<List<UserProfileDto>> ListUsersAsync(ApplicationDbContext db, AccountApprovalStatus? status)
    {
        var query = db.Users.AsNoTracking();
        if (status.HasValue)
        {
            query = query.Where(u => u.ApprovalStatus == status.Value);
        }

        var users = await query.OrderByDescending(u => u.CreatedAt).Take(200).ToListAsync();
        return users.Select(AuthWebService.MapToProfile).ToList();
    }

    public static async Task<UserProfileDto?> SetApprovalAsync(ApplicationDbContext db, Guid userId, AccountApprovalStatus status)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;

        user.ApprovalStatus = status;
        user.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return AuthWebService.MapToProfile(user);
    }
}
