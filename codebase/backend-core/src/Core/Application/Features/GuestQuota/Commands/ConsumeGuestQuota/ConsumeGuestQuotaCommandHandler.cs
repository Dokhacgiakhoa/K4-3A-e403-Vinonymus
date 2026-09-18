using System.Security.Cryptography;
using System.Text;
using AIIANotebook.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Options;

namespace AIIANotebook.Application.Features.GuestQuota.Commands.ConsumeGuestQuota;

public class ConsumeGuestQuotaCommandHandler(IGuestQuotaStore store, IOptions<GuestQuotaOptions> options, TimeProvider clock)
    : IRequestHandler<ConsumeGuestQuotaCommand, GuestQuotaResultDto>
{
    public async Task<GuestQuotaResultDto> Handle(ConsumeGuestQuotaCommand request, CancellationToken cancellationToken)
    {
        var limits = options.Value;
        // Hạn mức tính theo ngày giờ Việt Nam (UTC+7), không theo giờ server.
        var day = DateOnly.FromDateTime(clock.GetUtcNow().UtcDateTime.AddHours(7));

        var sessionUsed = await store.TryConsumeAsync(
            day,
            Subject("s:", request.SessionHash),
            Subject("i:", request.IpHash),
            limits.SessionDailyLimit,
            limits.IpDailyLimit,
            cancellationToken);

        return sessionUsed is null
            ? new GuestQuotaResultDto(false, limits.SessionDailyLimit, 0)
            : new GuestQuotaResultDto(true, limits.SessionDailyLimit, Math.Max(0, limits.SessionDailyLimit - sessionUsed.Value));
    }

    // Cột subject_hash dài đúng 64 ký tự: băm lại khoá có tiền tố để phiên và IP không trùng nhau.
    private static string Subject(string prefix, string hash) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(prefix + hash)));
}
