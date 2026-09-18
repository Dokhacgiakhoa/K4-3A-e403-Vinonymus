using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Application.Features.Auth;
using AIIANotebook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Admin.Commands.SetApproval;

public class SetApprovalCommandHandler(IApplicationDbContext db) : IRequestHandler<SetApprovalCommand, UserProfileDto?>
{
    public static bool TryParseDecision(string? value, out AccountApprovalStatus status) =>
        Enum.TryParse(value, ignoreCase: true, out status)
        && Enum.IsDefined(status)
        && status != AccountApprovalStatus.Pending;

    public async Task<UserProfileDto?> Handle(SetApprovalCommand request, CancellationToken cancellationToken)
    {
        // Validator đã chặn giá trị sai trước khi tới đây.
        TryParseDecision(request.Status, out var status);

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user is null) return null;

        user.SetApproval(status);
        await db.SaveChangesAsync(cancellationToken);
        return UserProfileDto.From(user);
    }
}
