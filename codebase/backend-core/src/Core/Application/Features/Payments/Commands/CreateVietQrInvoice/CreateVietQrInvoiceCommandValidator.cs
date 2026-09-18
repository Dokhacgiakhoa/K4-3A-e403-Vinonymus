using FluentValidation;

namespace AIIANotebook.Application.Features.Payments.Commands.CreateVietQrInvoice;

public class CreateVietQrInvoiceCommandValidator : AbstractValidator<CreateVietQrInvoiceCommand>
{
    public CreateVietQrInvoiceCommandValidator()
    {
        RuleFor(x => x.AmountVnd)
            .GreaterThan(0).WithMessage("Số tiền phải lớn hơn 0.")
            .LessThanOrEqualTo(100_000_000).WithMessage("Số tiền vượt giới hạn một hoá đơn.");

        // Tên gói đi vào nội dung chuyển khoản, nên chỉ cho chữ, số, gạch dưới và gạch ngang.
        RuleFor(x => x.PlanName)
            .NotEmpty().WithMessage("Thiếu tên gói.")
            .MaximumLength(50).WithMessage("Tên gói tối đa 50 ký tự.")
            .Matches("^[A-Za-z0-9_-]+$").WithMessage("Tên gói chỉ gồm chữ, số, dấu gạch dưới hoặc gạch ngang.");
    }
}
