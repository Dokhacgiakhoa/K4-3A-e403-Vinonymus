using AIIANotebook.Domain.Common;

namespace AIIANotebook.Domain.Entities;

public class UserStreak : BaseEntity
{
    public Guid UserId { get; set; }
    public int CurrentStreakDays { get; set; } = 1;
    public int LongestStreakDays { get; set; } = 1;
    public DateOnly LastActiveDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
}
