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
}
