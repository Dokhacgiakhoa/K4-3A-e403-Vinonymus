'use client';

import { BookOpenCheck, Database, Upload } from 'lucide-react';
import { DocumentManager } from '@/components/staff/document-manager';
import { StaffGuard } from '@/components/staff/staff-guard';

export function LectureDashboardView() {
  return (
    <StaffGuard allow={['lecture', 'admin']}>
      {(profile) => (
        <div className="space-y-6 pb-12">
          <header className="staff-panel p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  <BookOpenCheck className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">Không gian giảng viên</h1>
                    <span className="rounded-full border border-sky-300 bg-sky-50 px-2.5 py-1 text-[11px] font-bold uppercase text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
                      {profile.role === 'admin' ? 'Quản trị viên' : 'Giảng viên'}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                    Xin chào {profile.display_name}. Quản lý tài liệu bằng giao diện, không cần sửa Git.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <Upload className="mb-2 h-4 w-4 text-sky-500" />
                  <strong className="block">API metadata</strong>
                  <span className="text-slate-500">Đã kết nối</span>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                  <Database className="mb-2 h-4 w-4 text-amber-500" />
                  <strong className="block">Kho tệp</strong>
                  <span className="text-slate-500">Backend chưa nhận bytes</span>
                </div>
              </div>
            </div>
          </header>
          <DocumentManager mode="lecture" />
        </div>
      )}
    </StaffGuard>
  );
}
