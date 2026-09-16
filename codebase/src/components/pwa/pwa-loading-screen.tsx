'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function PwaLoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(15);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(45), 180);
    const timer2 = setTimeout(() => setProgress(80), 450);
    const timer3 = setTimeout(() => setProgress(100), 750);

    const finishTimer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => setLoading(false), 500); // Remove from DOM after fade out
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finishTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#040914] bg-[url('/ai-background.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-between p-8 font-sans transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dark overlay for glassmorphism */}
      <div className="absolute inset-0 bg-[#040914]/80 backdrop-blur-md" />

      {/* Top spacer badge */}
      <div className="relative z-10 w-full flex justify-center pt-4">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400/90 tracking-widest uppercase bg-cyan-950/50 border border-cyan-800/50 px-3.5 py-1 rounded-full backdrop-blur-md shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AIIA Notebook PWA</span>
        </div>
      </div>

      {/* Center Branding Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-5 my-auto">
        {/* Animated Glowing Logo Frame */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-cyan-500/30 blur-2xl animate-pulse" />
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950/80 border-2 border-cyan-500/60 p-2 shadow-2xl flex items-center justify-center relative backdrop-blur-xl">
            <img
              src="/aiia-logo.png?v=4"
              alt="AI in Action Logo"
              className="w-full h-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            Sổ tay AI Thực chiến
          </h1>
          <p className="text-xs sm:text-sm text-cyan-300/80 font-medium">
            AI in Action • VinUni & Vingroup
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-64 sm:w-72 space-y-2 pt-4">
          <div className="h-1.5 w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-sm shadow-cyan-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            Đang tải dữ liệu Sổ tay AI... {progress}%
          </p>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 text-[10px] text-slate-500 text-center font-medium pb-2">
        Dành cho Học viên & Thí sinh Khóa IV
      </div>
    </div>
  );
}
