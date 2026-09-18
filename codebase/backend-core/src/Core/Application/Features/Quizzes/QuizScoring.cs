namespace AIIANotebook.Application.Features.Quizzes;

public static class QuizScoring
{
    public const double PassPercent = 70.0;

    public static SubmitQuizResult Evaluate(IReadOnlyDictionary<Guid, string> answers, IReadOnlyList<QuizQuestionDto> questions)
    {
        var correct = questions.Count(q =>
            answers.TryGetValue(q.Id, out var answer)
            && string.Equals(answer?.Trim(), q.CorrectOption.Trim(), StringComparison.OrdinalIgnoreCase));

        var percent = questions.Count > 0 ? (double)correct / questions.Count * 100.0 : 0.0;
        var passed = percent >= PassPercent;

        return new SubmitQuizResult(
            TotalQuestions: questions.Count,
            CorrectCount: correct,
            ScorePercentage: percent,
            IsPassed: passed,
            FeedbackMessage: passed
                ? $"Xuất sắc! Bạn đã vượt qua bài thi với {percent:F1}% số điểm chuẩn SFIA."
                : $"Bạn đạt {percent:F1}%. Cần tối thiểu {PassPercent:F0}% để vượt qua cấp độ này.");
    }
}
