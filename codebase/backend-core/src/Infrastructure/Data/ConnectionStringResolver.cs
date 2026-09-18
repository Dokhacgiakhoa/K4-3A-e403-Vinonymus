using Microsoft.Extensions.Configuration;
using Npgsql;

namespace AIIANotebook.Infrastructure.Data;

public static class ConnectionStringResolver
{
    // Nhà cung cấp hosting (Railway, Render, Supabase…) thường cấp DATABASE_URL dạng
    // postgresql://user:pass@host:port/db, còn Npgsql cần dạng key=value.
    public static string Resolve(IConfiguration configuration)
    {
        var configured = configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrWhiteSpace(configured)) return configured;

        var url = configuration["DATABASE_URL"];
        if (string.IsNullOrWhiteSpace(url))
        {
            throw new InvalidOperationException("Thiếu chuỗi kết nối: đặt ConnectionStrings__DefaultConnection hoặc DATABASE_URL.");
        }

        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':', 2);
        return new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = uri.AbsolutePath.TrimStart('/'),
            Username = Uri.UnescapeDataString(userInfo[0]),
            Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty
        }.ConnectionString;
    }
}
