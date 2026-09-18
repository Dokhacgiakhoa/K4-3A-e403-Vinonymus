using MediatR;

namespace AIIANotebook.Application.Features.Auth.Queries.GetCurrentUser;

public record GetCurrentUserQuery : IRequest<UserProfileDto?>;
