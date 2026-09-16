using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.Features.Quizzes;

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

public record SubmitQuizRequest(
    Guid UserId,
    Guid? ModuleId,
    Dictionary<Guid, string> UserAnswers
);

public record SubmitQuizResult(
    int TotalQuestions,
    int CorrectCount,
    double ScorePercentage,
    bool IsPassed,
    string FeedbackMessage
);

public static class QuizService
{
    public static List<QuizQuestionDto> GetSimulationMockQuestions(SFIALevel level)
    {
        return new List<QuizQuestionDto>
        {
            new(
                Guid.Parse("22222222-2222-2222-2222-222222222201"),
                level,
                "Trong cơ chế Attention của mô hình Transformer, tại sao tích vô hướng Dot-Product Q.K^T lại phải chia cho căn bậc hai của d_k (Scaled Factor)?",
                "Để giảm dung lượng RAM của ma trận",
                "Để tránh giá trị quá lớn đẩy Softmax vào vùng gradient cực nhỏ (bão hòa gradient)",
                "Để tự động đảo ngược thứ tự các từ trong câu",
                "Để tăng tốc độ tính toán trên GPU",
                "B",
                "Khi d_k lớn, tích vô hướng có phương sai tăng lên d_k, khiến giá trị đẩy vào hàm Softmax rất lớn, dẫn tới gradient cực nhỏ (vanishing gradient). Chia cho sqrt(d_k) giúp ổn định gradient.",
                true
            ),
            new(
                Guid.Parse("22222222-2222-2222-2222-222222222202"),
                level,
                "Trong giải thuật tìm kiếm lai Hybrid Search RRF (Reciprocal Rank Fusion), hằng số k (thường là 60) có vai trò gì?",
                "Giới hạn số lượng token trả về",
                "Làm mềm ảnh hưởng của các tài liệu có thứ hạng cực cao từ một hệ thống tìm kiếm đơn lẻ",
                "Xác định ngưỡng khoảng cách Cosine Similarity",
                "Là số chiều của vector nhúng",
                "B",
                "Hằng số k trong công thức RRF Score = sum(1 / (k + rank)) giúp giảm bớt sự thống trị quá mức của vị trí top 1 từ một thuật toán tìm kiếm cụ thể.",
                true
            )
        };
    }

    public static SubmitQuizResult EvaluateSubmission(SubmitQuizRequest request, List<QuizQuestionDto> questions)
    {
        int correct = 0;
        foreach (var q in questions)
        {
            if (request.UserAnswers.TryGetValue(q.Id, out var answer) && 
                string.Equals(answer.Trim(), q.CorrectOption.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                correct++;
            }
        }

        double pct = questions.Count > 0 ? (double)correct / questions.Count * 100.0 : 0.0;
        bool passed = pct >= 70.0;

        return new SubmitQuizResult(
            TotalQuestions: questions.Count,
            CorrectCount: correct,
            ScorePercentage: pct,
            IsPassed: passed,
            FeedbackMessage: passed 
                ? $"Xuất sắc! Bạn đã vượt qua bài thi với {pct:F1}% số điểm chuẩn SFIA." 
                : $"Bạn đạt {pct:F1}%. Cần tối thiểu 70% để vượt qua cấp độ này."
        );
    }
}
