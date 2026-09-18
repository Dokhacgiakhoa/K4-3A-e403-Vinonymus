using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.WebApi.IntegrationTests;

/// <summary>
/// Gọi HTTP thật như frontend Next.js gọi, để giữ đúng hợp đồng: đường dẫn, mã trạng thái, tên trường JSON.
/// </summary>
public class ApiContractTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private static async Task<JsonElement> JsonOf(HttpResponseMessage response) =>
        (await response.Content.ReadFromJsonAsync<JsonElement>())!;

    private static string Unique(string name) => $"{name}-{Guid.NewGuid():N}@example.com";

    [Fact]
    public async Task Health_IsPublic()
    {
        var response = await factory.CreateClient().GetAsync("/api/v1/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("healthy", (await JsonOf(response)).GetProperty("status").GetString());
    }

    [Fact]
    public async Task RegisterWaitApproveLogin_EndToEnd()
    {
        var client = factory.CreateClient();
        var admin = await factory.SeedUserAsync(Unique("admin"), role: UserRole.SuperAdmin);
        var email = Unique("hoc-vien");

        var register = await client.PostAsJsonAsync("/api/v1/auth/register", new { email, password = ApiFactory.Password, displayName = "Học viên" });
        var registerJson = await JsonOf(register);
        Assert.Equal(HttpStatusCode.OK, register.StatusCode);
        Assert.True(registerJson.GetProperty("success").GetBoolean());
        Assert.Equal(JsonValueKind.Null, registerJson.GetProperty("token").ValueKind);
        Assert.Equal("Pending", registerJson.GetProperty("approvalStatus").GetString());

        var pendingLogin = await client.PostAsJsonAsync("/api/v1/auth/login", new { email, password = ApiFactory.Password });
        Assert.Equal(HttpStatusCode.BadRequest, pendingLogin.StatusCode);
        Assert.Contains("chờ quản trị viên duyệt", (await JsonOf(pendingLogin)).GetProperty("message").GetString());

        var adminClient = factory.ClientWithToken(factory.TokenFor(admin));
        var pendingList = await JsonOf(await adminClient.GetAsync("/api/v1/admin/users?status=Pending"));
        var newUser = pendingList.GetProperty("data").EnumerateArray().Single(u => u.GetProperty("email").GetString() == email);
        var approve = await adminClient.PostAsJsonAsync($"/api/v1/admin/users/{newUser.GetProperty("id").GetString()}/approval", new { status = "Approved" });
        Assert.Equal(HttpStatusCode.OK, approve.StatusCode);
        Assert.Equal("Approved", (await JsonOf(approve)).GetProperty("data").GetProperty("approvalStatus").GetString());

        var login = await client.PostAsJsonAsync("/api/v1/auth/login", new { email, password = ApiFactory.Password });
        var loginJson = await JsonOf(login);
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
        var token = loginJson.GetProperty("token").GetString()!;
        Assert.Equal(email, loginJson.GetProperty("user").GetProperty("email").GetString());

        var me = await factory.ClientWithToken(token).GetAsync("/api/v1/auth/me");
        Assert.Equal(HttpStatusCode.OK, me.StatusCode);
        Assert.Equal(email, (await JsonOf(me)).GetProperty("data").GetProperty("email").GetString());
    }

    [Fact]
    public async Task Me_WithoutToken_Is401WithJsonMessage()
    {
        var response = await factory.CreateClient().GetAsync("/api/v1/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Contains(response.Headers.WwwAuthenticate, h => h.Scheme == "Bearer");
        Assert.False((await JsonOf(response)).GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task ForgedToken_Is401()
    {
        // Token ký bằng khoá khác: phải bị từ chối dù nội dung trông hợp lệ.
        const string forged = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEifQ.c2lnbmF0dXJl";

        var response = await factory.ClientWithToken(forged).GetAsync("/api/v1/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task PendingAccount_WithSignedToken_Is401_NotAllowedToEnroll()
    {
        var pending = await factory.SeedUserAsync(Unique("cho-duyet"), AccountApprovalStatus.Pending);

        var response = await factory.ClientWithToken(factory.TokenFor(pending))
            .PostAsJsonAsync("/api/v1/curriculum/enroll", new { moduleId = Guid.NewGuid() });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("Bạn cần đăng nhập bằng tài khoản đã được duyệt.", (await JsonOf(response)).GetProperty("message").GetString());
    }

    [Fact]
    public async Task LockingAccount_RevokesExistingTokenImmediately()
    {
        var user = await factory.SeedUserAsync(Unique("sap-bi-khoa"));
        var client = factory.ClientWithToken(factory.TokenFor(user));
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/v1/auth/me")).StatusCode);

        await factory.UpdateUserAsync(user.Id, u => u.IsActive = false);

        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/auth/me")).StatusCode);
    }

    [Fact]
    public async Task ApprovedStudent_OnAdminEndpoint_Is403()
    {
        var student = await factory.SeedUserAsync(Unique("hoc-vien"));

        var response = await factory.ClientWithToken(factory.TokenFor(student)).GetAsync("/api/v1/admin/users");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.False((await JsonOf(response)).GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task ValidationError_IsProblemDetails_WithMessageForClient()
    {
        var response = await factory.CreateClient().PostAsJsonAsync("/api/v1/auth/register",
            new { email = "khong-phai-email", password = ApiFactory.Password, displayName = "Học viên" });
        var json = await JsonOf(response);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal(400, json.GetProperty("status").GetInt32());
        Assert.False(json.GetProperty("success").GetBoolean());
        Assert.Equal("Địa chỉ email không đúng định dạng.", json.GetProperty("message").GetString());
    }

    [Fact]
    public async Task MalformedJson_Is400WithMessage()
    {
        var response = await factory.CreateClient().PostAsync("/api/v1/auth/login",
            new StringContent("{ khong phai json", Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("không đúng định dạng", (await JsonOf(response)).GetProperty("message").GetString());
    }

    [Fact]
    public async Task OAuthSync_RequiresInternalKey()
    {
        var body = new { provider = "google", providerId = "1", email = Unique("oauth"), displayName = "OAuth", avatarUrl = (string?)null };

        var withoutKey = await factory.CreateClient().PostAsJsonAsync("/api/v1/auth/oauth-sync", body);
        var withKeyClient = factory.CreateClient();
        withKeyClient.DefaultRequestHeaders.Add("X-Internal-Key", ApiFactory.InternalKey);
        var withKey = await withKeyClient.PostAsJsonAsync("/api/v1/auth/oauth-sync", body);

        Assert.Equal(HttpStatusCode.Forbidden, withoutKey.StatusCode);
        // Có khoá: tài khoản mới được tạo nhưng vẫn phải chờ duyệt, nên chưa có token.
        Assert.Equal(HttpStatusCode.BadRequest, withKey.StatusCode);
        Assert.Equal("Pending", (await JsonOf(withKey)).GetProperty("approvalStatus").GetString());
    }

    [Fact]
    public async Task GuestQuota_ReturnsDataForClient()
    {
        var response = await factory.CreateClient().PostAsJsonAsync("/api/v1/quota/helpdesk/consume",
            new { sessionHash = new string('c', 64), ipHash = new string('d', 64) });
        var data = (await JsonOf(response)).GetProperty("data");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(data.GetProperty("allowed").GetBoolean());
        Assert.Equal(10, data.GetProperty("limit").GetInt32());
        Assert.Equal(9, data.GetProperty("remaining").GetInt32());
    }

    [Fact]
    public async Task Curriculum_ListIsPublic_WritesNeedLogin()
    {
        var client = factory.CreateClient();

        var list = await client.GetAsync("/api/v1/curriculum/modules");
        var payment = await client.PostAsJsonAsync("/api/v1/payments/vietqr", new { amountVnd = 199000, planName = "PRO_MONTHLY" });

        Assert.Equal(HttpStatusCode.OK, list.StatusCode);
        Assert.NotEmpty((await JsonOf(list)).GetProperty("data").EnumerateArray());
        Assert.Equal(HttpStatusCode.Unauthorized, payment.StatusCode);
    }

    [Fact]
    public async Task QuizSimulation_DoesNotLeakAnswers()
    {
        var json = await JsonOf(await factory.CreateClient().GetAsync("/api/v1/quizzes/simulation?level=1"));
        var first = json.GetProperty("data").EnumerateArray().First();

        Assert.Equal("L1", json.GetProperty("level").GetString());
        Assert.False(first.TryGetProperty("correctOption", out _));
        Assert.False(first.TryGetProperty("explanation", out _));
    }
}
