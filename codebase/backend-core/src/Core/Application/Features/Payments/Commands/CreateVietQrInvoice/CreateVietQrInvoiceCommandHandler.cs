using System.Globalization;
using System.Security.Cryptography;
using AIIANotebook.Application.Common.Extensions;
using AIIANotebook.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Options;

namespace AIIANotebook.Application.Features.Payments.Commands.CreateVietQrInvoice;

public class CreateVietQrInvoiceCommandHandler(ICurrentUserService currentUser, IOptions<PaymentOptions> options, TimeProvider clock)
    : IRequestHandler<CreateVietQrInvoiceCommand, VietQrInvoiceDto>
{
    public Task<VietQrInvoiceDto> Handle(CreateVietQrInvoiceCommand request, CancellationToken cancellationToken)
    {
        // Chỉ người đã đăng nhập mới tạo hoá đơn; endpoint đã chặn, đây là lớp kiểm tra thứ hai.
        currentUser.RequireUserId();

        var bank = options.Value;
        var orderCode = $"AIIA{clock.GetUtcNow().ToUnixTimeSeconds()}{RandomNumberGenerator.GetInt32(100, 1000)}";
        var memo = $"TT {orderCode} {request.PlanName}";
        var amount = request.AmountVnd.ToString(CultureInfo.InvariantCulture);
        var qrUrl = $"https://img.vietqr.io/image/{Uri.EscapeDataString(bank.BankId)}-{Uri.EscapeDataString(bank.AccountNumber)}-compact2.png"
            + $"?amount={amount}&addInfo={Uri.EscapeDataString(memo)}&accountName={Uri.EscapeDataString(bank.AccountName)}";

        return Task.FromResult(new VietQrInvoiceDto(orderCode, request.AmountVnd, bank.BankId, bank.AccountNumber, bank.AccountName, memo, qrUrl));
    }
}
