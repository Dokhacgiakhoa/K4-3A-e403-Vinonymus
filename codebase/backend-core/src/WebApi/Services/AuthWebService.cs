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
    int AiTokenUsed
);
public record AuthResultDto(bool Success, string Message, string? Token = null, UserProfileDto? User = null);
public record OAuthSyncRequest(string Provider, string ProviderId, string Email, string DisplayName, string? AvatarUrl);

public static class AuthWebService
{
    public static async Task<AuthResultDto> RegisterAsync(ApplicationDbContext db, RegisterRequest req, IConfiguration config)
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

        if (req.Password.Length < 6)
        {
            return new AuthResultDto(false, "Mật khẩu phải có độ dài tối thiểu 6 ký tự.");
        }

        try
        {
            var exists = await db.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
            if (exists)
            {
                return new AuthResultDto(false, "Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new AppUser
            {
                Id = Guid.NewGuid(),
                Email = normalizedEmail,
                DisplayName = req.DisplayName.Trim(),
                PasswordHash = passwordHash,
                Tier = UserTier.Free,
                Role = UserRole.Visitor,
                CurrentLevel = SFIALevel.L1,
                TotalStudyHours = 0,
                AiTokenQuota = 100_000,
                AiTokenUsed = 0,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            var token = GenerateJwtToken(user, config);
            return new AuthResultDto(true, "Đăng ký tài khoản thành công!", token, MapToProfile(user));
        }
        catch (Exception ex)
        {
            return new AuthResultDto(false, $"Lỗi xử lý đăng ký: {ex.Message}");
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
            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            {
                return new AuthResultDto(false, "Email hoặc mật khẩu không chính xác.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return new AuthResultDto(false, "Email hoặc mật khẩu không chính xác.");
            }

            if (!user.IsActive)
            {
                return new AuthResultDto(false, "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.");
            }

            var token = GenerateJwtToken(user, config);
            return new AuthResultDto(true, "Đăng nhập thành công!", token, MapToProfile(user));
        }
        catch (Exception ex)
        {
            return new AuthResultDto(false, $"Lỗi xử lý đăng nhập: {ex.Message}");
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

            var token = GenerateJwtToken(user, config);
            return new AuthResultDto(true, "Đăng nhập OAuth thành công!", token, MapToProfile(user));
        }
        catch (Exception ex)
        {
            return new AuthResultDto(false, $"Lỗi đồng bộ tài khoản OAuth: {ex.Message}");
        }
    }

    public static async Task<UserProfileDto?> GetMeAsync(ApplicationDbContext db, Guid userId)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        return user != null ? MapToProfile(user) : null;
    }

    public static string GenerateJwtToken(AppUser user, IConfiguration config)
    {
        var secret = config["Jwt:Secret"] ?? "AIIA_SUPER_SECURE_ENTERPRISE_KEY_2026_JWT_TOKEN_SECRET_KEY_MIN_32_CHARS";
        var issuer = config["Jwt:Issuer"] ?? "AIIANotebookBackend";
        var audience = config["Jwt:Audience"] ?? "AIIANotebookFrontend";
        var expiryMinutes = int.TryParse(config["Jwt:ExpiryMinutes"], out var m) ? m : 10080; // 7 days

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
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
        var secret = config["Jwt:Secret"] ?? "AIIA_SUPER_SECURE_ENTERPRISE_KEY_2026_JWT_TOKEN_SECRET_KEY_MIN_32_CHARS";
        var issuer = config["Jwt:Issuer"] ?? "AIIANotebookBackend";
        var audience = config["Jwt:Audience"] ?? "AIIANotebookFrontend";

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var principal = tokenHandler.ValidateToken(tokenStr, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
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
        catch
        {
            // Invalid or expired token
        }

        return null;
    }

    private static UserProfileDto MapToProfile(AppUser user)
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
            user.AiTokenUsed
        );
    }
}
