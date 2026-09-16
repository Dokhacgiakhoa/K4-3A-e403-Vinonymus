'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Play, 
  Clock, 
  Layers, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Cpu, 
  BrainCircuit, 
  Filter, 
  Sparkles,
  Lock,
  ArrowRight,
  Flame,
  Check
} from 'lucide-react';
import { 
  MICRO_SUBJECTS, 
  getAllLessons, 
  type MicroSubject, 
  type MicroLesson 
} from '@/data/MicroCurriculumData';
import { MicroLessonReaderModal } from '@/components/learning/MicroLessonReaderModal';
import { useStudyTimer } from '@/lib/study-timer';

interface LinearCurriculumViewProps {
  onUpgradeClick?: () => void;
}

export function LinearCurriculumView({ onUpgradeClick }: LinearCurriculumViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<string[]>(['SUB-PY']);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<MicroLesson | null>(null);

  // Background Telemetry Timer
  useStudyTimer();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aiia_completed_lessons');
      if (saved) {
        setCompletedLessonIds(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to read completed lessons', err);
    }
  }, []);

  const toggleSubject = (subjId: string) => {
    setExpandedSubjectIds(prev => 
      prev.includes(subjId) ? prev.filter(id => id !== subjId) : [...prev, subjId]
    );
  };

  const handleLessonCompleted = (lessonId: string) => {
    setCompletedLessonIds(prev => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      try {
        localStorage.setItem('aiia_completed_lessons', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const allLessons = getAllLessons();
  const totalLessonsCount = allLessons.length;
  const completedCount = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const overallProgress = Math.round((completedCount / (totalLessonsCount || 1)) * 100);

  // Filtered Subjects & Lessons
  const filteredSubjects = MICRO_SUBJECTS.map(subj => {
    const matchesLevel = selectedLevel === 'ALL' || subj.levelCode === selectedLevel;
    const filteredLessons = subj.lessons.filter(l => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        l.title.toLowerCase().includes(query) ||
        l.summary.toLowerCase().includes(query) ||
        l.tags.some(t => t.toLowerCase().includes(query))
      );
    });

    return {
      ...subj,
      isMatch: matchesLevel && (filteredLessons.length > 0 || !searchQuery),
      visibleLessons: filteredLessons
    };
  }).filter(s => s.isMatch);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 1. TOP HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#0e1c3d] to-[#0b1329] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Giáo Trình Tuyến Tính (Free Linear Track)
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-500/15 text-purple-300 text-xs font-bold border border-purple-500/30">
                Chuẩn SFIA 8 & Bloom Taxonomy
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Lộ Trình Học Tập Chi Tiết & Đánh Giá Năng Lực Từng Bài
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Mỗi chủ đề được chia nhỏ thành các bài học vi mô hoàn chỉnh kèm mã nguồn minh họa và bài trắc nghiệm năng lực. Học xong bài nào, kiểm tra đạt bài đó để tích lũy giờ học.
            </p>
          </div>

          {/* Progress Card */}
          <div className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800 backdrop-blur-md min-w-[240px] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Tiến độ tổng quan</span>
              <span className="font-mono font-bold text-cyan-300">{completedCount}/{totalLessonsCount} bài ({overallProgress}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Đã qua ải
              </span>
              <span className="text-amber-400 font-bold">100% Miễn phí</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bài học, từ khóa (venv, Big O, RAG, yield, decorator)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Cấp độ:
          </span>
          {['ALL', 'L1', 'L2', 'L3'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'Tất cả' : `SFIA ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SUBJECTS & LESSONS LIST */}
      <div className="space-y-5">
        {filteredSubjects.map(subject => {
          const isExpanded = expandedSubjectIds.includes(subject.id);
          const subjLessons = subject.visibleLessons;
          const subjCompleted = subjLessons.filter(l => completedLessonIds.includes(l.id)).length;
          const subjPercent = Math.round((subjCompleted / (subjLessons.length || 1)) * 100);

          return (
            <div 
              key={subject.id} 
              className="rounded-2xl bg-gradient-to-b from-[#0e1628] to-[#0a1020] border border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden shadow-lg"
            >
              {/* Subject Header (Click to toggle) */}
              <div 
                onClick={() => toggleSubject(subject.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${subject.accentColor} flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0`}>
                    {subject.id === 'SUB-PY' ? <Code2 className="w-6 h-6" /> : subject.id === 'SUB-DSA' ? <Cpu className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700">
                        {subject.levelCode}
                      </span>
                      <span className="text-xs text-slate-400">
                        {subject.levelName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {subject.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 sm:line-clamp-none">
                      {subject.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-cyan-300">
                      {subjCompleted} / {subjLessons.length} bài ({subjPercent}%)
                    </div>
                    <div className="w-24 h-1.5 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${subjPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Lessons List (Accordion body) */}
              {isExpanded && (
                <div className="border-t border-slate-800/80 bg-slate-950/40 p-4 sm:p-6 space-y-3">
                  {subjLessons.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Không tìm thấy bài học nào phù hợp với bộ lọc tìm kiếm.
                    </div>
                  ) : (
                    subjLessons.map(lesson => {
                      const isDone = completedLessonIds.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isDone 
                              ? 'bg-emerald-950/10 border-emerald-500/30 text-slate-200' 
                              : 'bg-slate-900/50 border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/80'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                              isDone 
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                                : 'bg-slate-800 border border-slate-700 text-slate-300'
                            }`}>
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : lesson.order}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-white leading-snug">
                                  {lesson.title}
                                </h4>
                                <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-purple-300 border border-purple-500/20">
                                  Bloom: {lesson.bloomLevel}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {lesson.summary}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-cyan-400" /> {lesson.estimatedMinutes} phút
                                </span>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <Award className="w-3 h-3 text-amber-400" /> {lesson.quizQuestions.length} câu trắc nghiệm
                                </span>
                                {lesson.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => setActiveLesson(lesson)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                                isDone
                                  ? 'bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-emerald-500/30'
                                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{isDone ? 'Xem Lại & Ôn Tập' : 'Học Bài & Kiểm Tra'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. UPGRADE HOOK CARD FOR FREE LEARNERS */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#10142c] to-cyan-950/40 border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Nâng Tầm Luyện Tập Với AI Gamification Tương Tác
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Muốn Học Qua Game Tương Tác & Lặp Lại Ngắt Quãng (Spaced Repetition)?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nâng cấp gói Pro để trải nghiệm chế độ học tương tác vượt ải, hệ thống Tim/Streak, các màn Boss Fight và thuật toán tự động nhắc lại kiến thức cũ ở các mốc tiếp theo.
          </p>
        </div>

        <button
          onClick={onUpgradeClick}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all shrink-0 flex items-center gap-2"
        >
          <span>Khám Phá Chế Độ Pro Gamification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. MODAL ĐỌC BÀI VÀ KIỂM TRA NĂNG LỰC */}
      {activeLesson && (
        <MicroLessonReaderModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onCompleted={handleLessonCompleted}
        />
      )}

    </div>
  );
}
