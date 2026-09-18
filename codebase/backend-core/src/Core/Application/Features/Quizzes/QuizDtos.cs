using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.Features.Quizzes;

// Bản đầy đủ, có đáp án — chỉ dùng trong server để chấm điểm.
public record QuizQuestionDto(
    Guid Id,
    SFIALevel Level,
    string QuestionText,
    string OptionA,
    string OptionB,
    string OptionC,
    string OptionD,
    string CorrectOption,
    string Explanation,
    bool IsSimulationMock
);

// Bản gửi cho người làm bài: không kèm đáp án và lời giải, để không xem được đáp án trước khi nộp.
public record QuizQuestionPublicDto(
    Guid Id,
    SFIALevel Level,
    string QuestionText,
    string OptionA,
    string OptionB,
    string OptionC,
    string OptionD,
    bool IsSimulationMock)
{
    public static QuizQuestionPublicDto From(QuizQuestionDto q) =>
        new(q.Id, q.Level, q.QuestionText, q.OptionA, q.OptionB, q.OptionC, q.OptionD, q.IsSimulationMock);
}

public record SubmitQuizResult(
    int TotalQuestions,
    int CorrectCount,
    double ScorePercentage,
    bool IsPassed,
    string FeedbackMessage
);
