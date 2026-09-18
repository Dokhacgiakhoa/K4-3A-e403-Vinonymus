using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.Features.Auth;

public record UserProfileDto(
    Guid Id,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    string Tier,
    string Role,
    string CurrentLevel,
    int TotalStudyHours,
    int AiTokenQuota,
    int AiTokenUsed,
    string ApprovalStatus)
{
    public static UserProfileDto From(AppUser user) => new(
        user.Id,
        user.Email,
        user.DisplayName,
        user.AvatarUrl,
        user.Tier.ToString(),
        user.Role.ToString(),
        user.CurrentLevel.ToString(),
        user.TotalStudyHours,
        user.AiTokenQuota,
        user.AiTokenUsed,
        user.ApprovalStatus.ToString());
}

// Giữ nguyên dạng JSON cũ ({ success, message, token, user, approvalStatus }) để frontend không phải sửa.
public record AuthResultDto(
    bool Success,
    string Message,
    string? Token = null,
    UserProfileDto? User = null,
    string? ApprovalStatus = null)
{
    public static AuthResultDto Fail(string message, AppUser? user = null) =>
        new(false, message, ApprovalStatus: user?.ApprovalStatus.ToString());
}

public static class SignInMessages
{
    public const string Pending =
        "Tài khoản của bạn đang chờ quản trị viên duyệt. Bạn sẽ đăng nhập được sau khi tài khoản được duyệt.";
    public const string Rejected =
        "Tài khoản của bạn chưa được duyệt. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.";
    public const string Locked =
        "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.";

    public static string? For(SignInBlock block) => block switch
    {
        SignInBlock.None => null,
        SignInBlock.Locked => Locked,
        SignInBlock.Rejected => Rejected,
        _ => Pending
    };
}
