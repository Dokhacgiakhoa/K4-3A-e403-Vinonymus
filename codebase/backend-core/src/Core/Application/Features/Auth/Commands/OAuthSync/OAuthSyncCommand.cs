using MediatR;

namespace AIIANotebook.Application.Features.Auth.Commands.OAuthSync;

// Chỉ server Next.js (có khoá nội bộ) gọi được — kiểm tra khoá nằm ở WebApi.
public record OAuthSyncCommand(string Provider, string ProviderId, string Email, string DisplayName, string? AvatarUrl)
    : IRequest<AuthResultDto>;
