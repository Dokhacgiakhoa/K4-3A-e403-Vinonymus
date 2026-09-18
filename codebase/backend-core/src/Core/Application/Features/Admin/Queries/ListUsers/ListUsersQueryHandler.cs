using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Application.Features.Auth;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Features.Admin.Queries.ListUsers;

public class ListUsersQueryHandler(IApplicationDbContext db) : IRequestHandler<ListUsersQuery, List<UserProfileDto>>
{
    // Màn hình duyệt chỉ cần những tài khoản mới nhất; chặn trả về toàn bộ bảng.
    private const int MaxUsers = 200;

    public async Task<List<UserProfileDto>> Handle(ListUsersQuery request, CancellationToken cancellationToken)
    {
        var query = db.Users.AsNoTracking();
        if (request.Status.HasValue)
        {
            query = query.Where(u => u.ApprovalStatus == request.Status.Value);
        }

        var users = await query.OrderByDescending(u => u.CreatedAt).Take(MaxUsers).ToListAsync(cancellationToken);
        return users.Select(UserProfileDto.From).ToList();
    }
}
