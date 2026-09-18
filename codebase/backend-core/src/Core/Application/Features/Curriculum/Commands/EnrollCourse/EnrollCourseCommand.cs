using MediatR;

namespace AIIANotebook.Application.Features.Curriculum.Commands.EnrollCourse;

/// <returns>false nếu chuyên đề không tồn tại hoặc chưa mở.</returns>
public record EnrollCourseCommand(Guid ModuleId) : IRequest<bool>;
