'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GraduationCap, Lock } from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { StudyPlanner } from '@/components/planner/study-planner';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { getUserRole, ROLE_LABELS } from '@/lib/demo/demo-accounts';

// Lộ trình cá nhân hoá chỉ dành cho học viên đã đăng nhập: khách dùng AI Helpdesk có giới hạn,
// còn AI Mentor (tốn chi phí gọi AI) chỉ mở cho tài khoản đã duyệt.
export function StudentPathGate() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUser(clientStorage.getUser());
      setReady(true);
    };
    sync();
    window.addEventListener('aiia_auth_changed', sync);
    return () => window.removeEventListener('aiia_auth_changed', sync);
  }, []);

  if (!ready) return null;

  const role = getUserRole(user);

  if (role === 'student') return <StudyPlanner />;

  return (
    <>
    <div className="max-w-xl mx-auto mt-10 rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
        {role === 'guest' ? <Lock className="w-6 h-6 text-sky-300" /> : <GraduationCap className="w-6 h-6 text-sky-300" />}
      </div>
      <h1 className="text-xl font-bold text-white">Lộ trình cá nhân hoá</h1>
      {role === 'guest' ? (
        <>
          <p className="text-sm text-slate-300">
            Đăng nhập bằng tài khoản học viên để AI Mentor lên lộ trình cho bạn: tối đa 3 việc, vừa với số phút rảnh hôm nay.
          </p>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-bold cursor-pointer"
          >
            Đăng nhập
          </button>
        </>
      ) : (
        <p className="text-sm text-slate-300">
          Tính năng này dành cho học viên. Bạn đang đăng nhập với vai trò {ROLE_LABELS[role]}.
        </p>
      )}
    </div>
    {/* Portal lên body để hộp đăng nhập không bị lớp nội dung của trang đè lên */}
    {createPortal(<AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />, document.body)}
    </>
  );
}
