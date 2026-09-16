using AIIANotebook.Domain.Common;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Domain.Entities;

public class CurriculumModule : BaseEntity
{
    public int ModuleNumber { get; set; }
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Description { get; set; }
    public SFIALevel TargetLevel { get; set; } = SFIALevel.L1;
    public CurriculumTrack Track { get; set; } = CurriculumTrack.Universal;
    public string BloomLevel { get; set; } = "Remember";
    public int EstimatedHours { get; set; } = 20;
    public string HumanAiRatio { get; set; } = "20% AI - 80% Human";
    public string? CodeSnippet { get; set; }
    public string? CodeLanguage { get; set; }
    public bool IsPublished { get; set; } = true;

    public ICollection<CurriculumTopic> Topics { get; set; } = new List<CurriculumTopic>();
    public ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();
}
