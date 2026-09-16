'use client';

import { useState, useMemo } from 'react';
import { SFIA_COMMUNITY_DATA, SfiaLevelItem } from '@/data/sfia-community-data';
import { 
  Award, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Code2, 
  ShieldCheck, 
  FolderGit2,
  SlidersHorizontal,
  Sparkles,
  Target
} from 'lucide-react';

interface SfiaMatrixViewProps {
  onSelectLevel?: (levelId: string) => void;
}

export function SfiaMatrixView({ onSelectLevel }: SfiaMatrixViewProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string>('L3');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const levels = SFIA_COMMUNITY_DATA.levels;

  const filteredLevels = useMemo(() => {
    return levels.filter((lvl) => {
      const matchFilter = levelFilter === 'ALL' || lvl.id === levelFilter;
      const matchSearch = !searchQuery || 
        lvl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lvl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lvl.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lvl.techniques.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [levels, levelFilter, searchQuery]);

  const selectedLevel = useMemo(() => {
    return levels.find(l => l.id === selectedLevelId) ?? levels[0]!; // Default L1
  }, [levels, selectedLevelId]);

  return (
    <div className="space-y-8 animate-fadeIn font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* Intro Header & Stats in Frosted Glass */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-sky-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>SFIA (v8) International Standard</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f172a]/90 border border-slate-700 text-slate-300 text-xs font-medium font-mono">
                Bloom's Taxonomy Scale
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide uppercase leading-tight text-shadow-clean">
              Ma Trận Năng Lực AI Chuẩn Quốc Tế <br />
              <span className="text-sky-400 font-bold">
                Khung Tham Chiếu SFIA (v8) (L1 — L7)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed font-normal">
              Khung đối chiếu năng lực mở quốc tế chuẩn hóa toàn diện từ tư duy vận hành cơ bản (L1) đến hoạch định chiến lược AI (L7). Nền tảng cung cấp giáo trình thực hành từ Level 0 đến Level 4; các cấp độ L5-L7 đóng vai trò thước đo năng lực dài hạn tại doanh nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0b1329]/80 p-4 rounded-2xl border border-slate-700/80 shrink-0 shadow-lg backdrop-blur-md">
            <div className="text-center">
              <div className="text-xl font-bold text-sky-400 font-mono">7</div>
              <div className="text-[11px] text-slate-300 font-medium">Cấp độ SFIA</div>
            </div>
            <div className="text-center border-l border-slate-800">
              <div className="text-xl font-bold text-emerald-400 font-mono">100%</div>
              <div className="text-[11px] text-slate-300 font-medium">Tự Học Mở</div>
            </div>
            <div className="text-center border-l border-slate-800">
              <div className="text-xl font-bold text-teal-400 font-mono">L1-L4</div>
              <div className="text-[11px] text-slate-300 font-medium">Bloom's Scale</div>
            </div>
            <div className="text-center border-l border-slate-800">
              <div className="text-xl font-bold text-amber-400 font-mono">Mock</div>
              <div className="text-[11px] text-slate-300 font-medium">An toàn NDA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f172a]/85 border border-slate-700/80 shadow-lg backdrop-blur-xl">
        {/* Level Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setLevelFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition uppercase tracking-wide ${
              levelFilter === 'ALL'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
                : 'bg-[#0b1329] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tất Cả
          </button>
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => {
                setLevelFilter(lvl.id);
                setSelectedLevelId(lvl.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition whitespace-nowrap ${
                levelFilter === lvl.id
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
                  : 'bg-[#0b1329] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lvl.id}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo kỹ năng, Vector DB, LoRA..."
            className="w-full pl-10 pr-4 py-2 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition shadow-inner font-normal"
          />
        </div>
      </div>

      {/* Main Matrix Grid: Left Level Selector & Right Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Level Cards List (5/12) WITH OPAQUE BACKGROUND & WHITE-ACTIVE / WHITE-HOVER EFFECT */}
        <div className="lg:col-span-5 space-y-3">
          {filteredLevels.map((lvl) => {
            const isSelected = selectedLevel.id === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => setSelectedLevelId(lvl.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md group ${
                  isSelected
                    ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-sky-400 -translate-y-0.5'
                    : 'bg-[#0f172a]/95 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all shrink-0 ${
                      isSelected 
                        ? 'bg-sky-500 text-slate-950 shadow-md' 
                        : 'bg-[#070d1e] text-sky-300 border border-slate-700 group-hover:bg-sky-500 group-hover:text-slate-950 group-hover:border-transparent'
                    }`}>
                      {lvl.id}
                    </span>
                    <div>
                      <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors ${
                        isSelected 
                          ? 'text-slate-950' 
                          : 'text-white group-hover:text-slate-950'
                      }`}>
                        {lvl.title}
                      </h3>
                      <p className={`text-[11px] line-clamp-1 font-normal transition-colors ${
                        isSelected 
                          ? 'text-slate-700 font-medium' 
                          : 'text-slate-300 group-hover:text-slate-700'
                      }`}>
                        {lvl.tagline}
                      </p>
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-4 h-4 transition-all shrink-0 ${
                    isSelected 
                      ? 'text-sky-600 font-bold translate-x-1' 
                      : 'text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Level Full Details (7/12) */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 rounded-3xl bg-[#0f172a]/95 border border-sky-500/30 space-y-6 shadow-2xl backdrop-blur-2xl">
            
            {/* Header Level Info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-700/70 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono text-xs font-bold">
                    SFIA Level {selectedLevel.levelNumber}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#070d1e] text-slate-300 border border-slate-700 text-xs font-mono">
                    Bloom: {selectedLevel.bloomTaxonomy}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide text-shadow-clean mt-2">
                  {selectedLevel.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
                  {selectedLevel.tagline}
                </p>
              </div>
            </div>

            {/* Autonomy Responsibility */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1329] border border-slate-700/80 space-y-1.5 shadow-md">
              <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase font-mono">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Mức Độ Tự Chủ & Trách Nhiệm (Autonomy):</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal pl-5">
                {selectedLevel.autonomy}
              </p>
            </div>

            {/* Core Objectives */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Mục Tiêu & Tiêu Chuẩn Năng Lực Cần Đạt:
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {selectedLevel.objectives.map((obj, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#0b1329]/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200 font-normal shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Project Deliverables */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1329] border border-sky-500/40 space-y-2.5 shadow-md">
              <div className="text-xs font-bold text-sky-300 flex items-center gap-2 uppercase font-mono">
                <FolderGit2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Dự Án Bàn Giao Cấp Độ: {selectedLevel.practicalProject.name}</span>
              </div>
              <p className="text-xs text-slate-300 font-normal leading-relaxed pl-6">
                {selectedLevel.practicalProject.desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-1 pl-6">
                {selectedLevel.practicalProject.deliverables.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#070d1e] text-[11px] text-slate-200 border border-slate-800 font-medium">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Tool Stack Tags */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono">Công cụ & Công nghệ cốt lõi:</span>
              <div className="flex flex-wrap gap-2">
                {selectedLevel.tools.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-[#0b1329] border border-slate-700 text-xs font-mono text-sky-300 font-semibold shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
