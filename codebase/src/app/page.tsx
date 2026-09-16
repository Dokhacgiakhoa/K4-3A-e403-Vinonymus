'use client';

import { useState, useEffect } from 'react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { GuestHomeView } from '@/components/views/guest/guest-home-view';
import { FreeMemberDashboardView } from '@/components/views/free/free-member-dashboard-view';
import { ProCockpitDashboardView } from '@/components/views/pro/pro-cockpit-dashboard-view';
import { AdminCockpitDashboardView } from '@/components/views/admin/admin-cockpit-dashboard-view';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const syncUser = () => {
      setCurrentUser(clientStorage.getUser());
    };
    syncUser();
    window.addEventListener('aiia_auth_changed', syncUser);
    return () => window.removeEventListener('aiia_auth_changed', syncUser);
  }, []);

  return (
    <div className="space-y-6">
      {/* DYNAMIC ROOT EXPERIENCE ROUTING DỰA TRÊN LOẠI TÀI KHOẢN (GUEST / FREE / PRO / ADMIN) */}
      {!mounted || !currentUser ? (
        /* 1. GIAO DIỆN KHÁCH VÃNG LAI (GUEST) */
        <GuestHomeView />
      ) : currentUser.role === 'admin' || currentUser.tier === 'Admin' ? (
        /* 4. GIAO DIỆN QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN) */
        <AdminCockpitDashboardView />
      ) : currentUser.tier === 'Pro' || currentUser.plan === 'pro' ? (
        /* 3. GIAO DIỆN HỌC VIÊN TRẢ PHÍ (PRO VIP) */
        <ProCockpitDashboardView />
      ) : (
        /* 2. GIAO DIỆN THÀNH VIÊN MIỄN PHÍ ĐÃ ĐĂNG NHẬP (FREE MEMBER) */
        <FreeMemberDashboardView />
      )}

    </div>
  );
}
