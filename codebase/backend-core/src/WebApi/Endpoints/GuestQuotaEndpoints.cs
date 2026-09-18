using AIIANotebook.Application.Features.GuestQuota.Commands.ConsumeGuestQuota;
using MediatR;

namespace AIIANotebook.WebApi.Endpoints;

public static class GuestQuotaEndpoints
{
    public static IEndpointRouteBuilder MapGuestQuotaEndpoints(this IEndpointRouteBuilder app)
    {
        // Hạn mức AI Helpdesk cho khách chưa đăng nhập. Next.js gọi, chỉ gửi mã băm SHA-256.
        app.MapPost("/api/v1/quota/helpdesk/consume", async (ConsumeGuestQuotaCommand command, ISender sender, CancellationToken ct) =>
            Results.Ok(new { success = true, data = await sender.Send(command, ct) }))
            .WithTags("Guest quota");

        return app;
    }
}
