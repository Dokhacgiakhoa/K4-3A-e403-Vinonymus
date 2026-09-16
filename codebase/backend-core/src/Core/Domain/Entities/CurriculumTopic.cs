using AIIANotebook.Domain.Common;

namespace AIIANotebook.Domain.Entities;

public class CurriculumTopic : BaseEntity
{
    public Guid ModuleId { get; set; }
    public int TopicNumber { get; set; }
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Description { get; set; }
    public int ReadingTimeMinutes { get; set; } = 45;
    public string? CodeSnippet { get; set; }
    public string? CodeLanguage { get; set; }
    public bool IsPublished { get; set; } = true;

    public CurriculumModule? Module { get; set; }
}
