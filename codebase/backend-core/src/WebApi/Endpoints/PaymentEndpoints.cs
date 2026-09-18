using AIIANotebook.Application.Features.Payments.Commands.CreateVietQrInvoice;
using AIIANotebook.WebApi.Security;
using MediatR;

namespace AIIANotebook.WebApi.Endpoints;

public static class PaymentEndpoints
{
    public static IEndpointRouteBuilder MapPaymentEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/v1/payments/vietqr", async (CreateVietQrInvoiceCommand command, ISender sender, CancellationToken ct) =>
                Results.Ok(new { success = true, data = await sender.Send(command, ct) }))
            .WithTags("Payments")
            .RequireAuthorization(AuthorizationPolicies.SignedInUser);

        return app;
    }
}
