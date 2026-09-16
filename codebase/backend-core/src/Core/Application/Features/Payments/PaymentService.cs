using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.Features.Payments;

public record VietQrInvoiceDto(
    string OrderCode,
    decimal AmountVnd,
    string BankId,
    string AccountNumber,
    string AccountName,
    string Description,
    string QrCodeUrl
);

public static class PaymentService
{
    public static VietQrInvoiceDto GenerateVietQrInvoice(Guid userId, decimal amountVnd, string planName)
    {
        string orderCode = $"AIIA{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{Random.Shared.Next(100, 999)}";
        string bankId = "MBBank";
        string accountNo = "0987654321";
        string accountName = "AI IN ACTION SFIA";
        string memo = $"TT {orderCode} {planName}";
        string qrUrl = $"https://img.vietqr.io/image/{bankId}-{accountNo}-compact2.png?amount={amountVnd}&addInfo={Uri.EscapeDataString(memo)}&accountName={Uri.EscapeDataString(accountName)}";

        return new VietQrInvoiceDto(
            OrderCode: orderCode,
            AmountVnd: amountVnd,
            BankId: bankId,
            AccountNumber: accountNo,
            AccountName: accountName,
            Description: memo,
            QrCodeUrl: qrUrl
        );
    }
}
