using MediatR;

namespace AIIANotebook.Application.Features.Auth.Commands.Register;

public record RegisterCommand(string Email, string Password, string DisplayName) : IRequest<AuthResultDto>;
