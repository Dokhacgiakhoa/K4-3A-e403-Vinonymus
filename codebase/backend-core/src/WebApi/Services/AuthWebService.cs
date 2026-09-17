using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;
using AIIANotebook.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AIIANotebook.WebApi.Services;

public record RegisterRequest(string Email, string Password, string DisplayName);
public record LoginRequest(string Email, string Password);
public record UserProfileDto(
    Guid Id,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    string Tier,
    string Role,
    string CurrentLevel,
    int TotalStudyHours,
    int AiTokenQuota,
    int AiTokenUsed,
    string ApprovalStatus
);
public record AuthResultDto(
    bool Success,
    string Message,
    string? Token = null,
    UserProfileDto? User = null,
    string? ApprovalStatus = null
);
public record OAuthSyncRequest(string Provider, string ProviderId, string Email, string DisplayName, string? AvatarUrl);

public static class AuthWebService
{
    public const string PendingMessage =
        "Tài khoản của bạn đang chờ quản trị viên duyệt. Bạn sẽ đăng nhập được sau khi tài khoản được duyệt.";
    public const string RejectedMessage =
        "Tài khoản của bạn chưa được duyệt. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.";

    public static async Task<AuthResultDto> RegisterAsync(ApplicationDbContext db, RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password) || string.IsNullOrWhiteSpace(req.DisplayName))
        {
            return new AuthResultDto(false, "Vui lòng nhập đầy đủ Email, Mật khẩu và Họ tên.");
        }

        var normalizedEmail = req.Email.Trim().ToLowerInvariant();
        if (!normalizedEmail.Contains('@') || !normalizedEmail.Contains('.'))
        {
            return new AuthResultDto(false, "Địa chỉ email không đúng định dạng.");
        }

        if (req.Password.Length < 8)
        {
            return new AuthResultDto(false, "Mật khẩu phải có độ dài tối thiểu 8 ký tự.");
        }

        try
        {
            var exists = await db.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
            if (exists)
            {
                return new AuthResultDto(false, "Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.");
            }

            var user = new AppUser
            {
                Id = Guid.NewGuid(),
                Email = normalizedEmail,
                DisplayName = req.DisplayName.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                Tier = UserTier.Free,
                Role = UserRole.Visitor,
                CurrentLevel = SFIALevel.L1,
                TotalStudyHours = 0,
                AiTokenQuota = 100_000,
                AiTokenUsed = 0,
                IsActive = true,
                ApprovalStatus = AccountApprovalStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            // Không cấp token: người dùng chỉ đăng nhập được sau khi quản trị viên duyệt.
            return new AuthResultDto(
                true,
                "Đăng ký thành công! Tài khoản đang chờ quản trị viên duyệt, bạn sẽ đăng nhập được sau khi được duyệt.",
                ApprovalStatus: AccountApprovalStatus.Pending.ToString());
        }
        catch (Exception)
        {
            return new AuthResultDto(false, "Không thể xử lý đăng ký lúc này. Vui lòng thử lại sau.");
        }
    }

    public static async Task<AuthResultDto> LoginAsync(ApplicationDbContext db, LoginRequest req, IConfiguration config)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
        {
            return new AuthResultDto(false, "Vui lòng nhập Email và Mật khẩu.");
        }

        var normalizedEmail = req.Email.Trim().ToLowerInvariant();

        try
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (user == null || string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return new AuthResultDto(false, "Email hoặc mật khẩu không chính xác.");
            }

            var blocked = GetLoginBlockReason(user);
            if (blocked != null)
            {
                return new AuthResultDto(false, blocked, ApprovalStatus: user.ApprovalStatus.ToString());
            }

            var token = GenerateJwtToken(user, config);
            return new AuthResultDto(true, "Đăng nhập thành công!", token, MapToProfile(user), user.ApprovalStatus.ToString());
        }
        catch (Exception)
        {
            return new AuthResultDto(false, "Không thể xử lý đăng nhập lúc này. Vui lòng thử lại sau.");
        }
    }

    public static async Task<AuthResultDto> OAuthSyncAsync(ApplicationDbContext db, OAuthSyncRequest req, IConfiguration config)
    {
        if (string.IsNullOrWhiteSpace(req.Email))
        {
            return new AuthResultDto(false, "Không thể xác định Email từ tài khoản OAuth.");
        }

        var normalizedEmail = req.Email.Trim().ToLowerInvariant();
        var displayName = !string.IsNullOrWhiteSpace(req.DisplayName)
            ? req.DisplayName.Trim()
            : req.Email.Split('@')[0];

        try
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            if (user == null)
            {
                user = new AppUser
                {
                    Id = Guid.NewGuid(),
                    Email = normalizedEmail,
                    DisplayName = displayName,
                    AvatarUrl = req.AvatarUrl,
                    PasswordHash = null,
                    Tier = UserTier.Free,
                    Role = UserRole.Visitor,
                    CurrentLevel = SFIALevel.L1,
                    TotalStudyHours = 0,
                    AiTokenQuota = 100_000,
                    AiTokenUsed = 0,
                    IsActive = true,
                    ApprovalStatus = AccountApprovalStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                db.Users.Add(user);
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(req.AvatarUrl) && string.IsNullOrWhiteSpace(user.AvatarUrl))
                {
                    user.AvatarUrl = req.AvatarUrl;
                }
                user.UpdatedAt = DateTime.UtcNow;
            }

            await db.SaveChangesAsync();

            var blocked = GetLoginBlockReason(user);
            if (blocked != null)
            {
                return new AuthResultDto(false, blocked, ApprovalStatus: user.ApprovalStatus.ToString());
            }

            var token = GenerateJwtToken(user, config);
            return new AuthResultDto(true, "Đăng nhập OAuth thành công!", token, MapToProfile(user), user.ApprovalStatus.ToString());
        }
        catch (Exception)
        {
            return new AuthResultDto(false, "Không thể đồng bộ tài khoản OAuth lúc này. Vui lòng thử lại sau.");
        }
    }

    public static async Task<AppUser?> GetActiveApprovedUserAsync(ApplicationDbContext db, Guid userId)
    {
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        return user != null && GetLoginBlockReason(user) == null ? user : null;
    }

    public static string? GetLoginBlockReason(AppUser user)
    {
        if (!user.IsActive)
        {
            return "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.";
        }

        return user.ApprovalStatus switch
        {
            AccountApprovalStatus.Approved => null,
            AccountApprovalStatus.Rejected => RejectedMessage,
            _ => PendingMessage
        };
    }

    public static string GetJwtSecret(IConfiguration config)
    {
        var secret = config["Jwt:Secret"];
        if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
        {
            throw new InvalidOperationException("Thiếu cấu hình Jwt:Secret (tối thiểu 32 ký tự). Đặt biến môi trường Jwt__Secret.");
        }
        return secret;
    }

    public static string GenerateJwtToken(AppUser user, IConfiguration config)
    {
        var issuer = config["Jwt:Issuer"] ?? "AIIANotebookBackend";
        var audience = config["Jwt:Audience"] ?? "AIIANotebookFrontend";
        var expiryMinutes = int.TryParse(config["Jwt:ExpiryMinutes"], out var m) ? m : 10080;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetJwtSecret(config)));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.DisplayName),
            new Claim("tier", user.Tier.ToString()),
            new Claim("role", user.Role.ToString()),
            new Claim("current_level", user.CurrentLevel.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static Guid? ValidateAndExtractUserId(string? authHeader, IConfiguration config)
    {
        if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var tokenStr = authHeader.Substring("Bearer ".Length).Trim();
        var issuer = config["Jwt:Issuer"] ?? "AIIANotebookBackend";
        var audience = config["Jwt:Audience"] ?? "AIIANotebookFrontend";

        try
        {
            var principal = new JwtSecurityTokenHandler().ValidateToken(tokenStr, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetJwtSecret(config))),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5)
            }, out _);

            var subClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub) ?? principal.FindFirst(ClaimTypes.NameIdentifier);
            if (subClaim != null && Guid.TryParse(subClaim.Value, out var userId))
            {
                return userId;
            }
        }
        catch (SecurityTokenException)
        {
            // Token sai chữ ký hoặc hết hạn: coi như chưa đăng nhập.
        }
        catch (ArgumentException)
        {
            // Chuỗi không phải JWT hợp lệ.
        }

        return null;
    }

    public static UserProfileDto MapToProfile(AppUser user)
    {
        return new UserProfileDto(
            user.Id,
            user.Email,
            user.DisplayName,
            user.AvatarUrl,
            user.Tier.ToString(),
            user.Role.ToString(),
            user.CurrentLevel.ToString(),
            user.TotalStudyHours,
            user.AiTokenQuota,
            user.AiTokenUsed,
            user.ApprovalStatus.ToString()
        );
    }
}
