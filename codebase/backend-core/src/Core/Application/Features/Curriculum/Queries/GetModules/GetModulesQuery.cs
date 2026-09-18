using MediatR;

namespace AIIANotebook.Application.Features.Curriculum.Queries.GetModules;

// Khách cũng xem được danh sách; nếu đã đăng nhập thì kèm tiến độ của chính mình.
public record GetModulesQuery(string? Track) : IRequest<List<CurriculumModuleDto>>;
