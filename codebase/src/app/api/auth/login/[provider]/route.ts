import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const isCheck = searchParams.get('check') === 'true';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const normProvider = provider.toLowerCase();

  if (normProvider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID;

    if (!clientId) {
      if (isCheck) {
        return NextResponse.json({
          configured: false,
          provider: 'GitHub',
          message: 'Chưa cấu hình GITHUB_CLIENT_ID trong .env.local. Vui lòng tạo GitHub OAuth App tại https://github.com/settings/developers và điền thông tin để kích hoạt.'
        });
      }

      return NextResponse.redirect(
        new URL(
          `/auth/callback?error=${encodeURIComponent(
            'Chưa cấu hình GITHUB_CLIENT_ID trong .env.local. Vui lòng xem hướng dẫn để kích hoạt GitHub OAuth.'
          )}`,
          appUrl
        )
      );
    }

    if (isCheck) {
      return NextResponse.json({ configured: true, provider: 'GitHub' });
    }

    const redirectUri = `${appUrl}/api/auth/callback/github`;
    const state = Math.random().toString(36).substring(7);

    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', clientId);
    githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
    githubAuthUrl.searchParams.set('scope', 'read:user user:email');
    githubAuthUrl.searchParams.set('state', state);

    return NextResponse.redirect(githubAuthUrl.toString());
  }

  if (normProvider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      if (isCheck) {
        return NextResponse.json({
          configured: false,
          provider: 'Google',
          message: 'Chưa cấu hình GOOGLE_CLIENT_ID trong .env.local. Vui lòng tạo OAuth 2.0 Client ID tại Google Cloud Console và điền thông tin để kích hoạt.'
        });
      }

      return NextResponse.redirect(
        new URL(
          `/auth/callback?error=${encodeURIComponent(
            'Chưa cấu hình GOOGLE_CLIENT_ID trong .env.local. Vui lòng xem hướng dẫn để kích hoạt Google OAuth.'
          )}`,
          appUrl
        )
      );
    }

    if (isCheck) {
      return NextResponse.json({ configured: true, provider: 'Google' });
    }

    const redirectUri = `${appUrl}/api/auth/callback/google`;
    const state = Math.random().toString(36).substring(7);

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');
    googleAuthUrl.searchParams.set('state', state);

    return NextResponse.redirect(googleAuthUrl.toString());
  }

  return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
}
