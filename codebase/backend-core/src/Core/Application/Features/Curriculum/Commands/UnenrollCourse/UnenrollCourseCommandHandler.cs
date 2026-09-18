using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Curriculum.Commands.UnenrollCourse;

public class UnenrollCourseCommandHandler(IApplicationDbContext db, ICurrentUserService currentUser)
    : IRequestHandler<UnenrollCourseCommand, bool>
{
    public async Task<bool> Handle(UnenrollCourseCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        var enrollment = await db.CourseEnrollments
            .FirstOrDefaultAsync(e => e.UserId == userId && e.ModuleId == request.ModuleId, cancellationToken);
        if (enrollment is null) return false;

        // Chỉ đổi trạng thái, không xoá: tiến độ và chứng chỉ đã cấp vẫn giữ nếu học viên quay lại.
        enrollment.Status = EnrollmentStatus.Dropped;
        enrollment.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
