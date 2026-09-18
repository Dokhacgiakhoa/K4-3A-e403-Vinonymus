using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Curriculum.Queries.GetModuleDetail;

public class GetModuleDetailQueryHandler(IApplicationDbContext db, ICurrentUserService currentUser)
    : IRequestHandler<GetModuleDetailQuery, CurriculumModuleDetailDto?>
{
    private const string LockedTopicDescription = "Nội dung bài học chỉ mở cho học viên đã ghi danh (0đ).";

    public async Task<CurriculumModuleDetailDto?> Handle(GetModuleDetailQuery request, CancellationToken cancellationToken)
    {
        var module = await db.CurriculumModules.AsNoTracking()
            .Include(m => m.Topics)
            .FirstOrDefaultAsync(m => m.Id == request.ModuleId && m.IsPublished, cancellationToken);
        if (module is null) return null;

        var user = await db.Users.FindSignedInUserAsync(currentUser.UserId, cancellationToken);
        var isEnrolled = user is not null && await db.CourseEnrollments.AnyAsync(
            e => e.UserId == user.Id && e.ModuleId == module.Id && e.Status == EnrollmentStatus.Active, cancellationToken);
        var completedTopicIds = user is null
            ? new HashSet<Guid>()
            : (await db.UserTopicProgresses.AsNoTracking()
                .Where(p => p.UserId == user.Id && p.ModuleId == module.Id && p.IsCompleted)
                .Select(p => p.TopicId)
                .ToListAsync(cancellationToken)).ToHashSet();

        // Chưa ghi danh thì chỉ thấy tên bài, không thấy nội dung.
        var topics = module.Topics
            .OrderBy(t => t.TopicNumber)
            .Select(t => new CurriculumTopicDto(
                t.Id, t.TopicNumber, t.Title, t.Slug,
                isEnrolled ? t.Description : LockedTopicDescription,
                t.ReadingTimeMinutes,
                isEnrolled ? t.CodeSnippet : null,
                isEnrolled ? t.CodeLanguage : null,
                completedTopicIds.Contains(t.Id)))
            .ToList();

        var progress = new CourseProgress(completedTopicIds.Count, module.Topics.Count);
        return new CurriculumModuleDetailDto(
            module.Id, module.ModuleNumber, module.Title, module.Slug, module.Description, module.TargetLevel,
            module.BloomLevel, module.EstimatedHours, module.HumanAiRatio, module.CodeSnippet, module.CodeLanguage,
            isEnrolled, progress.Completed, progress.Total, progress.Percent, progress.IsCompleted, topics, module.Track);
    }
}
