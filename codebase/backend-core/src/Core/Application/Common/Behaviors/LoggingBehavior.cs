using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AIIANotebook.Application.Common.Behaviors;

// Chỉ ghi tên use case và thời gian chạy — không ghi nội dung request vì có mật khẩu, email.
public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private const int SlowRequestMs = 500;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();
        var response = await next();
        stopwatch.Stop();

        if (stopwatch.ElapsedMilliseconds > SlowRequestMs)
        {
            logger.LogWarning("Use case {RequestName} chạy chậm: {ElapsedMs} ms", typeof(TRequest).Name, stopwatch.ElapsedMilliseconds);
        }
        else
        {
            logger.LogDebug("Use case {RequestName}: {ElapsedMs} ms", typeof(TRequest).Name, stopwatch.ElapsedMilliseconds);
        }

        return response;
    }
}
