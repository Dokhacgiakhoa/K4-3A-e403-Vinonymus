using AIIANotebook.Application.Features.Auth;
using MediatR;

namespace AIIANotebook.Application.Features.Admin.Commands.SetApproval;

/// <returns>Hồ sơ sau khi cập nhật, hoặc null nếu không có tài khoản này.</returns>
public record SetApprovalCommand(Guid UserId, string Status) : IRequest<UserProfileDto?>;
