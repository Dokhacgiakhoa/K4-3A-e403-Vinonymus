using AIIANotebook.Application.Features.Payments;
using Xunit;

namespace AIIANotebook.Domain.UnitTests;

public class PaymentInvoiceUnitTests
{
    [Fact]
    public void GenerateVietQrInvoice_ShouldReturnValidInvoice()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var amount = 199_000m;
        var plan = "PRO_MONTHLY";

        // Act
        var invoice = PaymentService.GenerateVietQrInvoice(userId, amount, plan);

        // Assert
        Assert.NotNull(invoice);
        Assert.StartsWith("AIIA", invoice.OrderCode);
        Assert.Equal(amount, invoice.AmountVnd);
        Assert.Contains(amount.ToString(), invoice.QrCodeUrl);
        Assert.Contains("MBBank", invoice.QrCodeUrl);
    }
}
