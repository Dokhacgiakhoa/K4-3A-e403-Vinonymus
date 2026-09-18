using AIIANotebook.Application.Common.Exceptions;
using AIIANotebook.Application.Features.Auth;
using AIIANotebook.Application.Features.Auth.Commands.Login;
using AIIANotebook.Application.Features.Auth.Commands.OAuthSync;
using AIIANotebook.Application.Features.Auth.Commands.Register;
using AIIANotebook.Application.Features.Auth.Queries.GetCurrentUser;
using AIIANotebook.Application.UnitTests.Common;
using AIIANotebook.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.UnitTests.Features;

public class AuthTests : IDisposable
{
    private readonly ApplicationTestHost _host = new();

    public void Dispose() => _host.Dispose();

    [Fact]
    public async Task Register_CreatesPendingAccount_WithoutToken()
    {
        var result = await _host.Sender.Send(new RegisterCommand(" Hoc.Vien@Example.com ", "matkhau123", "Học viên"));

        Assert.True(result.Success);
        Assert.Null(result.Token);
        Assert.Equal("Pending", result.ApprovalStatus);
        var saved = await _host.Db.Users.SingleAsync();
        Assert.Equal("hoc.vien@example.com", saved.Email);
        Assert.Equal(AccountApprovalStatus.Pending, saved.ApprovalStatus);
        Assert.NotEqual("matkhau123", saved.PasswordHash);
    }

    [Fact]
    public async Task Register_RejectsDuplicateEmail_IgnoringCase()
    {
        await _host.AddUserAsync(email: "hoc.vien@example.com");

        var result = await _host.Sender.Send(new RegisterCommand("HOC.VIEN@example.com", "matkhau123", "Người khác"));

        Assert.False(result.Success);
        Assert.Contains("đã được sử dụng", result.Message);
    }

    [Theory]
    [InlineData("khong-phai-email", "matkhau123", "Học viên", "Địa chỉ email không đúng định dạng.")]
    [InlineData("a@b.vn", "ngan", "Học viên", "Mật khẩu phải có độ dài tối thiểu 8 ký tự.")]
    [InlineData("a@b.vn", "matkhau123", "", "Vui lòng nhập đầy đủ Email, Mật khẩu và Họ tên.")]
    public async Task Register_ValidatesInput_WithVietnameseMessage(string email, string password, string name, string expected)
    {
        var error = await Assert.ThrowsAsync<ValidationException>(() => _host.Sender.Send(new RegisterCommand(email, password, name)));

        Assert.Equal(expected, error.Message);
        Assert.Empty(_host.Db.Users);
    }

    [Fact]
    public async Task Login_ApprovedAccount_GetsToken()
    {
        var user = await _host.AddUserAsync(status: AccountApprovalStatus.Approved);

        var result = await _host.Sender.Send(new LoginCommand("HOC.VIEN@example.com", "matkhau123"));

        Assert.True(result.Success);
        Assert.Equal("token-for-" + user.Id, result.Token);
        Assert.Equal(user.Id, result.User!.Id);
    }

    [Theory]
    [InlineData(AccountApprovalStatus.Pending, true, SignInMessages.Pending)]
    [InlineData(AccountApprovalStatus.Rejected, true, SignInMessages.Rejected)]
    [InlineData(AccountApprovalStatus.Approved, false, SignInMessages.Locked)]
    public async Task Login_BlockedAccount_GetsNoToken(AccountApprovalStatus status, bool isActive, string expectedMessage)
    {
        await _host.AddUserAsync(status: status, isActive: isActive);

        var result = await _host.Sender.Send(new LoginCommand("hoc.vien@example.com", "matkhau123"));

        Assert.False(result.Success);
        Assert.Null(result.Token);
        Assert.Equal(expectedMessage, result.Message);
    }

    [Fact]
    public async Task Login_WrongPasswordAndUnknownEmail_ShareOneMessage()
    {
        await _host.AddUserAsync();

        var wrongPassword = await _host.Sender.Send(new LoginCommand("hoc.vien@example.com", "sai-mat-khau"));
        var unknownEmail = await _host.Sender.Send(new LoginCommand("khong-ton-tai@example.com", "matkhau123"));

        Assert.False(wrongPassword.Success);
        Assert.Equal(wrongPassword.Message, unknownEmail.Message);
    }

    [Fact]
    public async Task OAuthSync_NewAccount_WaitsForApproval()
    {
        var result = await _host.Sender.Send(new OAuthSyncCommand("google", "123", "moi@example.com", "", null));

        Assert.False(result.Success);
        Assert.Null(result.Token);
        Assert.Equal(SignInMessages.Pending, result.Message);
        Assert.Equal("moi", (await _host.Db.Users.SingleAsync()).DisplayName);
    }

    [Fact]
    public async Task GetCurrentUser_ReturnsNull_WhenAccountIsNoLongerApproved()
    {
        var user = await _host.AddUserAsync(status: AccountApprovalStatus.Rejected);
        _host.SignInAs(user);

        Assert.Null(await _host.Sender.Send(new GetCurrentUserQuery()));
    }

    [Fact]
    public async Task GetCurrentUser_ReturnsProfile_ForApprovedAccount()
    {
        var user = await _host.AddUserAsync();
        _host.SignInAs(user);

        var profile = await _host.Sender.Send(new GetCurrentUserQuery());

        Assert.Equal(user.Email, profile!.Email);
        Assert.Equal("Approved", profile.ApprovalStatus);
    }
}
