using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Constants;
using AIIANotebook.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Curriculum.Commands.EnrollCourse;

public class EnrollCourseCommandHandler(IApplicationDbContext db, ICurrentUserService currentUser)
    : IRequestHandler<EnrollCourseCommand, bool>
{
    public async Task<bool> Handle(EnrollCourseCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        if (!await db.CurriculumModules.AnyAsync(m => m.Id == request.ModuleId && m.IsPublished, cancellationToken))
        {
            return false;
        }

        var enrollment = await db.CourseEnrollments
            .FirstOrDefaultAsync(e => e.UserId == userId && e.ModuleId == request.ModuleId, cancellationToken);
        if (enrollment is null)
        {
            db.CourseEnrollments.Add(new CourseEnrollment { UserId = userId, ModuleId = request.ModuleId });
        }
        else
        {
            // Ghi danh lại sau khi huỷ: dùng lại bản ghi cũ để giữ lịch sử và chỉ mục unique (user, module).
            enrollment.Status = EnrollmentStatus.Active;
            enrollment.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
