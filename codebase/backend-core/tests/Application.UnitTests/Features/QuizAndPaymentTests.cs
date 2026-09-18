using AIIANotebook.Application.Common.Exceptions;
using AIIANotebook.Application.Features.Payments.Commands.CreateVietQrInvoice;
using AIIANotebook.Application.Features.Quizzes;
using AIIANotebook.Application.Features.Quizzes.Commands.SubmitQuiz;
using AIIANotebook.Application.Features.Quizzes.Queries.GetSimulationQuestions;
using AIIANotebook.Application.UnitTests.Common;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.UnitTests.Features;

public class QuizAndPaymentTests : IDisposable
{
    private readonly ApplicationTestHost _host = new();

    public void Dispose() => _host.Dispose();

    [Fact]
    public async Task Simulation_DoesNotSendAnswersBeforeSubmission()
    {
        var result = await _host.Sender.Send(new GetSimulationQuestionsQuery(99));

        Assert.Equal(SFIALevel.L1, result.Level);
        Assert.NotEmpty(result.Questions);
        Assert.DoesNotContain(typeof(QuizQuestionPublicDto).GetProperties(), p => p.Name is "CorrectOption" or "Explanation");
    }

    [Fact]
    public async Task Submit_AllCorrect_Passes()
    {
        var answers = SimulationQuestionBank.For(SFIALevel.L1).ToDictionary(q => q.Id, q => q.CorrectOption.ToLowerInvariant());

        var result = await _host.Sender.Send(new SubmitQuizCommand(null, answers));

        Assert.True(result.IsPassed);
        Assert.Equal(100.0, result.ScorePercentage);
    }

    [Fact]
    public async Task Submit_WrongAnswers_Fails()
    {
        var answers = SimulationQuestionBank.For(SFIALevel.L1).ToDictionary(q => q.Id, _ => "X");

        var result = await _host.Sender.Send(new SubmitQuizCommand(null, answers));

        Assert.False(result.IsPassed);
        Assert.Equal(0, result.CorrectCount);
    }

    [Fact]
    public async Task Invoice_UsesConfiguredBankAccount()
    {
        _host.SignInAs(await _host.AddUserAsync());

        var invoice = await _host.Sender.Send(new CreateVietQrInvoiceCommand(199_000m, "PRO_MONTHLY"));

        Assert.StartsWith("AIIA", invoice.OrderCode);
        Assert.Contains("amount=199000", invoice.QrCodeUrl);
        Assert.Contains("MBBank", invoice.QrCodeUrl);
        Assert.Contains("PRO_MONTHLY", invoice.Description);
    }

    [Theory]
    [InlineData(0, "PRO_MONTHLY", "Số tiền phải lớn hơn 0.")]
    [InlineData(199000, "PRO MONTHLY&x=1", "Tên gói chỉ gồm chữ, số, dấu gạch dưới hoặc gạch ngang.")]
    public async Task Invoice_ValidatesInput(decimal amount, string plan, string expected)
    {
        _host.SignInAs(await _host.AddUserAsync());

        var error = await Assert.ThrowsAsync<ValidationException>(() => _host.Sender.Send(new CreateVietQrInvoiceCommand(amount, plan)));

        Assert.Equal(expected, error.Message);
    }

    [Fact]
    public async Task Invoice_RequiresSignedInUser()
    {
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _host.Sender.Send(new CreateVietQrInvoiceCommand(199_000m, "PRO_MONTHLY")));
    }
}
