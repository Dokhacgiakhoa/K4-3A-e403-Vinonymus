'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { authBackendClient } from '@/lib/api/auth-backend-client';
import { CheckCircle2, AlertCircle, ArrowRight, KeyRound, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

function toStoredRole(role: string): StoredUser['role'] {
  if (role === 'SuperAdmin' || role === 'admin') return 'admin';
  if (role === 'Lecture' || role === 'lecture') return 'lecture';
  return 'student';
}

function toStoredTier(role: string, tier: string): NonNullable<StoredUser['tier']> {
  if (role === 'SuperAdmin' || role === 'admin') return 'Admin';
  if (tier === 'vip' || tier === 'Pro') return 'Pro';
  return 'Free';
}

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [providerName, setProviderName] = useState<string>('');

  useEffect(() => {
    const error = searchParams.get('error');
    const token = searchParams.get('token');
    const userRaw = searchParams.get('user');
    const provider = searchParams.get('provider') || 'OAuth';

    setProviderName(provider.toUpperCase());

    if (error) {
      setStatus('error');
      setErrorMessage(error);
      return;
    }

    if (token && userRaw) {
      try {
        const userObj = JSON.parse(userRaw);
        authBackendClient.saveToken(token);

        const loggedUser: StoredUser = {
          id: userObj.id,
          name: userObj.displayName || 'Kỹ sư AI',
          email: userObj.email,
          avatar: userObj.avatarUrl || undefined,
          tier: toStoredTier(String(userObj.role ?? 'student'), String(userObj.tier ?? 'free')),
          role: toStoredRole(String(userObj.role ?? 'student')),
          currentLevel: userObj.currentLevel || 'L1',
          totalStudyHours: userObj.totalStudyHours || 0
        };

        clientStorage.saveUser(loggedUser);
        window.dispatchEvent(new Event('aiia_auth_changed'));

        setStatus('success');

        const timer = setTimeout(() => {
          router.replace('/learning');
        }, 1200);

        return () => clearTimeout(timer);
      } catch (e: any) {
        setStatus('error');
        setErrorMessage('Dữ liệu phiên làm việc không hợp lệ: ' + (e?.message || 'Lỗi phân tích JSON.'));
      }
    } else {
      setStatus('error');
      setErrorMessage('Không tìm thấy Token xác thực từ máy chủ.');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a]/95 border border-sky-500/40 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6 text-center">
        
        {status === 'loading' && (
          <div className="space-y-4 py-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/40 flex items-center justify-center text-sky-400 animate-spin">
              <Loader2 className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Đang xác thực tài khoản {providerName}...
            </h2>
            <p className="text-xs text-slate-400">
              Hệ thống đang trao đổi Token bảo mật với máy chủ và đồng bộ tiến độ học tập.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4 animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Đăng Nhập Thành Công!
            </h2>
            <p className="text-xs text-emerald-300 font-medium">
              Chào mừng bạn trở lại nền tảng AI Thực Chiến. Đang chuyển hướng vào phòng học...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5 py-2 text-left animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Xác Thực OAuth Chưa Hoàn Tất
                </h3>
                <p className="text-[11px] text-slate-400">
                  Nhà cung cấp: <span className="font-semibold text-sky-400">{providerName}</span>
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 leading-relaxed font-normal">
              {errorMessage}
            </div>

            {errorMessage.includes('CLIENT_ID') && (
              <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-700 text-xs text-slate-300 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Hướng dẫn kích hoạt OAuth Thật:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
                  <li>Mở file <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded">.env.local</code> ở thư mục gốc dự án.</li>
                  <li>Tạo OAuth App trên <strong className="text-slate-200">GitHub Developer Settings</strong> hoặc <strong className="text-slate-200">Google Cloud Console</strong>.</li>
                  <li>Điền <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded">CLIENT_ID</code> và <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded">CLIENT_SECRET</code> tương ứng.</li>
                  <li>Khởi động lại máy chủ Next.js và thử lại.</li>
                </ol>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/learning"
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Về Trang Học Tập</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070d19] flex items-center justify-center text-slate-400 font-mono text-xs">
        Đang tải trang xác thực...
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
