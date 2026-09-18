using FluentValidation;

namespace AIIANotebook.Application.Features.Auth.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        ClassLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Email).NotEmpty().WithMessage("Vui lòng nhập Email và Mật khẩu.");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Vui lòng nhập Email và Mật khẩu.");
    }
}
