namespace AIIANotebook.Application.Features.Payments;

// Tài khoản nhận tiền đọc từ cấu hình (biến môi trường Payments__...), không viết cứng trong code.
public class PaymentOptions
{
    public const string SectionName = "Payments";

    public string BankId { get; set; } = "MBBank";
    public string AccountNumber { get; set; } = "0987654321";
    public string AccountName { get; set; } = "AI IN ACTION SFIA";
}
