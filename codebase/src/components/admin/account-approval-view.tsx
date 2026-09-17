'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, UserCheck, XCircle } from 'lucide-react';
import { authBackendClient, type ApprovalDecision, type AuthUserDto } from '@/lib/api/auth-backend-client';

type StatusFilter = 'Pending' | 'Approved' | 'Rejected';

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'Pending', label: 'Chờ duyệt' },
  { id: 'Approved', label: 'Đã duyệt' },
  { id: 'Rejected', label: 'Đã từ chối' },
];

export function AccountApprovalView() {
  const [filter, setFilter] = useState<StatusFilter>('Pending');
  const [users, setUsers] = useState<AuthUserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await authBackendClient.listUsers(filter);
    setUsers(res.users);
    if (!res.ok) setError(res.message ?? 'Không tải được danh sách tài khoản.');
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const decide = async (userId: string, decision: ApprovalDecision) => {
    setBusyId(userId);
    const res = await authBackendClient.setApproval(userId, decision);
    setBusyId(null);
    if (!res.ok) {
      setError(res.message ?? 'Không cập nhật được trạng thái tài khoản.');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-sky-300" />
          <h1 className="text-2xl font-bold text-white">Duyệt tài khoản</h1>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Tải lại
        </button>
      </div>

      <p className="text-sm text-slate-400">
        Tài khoản mới đăng ký chỉ đăng nhập được sau khi quản trị viên duyệt.
      </p>

      <div className="flex gap-2" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
              filter === f.id ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải…
        </div>
      ) : users.length === 0 && !error ? (
        <p className="text-sm text-slate-400">Không có tài khoản nào trong mục này.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{u.displayName}</div>
                <div className="text-xs text-slate-400 truncate">{u.email}</div>
              </div>
              {filter !== 'Approved' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === u.id}
                    onClick={() => void decide(u.id, 'Approved')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                  </button>
                  {filter === 'Pending' && (
                    <button
                      type="button"
                      disabled={busyId === u.id}
                      onClick={() => void decide(u.id, 'Rejected')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-rose-300 border border-rose-500/40 disabled:opacity-50 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Từ chối
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
