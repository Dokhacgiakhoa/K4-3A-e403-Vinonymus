'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { 
  Minimize2, 
  Target, 
  AlertTriangle, 
  Sparkles, 
  Brain
} from 'lucide-react';
import { emitLearningActivity } from '@/lib/study-timer';

// =============================================================================
// 1. SINGLETON FOCUS MODE STORE (ĐỒNG BỘ TRẠNG THÁI TOÀN HỆ THỐNG)
// =============================================================================

type Listener = () => void;

interface FocusState {
  isFocusActive: boolean;
  showExitWarning: boolean;
  focusSeconds: number;
}

const INITIAL_FOCUS_STATE: FocusState = {
  isFocusActive: false,
  showExitWarning: false,
  focusSeconds: 0
};

class FocusModeStore {
  private state: FocusState = INITIAL_FOCUS_STATE;
  private timerInterval: NodeJS.Timeout | null = null;
  private listeners: Set<Listener> = new Set();
  private initialized: boolean = false;

  private setState(partial: Partial<FocusState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Kiểm tra trạng thái fullscreen ban đầu
    if (document.fullscreenElement) {
      this.setState({ isFocusActive: true, showExitWarning: false });
      this.startTimer();
    }

    // 1. LẮNG NGHE SỰ KIỆN TOÀN MÀN HÌNH TỪ TRÌNH DUYỆT (HTML5 FULLSCREEN API)
    document.addEventListener('fullscreenchange', () => {
      const isFullscreen = !!document.fullscreenElement;
      if (isFullscreen) {
        if (!this.state.isFocusActive) {
          this.setState({ isFocusActive: true, showExitWarning: false });
          this.startTimer();
          emitLearningActivity('enter_focus_mode');
        }
      } else {
        // Khi người dùng bấm Esc hoặc F11 thoát fullscreen
        if (this.state.isFocusActive) {
          this.stopTimer();
          this.setState({ isFocusActive: false, showExitWarning: false });
          emitLearningActivity('exit_focus_mode');
        }
      }
    });

    // 2. LẮNG NGHE PHÍM TẮT F11 & ESCAPE (TÍCH HỢP TỔ HỢP PHÍM FULL MÀN HÌNH LÀ FOCUS)
    window.addEventListener('keydown', (e) => {
      // Phím F11: Chuyển đổi toàn màn hình & Chế độ Focus
      if (e.key === 'F11') {
        e.preventDefault();
        this.toggle();
      } 
      // Phím Escape khi đang mở popup cảnh báo: đóng popup, duy trì focus
      else if (e.key === 'Escape' && this.state.showExitWarning) {
        e.preventDefault();
        this.closeExitWarning();
      }
    });
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): FocusState {
    return this.state;
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  private startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.setState({ focusSeconds: this.state.focusSeconds + 1 });
      emitLearningActivity('focus_tick');
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.setState({ focusSeconds: 0 });
  }

  public async enter() {
    this.init();
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      this.setState({ isFocusActive: true, showExitWarning: false });
      this.startTimer();
      emitLearningActivity('enter_focus_mode');
    } catch {
      // Dự phòng nếu trình duyệt chặn quyền Fullscreen
      this.setState({ isFocusActive: true, showExitWarning: false });
      this.startTimer();
    }
  }

  public openExitWarning() {
    this.setState({ showExitWarning: true });
  }

  public closeExitWarning() {
    this.setState({ showExitWarning: false });
  }

  public async confirmExit() {
    this.stopTimer();
    this.setState({ showExitWarning: false, isFocusActive: false });

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }

    emitLearningActivity('exit_focus_mode');
  }

  public toggle() {
    if (this.state.isFocusActive || (typeof document !== 'undefined' && !!document.fullscreenElement)) {
      this.confirmExit();
    } else {
      this.enter();
    }
  }
}

export const focusModeStore = new FocusModeStore();

export function useFocusMode() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    focusModeStore.init();
  }, []);

  const state = useSyncExternalStore(
    (onStoreChange) => focusModeStore.subscribe(onStoreChange),
    () => focusModeStore.getState(),
    () => INITIAL_FOCUS_STATE
  );

  return {
    mounted,
    ...state,
    enterFocusMode: () => focusModeStore.enter(),
    requestExitFocus: () => focusModeStore.openExitWarning(),
    confirmExitFocus: () => focusModeStore.confirmExit(),
    resumeFocus: () => focusModeStore.closeExitWarning(),
    toggleFocusMode: () => focusModeStore.toggle()
  };
}

