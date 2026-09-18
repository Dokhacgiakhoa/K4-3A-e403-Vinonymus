using AIIANotebook.Domain.Common;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Domain.Entities;

public class AppUser : BaseEntity
{
    public required string Email { get; set; }
    public required string DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? PasswordHash { get; set; }
    public UserTier Tier { get; set; } = UserTier.Free;
    public UserRole Role { get; set; } = UserRole.Visitor;
    public SFIALevel CurrentLevel { get; set; } = SFIALevel.L1;
    public int TotalStudyHours { get; set; } = 0;
    public int AiTokenQuota { get; set; } = 100_000;
    public int AiTokenUsed { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    // Tài khoản mới phải chờ quản trị viên duyệt mới được đăng nhập.
    public AccountApprovalStatus ApprovalStatus { get; set; } = AccountApprovalStatus.Pending;

    // Luật đăng nhập nằm ở Domain để mọi lối vào (mật khẩu, OAuth, token cũ) dùng chung một nguồn.
    public SignInBlock SignInBlock => !IsActive
        ? SignInBlock.Locked
        : ApprovalStatus switch
        {
            AccountApprovalStatus.Approved => SignInBlock.None,
            AccountApprovalStatus.Rejected => SignInBlock.Rejected,
            _ => SignInBlock.PendingApproval
        };

    public bool CanSignIn => SignInBlock == SignInBlock.None;

    public void SetApproval(AccountApprovalStatus status)
    {
        if (status == AccountApprovalStatus.Pending)
        {
            throw new ArgumentException("Chỉ được duyệt hoặc từ chối, không đưa tài khoản về trạng thái chờ.", nameof(status));
        }

        ApprovalStatus = status;
        UpdatedAt = DateTime.UtcNow;
    }
}
