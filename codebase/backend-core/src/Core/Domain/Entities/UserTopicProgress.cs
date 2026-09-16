using AIIANotebook.Domain.Common;

namespace AIIANotebook.Domain.Entities;

public class UserTopicProgress : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ModuleId { get; set; }
    public Guid TopicId { get; set; }
    public bool IsCompleted { get; set; } = true;
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    public AppUser? User { get; set; }
    public CurriculumModule? Module { get; set; }
    public CurriculumTopic? Topic { get; set; }
}
