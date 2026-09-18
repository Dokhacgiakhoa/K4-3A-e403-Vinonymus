using AIIANotebook.Application.Features.Auth;
using AIIANotebook.Application.Features.Auth.Commands.Login;
using AIIANotebook.Application.Features.Auth.Commands.OAuthSync;
using AIIANotebook.Application.Features.Auth.Commands.Register;
using AIIANotebook.Application.Features.Auth.Queries.GetCurrentUser;
using AIIANotebook.WebApi.Security;
using MediatR;

namespace AIIANotebook.WebApi.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/auth").WithTags("Auth");

        // Đăng ký không cấp token: tài khoản phải chờ quản trị viên duyệt.
        group.MapPost("/register", async (RegisterCommand command, ISender sender, CancellationToken ct) =>
            ToResult(await sender.Send(command, ct)));

        group.MapPost("/login", async (LoginCommand command, ISender sender, CancellationToken ct) =>
            ToResult(await sender.Send(command, ct)));

        group.MapPost("/oauth-sync", async (OAuthSyncCommand command, ISender sender, CancellationToken ct) =>
                ToResult(await sender.Send(command, ct)))
            .AddEndpointFilter<InternalApiKeyFilter>();

        group.MapGet("/me", async (ISender sender, CancellationToken ct) =>
            {
                var profile = await sender.Send(new GetCurrentUserQuery(), ct);
                return profile is null
                    ? Results.Json(new { success = false, message = ApiAuthorizationResultHandler.LoginRequiredMessage }, statusCode: StatusCodes.Status401Unauthorized)
                    : Results.Ok(new { success = true, data = profile });
            })
            .RequireAuthorization(AuthorizationPolicies.SignedInUser);

        return app;
    }

    private static IResult ToResult(AuthResultDto result) =>
        result.Success ? Results.Ok(result) : Results.BadRequest(result);
}
