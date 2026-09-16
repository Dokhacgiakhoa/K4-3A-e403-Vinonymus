using AIIANotebook.Domain.Common;

namespace AIIANotebook.Domain.Entities;

public class CourseEnrollment : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ModuleId { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public AppUser? User { get; set; }
    public CurriculumModule? Module { get; set; }
}
