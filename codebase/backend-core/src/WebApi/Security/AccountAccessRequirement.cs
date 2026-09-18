using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace AIIANotebook.WebApi.Security;

/// <summary>
/// RequiredRole = null: tài khoản đang hoạt động và đã được duyệt.
/// RequiredRole có giá trị: đã đăng nhập hợp lệ và có đúng vai trò đó.
/// Tách hai điều kiện để phân biệt 401 (chưa đăng nhập hợp lệ) với 403 (thiếu quyền).
/// </summary>
public class AccountAccessRequirement(UserRole? requiredRole = null) : IAuthorizationRequirement
{
    public UserRole? RequiredRole { get; } = requiredRole;
}

// Đọc trạng thái tài khoản từ DB ở mỗi request thay vì tin claim trong token,
// để khoá tài khoản hay thu hồi quyền admin có hiệu lực ngay, không phải chờ token hết hạn.
public class AccountAccessHandler(IApplicationDbContext db, ICurrentUserService currentUser) : IAuthorizationHandler
{
    public async Task HandleAsync(AuthorizationHandlerContext context)
    {
        var requirements = context.PendingRequirements.OfType<AccountAccessRequirement>().ToList();
        if (requirements.Count == 0) return;

        var cancellationToken = (context.Resource as HttpContext)?.RequestAborted ?? CancellationToken.None;
        var user = await db.Users.FindSignedInUserAsync(currentUser.UserId, cancellationToken);
        if (user is null) return;

        foreach (var requirement in requirements.Where(r => r.RequiredRole is null || r.RequiredRole == user.Role))
        {
            context.Succeed(requirement);
        }
    }
}
