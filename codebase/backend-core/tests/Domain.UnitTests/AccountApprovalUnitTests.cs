using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using Xunit;

namespace AIIANotebook.Domain.UnitTests;

public class AccountApprovalUnitTests
{
    private static AppUser NewUser() => new() { Email = "hoc.vien@example.com", DisplayName = "Học viên" };

    [Fact]
    public void NewUser_ShouldWaitForApproval_ByDefault()
    {
        var user = NewUser();

        Assert.Equal(AccountApprovalStatus.Pending, user.ApprovalStatus);
        Assert.Equal(SignInBlock.PendingApproval, user.SignInBlock);
        Assert.False(user.CanSignIn);
    }

    [Fact]
    public void ApprovalStatus_ShouldKeepStableNames_ForDatabaseStorage()
    {
        // Cột approval_status có CHECK theo đúng 3 tên này; đổi tên enum sẽ làm hỏng dữ liệu.
        Assert.Equal(
            new[] { "Pending", "Approved", "Rejected" },
            Enum.GetNames<AccountApprovalStatus>());
    }

    [Fact]
    public void ApprovedUser_CanSignIn()
    {
        var user = NewUser();

        user.SetApproval(AccountApprovalStatus.Approved);

        Assert.True(user.CanSignIn);
        Assert.NotNull(user.UpdatedAt);
    }

    [Fact]
    public void RejectedUser_CannotSignIn()
    {
        var user = NewUser();

        user.SetApproval(AccountApprovalStatus.Rejected);

        Assert.Equal(SignInBlock.Rejected, user.SignInBlock);
    }

    [Fact]
    public void LockedUser_CannotSignIn_EvenWhenApproved()
    {
        var user = NewUser();
        user.SetApproval(AccountApprovalStatus.Approved);

        user.IsActive = false;

        Assert.Equal(SignInBlock.Locked, user.SignInBlock);
    }

    [Fact]
    public void SetApproval_ShouldRejectMovingBackToPending()
    {
        var user = NewUser();

        Assert.Throws<ArgumentException>(() => user.SetApproval(AccountApprovalStatus.Pending));
    }
}
