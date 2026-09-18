using AIIANotebook.Application.Common.Exceptions;
using AIIANotebook.WebApi.Security;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace AIIANotebook.WebApi.Middlewares;

/// <summary>
/// Mọi lỗi chưa được xử lý đều thành ProblemDetails (RFC 7807), kèm thêm hai trường
/// "success" và "message" mà frontend đang đọc. Không bao giờ trả stack trace ra ngoài.
/// </summary>
public class GlobalExceptionHandler(IProblemDetailsService problemDetailsService, ILogger<GlobalExceptionHandler> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title, message) = exception switch
        {
            ValidationException ex => (StatusCodes.Status400BadRequest, "Dữ liệu không hợp lệ", ex.Message),
            BadHttpRequestException => (StatusCodes.Status400BadRequest, "Yêu cầu không hợp lệ",
                "Dữ liệu gửi lên không đúng định dạng. Kiểm tra lại nội dung JSON."),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Chưa đăng nhập",
                ApiAuthorizationResultHandler.LoginRequiredMessage),
            _ => (StatusCodes.Status500InternalServerError, "Lỗi hệ thống",
                "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.")
        };

        if (status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Lỗi chưa xử lý tại {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
        }

        var problem = new ProblemDetails { Status = status, Title = title, Detail = message };
        problem.Extensions["success"] = false;
        problem.Extensions["message"] = message;
        if (exception is ValidationException validation)
        {
            problem.Extensions["errors"] = validation.Errors;
        }

        httpContext.Response.StatusCode = status;
        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problem,
            Exception = exception
        });
    }
}
