using System.Security.Cryptography;
using System.Text;

namespace AIIANotebook.WebApi.Security;

// Endpoint được bảo vệ bằng filter này cấp token chỉ dựa vào email, nên chỉ server Next.js
// (giữ khoá nội bộ) được gọi. Thiếu khoá hoặc khoá ngắn thì tắt hẳn endpoint.
public class InternalApiKeyFilter(IConfiguration configuration) : IEndpointFilter
{
    public const string HeaderName = "X-Internal-Key";
    private const int MinKeyLength = 32;

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var expected = configuration["Backend:InternalApiKey"];
        var provided = context.HttpContext.Request.Headers[HeaderName].FirstOrDefault() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(expected) || expected.Length < MinKeyLength
            || !CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expected), Encoding.UTF8.GetBytes(provided)))
        {
            return Results.Json(
                new { success = false, message = "Đăng nhập bằng tài khoản ngoài đang tắt hoặc yêu cầu không hợp lệ." },
                statusCode: StatusCodes.Status403Forbidden);
        }

        return await next(context);
    }
}
