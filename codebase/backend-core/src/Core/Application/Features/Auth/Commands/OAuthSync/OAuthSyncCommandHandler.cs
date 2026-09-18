using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Auth.Commands.OAuthSync;

public class OAuthSyncCommandHandler(IApplicationDbContext db, IJwtTokenGenerator tokenGenerator)
    : IRequestHandler<OAuthSyncCommand, AuthResultDto>
{
    public async Task<AuthResultDto> Handle(OAuthSyncCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var displayName = string.IsNullOrWhiteSpace(request.DisplayName) ? email.Split('@')[0] : request.DisplayName.Trim();

        var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email, cancellationToken);
        if (user is null)
        {
            // Đăng nhập bằng Google/GitHub lần đầu cũng phải chờ duyệt như đăng ký bằng mật khẩu.
            user = new AppUser
            {
                Email = email,
                DisplayName = displayName,
                AvatarUrl = request.AvatarUrl,
                ApprovalStatus = AccountApprovalStatus.Pending
            };
            db.Users.Add(user);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(request.AvatarUrl) && string.IsNullOrWhiteSpace(user.AvatarUrl))
            {
                user.AvatarUrl = request.AvatarUrl;
            }
            user.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(cancellationToken);

        var blocked = SignInMessages.For(user.SignInBlock);
        if (blocked is not null)
        {
            return AuthResultDto.Fail(blocked, user);
        }

        return new AuthResultDto(true, "Đăng nhập OAuth thành công!", tokenGenerator.CreateToken(user), UserProfileDto.From(user), user.ApprovalStatus.ToString());
    }
}
