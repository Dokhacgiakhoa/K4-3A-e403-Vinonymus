'use client';

import React, { useState } from 'react';
import { Smartphone, Apple, Monitor, Share, PlusSquare, MoreVertical, Download, Sparkles, CheckCircle2 } from 'lucide-react';

export function ShortcutGuideView() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('ios');

  return (
    <div className="h-full flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="bg-slate-950 p-4 md:p-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-white tracking-tight">
              Tạo phím tắt màn hình chính
            </h2>
            <p className="text-xs text-slate-400">Truy cập Sổ tay AIIA Notebook cực nhanh chỉ với 1 chạm</p>
          </div>
        </div>
      </div>

      {/* Platform Selector Tabs */}
      <div className="bg-slate-950/80 border-b border-slate-800 p-3 shrink-0">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
              platform === 'ios'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Apple className="w-4 h-4 shrink-0" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setPlatform('android')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
              platform === 'android'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setPlatform('desktop')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
              platform === 'desktop'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4 shrink-0" />
            <span>Máy tính</span>
          </button>
        </div>
      </div>

      {/* Main Content Guide Steps Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4">
        {platform === 'ios' && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Hướng dẫn dành riêng cho trình duyệt <strong>Safari trên iPhone / iPad</strong></span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Nhấp nút Chia sẻ <Share className="w-4 h-4 text-cyan-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Ở thanh công cụ phía dưới cùng của màn hình trình duyệt Safari.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Chọn &quot;Thêm vào MH chính&quot; <PlusSquare className="w-4 h-4 text-cyan-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Cuộn danh sách menu hành động xuống dưới và bấm chọn mục này.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Xác nhận &quot;Thêm&quot; <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Bấm nút **Thêm** ở góc trên bên phải màn hình. Biểu tượng AIIA Notebook sẽ xuất hiện ngoài màn hình ứng dụng.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {platform === 'android' && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Hướng dẫn dành cho trình duyệt <strong>Chrome trên Android</strong></span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Nhấp menu 3 chấm <MoreVertical className="w-4 h-4 text-cyan-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Nằm ở góc trên bên phải màn hình ứng dụng Chrome.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Chọn &quot;Thêm vào màn hình chính&quot; <Download className="w-4 h-4 text-cyan-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Hoặc chọn mục &quot;Cài đặt ứng dụng&quot; tùy theo phiên bản Chrome.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Xác nhận tạo phím tắt <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Bấm nút **Thêm** để ứng dụng tự động đưa biểu tượng Sổ tay ra màn hình chính.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {platform === 'desktop' && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Hướng dẫn dành cho <strong>Máy tính (Chrome, Edge, Brave...)</strong></span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Nhấp biểu tượng Cài đặt <Download className="w-4 h-4 text-cyan-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Nằm ở góc phải của thanh nhập địa chỉ trang web (URL bar).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Xác nhận &quot;Cài đặt AIIA Notebook&quot; <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Bấm **Cài đặt** để ứng dụng chạy độc lập dạng cửa sổ Desktop app tiện lợi.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
