using AIIANotebook.Domain.Enums;
using MediatR;

namespace AIIANotebook.Application.Features.Quizzes.Commands.SubmitQuiz;

public class SubmitQuizCommandHandler : IRequestHandler<SubmitQuizCommand, SubmitQuizResult>
{
    public Task<SubmitQuizResult> Handle(SubmitQuizCommand request, CancellationToken cancellationToken)
    {
        var questions = SimulationQuestionBank.For(SFIALevel.L1);
        return Task.FromResult(QuizScoring.Evaluate(request.UserAnswers, questions));
    }
}
