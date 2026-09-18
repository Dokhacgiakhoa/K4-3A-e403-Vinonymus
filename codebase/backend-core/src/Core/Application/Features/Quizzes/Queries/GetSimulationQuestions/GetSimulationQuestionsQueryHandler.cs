using AIIANotebook.Domain.Enums;
using MediatR;

namespace AIIANotebook.Application.Features.Quizzes.Queries.GetSimulationQuestions;

public class GetSimulationQuestionsQueryHandler : IRequestHandler<GetSimulationQuestionsQuery, SimulationQuestionsDto>
{
    public Task<SimulationQuestionsDto> Handle(GetSimulationQuestionsQuery request, CancellationToken cancellationToken)
    {
        var level = request.Level.HasValue && Enum.IsDefined(typeof(SFIALevel), request.Level.Value)
            ? (SFIALevel)request.Level.Value
            : SFIALevel.L1;

        var questions = SimulationQuestionBank.For(level).Select(QuizQuestionPublicDto.From).ToList();
        return Task.FromResult(new SimulationQuestionsDto(level, questions));
    }
}
