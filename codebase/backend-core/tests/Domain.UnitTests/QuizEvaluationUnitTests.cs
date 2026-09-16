using AIIANotebook.Application.Features.Quizzes;
using AIIANotebook.Domain.Enums;
using Xunit;

namespace AIIANotebook.Domain.UnitTests;

public class QuizEvaluationUnitTests
{
    [Fact]
    public void EvaluateSubmission_ShouldPass_WhenScoreIsAtLeast70Percent()
    {
        // Arrange
        var questions = QuizService.GetSimulationMockQuestions(SFIALevel.L1);
        Assert.NotEmpty(questions);

        var answers = new Dictionary<Guid, string>();
        foreach (var q in questions)
        {
            answers[q.Id] = q.CorrectOption; // All correct
        }

        var request = new SubmitQuizRequest(Guid.NewGuid(), null, answers);

        // Act
        var result = QuizService.EvaluateSubmission(request, questions);

        // Assert
        Assert.True(result.IsPassed);
        Assert.Equal(100.0, result.ScorePercentage);
        Assert.Equal(questions.Count, result.CorrectCount);
    }

    [Fact]
    public void EvaluateSubmission_ShouldFail_WhenAnswersAreWrong()
    {
        // Arrange
        var questions = QuizService.GetSimulationMockQuestions(SFIALevel.L1);
        var answers = new Dictionary<Guid, string>();
        foreach (var q in questions)
        {
            answers[q.Id] = "X"; // Wrong answer
        }

        var request = new SubmitQuizRequest(Guid.NewGuid(), null, answers);

        // Act
        var result = QuizService.EvaluateSubmission(request, questions);

        // Assert
        Assert.False(result.IsPassed);
        Assert.Equal(0.0, result.ScorePercentage);
        Assert.Equal(0, result.CorrectCount);
    }
}
