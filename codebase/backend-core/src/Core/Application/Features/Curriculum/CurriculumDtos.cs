using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.Features.Curriculum;

public record CurriculumModuleDto(
    Guid Id,
    int ModuleNumber,
    string Title,
    string Slug,
    string Description,
    SFIALevel TargetLevel,
    string BloomLevel,
    int EstimatedHours,
    string HumanAiRatio,
    string? CodeSnippet,
    string? CodeLanguage,
    bool IsEnrolled = false,
    int CompletedTopicsCount = 0,
    int TotalTopicsCount = 0,
    int ProgressPercent = 0,
    bool IsCompleted = false,
    CurriculumTrack Track = CurriculumTrack.Universal
);

public record CurriculumTopicDto(
    Guid Id,
    int TopicNumber,
    string Title,
    string Slug,
    string Description,
    int ReadingTimeMinutes,
    string? CodeSnippet,
    string? CodeLanguage,
    bool IsCompleted = false
);

public record CurriculumModuleDetailDto(
    Guid Id,
    int ModuleNumber,
    string Title,
    string Slug,
    string Description,
    SFIALevel TargetLevel,
    string BloomLevel,
    int EstimatedHours,
    string HumanAiRatio,
    string? CodeSnippet,
    string? CodeLanguage,
    bool IsEnrolled,
    int CompletedTopicsCount,
    int TotalTopicsCount,
    int ProgressPercent,
    bool IsCompleted,
    List<CurriculumTopicDto> Topics,
    CurriculumTrack Track = CurriculumTrack.Universal
);

public record CertificateResultDto(
    string CertificateCode,
    string RecipientName,
    string CourseTitle,
    string CourseLevel,
    DateOnly IssueDate
);
