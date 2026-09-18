using FluentValidation;

namespace AIIANotebook.Application.Features.GuestQuota.Commands.ConsumeGuestQuota;

public class ConsumeGuestQuotaCommandValidator : AbstractValidator<ConsumeGuestQuotaCommand>
{
    private const string Sha256Hex = "^[a-f0-9]{64}$";
    private const string InvalidMessage = "Mã phiên không hợp lệ.";

    public ConsumeGuestQuotaCommandValidator()
    {
        RuleFor(x => x.SessionHash).NotEmpty().WithMessage(InvalidMessage).Matches(Sha256Hex).WithMessage(InvalidMessage);
        RuleFor(x => x.IpHash).NotEmpty().WithMessage(InvalidMessage).Matches(Sha256Hex).WithMessage(InvalidMessage);
    }
}
