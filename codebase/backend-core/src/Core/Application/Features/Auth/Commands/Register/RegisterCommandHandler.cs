using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler(IApplicationDbContext db, IPasswordHasher passwordHasher)
    : IRequestHandler<RegisterCommand, AuthResultDto>
{
    private const string DuplicateEmailMessage = "Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.";

    public async Task<AuthResultDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (await db.Users.AnyAsync(u => u.Email.ToLower() == email, cancellationToken))
        {
            return AuthResultDto.Fail(DuplicateEmailMessage);
        }

        var user = new AppUser
        {
            Email = email,
            DisplayName = request.DisplayName.Trim(),
            PasswordHash = passwordHasher.Hash(request.Password),
            ApprovalStatus = AccountApprovalStatus.Pending
        };

        db.Users.Add(user);
        try
        {
            await db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            // Hai request đăng ký cùng email chạy song song: chỉ mục unique chặn lại bản thứ hai.
            return AuthResultDto.Fail(DuplicateEmailMessage);
        }

        // Không cấp token: chỉ đăng nhập được sau khi quản trị viên duyệt.
        return new AuthResultDto(
            true,
            "Đăng ký thành công! Tài khoản đang chờ quản trị viên duyệt, bạn sẽ đăng nhập được sau khi được duyệt.",
            ApprovalStatus: user.ApprovalStatus.ToString());
    }
}