export function formatFocusTimer(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// =============================================================================
// 2. GLOBAL FOCUS OVERLAY (PORTAL RA BODY: ZEN DOCK + EXIT MODAL)
// =============================================================================

export function GlobalFocusOverlay() {
  const { mounted, isFocusActive, showExitWarning, focusSeconds, requestExitFocus, confirmExitFocus, resumeFocus } = useFocusMode();

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* ZEN DOCK: NỔI Ở TRÊN CÙNG MÀN HÌNH KHI ĐANG TOÀN MÀN HÌNH */}
      {isFocusActive && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-[#0f172a]/95 border border-sky-500/50 shadow-2xl backdrop-blur-xl animate-fadeIn pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-xs font-black text-white uppercase tracking-wider hidden sm:inline">
              Deep Focus Mode
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700" />

          <div className="flex items-center gap-1.5 font-mono text-sky-300 font-extrabold text-xs">
            <Brain className="w-4 h-4 text-sky-400" />
            <span>{formatFocusTimer(focusSeconds)}</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700" />

          <button
            type="button"
            onClick={requestExitFocus}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-bold transition cursor-pointer"
            title="Thoát Chế Độ Focus (Esc / F11)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Thoát Toàn Màn Hình</span>
          </button>
        </div>
      )}

      {/* MODAL CẢNH BÁO: RENDER TẬN GỐC BODY, KHÔNG BỊ BÓ HẸP BỞI SIDEBAR */}
      {showExitWarning && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans"
          onClick={(e) => {
            if (e.target === e.currentTarget) resumeFocus();
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-[#0f172a] border border-amber-500/50 p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp">
            
            {/* Warning Icon & Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle className="w-6 h-6 animate-pulse text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-mono">
                  Cảnh Báo Gián Đoạn Não Bộ
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  Bạn có chắc muốn thoát Chế Độ Focus?
                </h3>
              </div>
            </div>

            {/* Note */}
            <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                🎯 Bạn đã duy trì trạng thái <strong>Deep Work</strong> được <strong className="text-sky-400 font-mono">{formatFocusTimer(focusSeconds)}</strong>.
              </p>
              <p className="text-slate-400">
                Theo nghiên cứu nhận thức, việc thoát toàn màn hình hoặc chuyển tab có thể khiến não bộ mất <strong>15 - 20 phút</strong> để thiết lập lại vùng tập trung tối đa.
              </p>
            </div>

            {/* Buttons tuân thủ quy chuẩn: Ngang hàng nhau (flex-row), nút đỏ bên phải có nhiều chữ hơn */}
            <div className="flex flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={resumeFocus}
                className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:opacity-95 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Tiếp Tục Tập Trung</span>
              </button>

              <button
                type="button"
                onClick={confirmExitFocus}
                className="flex-1 py-3 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>Dừng Và Thoát Toàn Màn Hình</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

// =============================================================================
// 3. NÚT FOCUS MODE DẠNG PILL (CHO TOP HEADER VÀ PROFILE BANNER)
// =============================================================================

export function FocusModeController({ children }: { children?: React.ReactNode }) {
  const { isFocusActive, toggleFocusMode } = useFocusMode();

  return (
    <>
      <button
        type="button"
        onClick={toggleFocusMode}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md cursor-pointer group ${
          isFocusActive
            ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sky-500/30'
            : 'bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-sky-500/30 border-sky-500/40 text-sky-300 shadow-sky-500/10'
        }`}
        title="Bật toàn màn hình để kích hoạt trạng thái Deep Work (Hoặc bấm phím F11)"
      >
        <Target className={`w-3.5 h-3.5 ${isFocusActive ? 'text-slate-950' : 'text-sky-400 group-hover:scale-110'} transition-transform animate-pulse`} />
        <span>Focus</span>
        <span className={`hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
          isFocusActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
        }`}>
          F11
        </span>
      </button>
      {children}
    </>
  );
}

// =============================================================================
// 4. NÚT FOCUS MODE CHO SIDEBAR TRÁI
// =============================================================================

export function FocusModeButton({ isCompact }: { isCompact?: boolean }) {
  const { isFocusActive, toggleFocusMode } = useFocusMode();

  return (
    <button
      type="button"
      onClick={toggleFocusMode}
      className={`flex items-center rounded-xl text-sm transition-colors text-left cursor-pointer border border-transparent font-medium ${
        isFocusActive 
          ? 'text-sky-300 bg-sky-500/15 border-sky-500/30 font-bold' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      } ${
        isCompact ? 'w-10 h-10 mx-auto justify-center p-0' : 'w-full gap-2.5 px-3 py-2.5'
      }`}
      title={isCompact ? (isFocusActive ? "Thoát Focus (F11)" : "Bật Chế Độ Focus (F11)") : undefined}
    >
      <Target className={`w-[18px] h-[18px] shrink-0 ${isFocusActive ? 'text-sky-400 animate-pulse' : 'text-slate-400'}`} />
      {!isCompact && (
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="truncate">{isFocusActive ? 'Đang Focus' : 'Focus'}</span>
          <span className="text-[11px] font-mono text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-800/60">F11</span>
        </div>
      )}
    </button>
  );
}
