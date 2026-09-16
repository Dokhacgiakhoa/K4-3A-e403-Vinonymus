using AIIANotebook.Application.Features.Curriculum;
using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using AIIANotebook.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.WebApi.Services;

public static class CurriculumWebService
{
    public static async Task<List<CurriculumModuleDto>> GetModulesAsync(ApplicationDbContext db, Guid? userId, string? track = null)
    {
        try
        {
            var query = db.CurriculumModules
                .Include(m => m.Topics)
                .Where(m => m.IsPublished);

            if (!string.IsNullOrWhiteSpace(track) && Enum.TryParse<CurriculumTrack>(track, true, out var trackEnum))
            {
                query = query.Where(m => m.Track == trackEnum || m.Track == CurriculumTrack.Universal);
            }

            var dbModules = await query
                .OrderBy(m => m.ModuleNumber)
                .ToListAsync();

            if (dbModules.Any())
            {
                var userEnrollments = userId.HasValue
                    ? await db.CourseEnrollments.Where(e => e.UserId == userId.Value && e.Status == "Active").ToListAsync()
                    : new List<CourseEnrollment>();

                var userProgress = userId.HasValue
                    ? await db.UserTopicProgresses.Where(p => p.UserId == userId.Value && p.IsCompleted).ToListAsync()
                    : new List<UserTopicProgress>();

                return dbModules.Select(m =>
                {
                    bool isEnrolled = userEnrollments.Any(e => e.ModuleId == m.Id);
                    int totalTopics = m.Topics.Count;
                    int completedCount = userProgress.Count(p => p.ModuleId == m.Id);
                    int progressPercent = totalTopics > 0 ? (int)Math.Round(((double)completedCount / totalTopics) * 100) : 0;
                    bool isCompleted = totalTopics > 0 && completedCount >= totalTopics;

                    return new CurriculumModuleDto(
                        m.Id,
                        m.ModuleNumber,
                        m.Title,
                        m.Slug,
                        m.Description,
                        m.TargetLevel,
                        m.BloomLevel,
                        m.EstimatedHours,
                        m.HumanAiRatio,
                        m.CodeSnippet,
                        m.CodeLanguage,
                        isEnrolled,
                        completedCount,
                        totalTopics,
                        progressPercent,
                        isCompleted,
                        m.Track
                    );
                }).ToList();
            }
        }
        catch
        {
            // Graceful fallback
        }

        return CurriculumService.GetDefaultModules();
    }

    public static async Task<CurriculumModuleDetailDto?> GetModuleDetailAsync(ApplicationDbContext db, Guid moduleId, Guid? userId)
    {
        try
        {
            var module = await db.CurriculumModules
                .Include(m => m.Topics)
                .FirstOrDefaultAsync(m => m.Id == moduleId);

            if (module != null)
            {
                bool isEnrolled = userId.HasValue && await db.CourseEnrollments
                    .AnyAsync(e => e.UserId == userId.Value && e.ModuleId == moduleId && e.Status == "Active");

                var completedTopicIds = userId.HasValue
                    ? await db.UserTopicProgresses
                        .Where(p => p.UserId == userId.Value && p.ModuleId == moduleId && p.IsCompleted)
                        .Select(p => p.TopicId)
                        .ToListAsync()
                    : new List<Guid>();

                var sortedTopics = module.Topics
                    .OrderBy(t => t.TopicNumber)
                    .Select(t => new CurriculumTopicDto(
                        t.Id,
                        t.TopicNumber,
                        t.Title,
                        t.Slug,
                        isEnrolled ? t.Description : "Nội dung bài học chỉ mở cho học viên đã ghi danh (0đ).",
                        t.ReadingTimeMinutes,
                        isEnrolled ? t.CodeSnippet : null,
                        isEnrolled ? t.CodeLanguage : null,
                        completedTopicIds.Contains(t.Id)
                    )).ToList();

                int totalTopics = module.Topics.Count;
                int completedCount = completedTopicIds.Count;
                int progressPercent = totalTopics > 0 ? (int)Math.Round(((double)completedCount / totalTopics) * 100) : 0;
                bool isCompleted = totalTopics > 0 && completedCount >= totalTopics;

                return new CurriculumModuleDetailDto(
                    module.Id,
                    module.ModuleNumber,
                    module.Title,
                    module.Slug,
                    module.Description,
                    module.TargetLevel,
                    module.BloomLevel,
                    module.EstimatedHours,
                    module.HumanAiRatio,
                    module.CodeSnippet,
                    module.CodeLanguage,
                    isEnrolled,
                    completedCount,
                    totalTopics,
                    progressPercent,
                    isCompleted,
                    sortedTopics,
                    module.Track
                );
            }
        }
        catch
        {
            // Graceful fallback
        }

        return null;
    }

