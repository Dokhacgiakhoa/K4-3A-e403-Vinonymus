using AIIANotebook.Domain.Common;

namespace AIIANotebook.Domain.Entities;

public class QuizSubmission : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid? ModuleId { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public double ScorePercentage { get; set; }
    public bool IsPassed { get; set; }
    public int StudyMinutesCredited { get; set; } = 30;
}
