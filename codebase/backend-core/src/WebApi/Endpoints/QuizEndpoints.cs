using AIIANotebook.Application.Features.Quizzes.Commands.SubmitQuiz;
using AIIANotebook.Application.Features.Quizzes.Queries.GetSimulationQuestions;
using MediatR;

namespace AIIANotebook.WebApi.Endpoints;

public static class QuizEndpoints
{
    public static IEndpointRouteBuilder MapQuizEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/quizzes").WithTags("Quizzes");

        // Bài thi mô phỏng (câu hỏi tự soạn, không dùng đề thật). Không trả đáp án trước khi nộp.
        group.MapGet("/simulation", async (int? level, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetSimulationQuestionsQuery(level), ct);
            return Results.Ok(new { success = true, level = result.Level.ToString(), data = result.Questions });
        });

        group.MapPost("/submit", async (SubmitQuizCommand command, ISender sender, CancellationToken ct) =>
            Results.Ok(new { success = true, data = await sender.Send(command, ct) }));

        return app;
    }
}
