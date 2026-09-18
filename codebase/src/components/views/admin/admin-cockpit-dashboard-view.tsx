'use client';

import { useCallback, useEffect, useState } from 'react';
import { Activity, BarChart3, Eye, FileText, Loader2, RefreshCw, ShieldCheck, Sparkles, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import { CurriculumIngestionModal } from '@/components/admin/CurriculumIngestionModal';
import { SurveyAnalyticsView } from '@/components/admin/survey-analytics-view';
import { DocumentManager } from '@/components/staff/document-manager';
import { StaffGuard } from '@/components/staff/staff-guard';
import { staffBackendClient } from '@/lib/api/staff-backend-client';
import type { AdminAnalytics, AuditEntry, PlatformRole, Profile } from '@/types/staff';

type AdminTab = 'users' | 'documents' | 'audit' | 'survey';

const EMPTY_ANALYTICS: AdminAnalytics = {
  users: 0,
  activeUsers: 0,
  publishedDocuments: 0,
  pendingReviews: 0,
  roadmaps: 0,
};

const ROLE_LABELS: Record<PlatformRole, string> = {
  student: 'Học viên',
  lecture: 'Giảng viên',
  admin: 'Quản trị viên',
};

const BACKGROUND_LABELS: Record<NonNullable<Profile['background']>, string> = {
  non_tech: 'Non-tech',
  tech_base: 'Tech-base',
  ai: 'Đã học AI',
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export function AdminCockpitDashboardView() {
  return (
    <StaffGuard allow={['admin']}>
      {(profile) => <AdminConsole profile={profile} />}
    </StaffGuard>
  );
}

function AdminConsole({ profile }: { profile: Profile }) {
  const [tab, setTab] = useState<AdminTab>('users');
  const [roleFilter, setRoleFilter] = useState<PlatformRole | ''>('');
  const [analytics, setAnalytics] = useState<AdminAnalytics>(EMPTY_ANALYTICS);
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [notice, setNotice] = useState('');
  const [showIngestionModal, setShowIngestionModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotice('');
    try {
      const [analyticsResult, usersResult, auditResult] = await Promise.all([
        staffBackendClient.getAnalytics(),
        staffBackendClient.listUsers(roleFilter || undefined),
        staffBackendClient.listAudit(),
      ]);
      setAnalytics(analyticsResult);
      setUsers(usersResult.data);
      setAudit(auditResult.data);
      setSelectedUser((current) => current && usersResult.data.find((item) => item.id === current.id) || null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể tải dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const showUserDetail = async (user: Profile) => {
    setBusyId(user.id);
    try {
      setSelectedUser(await staffBackendClient.getUser(user.id));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể tải chi tiết tài khoản.');
    } finally {
      setBusyId('');
    }
  };

  const updateRole = async (user: Profile, role: PlatformRole, tier = user.tier) => {
    setBusyId(user.id);
    try {
      const updated = await staffBackendClient.updateUserRole(user.id, role, tier);
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedUser((current) => (current?.id === updated.id ? updated : current));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể cập nhật vai trò.');
    } finally {
      setBusyId('');
    }
  };

  const updateStatus = async (user: Profile) => {
    setBusyId(user.id);
    try {
      const updated = await staffBackendClient.updateUserStatus(user.id, !user.is_active);
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedUser((current) => (current?.id === updated.id ? updated : current));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.');
    } finally {
      setBusyId('');
    }
  };

  const stats = [
    { label: 'Tổng người dùng', value: analytics.users, icon: Users },
    { label: 'Đang hoạt động', value: analytics.activeUsers, icon: Activity },
    { label: 'Tài liệu đã xuất bản', value: analytics.publishedDocuments, icon: FileText },
    { label: 'Đang chờ duyệt', value: analytics.pendingReviews, icon: ShieldCheck },
    { label: 'Lộ trình đã tạo', value: analytics.roadmaps, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <CurriculumIngestionModal
        isOpen={showIngestionModal}
        onClose={() => setShowIngestionModal(false)}
        onSubjectPublished={() => setShowIngestionModal(false)}
      />
      <header className="staff-panel p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">Bảng quản trị hệ thống</h1>
              <span className="rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-bold uppercase text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">{ROLE_LABELS[profile.role]}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Quản lý người dùng, học liệu, nhật ký kiểm toán và số liệu hệ thống từ API phân quyền.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowIngestionModal(true)} className="staff-button-primary">
              <Sparkles className="h-4 w-4" /> Quản trị giáo trình
            </button>
            <button type="button" onClick={() => void load()} className="staff-button-secondary" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Làm mới
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="staff-panel p-4">
              <Icon className="mb-3 h-5 w-5 text-sky-500" />
              <p className="text-xs font-semibold uppercase text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <div className="flex flex-wrap gap-2">
        {(['users', 'documents', 'audit', 'survey'] as AdminTab[]).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={tab === item ? 'staff-button-primary' : 'staff-button-secondary'}>
            {item === 'users' ? 'Người dùng' : item === 'documents' ? 'Tài liệu' : item === 'audit' ? 'Nhật ký' : 'Khảo sát'}
          </button>
        ))}
      </div>

      {notice && <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200">{notice}</div>}

      {tab === 'users' && (
        <section className="staff-panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-bold text-slate-950 dark:text-white">Quản lý tài khoản</h2>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as PlatformRole | '')} className="staff-input max-w-48">
              <option value="">Tất cả vai trò</option>
              <option value="student">Học viên</option>
              <option value="lecture">Giảng viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> Đang tải người dùng...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr><th className="p-3">Người dùng</th><th className="p-3">Vai trò</th><th className="p-3">Gói</th><th className="p-3">Trạng thái</th><th className="p-3">Cập nhật</th><th className="p-3">Chi tiết</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {users.map((user) => (
                    <tr key={user.id} className="align-top">
                      <td className="p-3"><strong className="block text-slate-950 dark:text-white">{user.display_name}</strong><span className="text-xs text-slate-500">{user.id}</span></td>
                      <td className="p-3"><select disabled={busyId === user.id} value={user.role} onChange={(event) => void updateRole(user, event.target.value as PlatformRole)} className="staff-input"><option value="student">Học viên</option><option value="lecture">Giảng viên</option><option value="admin">Quản trị viên</option></select></td>
                      <td className="p-3"><select disabled={busyId === user.id} value={user.tier} onChange={(event) => void updateRole(user, user.role, event.target.value as Profile['tier'])} className="staff-input"><option value="free">Miễn phí</option><option value="vip">VIP</option></select></td>
                      <td className="p-3"><button type="button" disabled={busyId === user.id} onClick={() => void updateStatus(user)} className={user.is_active ? 'staff-button-secondary text-emerald-700 dark:text-emerald-300' : 'staff-button-secondary text-rose-700 dark:text-rose-300'}>{user.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />} {user.is_active ? 'Đang mở' : 'Đã khóa'}</button></td>
                      <td className="p-3 text-xs text-slate-500">{formatDate(user.updated_at)}</td>
                      <td className="p-3"><button type="button" disabled={busyId === user.id} onClick={() => void showUserDetail(user)} className="staff-button-secondary"><Eye className="h-4 w-4" /> Xem</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedUser && (
            <div className="border-t border-slate-200 p-4 text-sm dark:border-slate-800">
              <h3 className="font-bold text-slate-950 dark:text-white">Chi tiết tài khoản</h3>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div><dt className="text-xs uppercase text-slate-500">Tên hiển thị</dt><dd className="mt-1 font-semibold">{selectedUser.display_name}</dd></div>
                <div><dt className="text-xs uppercase text-slate-500">Nền tảng</dt><dd className="mt-1 font-semibold">{selectedUser.background ? BACKGROUND_LABELS[selectedUser.background] : 'Chưa khai báo'}</dd></div>
                <div><dt className="text-xs uppercase text-slate-500">Thời lượng/tuần</dt><dd className="mt-1 font-semibold">{selectedUser.weekly_minutes} phút</dd></div>
                <div><dt className="text-xs uppercase text-slate-500">Ngày tạo</dt><dd className="mt-1 font-semibold">{formatDate(selectedUser.created_at)}</dd></div>
                <div className="sm:col-span-2 lg:col-span-4"><dt className="text-xs uppercase text-slate-500">Mục tiêu học</dt><dd className="mt-1 font-semibold">{selectedUser.goal || 'Chưa khai báo'}</dd></div>
              </dl>
            </div>
          )}
        </section>
      )}

      {tab === 'documents' && <DocumentManager mode="admin" />}

      {tab === 'survey' && <SurveyAnalyticsView />}

      {tab === 'audit' && (
        <section className="staff-panel overflow-hidden">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800"><h2 className="font-bold text-slate-950 dark:text-white">Nhật ký kiểm toán</h2></div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {audit.map((entry) => (
              <div key={entry.id} className="grid gap-2 p-4 text-sm md:grid-cols-[180px_1fr_220px]">
                <span className="font-mono text-xs text-slate-500">{formatDate(entry.created_at)}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{entry.action}</span>
                <span className="truncate font-mono text-xs text-slate-500">{entry.resource_id ?? entry.actor_id ?? 'hệ thống'}</span>
              </div>
            ))}
            {!audit.length && <div className="p-8 text-center text-sm text-slate-500">Chưa có nhật ký kiểm toán.</div>}
          </div>
        </section>
      )}
    </div>
  );
}