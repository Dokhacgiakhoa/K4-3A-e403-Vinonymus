namespace AIIANotebook.Infrastructure.Identity;

public class JwtOptions
{
    public const string SectionName = "Jwt";
    public const int MinSecretLength = 32;

    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "AIIANotebookBackend";
    public string Audience { get; set; } = "AIIANotebookFrontend";
    public int ExpiryMinutes { get; set; } = 10080;
}
