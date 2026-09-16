using AIIANotebook.Domain.Common;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Domain.Entities;

public class PaymentLedger : BaseEntity
{
    public Guid UserId { get; set; }
    public decimal AmountVnd { get; set; }
    public required string OrderCode { get; set; }
    public required string VietQrUrl { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? GatewayTransactionId { get; set; }
    public DateTime? PaidAt { get; set; }
}
