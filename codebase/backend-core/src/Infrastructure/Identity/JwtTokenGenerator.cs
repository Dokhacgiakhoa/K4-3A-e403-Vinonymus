using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AIIANotebook.Infrastructure.Identity;

public class JwtTokenGenerator(IOptions<JwtOptions> options, TimeProvider clock) : IJwtTokenGenerator
{
    public string CreateToken(AppUser user)
    {
        var jwt = options.Value;
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Secret)), SecurityAlgorithms.HmacSha256);

        // Vai trò trong token chỉ để frontend hiển thị; quyền thật luôn đọc lại từ DB ở server.
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
            issuer: jwt.Issuer,
            audience: jwt.Audience,
            claims: claims,
            expires: clock.GetUtcNow().UtcDateTime.AddMinutes(jwt.ExpiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
