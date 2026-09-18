using System.Security.Cryptography;
using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Curriculum.Commands.ToggleTopicProgress;

public class ToggleTopicProgressCommandHandler(IApplicationDbContext db, ICurrentUserService currentUser)
    : IRequestHandler<ToggleTopicProgressCommand, bool>
{
    public async Task<bool> Handle(ToggleTopicProgressCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();

        // Chặn đánh dấu bài của chuyên đề khác, để không "hoàn thành" chuyên đề bằng bài không thuộc về nó.
        if (!await db.CurriculumTopics.AnyAsync(t => t.Id == request.TopicId && t.ModuleId == request.ModuleId, cancellationToken))
        {
            return false;
        }

        var progress = await db.UserTopicProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.TopicId == request.TopicId, cancellationToken);
        if (progress is null)
        {
            db.UserTopicProgresses.Add(new UserTopicProgress
            {
                UserId = userId,
                ModuleId = request.ModuleId,
                TopicId = request.TopicId,
                IsCompleted = true
            });
        }
        else
        {
            progress.IsCompleted = !progress.IsCompleted;
            progress.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(cancellationToken);
        await IssueCertificateIfCompletedAsync(userId, request.ModuleId, cancellationToken);
        return true;
    }

    private async Task IssueCertificateIfCompletedAsync(Guid userId, Guid moduleId, CancellationToken cancellationToken)
    {
        var total = await db.CurriculumTopics.CountAsync(t => t.ModuleId == moduleId, cancellationToken);
        var completed = await db.UserTopicProgresses.CountAsync(p => p.UserId == userId && p.ModuleId == moduleId && p.IsCompleted, cancellationToken);
        if (!new CourseProgress(completed, total).IsCompleted) return;

        // Chứng chỉ đã cấp thì giữ nguyên, kể cả khi học viên bỏ tick một bài sau đó.
        if (await db.IssuedCertificates.AnyAsync(c => c.UserId == userId && c.ModuleId == moduleId, cancellationToken)) return;

        var module = await db.CurriculumModules.AsNoTracking().FirstAsync(m => m.Id == moduleId, cancellationToken);
        var user = await db.Users.AsNoTracking().FirstAsync(u => u.Id == userId, cancellationToken);

        db.IssuedCertificates.Add(new IssuedCertificate
        {
            UserId = userId,
            ModuleId = moduleId,
            // Mã chứng chỉ để người ngoài tra cứu, nên dùng số ngẫu nhiên an toàn thay vì Random.
            CertificateCode = $"AIIA-{module.TargetLevel}-{DateTime.UtcNow.Year}-{RandomNumberGenerator.GetInt32(100000, 1000000)}",
            CourseTitle = module.Title,
            CourseLevel = module.TargetLevel.ToString(),
            RecipientName = user.DisplayName
        });
        await db.SaveChangesAsync(cancellationToken);
    }
}
