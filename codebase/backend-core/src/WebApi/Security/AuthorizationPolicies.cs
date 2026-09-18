namespace AIIANotebook.WebApi.Security;

public static class AuthorizationPolicies
{
    /// <summary>Tài khoản đang hoạt động và đã được quản trị viên duyệt.</summary>
    public const string SignedInUser = nameof(SignedInUser);

    /// <summary>Như SignedInUser, và có vai trò SuperAdmin.</summary>
    public const string SuperAdmin = nameof(SuperAdmin);
}
