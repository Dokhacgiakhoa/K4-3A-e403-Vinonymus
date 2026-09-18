using AIIANotebook.Application.Features.Admin.Commands.SetApproval;
using AIIANotebook.Application.Features.Admin.Queries.ListUsers;
using AIIANotebook.Domain.Enums;
using AIIANotebook.WebApi.Security;
using MediatR;

namespace AIIANotebook.WebApi.Endpoints;

public static class AdminEndpoints
{
    public record SetApprovalRequest(string Status);

    public static IEndpointRouteBuilder MapAdminEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/admin")
            .WithTags("Admin")
            .RequireAuthorization(AuthorizationPolicies.SuperAdmin);

        group.MapGet("/users", async (string? status, ISender sender, CancellationToken ct) =>
        {
            // Giá trị lọc lạ thì trả toàn bộ danh sách, như trước đây.
            AccountApprovalStatus? filter = Enum.TryParse<AccountApprovalStatus>(status, true, out var parsed) ? parsed : null;
            var users = await sender.Send(new ListUsersQuery(filter), ct);
            return Results.Ok(new { success = true, data = users });
        });

        group.MapPost("/users/{id:guid}/approval", async (Guid id, SetApprovalRequest request, ISender sender, CancellationToken ct) =>
        {
            var profile = await sender.Send(new SetApprovalCommand(id, request.Status), ct);
            return profile is null
                ? Results.NotFound(new { success = false, message = "Không tìm thấy tài khoản." })
                : Results.Ok(new { success = true, data = profile });
        });

        return app;
    }
}
