using AIIANotebook.Application.Common.Exceptions;
using AIIANotebook.Application.Features.GuestQuota.Commands.ConsumeGuestQuota;
using AIIANotebook.Application.UnitTests.Common;

namespace AIIANotebook.Application.UnitTests.Features;

public class GuestQuotaTests : IDisposable
{
    private static readonly string Session = new('a', 64);
    private static readonly string Ip = new('b', 64);
    private readonly ApplicationTestHost _host = new();

    public void Dispose() => _host.Dispose();

    [Fact]
    public async Task Guest_GetsTenQuestionsPerDay_ThenIsStopped()
    {
        GuestQuotaResultDto last = null!;
        for (var i = 0; i < 10; i++)
        {
            last = await _host.Sender.Send(new ConsumeGuestQuotaCommand(Session, Ip));
            Assert.True(last.Allowed);
        }

        var eleventh = await _host.Sender.Send(new ConsumeGuestQuotaCommand(Session, Ip));

        Assert.Equal(0, last.Remaining);
        Assert.False(eleventh.Allowed);
        Assert.Equal(10, eleventh.Limit);
    }

    [Fact]
    public async Task Quota_ResetsOnNewVietnamDay()
    {
        for (var i = 0; i < 10; i++) await _host.Sender.Send(new ConsumeGuestQuotaCommand(Session, Ip));

        // 03:00 UTC ngày 18/9 là 10:00 giờ Việt Nam; sang 17:00 UTC là 00:00 ngày 19/9 giờ Việt Nam.
        _host.Clock.Advance(TimeSpan.FromHours(14));
        var nextDay = await _host.Sender.Send(new ConsumeGuestQuotaCommand(Session, Ip));

        Assert.True(nextDay.Allowed);
        Assert.Equal(9, nextDay.Remaining);
    }

    [Theory]
    [InlineData("khong-phai-sha256")]
    [InlineData("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")]
    [InlineData("")]
    public async Task Consume_RejectsAnythingButLowercaseSha256(string sessionHash)
    {
        var error = await Assert.ThrowsAsync<ValidationException>(() => _host.Sender.Send(new ConsumeGuestQuotaCommand(sessionHash, Ip)));

        Assert.Equal("Mã phiên không hợp lệ.", error.Message);
    }
}
