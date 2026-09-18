using AIIANotebook.Domain.Entities;

namespace AIIANotebook.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string CreateToken(AppUser user);
}
