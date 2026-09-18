using AIIANotebook.Application.Common.Interfaces;

namespace AIIANotebook.Application.Common.Extensions;

public static class CurrentUserExtensions
{
    // Endpoint đã chặn khách bằng policy; kiểm tra lại ở đây để handler không bao giờ chạy với người dùng rỗng.
    public static Guid RequireUserId(this ICurrentUserService currentUser) =>
        currentUser.UserId ?? throw new UnauthorizedAccessException();
}
