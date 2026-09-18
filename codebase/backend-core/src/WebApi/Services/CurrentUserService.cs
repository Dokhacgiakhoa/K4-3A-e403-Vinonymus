using System.IdentityModel.Tokens.Jwt;
using AIIANotebook.Application.Common.Interfaces;

namespace AIIANotebook.WebApi.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    // HttpContext.User chỉ có claim khi middleware JwtBearer đã kiểm tra chữ ký và hạn của token.
    public Guid? UserId =>
        Guid.TryParse(httpContextAccessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value, out var id)
            ? id
            : null;
}
