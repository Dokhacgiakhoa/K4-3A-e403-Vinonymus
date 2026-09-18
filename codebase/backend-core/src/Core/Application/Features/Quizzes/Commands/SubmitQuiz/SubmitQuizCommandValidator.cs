using FluentValidation;

namespace AIIANotebook.Application.Features.Quizzes.Commands.SubmitQuiz;

public class SubmitQuizCommandValidator : AbstractValidator<SubmitQuizCommand>
{
    public SubmitQuizCommandValidator()
    {
        RuleFor(x => x.UserAnswers)
            .NotNull().WithMessage("Thiếu câu trả lời.")
            .Must(a => a is null || a.Count <= 100).WithMessage("Bài làm có quá nhiều câu trả lời.");
    }
}
