'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Swords, 
  ChevronRight, 
  Lock, 
  Heart, 
  Flame, 
  Award, 
  RotateCcw, 
  BrainCircuit, 
  Crown, 
  Zap, 
  Star,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  X,
  GitBranch,
  GitFork,
  Cpu,
  Boxes,
  Compass,
  Volume2,
  VolumeX,
  Skull
} from 'lucide-react';
import { 
  MICRO_SUBJECTS, 
  getAllLessons, 
  type MicroLesson, 
  type MicroSubject 
} from '@/data/MicroCurriculumData';
import { 
  generateSpacedRepetitionSession, 
  type SpacedRepetitionSession, 
  type SpacedQuizQuestion 
} from '@/lib/SpacedRepetitionEngine';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { useStudyTimer, emitLearningActivity } from '@/lib/study-timer';
import { AuthModal } from '@/components/auth/auth-modal';
import { SoundFX, CanvasFX } from '@/lib/audio-effects';

export type SkillBranchId = 'ALL' | 'CORE_FOUNDATION' | 'MATH_TRANSFORMER' | 'DATA_VECTOR_RAG' | 'MULTI_AGENT' | 'ENTERPRISE_MASTERY';

export interface GamifiedMilestoneNode {
  id: string;
  order: number;
  lessonId: string;
  lessonTitle: string;
  subjectTitle: string;
  levelCode: 'L1' | 'L2' | 'L3' | 'L4';
  nodeType: 'lesson' | 'review_checkpoint' | 'boss_fight';
  estimatedMinutes: number;
  bloomLevel: string;
  branchId: SkillBranchId;
  branchName: string;
  prerequisiteNodeIds: string[];
}

function getBossMeta(milestone: GamifiedMilestoneNode | null) {
  if (!milestone) return { name: 'AI Final Guardian', title: 'Người Gác Cổng Lõi SFIA', avatar: '🤖' };
  const title = (milestone.subjectTitle || '').toLowerCase();
  if (title.includes('python')) {
    return { name: 'Dr. Bytecode', title: 'Chúa Tể GIL & Quản Trị Bộ Nhớ', avatar: '🐍' };
  }
  if (title.includes('cấu trúc') || title.includes('dsa') || title.includes('thuật toán')) {
    return { name: 'Master Big-O', title: 'Bá Chủ Đệ Quy & Không Gian Bộ Nhớ', avatar: '⚡' };
  }
  if (title.includes('vector') || title.includes('rag') || title.includes('retrieval')) {
    return { name: 'The Vector Kraken', title: 'Thủy Quái Không Gian Triệu Chiều', avatar: '🐙' };
  }
  if (title.includes('agent')) {
    return { name: 'Agent Overlord', title: 'Trùm Ma Trận Phản Hồi Tự Quyết', avatar: '🧠' };
  }
  return { name: 'AI Chief Architect', title: 'Người Bảo Vệ Chuẩn SFIA (v8)', avatar: '🛡️' };
}

