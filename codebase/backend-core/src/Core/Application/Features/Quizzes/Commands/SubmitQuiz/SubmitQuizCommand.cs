using MediatR;

namespace AIIANotebook.Application.Features.Quizzes.Commands.SubmitQuiz;

// Bài mô phỏng không lưu kết quả, nên không cần biết ai nộp (trường userId cũ trong body bị bỏ qua).
public record SubmitQuizCommand(Guid? ModuleId, Dictionary<Guid, string> UserAnswers) : IRequest<SubmitQuizResult>;
