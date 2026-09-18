namespace AIIANotebook.Application.Common.Interfaces;

/// <summary>
/// Người đang gọi API, đọc từ token đã được xác thực chữ ký.
/// Chỉ cho biết token hợp lệ; tài khoản có được duyệt hay không phải kiểm tra lại trong DB.
/// </summary>
public interface ICurrentUserService
{
    Guid? UserId { get; }
}
