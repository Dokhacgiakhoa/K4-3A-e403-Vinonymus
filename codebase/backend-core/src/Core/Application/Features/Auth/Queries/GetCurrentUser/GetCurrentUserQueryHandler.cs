using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using MediatR;

namespace AIIANotebook.Application.Features.Auth.Queries.GetCurrentUser;

public class GetCurrentUserQueryHandler(IApplicationDbContext db, ICurrentUserService currentUser)
    : IRequestHandler<GetCurrentUserQuery, UserProfileDto?>
{
    public async Task<UserProfileDto?> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await db.Users.FindSignedInUserAsync(currentUser.UserId, cancellationToken);
        return user is null ? null : UserProfileDto.From(user);
    }
}
