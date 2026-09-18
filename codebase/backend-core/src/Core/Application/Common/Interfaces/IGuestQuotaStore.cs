namespace AIIANotebook.Application.Common.Interfaces;

public interface IGuestQuotaStore
{
    /// <summary>
    /// Cộng một lượt cho cả phiên và IP trong cùng một giao dịch; nếu một trong hai vượt hạn mức
    /// thì không ghi gì cả, để lượt bị từ chối không ăn vào hạn mức.
    /// </summary>
    /// <returns>Số lượt phiên đã dùng sau khi cộng, hoặc null nếu bị từ chối.</returns>
    Task<int?> TryConsumeAsync(
        DateOnly usageDay,
        string sessionSubject,
        string ipSubject,
        int sessionLimit,
        int ipLimit,
        CancellationToken cancellationToken);
}
