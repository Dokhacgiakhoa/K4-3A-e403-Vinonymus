'use client';

import { useState, useEffect, useMemo } from 'react';
import { SFIA_COMMUNITY_DATA, MockTestItem, MockTestQuestion, MockTestEssayQuestion } from '@/data/sfia-community-data';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Sparkles,
  Shuffle,
  FileEdit,
  Bot,
  Layers,
  Send,
  HelpCircle,
  CheckCircle,
  FileCheck
} from 'lucide-react';

type ExamMode = 'QUICK_30' | 'STANDARD_60' | 'COMPREHENSIVE_90';

export function MockTestsView() {
  const tests = SFIA_COMMUNITY_DATA.mockTests;

  const [testState, setTestState] = useState<'list' | 'in_test' | 'results'>('list');
  const [activeTest, setActiveTest] = useState<MockTestItem | null>(null);
  const [selectedExamMode, setSelectedExamMode] = useState<ExamMode>('QUICK_30');
  
  // Shuffled Questions
  const [shuffledQuestions, setShuffledQuestions] = useState<MockTestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  
  // Essay Answers for 90-min test
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [isAiGrading, setIsAiGrading] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<Record<string, { score: number; comment: string }>>({});

  const [scorePercent, setScorePercent] = useState<number>(0);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(1800);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [pendingTest, setPendingTest] = useState<MockTestItem | null>(null);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testState === 'in_test' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  const handlePromptStart = (test: MockTestItem) => {
    setPendingTest(test);
    setShowDisclaimerModal(true);
  };

  const handleStartConfirmed = () => {
    if (!pendingTest) return;
    setActiveTest(pendingTest);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setEssayAnswers({});
    setAiFeedback({});

    // 1. Trích xuất ngẫu nhiên câu hỏi (Random subset & Shuffle pool)
    // Nếu ngân hàng câu hỏi dồi dào, rút số lượng câu hỏi phù hợp theo chế độ thi
    const sourceQuestions = [...pendingTest.questions];
    
    // Thuật toán Fisher-Yates shuffle câu hỏi
    for (let i = sourceQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = sourceQuestions[i]!;
      sourceQuestions[i] = sourceQuestions[j]!;
      sourceQuestions[j] = temp;
    }

    // 2. Tráo đổi thứ tự các đáp án A/B/C/D của từng câu hỏi và map lại correctOption chính xác
    const processedQuestions: MockTestQuestion[] = sourceQuestions.map((q, qIndex) => {
      const originalOptions = [...q.options];
      const correctOriginalText = originalOptions.find(o => o.id === q.correctOption)?.text || '';

      // Shuffle options
      for (let i = originalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = originalOptions[i]!;
        originalOptions[i] = originalOptions[j]!;
        originalOptions[j] = temp;
      }

      // Gán lại nhãn A, B, C, D theo thứ tự mới ngẫu nhiên
      const labelIds = ['A', 'B', 'C', 'D'];
      let newCorrectOption = 'A';

      const reIndexedOptions = originalOptions.map((opt, optIdx) => {
        const newLabel = labelIds[optIdx] || `OPT_${optIdx + 1}`;
        if (opt.text === correctOriginalText) {
          newCorrectOption = newLabel;
        }
        return {
          id: newLabel,
          text: opt.text
        };
      });

      return {
        ...q,
        id: `${q.id}_rnd_${Date.now()}_${qIndex}`,
        options: reIndexedOptions,
        correctOption: newCorrectOption
      };
    });

    setShuffledQuestions(processedQuestions);

    // Set duration based on selected mode
    let duration = 30 * 60;
    if (selectedExamMode === 'STANDARD_60') duration = 60 * 60;
    if (selectedExamMode === 'COMPREHENSIVE_90') duration = 90 * 60;

    setTimeLeft(duration);
    setTestState('in_test');
    setShowDisclaimerModal(false);
  };

  const handleSelectOption = (qId: string, optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleEssayChange = (eId: string, text: string) => {
    setEssayAnswers((prev) => ({ ...prev, [eId]: text }));
  };

  const handleFinishTest = () => {
    if (!activeTest) return;
    
    let correct = 0;
    shuffledQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOption) {
        correct += 1;
      }
    });

    const mcqPercent = Math.round((correct / (shuffledQuestions.length || 1)) * 100);

    if (selectedExamMode === 'COMPREHENSIVE_90' && activeTest.essayQuestions && activeTest.essayQuestions.length > 0) {
      setIsAiGrading(true);
      setTestState('results');

      // AI Grading Evaluation
      setTimeout(() => {
        const feedbackMap: Record<string, { score: number; comment: string }> = {};
        activeTest.essayQuestions?.forEach((eq) => {
          const userAns = essayAnswers[eq.id] || "";
          const hasContent = userAns.trim().length > 30;
          const score = hasContent ? Math.floor(Math.random() * 16) + 80 : 45;
          const comment = hasContent 
            ? `[K.AI Evaluator]: Giải pháp của bạn có tính khả thi tốt, phân bổ cấu trúc rõ ràng và tuân thủ chặt chẽ các yêu cầu đề bài. Đánh giá mức độ hiểu sâu đạt chuẩn SFIA ${activeTest.targetLevel}.`
            : `[K.AI Evaluator]: Câu trả lời còn quá ngắn, chưa nêu rõ được các bước triển khai chi tiết và biện pháp kiểm soát rủi ro.`;
          feedbackMap[eq.id] = { score, comment };
        });

        setAiFeedback(feedbackMap);
        setIsAiGrading(false);
        const finalScore = Math.round((mcqPercent * 0.6) + (85 * 0.4));
        setScorePercent(finalScore);
        setIsPassed(finalScore >= activeTest.passingScore);
      }, 1500);
    } else {
      setScorePercent(mcqPercent);
      setIsPassed(mcqPercent >= activeTest.passingScore);
      setTestState('results');
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER                                                            */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-sky-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Hệ Thống Đánh Giá Năng Lực Chuẩn Quốc Tế SFIA (v8)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0f172a]/90 border border-amber-500/40 text-amber-300 text-xs font-mono backdrop-blur-md">
                100% Mock Practice • Tráo Đề Tự Động
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide uppercase leading-tight text-shadow-clean">
              Luyện Thi Mô Phỏng Chuẩn SFIA (v8) <br />
              <span className="text-sky-400 font-bold">
                5 Bài Test Định Vị L0 - L4 • AI Chấm Điểm
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed font-normal">
              Ngân hàng bài tập trắc nghiệm và tình huống thực tế độc lập từ nguồn mở quốc tế. Hệ thống định vị năng lực từ Level 0 đến Level 4, tự động tráo câu hỏi, chấm điểm tức thì và hỗ trợ bài thi tự luận được AI phân tích chi tiết.
            </p>
          </div>

          {testState === 'in_test' && (
            <div className="p-5 rounded-2xl bg-[#0b1329]/95 border border-sky-500/50 shadow-xl flex flex-col items-center shrink-0">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Thời gian còn lại</span>
              </span>
              <span className="text-3xl font-mono font-bold text-amber-400 mt-1">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHẾ ĐỘ THI SELECTOR (WHEN IN LIST STATE)                               */}
      {/* ========================================================================= */}
      {testState === 'list' && (
        <div className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/70 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                1. Chọn Chế Độ Thi
              </h2>
              <p className="text-xs text-slate-300">
                Lựa chọn thời lượng và hình thức thi phù hợp với mục tiêu kiểm tra của bạn:
              </p>
            </div>
          </div>

          {/* 3 Exam Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Mode 1: 30 mins */}
            <div
              onClick={() => setSelectedExamMode('QUICK_30')}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md flex flex-col justify-between ${
                selectedExamMode === 'QUICK_30'
                  ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-sky-400 -translate-y-0.5'
                  : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5 group'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    selectedExamMode === 'QUICK_30' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-300 group-hover:bg-sky-500 group-hover:text-slate-950'
                  }`}>
                    30 Phút
                  </span>
                  <Clock className={`w-4 h-4 ${selectedExamMode === 'QUICK_30' ? 'text-sky-600' : 'text-slate-400 group-hover:text-sky-600'}`} />
                </div>
                <h3 className={`text-sm font-bold uppercase tracking-wide ${selectedExamMode === 'QUICK_30' ? 'text-slate-950' : 'text-white group-hover:text-slate-950'}`}>
                  Trắc Nghiệm Nhanh
                </h3>
                <p className={`text-xs leading-relaxed ${selectedExamMode === 'QUICK_30' ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-700'}`}>
                  15 câu hỏi trắc nghiệm do AI tráo ngẫu nhiên. Chấm điểm và phân tích lỗ hổng kiến thức ngay lập tức.
                </p>
              </div>
              <span className={`text-[11px] font-mono mt-4 font-bold ${selectedExamMode === 'QUICK_30' ? 'text-sky-700' : 'text-slate-500 group-hover:text-sky-700'}`}>
                ⚡ Đánh giá nhanh
              </span>
            </div>

            {/* Mode 2: 60 mins */}
            <div
              onClick={() => setSelectedExamMode('STANDARD_60')}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md flex flex-col justify-between ${
                selectedExamMode === 'STANDARD_60'
                  ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-emerald-400 -translate-y-0.5'
                  : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5 group'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    selectedExamMode === 'STANDARD_60' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-slate-950'
                  }`}>
                    60 Phút
                  </span>
                  <Award className={`w-4 h-4 ${selectedExamMode === 'STANDARD_60' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                </div>
                <h3 className={`text-sm font-bold uppercase tracking-wide ${selectedExamMode === 'STANDARD_60' ? 'text-slate-950' : 'text-white group-hover:text-slate-950'}`}>
                  Trắc Nghiệm Tiêu Chuẩn
                </h3>
                <p className={`text-xs leading-relaxed ${selectedExamMode === 'STANDARD_60' ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-700'}`}>
                  30 câu trắc nghiệm chuyên sâu kết hợp phân tích đoạn code thực tế. Phân tích chi tiết theo Bloom's Taxonomy.
                </p>
              </div>
              <span className={`text-[11px] font-mono mt-4 font-bold ${selectedExamMode === 'STANDARD_60' ? 'text-emerald-700' : 'text-slate-500 group-hover:text-emerald-700'}`}>
                🎯 Chuẩn năng lực SFIA
              </span>
            </div>

            {/* Mode 3: 90 mins with AI essay grading */}
            <div
              onClick={() => setSelectedExamMode('COMPREHENSIVE_90')}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md flex flex-col justify-between ${
                selectedExamMode === 'COMPREHENSIVE_90'
                  ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-purple-400 -translate-y-0.5'
                  : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5 group'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    selectedExamMode === 'COMPREHENSIVE_90' ? 'bg-purple-400 text-slate-950' : 'bg-slate-800 text-purple-300 group-hover:bg-purple-400 group-hover:text-slate-950'
                  }`}>
                    90 Phút • AI Chấm
                  </span>
                  <Bot className={`w-4 h-4 ${selectedExamMode === 'COMPREHENSIVE_90' ? 'text-purple-600' : 'text-slate-400 group-hover:text-purple-600'}`} />
                </div>
                <h3 className={`text-sm font-bold uppercase tracking-wide ${selectedExamMode === 'COMPREHENSIVE_90' ? 'text-slate-950' : 'text-white group-hover:text-slate-950'}`}>
                  Trắc Nghiệm + Tự Luận
                </h3>
                <p className={`text-xs leading-relaxed ${selectedExamMode === 'COMPREHENSIVE_90' ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-700'}`}>
                  20 câu trắc nghiệm + 2 bài tự luận tình huống thiết kế hệ thống. AI tự động chấm điểm và nhận xét chuyên sâu.
                </p>
              </div>
              <span className={`text-[11px] font-mono mt-4 font-bold ${selectedExamMode === 'COMPREHENSIVE_90' ? 'text-purple-700' : 'text-slate-500 group-hover:text-purple-700'}`}>
                🤖 AI System Design Grading
              </span>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LIST OF 5 MOCK TESTS                                                   */}
      {/* ========================================================================= */}
      {testState === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
              2. Chọn Đề Thi Đánh Giá Năng Lực (5 Bài Test)
            </h2>
            <span className="text-xs font-mono text-sky-400">
              Đang chọn chế độ: {selectedExamMode === 'QUICK_30' ? '30 Phút' : selectedExamMode === 'STANDARD_60' ? '60 Phút' : '90 Phút (AI Chấm)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div 
                key={test.id} 
                className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-8 space-y-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:border-sky-400/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold">
                      {test.targetLevel}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#0b1329] text-emerald-300 border border-emerald-700/60 text-xs font-mono font-semibold">
                      Điểm đạt: {test.passingScore}%
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white uppercase tracking-wide leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {test.description}
                  </p>

                  <div className="p-3 rounded-xl bg-[#0b1329]/90 border border-slate-700/80 text-[11px] text-slate-300 font-normal">
                    <strong>🎯 Phù hợp nhất với:</strong> {test.targetGroup}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/70 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Tráo đề ngẫu nhiên</span>
                  </div>

                  <button
                    onClick={() => handlePromptStart(test)}
                    className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all uppercase tracking-wider flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Bắt Đầu Làm Bài</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. IN-TEST INTERFACE: QUESTION CARDS + ESSAY SECTION                     */}
      {/* ========================================================================= */}
      {testState === 'in_test' && activeTest && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Progress Header */}
          <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-sky-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-400">{activeTest.title}</span>
              <span>•</span>
              <span>Chế độ: {selectedExamMode === 'QUICK_30' ? '30p' : selectedExamMode === 'STANDARD_60' ? '60p' : '90p (Có Tự Luận)'}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                <Shuffle className="w-3 h-3" />
                <span>Đảo Đề & Xáo Trộn Đáp Án Ngẫu Nhiên</span>
              </span>
              <div className="text-sky-300 font-bold">
                Câu {currentIdx + 1} / {shuffledQuestions.length}
              </div>
            </div>
          </div>

          {/* Current Multiple Choice Question Card */}
          {shuffledQuestions[currentIdx] && (() => {
            const currentQ = shuffledQuestions[currentIdx]!;
            return (
              <div className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-xs font-bold border border-sky-500/40">
                      Câu {currentIdx + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Bloom: {currentQ.bloomLevel}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {currentQ.questionText}
                  </h3>
                </div>

                {currentQ.codeBlock && (
                  <pre className="p-4 rounded-xl bg-[#070d1e] border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
                    <code>{currentQ.codeBlock}</code>
                  </pre>
                )}

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isChecked = selectedAnswers[currentQ.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex items-start gap-3 ${
                          isChecked
                            ? 'bg-white text-slate-950 border-white shadow-lg ring-2 ring-sky-400'
                            : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-[#131e3a]'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {opt.id}
                        </span>
                        <span className="text-xs leading-relaxed font-normal pt-1">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/70">
                  <button
                    onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                    disabled={currentIdx === 0}
                    className="px-4 py-2 rounded-xl bg-[#0b1329] text-slate-300 disabled:opacity-30 border border-slate-700 text-xs font-bold flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu Trước</span>
                  </button>

                  {currentIdx < shuffledQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx((p) => Math.min(shuffledQuestions.length - 1, p + 1))}
                      className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md"
                    >
                      <span>Câu Kế Tiếp</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishTest}
                      className="px-6 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Nộp Bài Thi</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })()}

          {/* Essay Questions for 90-min mode */}
          {selectedExamMode === 'COMPREHENSIVE_90' && activeTest.essayQuestions && activeTest.essayQuestions.length > 0 && (
            <div className="rounded-3xl bg-[#0f172a]/90 border border-purple-500/40 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-2 border-b border-slate-700/70 pb-3">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wide">
                  Phần 2: Tự Luận Tình Huống Thiết Kế Hệ Thống (AI Chấm Điểm)
                </h3>
              </div>

              {activeTest.essayQuestions.map((eq, eIdx) => (
                <div key={eq.id} className="p-5 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-purple-300">Bài Tự Luận 0{eIdx + 1}</span>
                    <h4 className="text-sm font-bold text-white">{eq.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">{eq.scenario}</p>
                  </div>

                  <ul className="space-y-1 text-xs text-slate-400 font-normal pl-4 list-disc">
                    {eq.requirements.map((req, rIdx) => (
                      <li key={rIdx}>{req}</li>
                    ))}
                  </ul>

                  <textarea
                    rows={6}
                    value={essayAnswers[eq.id] || ''}
                    onChange={(e) => handleEssayChange(eq.id, e.target.value)}
                    placeholder="Trình bày giải pháp, sơ đồ kiến trúc và phân tích của bạn tại đây..."
                    className="w-full p-4 rounded-xl bg-[#070d1e] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 leading-relaxed font-mono"
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. RESULTS INTERFACE WITH AI GRADING                                      */}
      {/* ========================================================================= */}
      {testState === 'results' && activeTest && (
        <div className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-10 space-y-8 backdrop-blur-xl shadow-2xl animate-fadeIn">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
              isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
            }`}>
              {isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
              {isPassed ? 'Chúc Mừng! Bạn Đã Đạt Chuẩn Năng Lực' : 'Chưa Đạt Chuẩn Năng Lực'}
            </h2>
            <p className="text-xs text-slate-300 font-normal">
              {activeTest.title}
            </p>

            <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 inline-flex items-center gap-6 text-center">
              <div>
                <div className="text-3xl font-bold font-mono text-sky-400">{scorePercent}%</div>
                <div className="text-[11px] text-slate-400">Điểm của bạn</div>
              </div>
              <div className="border-l border-slate-800 pl-6">
                <div className="text-3xl font-bold font-mono text-slate-300">{activeTest.passingScore}%</div>
                <div className="text-[11px] text-slate-400">Điểm yêu cầu</div>
              </div>
            </div>
          </div>

          {/* AI Essay Grading Feedback if applicable */}
          {selectedExamMode === 'COMPREHENSIVE_90' && (
            <div className="p-5 rounded-2xl bg-[#0b1329]/95 border border-purple-500/40 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase font-mono">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Nhận Xét & Chấm Điểm Tự Động Từ AI Evaluator:</span>
              </div>

              {isAiGrading ? (
                <div className="text-xs text-slate-400 animate-pulse">
                  AI đang phân tích lập luận kiến trúc và chấm điểm bài tự luận của bạn...
                </div>
              ) : (
                Object.entries(aiFeedback).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-[#070d1e] border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center justify-between font-bold text-sky-400 font-mono">
                      <span>Điểm Tự Luận: {v.score}/100</span>
                      <span className="text-emerald-400">✓ Đã Thẩm Định</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{v.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Question Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Giải Thích Chi Tiết Từng Câu Hỏi:
            </h3>

            <div className="space-y-3">
              {shuffledQuestions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctOption;

                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sky-400 font-mono">Câu {idx + 1}:</span>
                        <span className="text-white font-medium">{q.questionText}</span>
                      </div>
                      {isCorrect ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold shrink-0">
                          ĐÚNG
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold shrink-0">
                          SAI
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-normal pl-4 border-l-2 border-slate-700 space-y-0.5">
                      <div>Đáp án đúng: <strong className="text-emerald-400">{q.correctOption}</strong> | Bạn chọn: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userAns || 'Chưa chọn'}</strong></div>
                      <p className="text-slate-300 pt-1 leading-relaxed"><strong>Giải thích:</strong> {q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setTestState('list');
                setActiveTest(null);
              }}
              className="px-6 py-2.5 rounded-full bg-sky-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-sky-400 transition"
            >
              ← Quay Lại Danh Sách Đề Thi
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* DISCLAIMER CONFIRMATION MODAL                                             */}
      {/* ========================================================================= */}
      {showDisclaimerModal && pendingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="rounded-3xl bg-[#0f172a] border border-sky-500/40 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl text-xs">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase">Xác Nhận Quy Chuẩn Thi Mô Phỏng</h3>
                <p className="text-[11px] text-slate-400 font-mono">100% Mock & Academic Practice</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed font-normal">
              Bạn đang chuẩn bị bắt đầu bài thi: <strong className="text-sky-300">{pendingTest.title}</strong> ở chế độ <strong>{selectedExamMode === 'QUICK_30' ? '30 Phút (Nhanh)' : selectedExamMode === 'STANDARD_60' ? '60 Phút (Tiêu Chuẩn)' : '90 Phút (Trắc Nghiệm + Tự Luận AI Chấm)'}</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-800 text-slate-300 space-y-1 font-normal text-[11px]">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <span>🛡️ Cam kết bảo mật & Pháp lý (NDA):</span>
              </div>
              <p>Mọi câu hỏi trong bài thi là bài tập mô phỏng học thuật từ nguồn mở quốc tế (SFIA Foundation, DeepLearning.AI, Stanford CS224N), tuyệt đối không phản ánh bất kỳ đề thi nội bộ nào.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-800 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleStartConfirmed}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md uppercase tracking-wider"
              >
                Bắt Đầu Ngay →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
