using AIIANotebook.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Auth.Commands.Login;

public class LoginCommandHandler(IApplicationDbContext db, IPasswordHasher passwordHasher, IJwtTokenGenerator tokenGenerator)
    : IRequestHandler<LoginCommand, AuthResultDto>
{
    public async Task<AuthResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email.ToLower() == email, cancellationToken);

        // Cùng một câu cho "sai email" và "sai mật khẩu" để không dò được email nào đã đăng ký.
        if (user is null || string.IsNullOrEmpty(user.PasswordHash) || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return AuthResultDto.Fail("Email hoặc mật khẩu không chính xác.");
        }

        var blocked = SignInMessages.For(user.SignInBlock);
        if (blocked is not null)
        {
            return AuthResultDto.Fail(blocked, user);
        }

        return new AuthResultDto(true, "Đăng nhập thành công!", tokenGenerator.CreateToken(user), UserProfileDto.From(user), user.ApprovalStatus.ToString());
    }
}
