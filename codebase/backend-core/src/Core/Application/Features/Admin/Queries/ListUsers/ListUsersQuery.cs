using AIIANotebook.Application.Features.Auth;
using AIIANotebook.Domain.Enums;
using MediatR;

namespace AIIANotebook.Application.Features.Admin.Queries.ListUsers;

public record ListUsersQuery(AccountApprovalStatus? Status) : IRequest<List<UserProfileDto>>;
