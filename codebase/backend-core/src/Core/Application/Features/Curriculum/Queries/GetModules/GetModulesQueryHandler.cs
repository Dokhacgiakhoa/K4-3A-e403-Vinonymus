using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Constants;
using AIIANotebook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AIIANotebook.Application.Features.Curriculum.Queries.GetModules;

public class GetModulesQueryHandler(IApplicationDbContext db, ICurrentUserService currentUser, ILogger<GetModulesQueryHandler> logger)
    : IRequestHandler<GetModulesQuery, List<CurriculumModuleDto>>
{
    public async Task<List<CurriculumModuleDto>> Handle(GetModulesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = db.CurriculumModules.AsNoTracking().Include(m => m.Topics).Where(m => m.IsPublished);
            if (!string.IsNullOrWhiteSpace(request.Track) && Enum.TryParse<CurriculumTrack>(request.Track, true, out var track))
            {
                query = query.Where(m => m.Track == track || m.Track == CurriculumTrack.Universal);
            }

            var modules = await query.OrderBy(m => m.ModuleNumber).ToListAsync(cancellationToken);
            if (modules.Count == 0)
            {
                return DefaultCurriculumModules.All();
            }

            var user = await db.Users.FindSignedInUserAsync(currentUser.UserId, cancellationToken);
            var enrolledModuleIds = user is null
                ? new HashSet<Guid>()
                : (await db.CourseEnrollments.AsNoTracking()
                    .Where(e => e.UserId == user.Id && e.Status == EnrollmentStatus.Active)
                    .Select(e => e.ModuleId)
                    .ToListAsync(cancellationToken)).ToHashSet();
            var completedByModule = user is null
                ? new Dictionary<Guid, int>()
                : await db.UserTopicProgresses.AsNoTracking()
                    .Where(p => p.UserId == user.Id && p.IsCompleted)
                    .GroupBy(p => p.ModuleId)
                    .Select(g => new { ModuleId = g.Key, Count = g.Count() })
                    .ToDictionaryAsync(x => x.ModuleId, x => x.Count, cancellationToken);

            return modules.Select(m =>
            {
                var progress = new CourseProgress(completedByModule.GetValueOrDefault(m.Id), m.Topics.Count);
                return new CurriculumModuleDto(
                    m.Id, m.ModuleNumber, m.Title, m.Slug, m.Description, m.TargetLevel, m.BloomLevel,
                    m.EstimatedHours, m.HumanAiRatio, m.CodeSnippet, m.CodeLanguage,
                    enrolledModuleIds.Contains(m.Id), progress.Completed, progress.Total, progress.Percent, progress.IsCompleted,
                    m.Track);
            }).ToList();
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // Trang khoá học vẫn hiện danh sách mặc định khi DB lỗi, thay vì trắng trang.
            logger.LogWarning(ex, "Không đọc được danh sách chuyên đề, dùng danh sách mặc định.");
            return DefaultCurriculumModules.All();
        }
    }
}
