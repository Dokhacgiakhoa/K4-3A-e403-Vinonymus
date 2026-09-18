'use client';

import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { staffBackendClient } from '@/lib/api/staff-backend-client';
import type { PlatformRole, Profile } from '@/types/staff';

interface StaffGuardProps {
  allow: PlatformRole[];
  children: (profile: Profile) => React.ReactNode;
}

export function StaffGuard({ allow, children }: StaffGuardProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const allowKey = allow.join('|');

  useEffect(() => {
    const allowedRoles = allowKey.split('|') as PlatformRole[];
    staffBackendClient.getMe()
      .then((current) => {
        if (!allowedRoles.includes(current.role)) {
          setError('Tài khoản của bạn không có quyền truy cập khu vực này.');
          return;
        }
        setProfile(current);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Không thể xác minh quyền truy cập.');
      });
  }, [allowKey]);

  if (error) {
    return (
      <div className="staff-panel mx-auto mt-12 max-w-lg p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-rose-500" />
        <h1 className="mt-4 text-lg font-bold">Không thể mở khu vực nhân sự</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Đang xác minh quyền...
      </div>
    );
  }

  return <>{children(profile)}</>;
}
