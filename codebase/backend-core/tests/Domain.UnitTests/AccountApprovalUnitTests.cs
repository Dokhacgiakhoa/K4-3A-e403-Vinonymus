using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using Xunit;

namespace AIIANotebook.Domain.UnitTests;

public class AccountApprovalUnitTests
{
    [Fact]
    public void NewUser_ShouldWaitForApproval_ByDefault()
    {
        var user = new AppUser { Email = "hoc.vien@example.com", DisplayName = "Học viên" };

        Assert.Equal(AccountApprovalStatus.Pending, user.ApprovalStatus);
    }

    [Fact]
    public void ApprovalStatus_ShouldKeepStableNames_ForDatabaseStorage()
    {
        // Cột approval_status có CHECK theo đúng 3 tên này; đổi tên enum sẽ làm hỏng dữ liệu.
        Assert.Equal(
            new[] { "Pending", "Approved", "Rejected" },
            Enum.GetNames<AccountApprovalStatus>());
    }
}
