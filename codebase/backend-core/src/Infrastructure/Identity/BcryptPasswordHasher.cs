using AIIANotebook.Application.Common.Interfaces;

namespace AIIANotebook.Infrastructure.Identity;

public class BcryptPasswordHasher : IPasswordHasher
{
    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password);

    public bool Verify(string password, string passwordHash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            // Hash hỏng trong DB thì coi như sai mật khẩu, không làm sập request đăng nhập.
            return false;
        }
    }
}
