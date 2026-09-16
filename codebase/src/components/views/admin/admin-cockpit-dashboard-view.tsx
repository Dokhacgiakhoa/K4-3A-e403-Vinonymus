'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Settings, 
  Layers, 
  FileText, 
  Check, 
  X, 
  Search, 
  RefreshCw,
  Cpu,
  Database,
  ArrowRight
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { CurriculumIngestionModal } from '@/components/admin/CurriculumIngestionModal';

interface MockPaymentTransaction {
  id: string;
  invoiceCode: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  bankRef: string;
}

export function AdminCockpitDashboardView() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [showIngestionModal, setShowIngestionModal] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<MockPaymentTransaction[]>([
    {
      id: 'tx-001',
      invoiceCode: 'PRO-LAMLUU-2026',
      userName: 'Lam Luu',
      userEmail: 'lamluu@ai-thuc-chien.vn',
      amount: 99000,
      status: 'approved',
      createdAt: '2026-09-03 14:20',
      bankRef: 'MB-98234710'
    },
    {
      id: 'tx-002',
      invoiceCode: 'PRO-GUEST-2026',
      userName: 'Google Engineer',
      userEmail: 'engineer@google.com',
      amount: 999000,
      status: 'pending',
      createdAt: '2026-09-03 22:50',
      bankRef: 'MB-81273941'
    },
    {
      id: 'tx-003',
      invoiceCode: 'PRO-DEVAI-2026',
      userName: 'Nguyễn Văn A',
      userEmail: 'anguyen@corp.vn',
      amount: 99000,
      status: 'approved',
      createdAt: '2026-09-03 18:30',
      bankRef: 'MB-10293847'
    }
  ]);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(clientStorage.getUser());
    };
    syncUser();
    window.addEventListener('aiia_auth_changed', syncUser);
    return () => window.removeEventListener('aiia_auth_changed', syncUser);
  }, []);

  const handleApproveTx = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    // Tự động nâng cấp tài khoản nếu đang đăng nhập đúng user đó
    const active = clientStorage.getUser();
    if (active) {
      const updated: StoredUser = { ...active, tier: 'Pro', plan: 'pro' };
      clientStorage.saveUser(updated);
      setCurrentUser(updated);
    }
  };

  const handleRejectTx = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* CURRICULUM INGESTION MODAL */}
      <CurriculumIngestionModal
        isOpen={showIngestionModal}
        onClose={() => setShowIngestionModal(false)}
        onSubjectPublished={() => setShowIngestionModal(false)}
      />

      {/* 1. ADMIN EXECUTIVE CONSOLE HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-red-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-2xl shrink-0 shadow-inner">
            🛡️
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Bảng Điều Khiển Quản Trị Hệ Thống (Admin Cockpit)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 font-mono text-xs font-bold border border-red-800">
                SYSTEM ADMINISTRATOR
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Quản trị toàn diện: Giáo trình AI, Ngân hàng câu hỏi, Phân quyền học viên và Kiểm soát giao dịch VietQR.
            </p>
          </div>
        </div>

        {/* NÚT MỞ CỔNG NẠP GIÁO TRÌNH BẰNG AI */}
        <button
          onClick={() => setShowIngestionModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Nạp & Đóng Gói Giáo Trình AI →</span>
        </button>
      </div>

      {/* 2. ADMIN STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 font-mono uppercase">Quy Mô Học Viên</div>
          <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">20,000</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Học viên toàn quốc</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 font-mono uppercase">Giáo Trình SFIA</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">12 / 12</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Modules đã chuẩn hóa</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 font-mono uppercase">Doanh Thu VietQR</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">897.000 đ</div>
          <div className="text-[11px] text-slate-400 mt-0.5">3 Giao dịch đã ghi sổ</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 font-mono uppercase">Hạ Tầng Core</div>
          <div className="text-2xl font-extrabold text-teal-400 font-mono mt-1">.NET 10</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Clean Arch + PostgreSQL</div>
        </div>
      </div>

      {/* 3. HUMAN-IN-THE-LOOP PAYMENT APPROVAL SECTION (QUY TẮC: KIỂM SOÁT TỪ CON NGƯỜI) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-amber-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase font-mono mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Human-In-The-Loop Verification</span>
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Kiểm Soát & Phê Duyệt Thanh Toán VietQR
            </h2>
            <p className="text-xs text-slate-300">
              Tuân thủ nguyên tắc: Giao dịch thanh toán bắt buộc phải có kiểm soát phê duyệt từ con người để đảm bảo tuyệt đối an toàn.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b1329] text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="p-3 rounded-l-xl">Mã Hóa Đơn</th>
                <th className="p-3">Học Viên</th>
                <th className="p-3">Số Tiền</th>
                <th className="p-3">Mã Ngân Hàng</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 rounded-r-xl text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-[#0b1329]/60 transition">
                  <td className="p-3 font-mono font-bold text-white">{tx.invoiceCode}</td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-200">{tx.userName}</div>
                    <div className="text-[11px] text-slate-400">{tx.userEmail}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-400">
                    {tx.amount.toLocaleString()} VNĐ
                  </td>
                  <td className="p-3 font-mono text-slate-400">{tx.bankRef}</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{tx.createdAt}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      tx.status === 'approved' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : tx.status === 'pending'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {tx.status === 'approved' ? 'Đã Phê Duyệt' : tx.status === 'pending' ? 'Chờ Duyệt' : 'Đã Từ Chối'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {tx.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApproveTx(tx.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition shadow-sm"
                        >
                          Duyệt Kích Hoạt
                        </button>
                        <button
                          onClick={() => handleRejectTx(tx.id)}
                          className="px-2 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 text-[11px] border border-red-800 transition"
                        >
                          Từ Chối
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Hoàn tất</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
