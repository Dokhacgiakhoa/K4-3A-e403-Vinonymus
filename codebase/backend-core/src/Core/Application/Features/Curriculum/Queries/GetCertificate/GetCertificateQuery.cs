using MediatR;

namespace AIIANotebook.Application.Features.Curriculum.Queries.GetCertificate;

public record GetCertificateQuery(Guid ModuleId) : IRequest<CertificateResultDto?>;
