using AIIANotebook.Application.Features.Curriculum.Commands.EnrollCourse;
using AIIANotebook.Application.Features.Curriculum.Commands.ToggleTopicProgress;
using AIIANotebook.Application.Features.Curriculum.Commands.UnenrollCourse;
using AIIANotebook.Application.Features.Curriculum.Queries.GetCertificate;
using AIIANotebook.Application.Features.Curriculum.Queries.GetModuleDetail;
using AIIANotebook.Application.Features.Curriculum.Queries.GetModules;
using AIIANotebook.WebApi.Security;
using MediatR;

namespace AIIANotebook.WebApi.Endpoints;

public static class CurriculumEndpoints
{
    private const string ModuleNotFound = "Không tìm thấy chuyên đề.";

    public static IEndpointRouteBuilder MapCurriculumEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/curriculum").WithTags("Curriculum");

        // Khách xem được danh sách và mục lục; nội dung bài và tiến độ chỉ có khi đã đăng nhập.
        group.MapGet("/modules", async (string? track, ISender sender, CancellationToken ct) =>
            Results.Ok(new { success = true, data = await sender.Send(new GetModulesQuery(track), ct) }));

        group.MapGet("/modules/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var detail = await sender.Send(new GetModuleDetailQuery(id), ct);
            return detail is null
                ? Results.NotFound(new { success = false, message = ModuleNotFound })
                : Results.Ok(new { success = true, data = detail });
        });

        // Người dùng luôn lấy từ token, không nhận userId do trình duyệt gửi lên.
        var signedIn = group.MapGroup("").RequireAuthorization(AuthorizationPolicies.SignedInUser);

        signedIn.MapPost("/enroll", async (EnrollCourseCommand command, ISender sender, CancellationToken ct) =>
            await sender.Send(command, ct)
                ? Results.Ok(new { success = true, message = "Ghi danh khóa học thành công." })
                : Results.NotFound(new { success = false, message = ModuleNotFound }));

        signedIn.MapPost("/unenroll", async (UnenrollCourseCommand command, ISender sender, CancellationToken ct) =>
            Results.Ok(new { success = await sender.Send(command, ct), message = "Đã hủy ghi danh khóa học." }));

        signedIn.MapPost("/progress/toggle", async (ToggleTopicProgressCommand command, ISender sender, CancellationToken ct) =>
            await sender.Send(command, ct)
                ? Results.Ok(new { success = true, message = "Cập nhật tiến độ bài học thành công." })
                : Results.NotFound(new { success = false, message = "Bài học không thuộc chuyên đề này." }));

        signedIn.MapGet("/certificates", async (Guid moduleId, ISender sender, CancellationToken ct) =>
        {
            var certificate = await sender.Send(new GetCertificateQuery(moduleId), ct);
            return certificate is null
                ? Results.NotFound(new { success = false, message = "Chưa có chứng chỉ cho chuyên đề này." })
                : Results.Ok(new { success = true, data = certificate });
        });

        return app;
    }
}
