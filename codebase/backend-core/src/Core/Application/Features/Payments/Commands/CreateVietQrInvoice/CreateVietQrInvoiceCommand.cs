using MediatR;

namespace AIIANotebook.Application.Features.Payments.Commands.CreateVietQrInvoice;

public record CreateVietQrInvoiceCommand(decimal AmountVnd, string PlanName) : IRequest<VietQrInvoiceDto>;

public record VietQrInvoiceDto(
    string OrderCode,
    decimal AmountVnd,
    string BankId,
    string AccountNumber,
    string AccountName,
    string Description,
    string QrCodeUrl
);
