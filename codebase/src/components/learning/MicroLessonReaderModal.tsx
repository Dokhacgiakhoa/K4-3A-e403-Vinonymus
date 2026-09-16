'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Clock, 
  Layers, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle, 
  Lightbulb, 
  Copy, 
  Check, 
  GraduationCap, 
  ChevronRight,
  BrainCircuit,
  Flame,
  HelpCircle
} from 'lucide-react';
import type { MicroLesson, MicroQuizQuestion } from '@/data/MicroCurriculumData';
import { emitLearningActivity } from '@/lib/study-timer';

interface MicroLessonReaderModalProps {
  lesson: MicroLesson;
  onClose: () => void;
  onCompleted?: (lessonId: string, minutesEarned: number) => void;
}

type TabMode = 'LECTURE' | 'ASSESSMENT';

export function MicroLessonReaderModal({ lesson, onClose, onCompleted }: MicroLessonReaderModalProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('LECTURE');
  const [mounted, setMounted] = useState<boolean>(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Ghi nhận bắt đầu đọc bài học
    emitLearningActivity(5);
  }, []);

  if (!mounted) return null;

  const totalQuestions = lesson.quizQuestions.length;
  const currentQuestion = lesson.quizQuestions[currentQuestionIndex];
  const passingScore = Math.ceil(totalQuestions * 0.7);
  const isPassed = score >= passingScore;

  const handleCopyCode = (code: string, idx: number) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCodeIndex(idx);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !currentQuestion || isAnswerChecked) return;
    const correct = selectedOption === currentQuestion.correctOption;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      setIsQuizFinished(true);
      if (score + (isCorrect ? 0 : 0) >= passingScore) {
        // Lưu tiến độ hoàn thành
        try {
          const saved = localStorage.getItem('aiia_completed_lessons');
          const completedList: string[] = saved ? JSON.parse(saved) : [];
          if (!completedList.includes(lesson.id)) {
            completedList.push(lesson.id);
            localStorage.setItem('aiia_completed_lessons', JSON.stringify(completedList));
          }
          emitLearningActivity(lesson.estimatedMinutes);
          onCompleted?.(lesson.id, lesson.estimatedMinutes);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setIsQuizFinished(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#080d1e] border border-cyan-500/30 shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              {lesson.subjectTitle}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 text-xs font-semibold border border-purple-500/30">
              {lesson.levelCode} • Bloom: {lesson.bloomLevel}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {lesson.estimatedMinutes} phút
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60">
              <button
                onClick={() => setActiveTab('LECTURE')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'LECTURE'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Bài Giảng
              </button>
              <button
                onClick={() => setActiveTab('ASSESSMENT')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'ASSESSMENT'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Kiểm Tra ({lesson.quizQuestions.length} câu)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-200">
          
          {activeTab === 'LECTURE' ? (
            <div className="space-y-6">
              {/* Title & Summary */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {lesson.title}
                </h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none prose-headings:text-cyan-300 prose-headings:font-bold prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-amber-300 prose-code:text-cyan-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                <div className="whitespace-pre-line text-sm text-slate-300 space-y-4">
                  {lesson.contentMarkdown}
                </div>
              </div>

              {/* Code Snippets */}
              {lesson.codeSnippets && lesson.codeSnippets.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    Mã Nguồn Minh Họa Thực Tế
                  </h3>
                  {lesson.codeSnippets.map((snippet, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-[#060a14] shadow-lg">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs">
                        <span className="font-mono text-cyan-300 font-bold">{snippet.title}</span>
                        <button
                          onClick={() => handleCopyCode(snippet.code, idx)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedCodeIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Takeaways & Gotchas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl p-4 bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    Điểm Cốt Lõi Cần Nhớ
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-100/90 list-disc list-inside">
                    {lesson.keyTakeaways.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Bẫy Lỗi (Gotchas / Anti-patterns)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-100/90 list-disc list-inside">
                    {lesson.gotchas.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* ASSESSMENT TAB                                                            */
            /* ========================================================================= */
            <div className="space-y-6">
              {!isQuizFinished ? (
                currentQuestion && (
                  <div className="space-y-5">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}</span>
                        <span>Độ khó: <strong className="text-cyan-300">{currentQuestion.difficulty}</strong></span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Prompt */}
                    <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 space-y-3">
                      <p className="text-base font-bold text-white leading-snug">
                        {currentQuestion.prompt}
                      </p>
                      {currentQuestion.codeSnippet && (
                        <pre className="p-3 rounded-lg bg-black/60 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800">
                          <code>{currentQuestion.codeSnippet}</code>
                        </pre>
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {currentQuestion.options.map(opt => {
                        let btnStyle = "border-slate-800 bg-slate-900/50 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60";
                        if (selectedOption === opt.id) {
                          btnStyle = "border-cyan-500 bg-cyan-500/15 text-cyan-200 ring-2 ring-cyan-500/30";
                        }
                        if (isAnswerChecked) {
                          if (opt.id === currentQuestion.correctOption) {
                            btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-500/40";
                          } else if (selectedOption === opt.id && !isCorrect) {
                            btnStyle = "border-rose-500 bg-rose-500/20 text-rose-200 ring-2 ring-rose-500/40";
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption(opt.id)}
                            disabled={isAnswerChecked}
                            className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                              {opt.id}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Feedback */}
                    {isAnswerChecked && (
                      <div className={`rounded-xl p-4 border text-xs leading-relaxed animate-fadeIn ${
                        isCorrect 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      }`}>
                        <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Chính xác!
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                              Chưa đúng! Đáp án chính xác là {currentQuestion.correctOption}.
                            </>
                          )}
                        </div>
                        <p>{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                )
              ) : (
                /* Quiz Finished Screen */
                <div className="text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    {isPassed ? '🎉 Chúc Mừng Bạn Đã Hoàn Thành!' : '⚡ Cần Cố Gắng Thêm!'}
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Bạn đạt <strong className="text-cyan-300">{score}/{totalQuestions}</strong> câu đúng 
                    ({Math.round((score / totalQuestions) * 100)}%). 
                    {isPassed 
                      ? ' Bạn đã nắm vững các khái niệm của bài học này và mở khóa thành công!' 
                      : ' Bạn cần đạt tối thiểu 70% để hoàn thành bài. Hãy ôn lại bài giảng và thử lại nhé!'}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-sm flex items-center justify-between">
          {activeTab === 'LECTURE' ? (
            <>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Đọc kỹ lý thuyết trước khi làm bài kiểm tra</span>
              </div>
              <button
                onClick={() => setActiveTab('ASSESSMENT')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg transition-all"
              >
                <span>Làm Bài Kiểm Tra Đánh Giá</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {!isQuizFinished ? (
                <>
                  <button
                    onClick={() => setActiveTab('LECTURE')}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    ← Quay lại xem bài giảng
                  </button>
                  <div>
                    {!isAnswerChecked ? (
                      <button
                        onClick={handleCheckAnswer}
                        disabled={!selectedOption}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Kiểm Tra Đáp Án
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm hover:brightness-110 transition-all"
                      >
                        <span>{currentQuestionIndex + 1 === totalQuestions ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <button
                    onClick={handleRetryQuiz}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Làm Lại Quiz
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition-all"
                  >
                    Đóng Và Tiếp Tục Học
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
