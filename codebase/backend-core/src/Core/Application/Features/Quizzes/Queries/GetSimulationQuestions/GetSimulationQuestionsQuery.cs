using AIIANotebook.Domain.Enums;
using MediatR;

namespace AIIANotebook.Application.Features.Quizzes.Queries.GetSimulationQuestions;

public record GetSimulationQuestionsQuery(int? Level) : IRequest<SimulationQuestionsDto>;

public record SimulationQuestionsDto(SFIALevel Level, List<QuizQuestionPublicDto> Questions);
