namespace AIIANotebook.Application.Features.GuestQuota;

public class GuestQuotaOptions
{
    public const string SectionName = "GuestQuota";

    public int SessionDailyLimit { get; set; } = 10;

    // Cả lớp học có thể dùng chung một IP, nên hạn mức theo IP cao hơn nhiều.
    public int IpDailyLimit { get; set; } = 200;
}
