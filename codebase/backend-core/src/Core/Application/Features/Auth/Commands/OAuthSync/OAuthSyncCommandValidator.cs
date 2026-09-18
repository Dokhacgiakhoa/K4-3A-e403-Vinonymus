using FluentValidation;

namespace AIIANotebook.Application.Features.Auth.Commands.OAuthSync;

public class OAuthSyncCommandValidator : AbstractValidator<OAuthSyncCommand>
{
    public OAuthSyncCommandValidator()
    {
        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Không thể xác định Email từ tài khoản OAuth.")
            .MaximumLength(254).WithMessage("Địa chỉ email quá dài.");
        RuleFor(x => x.DisplayName).MaximumLength(100).WithMessage("Họ tên tối đa 100 ký tự.");
        RuleFor(x => x.AvatarUrl).MaximumLength(2048).WithMessage("Đường dẫn ảnh đại diện quá dài.");
    }
}
