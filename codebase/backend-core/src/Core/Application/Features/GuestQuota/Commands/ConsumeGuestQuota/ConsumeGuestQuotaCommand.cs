using MediatR;

namespace AIIANotebook.Application.Features.GuestQuota.Commands.ConsumeGuestQuota;

// Next.js chỉ gửi mã băm SHA-256 của phiên và IP, backend không bao giờ thấy IP gốc.
public record ConsumeGuestQuotaCommand(string SessionHash, string IpHash) : IRequest<GuestQuotaResultDto>;

public record GuestQuotaResultDto(bool Allowed, int Limit, int Remaining);
