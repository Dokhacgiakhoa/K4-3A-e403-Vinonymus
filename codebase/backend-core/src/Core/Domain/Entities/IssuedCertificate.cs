using AIIANotebook.Domain.Common;

namespace AIIANotebook.Domain.Entities;

public class IssuedCertificate : BaseEntity
{
    public required string CertificateCode { get; set; }
    public Guid UserId { get; set; }
    public Guid ModuleId { get; set; }
    public required string CourseTitle { get; set; }
    public required string CourseLevel { get; set; }
    public required string RecipientName { get; set; }
    public DateOnly IssueDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

    public AppUser? User { get; set; }
    public CurriculumModule? Module { get; set; }
}
