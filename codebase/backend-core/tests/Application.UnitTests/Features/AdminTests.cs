using AIIANotebook.Application.Common.Exceptions;
using AIIANotebook.Application.Features.Admin.Commands.SetApproval;
using AIIANotebook.Application.Features.Admin.Queries.ListUsers;
using AIIANotebook.Application.Features.Auth.Commands.Login;
using AIIANotebook.Application.Features.Auth.Commands.Register;
using AIIANotebook.Application.UnitTests.Common;
using AIIANotebook.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.UnitTests.Features;

public class AdminTests : IDisposable
{
    private readonly ApplicationTestHost _host = new();

    public void Dispose() => _host.Dispose();

    [Fact]
    public async Task FullApprovalFlow_RegisterThenApproveThenLogin()
    {
        await _host.Sender.Send(new RegisterCommand("moi@example.com", "matkhau123", "Học viên mới"));
        var beforeApproval = await _host.Sender.Send(new LoginCommand("moi@example.com", "matkhau123"));
        var userId = (await _host.Db.Users.SingleAsync()).Id;

        var approved = await _host.Sender.Send(new SetApprovalCommand(userId, "approved"));
        var afterApproval = await _host.Sender.Send(new LoginCommand("moi@example.com", "matkhau123"));

        Assert.False(beforeApproval.Success);
        Assert.Equal("Approved", approved!.ApprovalStatus);
        Assert.True(afterApproval.Success);
        Assert.NotNull(afterApproval.Token);
    }

    [Theory]
    [InlineData("Pending")]
    [InlineData("xoa-tai-khoan")]
    [InlineData("")]
    public async Task SetApproval_RejectsAnythingButApprovedOrRejected(string status)
    {
        var user = await _host.AddUserAsync(status: AccountApprovalStatus.Pending);

        var error = await Assert.ThrowsAsync<ValidationException>(() => _host.Sender.Send(new SetApprovalCommand(user.Id, status)));

        Assert.Equal("Trạng thái phải là Approved hoặc Rejected.", error.Message);
    }

    [Fact]
    public async Task SetApproval_UnknownUser_ReturnsNull()
    {
        Assert.Null(await _host.Sender.Send(new SetApprovalCommand(Guid.NewGuid(), "Approved")));
    }

    [Fact]
    public async Task ListUsers_FiltersByStatus()
    {
        await _host.AddUserAsync(email: "cho@example.com", status: AccountApprovalStatus.Pending);
        await _host.AddUserAsync(email: "duyet@example.com", status: AccountApprovalStatus.Approved);

        var pending = await _host.Sender.Send(new ListUsersQuery(AccountApprovalStatus.Pending));
        var all = await _host.Sender.Send(new ListUsersQuery(null));

        Assert.Equal("cho@example.com", Assert.Single(pending).Email);
        Assert.Equal(2, all.Count);
    }
}
