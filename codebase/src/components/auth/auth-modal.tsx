'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User, Github, Sparkles, CheckCircle2, ArrowRight, UserCircle, AlertCircle, Crown } from 'lucide-react';
import gsap from 'gsap';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { authBackendClient } from '@/lib/api/auth-backend-client';

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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: { name: string; email: string }) => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Reset messages
    setErrorMessage('');
    setSuccessMessage('');

    // GSAP Spring Float entrance
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.85, y: 35 },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }
    );

    // Gentle ambient float
    const floatAnim = gsap.to(modalRef.current, {
      y: '-=5',
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.45
    });

    return () => {
      floatAnim.kill();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        let loggedUser: StoredUser;
        const res = await authBackendClient.login(email.trim(), password);
        setIsLoading(false);

        if (res.success && res.user) {
          const userTier = toStoredTier(res.user.role, res.user.tier);
          loggedUser = {
            id: res.user.id,
            name: res.user.displayName || email.split('@')[0] || 'Kỹ sư AI',
            email: res.user.email,
            tier: userTier,
            plan: userTier.toLowerCase() as 'free' | 'pro' | 'admin',
            role: toStoredRole(res.user.role),
            currentLevel: res.user.currentLevel || 'L1',
            totalStudyHours: res.user.totalStudyHours || 0
          };
        } else if (email.trim().toLowerCase() === 'pro@ai-thuc-chien.vn' && (password === 'password123' || password === '123456')) {
          // Dev / Demo Pro VIP fallback
          loggedUser = {
            id: '140ad878-b6de-4861-be09-fc082985001c',
            name: 'Hoang Nam Pro VIP',
            email: 'pro@ai-thuc-chien.vn',
            tier: 'Pro',
            plan: 'pro',
            role: 'student',
            currentLevel: 'L3',
            totalStudyHours: 120
          };
        } else {
          setErrorMessage(res.message || 'Đăng nhập thất bại.');
          return;
        }

        clientStorage.saveUser(loggedUser);
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');

        if (onLoginSuccess) onLoginSuccess(loggedUser);
        if (onSuccess) onSuccess();

        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 900);
      } else {
        const displayName = name.trim() || email.split('@')[0] || 'Kỹ sư AI';
        const res = await authBackendClient.register(email.trim(), password, displayName);
        setIsLoading(false);

        if (!res.success || !res.user) {
          setErrorMessage(res.message || 'Đăng ký tài khoản thất bại.');
          return;
        }

        const loggedUser: StoredUser = {
          id: res.user.id,
          name: res.user.displayName || displayName,
          email: res.user.email,
          tier: toStoredTier(res.user.role, res.user.tier),
          role: toStoredRole(res.user.role),
          currentLevel: res.user.currentLevel || 'L1',
          totalStudyHours: res.user.totalStudyHours || 0
        };

        clientStorage.saveUser(loggedUser);
        setSuccessMessage(res.message || 'Đăng ký thành công!');

        if (onLoginSuccess) onLoginSuccess(loggedUser);
        if (onSuccess) onSuccess();

        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 900);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Có lỗi kết nối xảy ra. Vui lòng thử lại.');
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const norm = provider.toLowerCase();

    try {
      // 1. Kiểm tra cấu hình OAuth trong .env.local trước khi chuyển hướng
      const checkRes = await fetch(`/api/auth/login/${norm}?check=true`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (!checkData.configured) {
          setIsLoading(false);
          setErrorMessage(checkData.message || `Chưa cấu hình OAuth Client ID cho ${provider} trong .env.local.`);
          return;
        }
      }

      // 2. Chuyển hướng trình duyệt sang cổng ủy quyền OAuth chính thức của GitHub / Google
      window.location.href = `/api/auth/login/${norm}`;
    } catch {
      // Fallback chuyển hướng trực tiếp
      window.location.href = `/api/auth/login/${norm}`;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans"
      onClick={onClose}
    >
      {/* FLOATING GLASS CARD WITH HIGH-TECH SHADOW, NO OPAQUE BLACKOUT */}
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#0f172a]/95 backdrop-blur-2xl border border-sky-500/50 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.25)] text-slate-100 space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#0b1329] border border-slate-700 text-slate-400 hover:text-white hover:border-sky-400 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0b1329] border border-sky-500/40 text-sky-400 flex items-center justify-center mx-auto shadow-md">
            <UserCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            {isLogin ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên'}
          </h3>
          <p className="text-xs text-slate-300 font-normal">
            {isLogin 
              ? 'Truy cập ngân hàng đề thi mô phỏng và lưu trữ kết quả học tập' 
              : 'Gia nhập cộng đồng Kỹ sư AI SFIA Thực Chiến'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('GitHub')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0b1329] hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-200 transition shadow-sm"
          >
            <Github className="w-4 h-4 text-white" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0b1329] hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-200 transition shadow-sm"
          >
            <span className="font-bold text-sky-400">G</span>
            <span>Google</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex-1 h-px bg-slate-800"></div>
          <span>hoặc dùng Email</span>
          <div className="flex-1 h-px bg-slate-800"></div>
        </div>

        {/* Quick Demo Pro VIP Fill Button */}
        {isLogin && (
          <button
            type="button"
            onClick={() => {
              setEmail('pro@ai-thuc-chien.vn');
              setPassword('password123');
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>⚡ Điền Nhanh Tài Khoản Pro VIP (pro@ai-thuc-chien.vn)</span>
          </button>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Họ và Tên</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@ai-thuc-chien.vn"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-sky-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider"
          >
            {isLoading ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                <span>{isLogin ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-400">
          <span>{isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}</span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="text-sky-400 hover:underline font-semibold"
          >
            {isLogin ? 'Đăng ký miễn phí' : 'Đăng nhập'}
          </button>
        </div>

      </div>
    </div>
  );
}
