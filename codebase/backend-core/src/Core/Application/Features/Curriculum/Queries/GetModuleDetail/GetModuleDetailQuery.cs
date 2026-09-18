using MediatR;

namespace AIIANotebook.Application.Features.Curriculum.Queries.GetModuleDetail;

public record GetModuleDetailQuery(Guid ModuleId) : IRequest<CurriculumModuleDetailDto?>;
