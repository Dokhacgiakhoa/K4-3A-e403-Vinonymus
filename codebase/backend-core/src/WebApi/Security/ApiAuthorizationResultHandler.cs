using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;

namespace AIIANotebook.WebApi.Security;

// Trả lỗi phân quyền dạng JSON { success, message } như các lỗi khác, để frontend hiện được câu thông báo.
public class ApiAuthorizationResultHandler : IAuthorizationMiddlewareResultHandler
{
    public const string LoginRequiredMessage = "Bạn cần đăng nhập bằng tài khoản đã được duyệt.";
    public const string ForbiddenMessage = "Bạn không có quyền thực hiện thao tác này.";

    private readonly AuthorizationMiddlewareResultHandler _defaultHandler = new();

    public async Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy, PolicyAuthorizationResult authorizeResult)
    {
        if (authorizeResult.Succeeded)
        {
            await _defaultHandler.HandleAsync(next, context, policy, authorizeResult);
            return;
        }

        // Chỉ thiếu vai trò (đã đăng nhập hợp lệ) mới là 403. Token hợp lệ nhưng tài khoản chờ duyệt
        // hay bị khoá vẫn là 401 — frontend dựa vào 401 để xoá token cũ và mời đăng nhập lại.
        var failed = authorizeResult.AuthorizationFailure?.FailedRequirements.OfType<AccountAccessRequirement>().ToList() ?? [];
        if (authorizeResult.Forbidden && failed.Count > 0 && failed.All(r => r.RequiredRole is not null))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new { success = false, message = ForbiddenMessage });
            return;
        }

        if (authorizeResult.Challenged)
        {
            // Để JwtBearer gắn header WWW-Authenticate chuẩn trước khi ghi nội dung.
            await context.ChallengeAsync();
        }

        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsJsonAsync(new { success = false, message = LoginRequiredMessage });
    }
}
