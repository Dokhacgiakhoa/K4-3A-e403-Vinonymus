using System.Reflection;
using AIIANotebook.Application.Common.Behaviors;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace AIIANotebook.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddValidatorsFromAssembly(assembly);
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
            // Thứ tự: đo thời gian bao cả bước validate, rồi validate trước khi vào handler.
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // Handler lấy giờ qua TimeProvider để test đổi được "hôm nay" (hạn mức theo ngày).
        services.TryAddSingleton(TimeProvider.System);

        return services;
    }
}
