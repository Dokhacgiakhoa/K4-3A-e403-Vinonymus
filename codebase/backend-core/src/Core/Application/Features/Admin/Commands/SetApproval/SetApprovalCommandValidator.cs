using AIIANotebook.Domain.Enums;
using FluentValidation;

namespace AIIANotebook.Application.Features.Admin.Commands.SetApproval;

public class SetApprovalCommandValidator : AbstractValidator<SetApprovalCommand>
{
    public SetApprovalCommandValidator()
    {
        RuleFor(x => x.Status)
            .Must(status => SetApprovalCommandHandler.TryParseDecision(status, out _))
            .WithMessage("Trạng thái phải là Approved hoặc Rejected.");
    }
}