    public static async Task<bool> EnrollCourseAsync(ApplicationDbContext db, Guid userId, Guid moduleId)
    {
        var existing = await db.CourseEnrollments
            .FirstOrDefaultAsync(e => e.UserId == userId && e.ModuleId == moduleId);

        if (existing == null)
        {
            db.CourseEnrollments.Add(new CourseEnrollment
            {
                UserId = userId,
                ModuleId = moduleId,
                Status = "Active",
                EnrolledAt = DateTime.UtcNow
            });
        }
        else
        {
            existing.Status = "Active";
            existing.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return true;
    }

    public static async Task<bool> UnenrollCourseAsync(ApplicationDbContext db, Guid userId, Guid moduleId)
    {
        var existing = await db.CourseEnrollments
            .FirstOrDefaultAsync(e => e.UserId == userId && e.ModuleId == moduleId);

        if (existing != null)
        {
            existing.Status = "Dropped";
            existing.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return true;
        }

        return false;
    }

    public static async Task<bool> ToggleTopicProgressAsync(ApplicationDbContext db, Guid userId, Guid moduleId, Guid topicId)
    {
        var progress = await db.UserTopicProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.TopicId == topicId);

        if (progress == null)
        {
            db.UserTopicProgresses.Add(new UserTopicProgress
            {
                UserId = userId,
                ModuleId = moduleId,
                TopicId = topicId,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow
            });
        }
        else
        {
            progress.IsCompleted = !progress.IsCompleted;
            progress.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();

        // Check if 100% completed to issue certificate
        var totalTopicsCount = await db.CurriculumTopics.CountAsync(t => t.ModuleId == moduleId);
        var userCompletedCount = await db.UserTopicProgresses.CountAsync(p => p.UserId == userId && p.ModuleId == moduleId && p.IsCompleted);

        if (totalTopicsCount > 0 && userCompletedCount >= totalTopicsCount)
        {
            var hasCert = await db.IssuedCertificates.AnyAsync(c => c.UserId == userId && c.ModuleId == moduleId);
            if (!hasCert)
            {
                var mod = await db.CurriculumModules.FindAsync(moduleId);
                var user = await db.Users.FindAsync(userId);
                string certCode = $"AIIA-{mod?.TargetLevel.ToString() ?? "SFIA"}-2026-{Random.Shared.Next(100000, 999999)}";

                db.IssuedCertificates.Add(new IssuedCertificate
                {
                    UserId = userId,
                    ModuleId = moduleId,
                    CertificateCode = certCode,
                    CourseTitle = mod?.Title ?? "Chuyên Đề AI Thực Chiến",
                    CourseLevel = mod?.TargetLevel.ToString() ?? "L1",
                    RecipientName = user?.DisplayName ?? "Học Viên K.AI Labs",
                    IssueDate = DateOnly.FromDateTime(DateTime.UtcNow)
                });
                await db.SaveChangesAsync();
            }
        }

        return true;
    }

    public static async Task<CertificateResultDto?> GetCertificateAsync(ApplicationDbContext db, Guid userId, Guid moduleId)
    {
        var cert = await db.IssuedCertificates
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ModuleId == moduleId);

        if (cert != null)
        {
            return new CertificateResultDto(
                cert.CertificateCode,
                cert.RecipientName,
                cert.CourseTitle,
                cert.CourseLevel,
                cert.IssueDate
            );
        }

        return null;
    }
}