export function GamifiedPathView() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<SpacedRepetitionSession | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<GamifiedMilestoneNode | null>(null);

  // Skill Tree Branch Filter & Selected Path
  const [selectedBranch, setSelectedBranch] = useState<SkillBranchId>('ALL');

  // Gamification State
  const [hearts, setHearts] = useState<number>(5);
  const [streak, setStreak] = useState<number>(3);
  const [comboCount, setComboCount] = useState<number>(0);
  const [userXP, setUserXP] = useState<number>(450);

  // Game Juice & Audio State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [floatingText, setFloatingText] = useState<{ id: number; text: string; isPositive: boolean } | null>(null);
  const [bossHP, setBossHP] = useState<number>(100);

  // Active Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  // Background Telemetry
  useStudyTimer();

  useEffect(() => {
    const syncUserAndProgress = () => {
      try {
        const u = clientStorage.getUser();
        setCurrentUser(u);

        const savedCompleted = localStorage.getItem('aiia_completed_nodes');
        if (savedCompleted) {
          setCompletedNodeIds(JSON.parse(savedCompleted));
        }
      } catch (err) {
        console.error('Failed to load local progress', err);
      }
    };

    syncUserAndProgress();
    window.addEventListener('aiia_auth_changed', syncUserAndProgress);
    return () => window.removeEventListener('aiia_auth_changed', syncUserAndProgress);
  }, []);

  // Build the list of gamified milestones from all lessons with branch mapping
  const milestoneNodes: GamifiedMilestoneNode[] = [];
  let milestoneOrder = 1;

  MICRO_SUBJECTS.forEach((subject) => {
    // Map subject to distinct skill tree branches
    let branchId: SkillBranchId = 'CORE_FOUNDATION';
    let branchName = 'Nền Tảng Cốt Lõi';

    if (subject.id === 'SUB-PY') {
      branchId = 'CORE_FOUNDATION';
      branchName = 'Gốc: Python & Cơ Chế Thực Thi';
    } else if (subject.id === 'SUB-DSA') {
      branchId = 'MATH_TRANSFORMER';
      branchName = 'Nhánh 1: Cấu Trúc Dữ Liệu & Giải Thuật AI';
    } else if (subject.id === 'SUB-RAG') {
      branchId = 'DATA_VECTOR_RAG';
      branchName = 'Nhánh 2: Vector DB, Chunking & Hybrid RAG';
    } else if (subject.id.includes('AGENT') || subject.title.toLowerCase().includes('agent')) {
      branchId = 'MULTI_AGENT';
      branchName = 'Nhánh 3: Multi-Agent & LangGraph';
    } else if (subject.levelCode === 'L4') {
      branchId = 'ENTERPRISE_MASTERY';
      branchName = 'Đỉnh Cao: Enterprise Mastery & ISO 42001';
    }

    subject.lessons.forEach((lesson, lessonIdx) => {
      const isLastInSubject = lessonIdx === subject.lessons.length - 1;
      const prevLessonId = lessonIdx > 0 ? `node-${subject.lessons[lessonIdx - 1]?.id}` : [];
      const prereqs = Array.isArray(prevLessonId) ? prevLessonId : [prevLessonId];

      milestoneNodes.push({
        id: `node-${lesson.id}`,
        order: milestoneOrder++,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        subjectTitle: subject.title,
        levelCode: lesson.levelCode,
        nodeType: isLastInSubject ? 'boss_fight' : (lessonIdx > 0 && lessonIdx % 2 === 0 ? 'review_checkpoint' : 'lesson'),
        estimatedMinutes: lesson.estimatedMinutes,
        bloomLevel: lesson.bloomLevel,
        branchId,
        branchName,
        prerequisiteNodeIds: prereqs
      });
    });
  });

  const handleLaunchMilestone = (node: GamifiedMilestoneNode) => {
    // Check if user is logged in
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    SoundFX.playClick();

    // Generate Spaced Repetition Session (trộn câu hỏi mới + câu hỏi ôn tập mốc trước)
    const session = generateSpacedRepetitionSession(
      node.lessonId,
      completedNodeIds.map(nid => nid.replace('node-', '')),
      2 // lấy 2 câu ôn tập
    );

    setSelectedMilestone(node);
    setActiveSession(session);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setIsQuizFinished(false);
    setCorrectAnswersCount(0);
    setHearts(5);
    setComboCount(0);
    setBossHP(100);
    setFloatingText(null);
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    SoundFX.playClick();
    setSelectedOption(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !activeSession || isAnswerChecked) return;
    const currentQ = activeSession.questions[currentQuestionIndex];
    if (!currentQ) return;

    const correct = selectedOption === currentQ.correctOption;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    const isBoss = selectedMilestone?.nodeType === 'boss_fight';

    if (correct) {
      const nextCombo = comboCount + 1;
      setComboCount(nextCombo);
      setCorrectAnswersCount(prev => prev + 1);

      const gainedXP = 15 + nextCombo * 5;
      setUserXP(prev => prev + gainedXP);

      if (isBoss) {
        // Boss fight damage scaling
        const baseDamage = Math.round(100 / Math.max(1, activeSession.questions.length));
        const bonusDamage = nextCombo > 1 ? (nextCombo - 1) * 5 : 0;
        const totalDamage = Math.min(100, baseDamage + bonusDamage);
        setBossHP(prev => Math.max(0, prev - totalDamage));

        SoundFX.playBossHit();
        setTimeout(() => SoundFX.playCorrect(nextCombo), 120);
        setFloatingText({
          id: Date.now(),
          text: `💥 Đòn Chí Mạng! -${totalDamage} HP Boss (+${gainedXP} XP)`,
          isPositive: true
        });
      } else {
        SoundFX.playCorrect(nextCombo);
        setFloatingText({
          id: Date.now(),
          text: `+${gainedXP} XP! ${nextCombo > 1 ? `🔥 Combo x${nextCombo}` : ''}`,
          isPositive: true
        });
      }
    } else {
      setComboCount(0);
      setHearts(prev => Math.max(0, prev - 1));
      SoundFX.playWrong();
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 420);

      setFloatingText({
        id: Date.now(),
        text: isBoss ? '💔 Boss Phản Đòn! Mất 1 Tim!' : '💔 Chưa Chính Xác! Mất 1 Tim!',
        isPositive: false
      });
    }
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;
    SoundFX.playClick();
    setFloatingText(null);

    if (currentQuestionIndex + 1 < activeSession.questions.length && hearts > 0) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      setIsQuizFinished(true);
      if (selectedMilestone && hearts > 0) {
        // Hoàn thành mốc
        SoundFX.playVictory();
        CanvasFX.fireConfetti();

        setCompletedNodeIds(prev => {
          if (prev.includes(selectedMilestone.id)) return prev;
          const updated = [...prev, selectedMilestone.id];
          try {
            localStorage.setItem('aiia_completed_nodes', JSON.stringify(updated));
            // Cũng đánh dấu bài học hoàn thành bên free
            const savedLessons = localStorage.getItem('aiia_completed_lessons');
            const lessonList: string[] = savedLessons ? JSON.parse(savedLessons) : [];
            if (!lessonList.includes(selectedMilestone.lessonId)) {
              lessonList.push(selectedMilestone.lessonId);
              localStorage.setItem('aiia_completed_lessons', JSON.stringify(lessonList));
            }
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
        emitLearningActivity(selectedMilestone.estimatedMinutes);
      }
    }
  };

  // DAG Dependency Resolver: Kiểm tra điều kiện mở khóa mốc theo đồ thị phân nhánh
  const isNodeUnlocked = (node: GamifiedMilestoneNode, allNodes: GamifiedMilestoneNode[]) => {
    // 1. Gốc Cây (CORE_FOUNDATION):
    if (node.branchId === 'CORE_FOUNDATION') {
      const coreNodes = allNodes.filter(n => n.branchId === 'CORE_FOUNDATION');
      const idx = coreNodes.findIndex(n => n.id === node.id);
      if (idx === 0) return true; // Mốc đầu tiên của Gốc luôn mở khóa
      return completedNodeIds.includes(coreNodes[idx - 1]?.id ?? '');
    }

    // 2. Ba nhánh chuyên sâu độc lập (MATH_TRANSFORMER, DATA_VECTOR_RAG, MULTI_AGENT):
    if (
      node.branchId === 'MATH_TRANSFORMER' ||
      node.branchId === 'DATA_VECTOR_RAG' ||
      node.branchId === 'MULTI_AGENT'
    ) {
      const branchNodes = allNodes.filter(n => n.branchId === node.branchId);
      const idx = branchNodes.findIndex(n => n.id === node.id);

      // Mốc đầu tiên của mỗi nhánh: Mở khóa ngay khi mốc đầu của Gốc đã hoàn thành
      if (idx === 0) {
        const coreNodes = allNodes.filter(n => n.branchId === 'CORE_FOUNDATION');
        return coreNodes.length === 0 || completedNodeIds.includes(coreNodes[0]?.id ?? '');
      }

      // Các mốc tiếp theo trong nhánh: Chỉ phụ thuộc vào mốc liền trước TRONG CHÍNH NHÁNH ĐÓ
      return completedNodeIds.includes(branchNodes[idx - 1]?.id ?? '');
    }

    // 3. Đỉnh Cao Hội Tụ (ENTERPRISE_MASTERY):
    if (node.branchId === 'ENTERPRISE_MASTERY') {
      const entNodes = allNodes.filter(n => n.branchId === 'ENTERPRISE_MASTERY');
      const idx = entNodes.findIndex(n => n.id === node.id);
      if (idx === 0) {
        // Mở khóa khi hoàn thành mốc Boss của ít nhất 1 nhánh chuyên sâu
        const branchBosses = allNodes.filter(n => 
          n.nodeType === 'boss_fight' && n.branchId !== 'ENTERPRISE_MASTERY'
        );
        return branchBosses.some(b => completedNodeIds.includes(b.id)) || completedNodeIds.length >= 3;
      }
      return completedNodeIds.includes(entNodes[idx - 1]?.id ?? '');
    }

    return true;
  };

  const currentQ = activeSession?.questions[currentQuestionIndex];
  const totalQ = activeSession?.questions.length ?? 0;

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 1. TOP STATUS BAR: CÂY KỸ NĂNG & NHÁNH ĐA HƯỚNG */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#111f44] to-[#0d162d] border border-cyan-500/40 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Cây Kỹ Năng Đa Nhánh (RPG AI Skill Tree)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  Phân Nhánh Tự Do
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Roadmap Dạng Cây Kỹ Năng: Chọn Hướng Đi May Đo Của Riêng Bạn
              </h2>
            </div>
          </div>

          {/* Player Stats */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1 text-rose-400 font-bold text-sm" title="Mạng sống (Hearts)">
              <Heart className="w-4 h-4 fill-current" />
              <span>{hearts}/5</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-1 text-amber-400 font-bold text-sm" title="Chuỗi ngày liên tục (Streak)">
              <Flame className="w-4 h-4 fill-current" />
              <span>{streak} ngày</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-1 text-cyan-300 font-bold text-sm" title="Kinh nghiệm (XP)">
              <Zap className="w-4 h-4 fill-current" />
              <span>{userXP} XP</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700" />
            <button
              type="button"
              onClick={() => {
                const muted = SoundFX.toggleMute();
                setIsMuted(muted);
              }}
              className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                isMuted 
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25' 
                  : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25'
              }`}
              title={isMuted ? 'Bật âm thanh hiệu ứng (Unmute)' : 'Tắt âm thanh hiệu ứng (Mute)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. CHỌN NHÁNH RẼ KỸ NĂNG (BRANCH SELECTOR) */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono mr-1">Nhánh kỹ năng:</span>
          
          <button
            type="button"
            onClick={() => setSelectedBranch('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedBranch === 'ALL'
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Toàn Bộ Cây (Toàn Cảnh)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedBranch('CORE_FOUNDATION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedBranch === 'CORE_FOUNDATION'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <span>🌱 Gốc: Python & Core Execution</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedBranch('MATH_TRANSFORMER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedBranch === 'MATH_TRANSFORMER'
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md shadow-emerald-400/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <span>📐 Nhánh A: DSA & Thuật Toán AI</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedBranch('DATA_VECTOR_RAG')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedBranch === 'DATA_VECTOR_RAG'
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-md shadow-cyan-400/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <span>⚡ Nhánh B: Vector DB & Hybrid RAG</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedBranch('MULTI_AGENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedBranch === 'MULTI_AGENT'
                ? 'bg-purple-400 text-slate-950 border-purple-300 shadow-md shadow-purple-400/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <span>🤖 Nhánh C: Multi-Agent Systems</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedBranch('ENTERPRISE_MASTERY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedBranch === 'ENTERPRISE_MASTERY'
                ? 'bg-rose-400 text-slate-950 border-rose-300 shadow-md shadow-rose-400/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <span>👑 Đỉnh Cao: Enterprise Mastery</span>
          </button>
        </div>
      </div>

      {/* 3. HIỂN THỊ CÂY KỸ NĂNG PHÂN NHÁNH THỰC THỤ (TRUE BRANCHING DAG TREE) */}
      <div className="relative py-6 px-2 sm:px-4 w-full max-w-6xl mx-auto space-y-10">
        
        {(() => {
          const coreNodes = milestoneNodes.filter(n => n.branchId === 'CORE_FOUNDATION');
          const dsaNodes = milestoneNodes.filter(n => n.branchId === 'MATH_TRANSFORMER');
          const ragNodes = milestoneNodes.filter(n => n.branchId === 'DATA_VECTOR_RAG');
          const agentNodes = milestoneNodes.filter(n => n.branchId === 'MULTI_AGENT');
          const entNodes = milestoneNodes.filter(n => n.branchId === 'ENTERPRISE_MASTERY');

          const isRootCompleted = coreNodes.length === 0 || completedNodeIds.includes(coreNodes[coreNodes.length - 1]?.id ?? '') || completedNodeIds.some(id => coreNodes.map(n => n.id).includes(id));

          // Single branch focused view
          if (selectedBranch !== 'ALL') {
            const displayNodes = milestoneNodes.filter(n => n.branchId === selectedBranch);
            const branchName = displayNodes[0]?.branchName || 'Nhánh Kỹ Năng';

            return (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedBranch('ALL')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-700"
                  >
                    <span>← Quay Lại Toàn Cảnh Cây Phân Nhánh</span>
                  </button>
                  <span className="text-xs font-mono text-slate-400">
                    Đang xem chuyên sâu: <strong className="text-white">{branchName}</strong>
                  </span>
                </div>

                <div className="rounded-3xl p-6 sm:p-8 bg-[#0b1329]/95 border border-sky-500/30 shadow-2xl space-y-6">
                  <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-sky-400" />
                      <span>{branchName}</span>
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold border border-sky-500/30">
                      {displayNodes.filter(n => completedNodeIds.includes(n.id)).length} / {displayNodes.length} mốc hoàn thành
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {displayNodes.map((node, nIdx) => {
                      const isCompleted = completedNodeIds.includes(node.id);
                      const isUnlocked = isNodeUnlocked(node, milestoneNodes);
                      const isLocked = !isUnlocked;
                      const isCurrentActive = isUnlocked && !isCompleted;

                      return (
                        <div
                          key={node.id}
                          onClick={() => !isLocked && handleLaunchMilestone(node)}
                          className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                            isLocked
                              ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-b from-amber-500/15 via-slate-900/90 to-slate-950 border-amber-400/50 shadow-lg cursor-pointer hover:border-amber-300 hover:scale-[1.02]'
                                : isCurrentActive
                                  ? 'bg-gradient-to-b from-cyan-500/20 via-slate-900/90 to-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)] ring-2 ring-cyan-400/40 cursor-pointer hover:scale-[1.03] animate-pulse'
                                  : 'bg-slate-900/80 border-slate-700 text-slate-300 cursor-pointer hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                              node.nodeType === 'boss_fight'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isCompleted
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {node.nodeType === 'boss_fight' ? '⚔️ Boss Fight' : `Mốc 0${nIdx + 1}`}
                            </span>

                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-amber-400" />
                              ) : isLocked ? (
                                <Lock className="w-5 h-5 text-slate-500" />
                              ) : node.nodeType === 'boss_fight' ? (
                                <Swords className="w-5 h-5 text-rose-400" />
                              ) : (
                                <Play className="w-5 h-5 text-cyan-400 fill-current ml-0.5" />
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                              {node.lessonTitle}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {node.subjectTitle}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>⏱ {node.estimatedMinutes} phút</span>
                            <span className={isCompleted ? 'text-amber-300 font-bold' : isCurrentActive ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                              {isCompleted ? '✓ Đã Vượt Ải' : isLocked ? '🔒 Đang Khóa' : '▶ Bấm Để Học'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          // FULL DAG BRANCHING VIEW (TOÀN CẢNH ĐỒ THỊ CÂY PHÂN NHÁNH)
          return (
            <div className="space-y-8">
              
              {/* TẦNG 1: GỐC CÂY NỀN TẢNG (ROOT FOUNDATION) */}
              <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-amber-950/40 via-[#0b1329]/90 to-amber-950/40 border border-amber-500/40 shadow-xl space-y-5 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-lg">
                      🌱
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">
                          TẦNG 0 • GỐC NỀN TẢNG CHUNG (ROOT FOUNDATION)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          Bắt Buộc
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white">
                        Python Master & Cơ Chế Thực Thi Lõi (Core Execution)
                      </h3>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Tiến độ gốc: <strong className="text-amber-400">{coreNodes.filter(n => completedNodeIds.includes(n.id)).length} / {coreNodes.length} mốc</strong>
                  </div>
                </div>

                {/* Root Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {coreNodes.map((node, nIdx) => {
                    const isCompleted = completedNodeIds.includes(node.id);
                    const isUnlocked = isNodeUnlocked(node, milestoneNodes);
                    const isLocked = !isUnlocked;
                    const isCurrentActive = isUnlocked && !isCompleted;

                    return (
                      <div
                        key={node.id}
                        onClick={() => !isLocked && handleLaunchMilestone(node)}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                          isLocked
                            ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                            : isCompleted
                              ? 'bg-gradient-to-b from-amber-500/20 via-slate-900/90 to-slate-950 border-amber-400/60 shadow-lg cursor-pointer hover:scale-[1.02]'
                              : isCurrentActive
                                ? 'bg-gradient-to-b from-cyan-500/25 via-slate-900/90 to-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] ring-2 ring-cyan-400/50 cursor-pointer animate-pulse'
                                : 'bg-slate-900/80 border-slate-700 text-slate-300 cursor-pointer hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            node.nodeType === 'boss_fight'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isCompleted
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : 'bg-slate-800 text-slate-300'
                          }`}>
                            {node.nodeType === 'boss_fight' ? '⚔️ Trùm Gốc' : `Gốc 0${nIdx + 1}`}
                          </span>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {isCompleted ? <CheckCircle2 className="w-5 h-5 text-amber-400" /> : isLocked ? <Lock className="w-4 h-4 text-slate-500" /> : <Play className="w-4 h-4 text-cyan-400 fill-current" />}
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                          {node.lessonTitle}
                        </h4>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-400">⏱ {node.estimatedMinutes}m</span>
                          <span className={isCompleted ? 'text-amber-300 font-bold' : isCurrentActive ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                            {isCompleted ? '✓ Đã Học' : isLocked ? '🔒 Khóa' : '▶ Bấm Học'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TẦNG 2: NGÃ 3 RẼ NHÁNH KỸ NĂNG (THE FORK JUNCTION) */}
              <div className="relative py-2">
                {/* SVG Visual Conduit Lines Branching Out */}
                <div className="hidden lg:block w-full h-12 relative">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 50">
                    <defs>
                      <linearGradient id="forkGradLeft" x1="50%" y1="0%" x2="16.67%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="forkGradCenter" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="forkGradRight" x1="50%" y1="0%" x2="83.33%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>

                    {/* Path to Branch A */}
                    <path d="M 500 0 C 500 25, 166 25, 166 50" fill="none" stroke="url(#forkGradLeft)" strokeWidth="3" strokeDasharray="6 4" className="animate-pulse" />
                    {/* Path to Branch B */}
                    <path d="M 500 0 L 500 50" fill="none" stroke="url(#forkGradCenter)" strokeWidth="3" strokeDasharray="6 4" className="animate-pulse" />
                    {/* Path to Branch C */}
                    <path d="M 500 0 C 500 25, 833 25, 833 50" fill="none" stroke="url(#forkGradRight)" strokeWidth="3" strokeDasharray="6 4" className="animate-pulse" />
                  </svg>
                </div>

                {/* Central Fork Hub Card */}
                <div className="mx-auto max-w-xl rounded-2xl bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-purple-500/20 border border-sky-400/50 p-4 shadow-xl text-center space-y-1.5 backdrop-blur-xl">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      ⚡ NGÃ 3 RẼ NHÁNH KỸ NĂNG: LỰA CHỌN CHUYÊN MÔN CỦA BẠN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Hoàn thành mốc Gốc cho phép bạn <strong>tự do chọn học bất kỳ nhánh nào dưới đây</strong> theo mục tiêu nghề nghiệp (AI App / Data RAG / Multi-Agent) mà không bị ép buộc tuần tự.
                  </p>
                </div>
              </div>

              {/* TẦNG 3: 3 CỘT CHUYÊN SÂU PHÂN NHÁNH (3 PARALLEL BRANCHES) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* 3A. CỘT TRÁI: NHÁNH 1 (MATH & DSA) */}
                <div className="rounded-3xl p-5 bg-[#0b1329]/95 border border-emerald-500/40 shadow-xl space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold border border-emerald-500/30">
                        📐
                      </span>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                          NHÁNH A • TOÁN & THUẬT TOÁN
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Cấu Trúc Dữ Liệu & DSA AI
                        </h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs font-bold">
                      {dsaNodes.filter(n => completedNodeIds.includes(n.id)).length}/{dsaNodes.length}
                    </span>
                  </div>

                  {/* Vertical Milestones */}
                  <div className="space-y-3 relative">
                    {dsaNodes.map((node, idx) => {
                      const isCompleted = completedNodeIds.includes(node.id);
                      const isUnlocked = isNodeUnlocked(node, milestoneNodes);
                      const isLocked = !isUnlocked;
                      const isCurrentActive = isUnlocked && !isCompleted;

                      return (
                        <div
                          key={node.id}
                          onClick={() => !isLocked && handleLaunchMilestone(node)}
                          className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 relative overflow-hidden ${
                            isLocked
                              ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-b from-emerald-500/15 via-slate-900/90 to-slate-950 border-emerald-400/50 shadow-md cursor-pointer hover:scale-[1.02]'
                                : isCurrentActive
                                  ? 'bg-gradient-to-b from-emerald-500/25 via-slate-900/90 to-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/40 cursor-pointer animate-pulse'
                                  : 'bg-slate-900/80 border-slate-700 text-slate-300 cursor-pointer hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              node.nodeType === 'boss_fight' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : isCompleted ? 'bg-emerald-400/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {node.nodeType === 'boss_fight' ? '⚔️ Boss Nhánh A' : `Mốc A.0${idx + 1}`}
                            </span>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : isLocked ? <Lock className="w-3.5 h-3.5 text-slate-500" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
                            </div>
                          </div>
                          <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">{node.lessonTitle}</h5>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                            <span>⏱ {node.estimatedMinutes}m</span>
                            <span className={isCompleted ? 'text-emerald-300 font-bold' : isCurrentActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                              {isCompleted ? '✓ Đã Vượt' : isLocked ? '🔒 Khóa' : '▶ Bấm Học'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3B. CỘT GIỮA: NHÁNH 2 (VECTOR & HYBRID RAG) */}
                <div className="rounded-3xl p-5 bg-[#0b1329]/95 border border-cyan-500/40 shadow-xl space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-sm font-bold border border-cyan-500/30">
                        ⚡
                      </span>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                          NHÁNH B • VECTOR & RAG
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Vector DB & Hybrid RAG
                        </h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold">
                      {ragNodes.filter(n => completedNodeIds.includes(n.id)).length}/{ragNodes.length}
                    </span>
                  </div>

                  {/* Vertical Milestones */}
                  <div className="space-y-3 relative">
                    {ragNodes.map((node, idx) => {
                      const isCompleted = completedNodeIds.includes(node.id);
                      const isUnlocked = isNodeUnlocked(node, milestoneNodes);
                      const isLocked = !isUnlocked;
                      const isCurrentActive = isUnlocked && !isCompleted;

                      return (
                        <div
                          key={node.id}
                          onClick={() => !isLocked && handleLaunchMilestone(node)}
                          className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 relative overflow-hidden ${
                            isLocked
                              ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-b from-cyan-500/15 via-slate-900/90 to-slate-950 border-cyan-400/50 shadow-md cursor-pointer hover:scale-[1.02]'
                                : isCurrentActive
                                  ? 'bg-gradient-to-b from-cyan-500/25 via-slate-900/90 to-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] ring-2 ring-cyan-400/40 cursor-pointer animate-pulse'
                                  : 'bg-slate-900/80 border-slate-700 text-slate-300 cursor-pointer hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              node.nodeType === 'boss_fight' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : isCompleted ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {node.nodeType === 'boss_fight' ? '⚔️ Boss Nhánh B' : `Mốc B.0${idx + 1}`}
                            </span>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : isLocked ? <Lock className="w-3.5 h-3.5 text-slate-500" /> : <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />}
                            </div>
                          </div>
                          <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">{node.lessonTitle}</h5>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                            <span>⏱ {node.estimatedMinutes}m</span>
                            <span className={isCompleted ? 'text-cyan-300 font-bold' : isCurrentActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                              {isCompleted ? '✓ Đã Vượt' : isLocked ? '🔒 Khóa' : '▶ Bấm Học'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3C. CỘT PHẢI: NHÁNH 3 (MULTI-AGENT & LANGGRAPH) */}
                <div className="rounded-3xl p-5 bg-[#0b1329]/95 border border-purple-500/40 shadow-xl space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-sm font-bold border border-purple-500/30">
                        🤖
                      </span>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                          NHÁNH C • MULTI-AGENT
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Multi-Agent & LangGraph
                        </h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 font-mono text-xs font-bold">
                      {agentNodes.filter(n => completedNodeIds.includes(n.id)).length}/{agentNodes.length}
                    </span>
                  </div>

                  {/* Vertical Milestones */}
                  <div className="space-y-3 relative">
                    {agentNodes.map((node, idx) => {
                      const isCompleted = completedNodeIds.includes(node.id);
                      const isUnlocked = isNodeUnlocked(node, milestoneNodes);
                      const isLocked = !isUnlocked;
                      const isCurrentActive = isUnlocked && !isCompleted;

                      return (
                        <div
                          key={node.id}
                          onClick={() => !isLocked && handleLaunchMilestone(node)}
                          className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 relative overflow-hidden ${
                            isLocked
                              ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-b from-purple-500/15 via-slate-900/90 to-slate-950 border-purple-400/50 shadow-md cursor-pointer hover:scale-[1.02]'
                                : isCurrentActive
                                  ? 'bg-gradient-to-b from-purple-500/25 via-slate-900/90 to-slate-950 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-2 ring-purple-400/40 cursor-pointer animate-pulse'
                                  : 'bg-slate-900/80 border-slate-700 text-slate-300 cursor-pointer hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              node.nodeType === 'boss_fight' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : isCompleted ? 'bg-purple-400/20 text-purple-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {node.nodeType === 'boss_fight' ? '⚔️ Boss Nhánh C' : `Mốc C.0${idx + 1}`}
                            </span>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-purple-400" /> : isLocked ? <Lock className="w-3.5 h-3.5 text-slate-500" /> : <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />}
                            </div>
                          </div>
                          <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">{node.lessonTitle}</h5>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                            <span>⏱ {node.estimatedMinutes}m</span>
                            <span className={isCompleted ? 'text-purple-300 font-bold' : isCurrentActive ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                              {isCompleted ? '✓ Đã Vượt' : isLocked ? '🔒 Khóa' : '▶ Bấm Học'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* TẦNG 4: ĐIỂM HỘI TỤ ĐỈNH CAO (CONVERGENCE APEX & ENTERPRISE BOSS) */}
              <div className="space-y-3">
                {/* SVG Convergence Lines Merging */}
                <div className="hidden lg:block w-full h-10 relative">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 40">
                    <path d="M 166 0 C 166 20, 500 20, 500 40" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5 3" className="animate-pulse" />
                    <path d="M 500 0 L 500 40" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5 3" className="animate-pulse" />
                    <path d="M 833 0 C 833 20, 500 20, 500 40" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5 3" className="animate-pulse" />
                  </svg>
                </div>

                <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-rose-950/50 border border-rose-500/50 shadow-2xl space-y-4 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-900/50 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center text-lg">
                        👑
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-rose-400 font-mono">
                            ĐIỂM HỘI TỤ ĐỈNH CAO • SFIA LEVEL 4 (CAPSTONE BOSS)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                            Enterprise Mastery
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white">
                          Kiến Trúc Sư AI Doanh Nghiệp & Thẩm Định Độc Lập
                        </h3>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-slate-300">
                      Mở khóa: <strong className="text-rose-400">Hoàn thành ít nhất 1 mốc Boss chuyên sâu</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {entNodes.map((node, nIdx) => {
                      const isCompleted = completedNodeIds.includes(node.id);
                      const isUnlocked = isNodeUnlocked(node, milestoneNodes);
                      const isLocked = !isUnlocked;
                      const isCurrentActive = isUnlocked && !isCompleted;

                      return (
                        <div
                          key={node.id}
                          onClick={() => !isLocked && handleLaunchMilestone(node)}
                          className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                            isLocked
                              ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-b from-rose-500/20 via-slate-900/90 to-slate-950 border-rose-400/60 shadow-lg cursor-pointer hover:scale-[1.02]'
                                : isCurrentActive
                                  ? 'bg-gradient-to-b from-rose-500/25 via-slate-900/90 to-slate-950 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.35)] ring-2 ring-rose-400/50 cursor-pointer animate-pulse'
                                  : 'bg-slate-900/80 border-slate-700 text-slate-300 cursor-pointer hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              ⚔️ Đại Trùm L4
                            </span>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                              {isCompleted ? <CheckCircle2 className="w-5 h-5 text-amber-400" /> : isLocked ? <Lock className="w-4 h-4 text-slate-500" /> : <Swords className="w-4 h-4 text-rose-400" />}
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                            {node.lessonTitle}
                          </h4>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-400">⏱ {node.estimatedMinutes}m</span>
                            <span className={isCompleted ? 'text-amber-300 font-bold' : isCurrentActive ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                              {isCompleted ? '✓ Đã Vượt Ải' : isLocked ? '🔒 Đang Khóa' : '▶ Thách Đấu Boss'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          );
        })()}
      </div>

      {/* 3. INTERACTIVE GAMIFIED QUIZ MODAL */}
      {activeSession && selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#0f1935] via-[#0b1329] to-[#080d1e] border ${
            selectedMilestone.nodeType === 'boss_fight' 
              ? 'border-rose-500/50 shadow-2xl shadow-rose-950/40' 
              : 'border-cyan-500/40 shadow-2xl'
          } p-6 sm:p-8 overflow-hidden space-y-5 transition-all ${isScreenShaking ? 'animate-screen-shake' : ''}`}>
            
            {/* Top Bar: Progress, Hearts, Close */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setActiveSession(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress Bar */}
              <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    selectedMilestone.nodeType === 'boss_fight'
                      ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-red-500'
                      : 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400'
                  }`}
                  style={{ width: `${((currentQuestionIndex + 1) / totalQ) * 100}%` }}
                />
              </div>

              {/* Hearts Indicator */}
              <div className="flex items-center gap-1.5 text-rose-400 font-extrabold text-sm bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
                <span>{hearts}/5</span>
              </div>
            </div>

            {/* BOSS FIGHT ARENA HEADER */}
            {selectedMilestone.nodeType === 'boss_fight' && !isQuizFinished && hearts > 0 && (
              <div className="rounded-2xl p-4 bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-purple-950/70 border border-rose-500/40 space-y-3 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 flex items-center justify-center text-xl shadow-lg shadow-rose-500/30 border border-rose-400/40">
                      {getBossMeta(selectedMilestone).avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <Skull className="w-3 h-3" />
                          TRẬN ĐẤU BOSS CUỐI CHUYÊN ĐỀ
                        </span>
                        {bossHP <= 50 && bossHP > 0 && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-400 fill-current" />
                            PHASE 2: ENRAGE
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                        {getBossMeta(selectedMilestone).name}
                        <span className="text-xs font-normal text-slate-400 hidden sm:inline">({getBossMeta(selectedMilestone).title})</span>
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono font-black ${bossHP <= 30 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                      HP: {bossHP}%
                    </span>
                  </div>
                </div>

                {/* Boss HP Bar */}
                <div className="h-2.5 rounded-full bg-slate-950/80 overflow-hidden border border-rose-900/50">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      bossHP <= 30 
                        ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 animate-pulse' 
                        : bossHP <= 60 
                          ? 'bg-gradient-to-r from-rose-500 to-orange-400' 
                          : 'bg-gradient-to-r from-purple-500 via-rose-500 to-red-500'
                    }`}
                    style={{ width: `${bossHP}%` }}
                  />
                </div>
              </div>
            )}

            {/* FLOATING TEXT JUICE BANNER */}
            {floatingText && (
              <div className="flex justify-center -my-2">
                <span className={`px-3.5 py-1 rounded-full text-xs font-black border shadow-lg animate-float-fade ${
                  floatingText.isPositive 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-emerald-500/20' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-rose-500/20'
                }`}>
                  {floatingText.text}
                </span>
              </div>
            )}

            {/* Quiz Body */}
            {!isQuizFinished && hearts > 0 ? (
              currentQ && (
                <div className="space-y-5">
                  {/* Spaced Repetition Tag Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                      currentQ.isReviewQuestion
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}>
                      {currentQ.isReviewQuestion ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ôn Tập Mốc Trước: {currentQ.originLessonTitle}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Kiến Thức Mới: {currentQ.originLessonTitle}</span>
                        </>
                      )}
                    </span>

                    {comboCount > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 animate-bounce">
                        🔥 Combo x{comboCount}
                      </span>
                    )}
                  </div>

                  {/* Question Prompt */}
                  <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3 shadow-inner">
                    <p className="text-base sm:text-lg font-bold text-white leading-snug">
                      {currentQ.prompt}
                    </p>
                    {currentQ.codeSnippet && (
                      <pre className="p-3 rounded-xl bg-black/70 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800">
                        <code>{currentQ.codeSnippet}</code>
                      </pre>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQ.options.map(opt => {
                      let btnStyle = "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800/80";
                      if (selectedOption === opt.id) {
                        btnStyle = "border-cyan-400 bg-cyan-500/20 text-cyan-100 ring-2 ring-cyan-400/40";
                      }
                      if (isAnswerChecked) {
                        if (opt.id === currentQ.correctOption) {
                          btnStyle = "border-emerald-500 bg-emerald-500/25 text-emerald-100 ring-2 ring-emerald-500/50";
                        } else if (selectedOption === opt.id && !isCorrect) {
                          btnStyle = "border-rose-500 bg-rose-500/25 text-rose-100 ring-2 ring-rose-500/50";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(opt.id)}
                          disabled={isAnswerChecked}
                          className={`w-full text-left p-4 rounded-2xl border text-sm font-semibold transition-all flex items-start gap-3.5 shadow-md ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                            {opt.id}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswerChecked && (
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fadeIn ${
                      isCorrect 
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' 
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Xuất sắc! Đúng rồi!
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            Chưa chính xác! Đáp án đúng là {currentQ.correctOption}.
                          </>
                        )}
                      </div>
                      <p>{currentQ.explanation}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {!isAnswerChecked ? (
                      <button
                        onClick={handleCheckAnswer}
                        disabled={!selectedOption}
                        className="w-full py-3.5 rounded-2xl bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
                      >
                        Kiểm Tra Đáp Án
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-3.5 rounded-2xl bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <span>{currentQuestionIndex + 1 === totalQ ? 'Hoàn Thành Mốc' : 'Tiếp Tục Câu Tiếp Theo'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : (
              /* Completion or Failed Screen */
              <div className="text-center py-8 space-y-5 animate-fadeIn">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center border ${
                  hearts > 0 
                    ? selectedMilestone.nodeType === 'boss_fight'
                      ? 'bg-amber-400/25 border-amber-400 text-amber-300 shadow-xl shadow-amber-500/30'
                      : 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                    : 'bg-rose-500/20 border-rose-500 text-rose-400'
                }`}>
                  {hearts > 0 ? (
                    selectedMilestone.nodeType === 'boss_fight' ? (
                      <Crown className="w-10 h-10 animate-bounce text-amber-300" />
                    ) : (
                      <Award className="w-10 h-10" />
                    )
                  ) : (
                    <Heart className="w-10 h-10" />
                  )}
                </div>

                <h3 className="text-2xl font-black text-white">
                  {hearts > 0 ? (
                    selectedMilestone.nodeType === 'boss_fight' 
                      ? '👑 HẠ GỤC TRÙM CUỐI THÀNH CÔNG!' 
                      : '🏆 Vượt Ải Mốc Kỹ Năng Thành Công!'
                  ) : (
                    '💔 Hết Tim / Mạng Sống!'
                  )}
                </h3>

                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {hearts > 0 
                    ? selectedMilestone.nodeType === 'boss_fight'
                      ? `Bạn đã xuất sắc đánh bại ${getBossMeta(selectedMilestone).name} và làm chủ hoàn toàn chuyên đề ${selectedMilestone.subjectTitle}. Huy hiệu mốc kỹ năng và XP đã được ghi nhận vào bảng hồ sơ!`
                      : `Bạn đã trả lời đúng ${correctAnswersCount}/${totalQ} câu hỏi, củng cố thành công kiến thức mới và ôn tập các mốc trước. Mốc tiếp theo đã được mở khóa!`
                    : 'Bạn đã sử dụng hết 5 tim. Hãy ôn tập lại bài giảng và thử lại để hồi phục năng lượng nhé!'}
                </p>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleLaunchMilestone(selectedMilestone)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Luyện Lại Mốc Này
                  </button>
                  <button
                    onClick={() => setActiveSession(null)}
                    className="px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-black hover:brightness-110 transition-all"
                  >
                    Tiếp Tục Bản Đồ Kỹ Năng
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4. AUTH MODAL */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      )}

    </div>
  );
}
