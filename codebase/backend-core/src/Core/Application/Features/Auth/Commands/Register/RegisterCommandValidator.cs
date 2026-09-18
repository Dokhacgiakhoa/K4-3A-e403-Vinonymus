using FluentValidation;

namespace AIIANotebook.Application.Features.Auth.Commands.Register;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        // Dừng ở lỗi đầu tiên: frontend chỉ hiện một câu thông báo.
        ClassLevelCascadeMode = CascadeMode.Stop;
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Vui lòng nhập đầy đủ Email, Mật khẩu và Họ tên.")
            .MaximumLength(254).WithMessage("Địa chỉ email quá dài.")
            .EmailAddress().WithMessage("Địa chỉ email không đúng định dạng.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Vui lòng nhập đầy đủ Email, Mật khẩu và Họ tên.")
            .MinimumLength(8).WithMessage("Mật khẩu phải có độ dài tối thiểu 8 ký tự.")
            // BCrypt chỉ dùng 72 byte đầu; dài hơn thì phần sau bị bỏ qua mà người dùng không biết.
            .Must(p => System.Text.Encoding.UTF8.GetByteCount(p) <= 72).WithMessage("Mật khẩu tối đa 72 ký tự.");

        RuleFor(x => x.DisplayName)
            .NotEmpty().WithMessage("Vui lòng nhập đầy đủ Email, Mật khẩu và Họ tên.")
            .MaximumLength(100).WithMessage("Họ tên tối đa 100 ký tự.");
    }
}
