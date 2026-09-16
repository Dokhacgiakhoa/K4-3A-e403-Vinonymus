import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_CORE_URL || 'http://localhost:5000';

  const errorParam = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');
  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/auth/callback?error=${encodeURIComponent(errorDesc || errorParam)}`, appUrl)
    );
  }

  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/callback?error=Không nhận được mã xác thực (Authorization Code).', appUrl)
    );
  }

  const normProvider = provider.toLowerCase();

  try {
    let oauthUser: {
      provider: string;
      providerId: string;
      email: string;
      displayName: string;
      avatarUrl?: string;
    };

    if (normProvider === 'github') {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return NextResponse.redirect(
          new URL('/auth/callback?error=Chưa cấu hình GITHUB_CLIENT_ID hoặc GITHUB_CLIENT_SECRET trong .env.local.', appUrl)
        );
      }

      // 1. Exchange code for access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code
        })
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        return NextResponse.redirect(
          new URL(`/auth/callback?error=${encodeURIComponent(tokenData.error_description || 'Không thể lấy Access Token từ GitHub.')}`, appUrl)
        );
      }

      const accessToken = tokenData.access_token;

      // 2. Fetch user profile from GitHub
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'AIIA-Notebook'
        }
      });

      const githubUser = await userRes.json();
      let email = githubUser.email;

      // If email is private on GitHub, fetch user emails list
      if (!email) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'AIIA-Notebook'
          }
        });
        if (emailsRes.ok) {
          const emails: Array<{ email: string; primary: boolean; verified: boolean }> = await emailsRes.json();
          const primaryEmail = emails.find((e) => e.primary && e.verified) || emails[0];
          if (primaryEmail) {
            email = primaryEmail.email;
          }
        }
      }

      if (!email) {
        email = `${githubUser.login}@github.users.local`;
      }

      oauthUser = {
        provider: 'github',
        providerId: String(githubUser.id),
        email: email,
        displayName: githubUser.name || githubUser.login || 'GitHub User',
        avatarUrl: githubUser.avatar_url
      };
    } else if (normProvider === 'google') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return NextResponse.redirect(
          new URL('/auth/callback?error=Chưa cấu hình GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong .env.local.', appUrl)
        );
      }

      const redirectUri = `${appUrl}/api/auth/callback/google`;

      // 1. Exchange code for access token
      const tokenParams = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      });

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams.toString()
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        return NextResponse.redirect(
          new URL(`/auth/callback?error=${encodeURIComponent(tokenData.error_description || 'Không thể lấy Access Token từ Google.')}`, appUrl)
        );
      }

      // 2. Fetch user profile from Google
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      const googleUser = await userRes.json();
      if (!googleUser.email) {
        return NextResponse.redirect(
          new URL('/auth/callback?error=Không thể lấy thông tin Email từ Google.', appUrl)
        );
      }

      oauthUser = {
        provider: 'google',
        providerId: String(googleUser.id),
        email: googleUser.email,
        displayName: googleUser.name || googleUser.email.split('@')[0],
        avatarUrl: googleUser.picture
      };
    } else {
      return NextResponse.redirect(
        new URL('/auth/callback?error=Nhà cung cấp OAuth không được hỗ trợ.', appUrl)
      );
    }

    // 3. Synchronize with .NET 10 Backend Core to create/update user in PostgreSQL & generate JWT Token
    const backendRes = await fetch(`${backendUrl}/api/v1/auth/oauth-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(oauthUser)
    });

    const backendData = await backendRes.json();
    if (!backendRes.ok || !backendData.success || !backendData.token) {
      return NextResponse.redirect(
        new URL(`/auth/callback?error=${encodeURIComponent(backendData.message || 'Lỗi đồng bộ tài khoản với máy chủ backend.')}`, appUrl)
      );
    }

    // 4. Redirect to callback frontend page with token & user data
    const callbackUrl = new URL('/auth/callback', appUrl);
    callbackUrl.searchParams.set('token', backendData.token);
    callbackUrl.searchParams.set('user', JSON.stringify(backendData.user));
    callbackUrl.searchParams.set('provider', normProvider);

    return NextResponse.redirect(callbackUrl.toString());
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/auth/callback?error=${encodeURIComponent(err?.message || 'Có lỗi xảy ra trong quá trình xác thực OAuth.')}`, appUrl)
    );
  }
}
