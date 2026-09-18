using MediatR;

namespace AIIANotebook.Application.Features.Curriculum.Commands.UnenrollCourse;

/// <returns>false nếu người dùng chưa từng ghi danh chuyên đề này.</returns>
public record UnenrollCourseCommand(Guid ModuleId) : IRequest<bool>;
