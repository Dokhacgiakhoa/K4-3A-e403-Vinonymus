using AIIANotebook.Application.Features.Curriculum;
using AIIANotebook.Application.Features.Curriculum.Commands.EnrollCourse;
using AIIANotebook.Application.Features.Curriculum.Commands.ToggleTopicProgress;
using AIIANotebook.Application.Features.Curriculum.Commands.UnenrollCourse;
using AIIANotebook.Application.Features.Curriculum.Queries.GetCertificate;
using AIIANotebook.Application.Features.Curriculum.Queries.GetModuleDetail;
using AIIANotebook.Application.Features.Curriculum.Queries.GetModules;
using AIIANotebook.Application.UnitTests.Common;
using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.UnitTests.Features;

public class CurriculumTests : IDisposable
{
    private readonly ApplicationTestHost _host = new();

    public void Dispose() => _host.Dispose();

    private async Task<CurriculumModule> AddModuleAsync(int topicCount = 2, bool published = true)
    {
        var module = new CurriculumModule
        {
            ModuleNumber = 1,
            Title = "Nhập môn AI",
            Slug = "nhap-mon-ai-" + Guid.NewGuid().ToString("N")[..6],
            Description = "Mô tả",
            IsPublished = published
        };
        for (var i = 1; i <= topicCount; i++)
        {
            module.Topics.Add(new CurriculumTopic { ModuleId = module.Id, TopicNumber = i, Title = $"Bài {i}", Slug = $"bai-{i}", Description = $"Nội dung bài {i}" });
        }
        _host.Db.CurriculumModules.Add(module);
        await _host.Db.SaveChangesAsync();
        _host.Db.ChangeTracker.Clear();
        return module;
    }

    [Fact]
    public async Task GetModules_FallsBackToDefaults_WhenDatabaseHasNone()
    {
        var modules = await _host.Sender.Send(new GetModulesQuery(null));

        Assert.Equal(DefaultCurriculumModules.All().Select(m => m.Id), modules.Select(m => m.Id));
    }

    [Fact]
    public async Task Guest_SeesTopicTitlesButNotContent()
    {
        var module = await AddModuleAsync();

        var detail = await _host.Sender.Send(new GetModuleDetailQuery(module.Id));

        Assert.False(detail!.IsEnrolled);
        Assert.Equal(new[] { "Bài 1", "Bài 2" }, detail.Topics.Select(t => t.Title));
        Assert.All(detail.Topics, t =>
        {
            Assert.Equal("Nội dung bài học chỉ mở cho học viên đã ghi danh (0đ).", t.Description);
            Assert.Null(t.CodeSnippet);
        });
    }

    [Fact]
    public async Task UnpublishedModule_IsHidden()
    {
        var module = await AddModuleAsync(published: false);

        Assert.Null(await _host.Sender.Send(new GetModuleDetailQuery(module.Id)));
    }

    [Fact]
    public async Task EnrolledStudent_SeesContent_AndProgress()
    {
        var module = await AddModuleAsync();
        _host.SignInAs(await _host.AddUserAsync());

        Assert.True(await _host.Sender.Send(new EnrollCourseCommand(module.Id)));
        Assert.True(await _host.Sender.Send(new ToggleTopicProgressCommand(module.Id, module.Topics.First().Id)));
        var detail = await _host.Sender.Send(new GetModuleDetailQuery(module.Id));
        var list = await _host.Sender.Send(new GetModulesQuery(null));

        Assert.True(detail!.IsEnrolled);
        Assert.Contains(detail.Topics, t => t.Description == "Nội dung bài 1" && t.IsCompleted);
        Assert.Equal(50, detail.ProgressPercent);
        Assert.Equal(50, Assert.Single(list).ProgressPercent);
    }

    [Fact]
    public async Task PendingAccount_WithValidToken_IsTreatedAsGuest()
    {
        var module = await AddModuleAsync();
        var student = await _host.AddUserAsync();
        _host.SignInAs(student);
        await _host.Sender.Send(new EnrollCourseCommand(module.Id));

        // Quản trị viên chuyển tài khoản về trạng thái bị từ chối sau khi đã cấp token.
        var user = _host.Db.Users.Single(u => u.Id == student.Id);
        user.SetApproval(AccountApprovalStatus.Rejected);
        await _host.Db.SaveChangesAsync();

        var detail = await _host.Sender.Send(new GetModuleDetailQuery(module.Id));

        Assert.False(detail!.IsEnrolled);
    }

    [Fact]
    public async Task CompletingAllTopics_IssuesCertificateOnce()
    {
        var module = await AddModuleAsync();
        _host.SignInAs(await _host.AddUserAsync());
        await _host.Sender.Send(new EnrollCourseCommand(module.Id));

        foreach (var topic in module.Topics)
        {
            await _host.Sender.Send(new ToggleTopicProgressCommand(module.Id, topic.Id));
        }
        // Bỏ tick rồi tick lại không được cấp thêm chứng chỉ thứ hai.
        await _host.Sender.Send(new ToggleTopicProgressCommand(module.Id, module.Topics.First().Id));
        await _host.Sender.Send(new ToggleTopicProgressCommand(module.Id, module.Topics.First().Id));

        var certificate = await _host.Sender.Send(new GetCertificateQuery(module.Id));

        Assert.StartsWith("AIIA-L1-", certificate!.CertificateCode);
        Assert.Equal("Học viên thử", certificate.RecipientName);
        Assert.Single(_host.Db.IssuedCertificates);
    }

    [Fact]
    public async Task Toggle_RejectsTopicFromAnotherModule()
    {
        var first = await AddModuleAsync();
        var second = await AddModuleAsync();
        _host.SignInAs(await _host.AddUserAsync());

        Assert.False(await _host.Sender.Send(new ToggleTopicProgressCommand(first.Id, second.Topics.First().Id)));
        Assert.Empty(_host.Db.UserTopicProgresses);
    }

    [Fact]
    public async Task Enroll_UnknownModule_ReturnsFalse()
    {
        _host.SignInAs(await _host.AddUserAsync());

        Assert.False(await _host.Sender.Send(new EnrollCourseCommand(Guid.NewGuid())));
    }

    [Fact]
    public async Task Unenroll_KeepsRecord_AndReEnrollReusesIt()
    {
        var module = await AddModuleAsync();
        _host.SignInAs(await _host.AddUserAsync());

        await _host.Sender.Send(new EnrollCourseCommand(module.Id));
        Assert.True(await _host.Sender.Send(new UnenrollCourseCommand(module.Id)));
        await _host.Sender.Send(new EnrollCourseCommand(module.Id));

        Assert.Equal("Active", Assert.Single(_host.Db.CourseEnrollments).Status);
    }

    [Fact]
    public async Task WriteUseCases_RequireSignedInUser()
    {
        var module = await AddModuleAsync();

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _host.Sender.Send(new EnrollCourseCommand(module.Id)));
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _host.Sender.Send(new GetCertificateQuery(module.Id)));
    }
}
