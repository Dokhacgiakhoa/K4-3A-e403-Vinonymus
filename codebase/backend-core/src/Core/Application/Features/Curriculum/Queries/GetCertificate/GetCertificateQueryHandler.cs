using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Curriculum.Queries.GetCertificate;

public class GetCertificateQueryHandler(IApplicationDbContext db, ICurrentUserService currentUser)
    : IRequestHandler<GetCertificateQuery, CertificateResultDto?>
{
    public async Task<CertificateResultDto?> Handle(GetCertificateQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUser.RequireUserId();
        return await db.IssuedCertificates.AsNoTracking()
            .Where(c => c.UserId == userId && c.ModuleId == request.ModuleId)
            .Select(c => new CertificateResultDto(c.CertificateCode, c.RecipientName, c.CourseTitle, c.CourseLevel, c.IssueDate))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
