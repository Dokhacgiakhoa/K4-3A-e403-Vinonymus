'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Briefcase, 
  Code, 
  Database, 
  GraduationCap, 
  Clock, 
  Target, 
  Zap, 
  BrainCircuit, 
  Award,
  Bot,
  Layers,
  Flame,
  BookOpen,
  RotateCcw,
  Check,
  UploadCloud,
  FileCheck,
  FileText,
  X,
  Paperclip
} from 'lucide-react';
import type { 
  PersonalizedRoadmap, 
  BackgroundType, 
  AdaptiveQuestion, 
  AdaptiveAnswer, 
  UserProfileInput
} from '@/types/roadmap';
import { 
  generateAdaptiveQuestions, 
  synthesizePersonalizedRoadmap 
} from '@/lib/roadmap-ai-engine';
import { clientStorage, type StoredUser } from '@/lib/client-storage';

interface AIMentorWizardProps {
  onRoadmapGenerated?: (roadmap: PersonalizedRoadmap) => void;
  onCancel?: () => void;
}

export function AIMentorWizard({ onRoadmapGenerated, onCancel }: AIMentorWizardProps) {
  // Wizard Steps: 1: Background & CV/Bio, 2: Commitment, 3: Core Goal, 4: AI Adaptive Questions, 5: Generated Roadmap
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // User Profile: CV & Bio
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<{ name: string; size: string; content?: string } | null>(null);
  const [userBio, setUserBio] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [syncedUser, setSyncedUser] = useState<StoredUser | null>(null);

  // Baseline Form State
  const [background, setBackground] = useState<BackgroundType>('software_dev');
  const [weeklyHours, setWeeklyHours] = useState<number>(15);
  const [coreGoal, setCoreGoal] = useState<string>('build_saas');

  // Adaptive Questions State
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<AdaptiveQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AdaptiveAnswer>>({});
  const [customNotes, setCustomNotes] = useState<string>('');

  // Generated Roadmap State
  const [generatedRoadmap, setGeneratedRoadmap] = useState<PersonalizedRoadmap | null>(null);

  // Load existing roadmap from localStorage on mount if present, and sync user account info
  useEffect(() => {
    try {
      // 1. Đồng bộ thông tin hồ sơ tài khoản
      const user = clientStorage.getUser();
      if (user) {
        setSyncedUser(user);

        // Tự động điền nền tảng nếu có
        if (
          user.backgroundType && 
          user.backgroundType !== 'undetermined' && 
          user.backgroundType !== 'other'
        ) {
          setBackground(user.backgroundType as BackgroundType);
        }

        // Tự động điền quỹ thời gian nếu có
        if (user.weeklyHoursBudget && user.weeklyHoursBudget > 0) {
          setWeeklyHours(user.weeklyHoursBudget);
        }

        // Tự động điền mục tiêu nếu có
        if (user.primaryGoal) {
          setCoreGoal(user.primaryGoal);
        }

        // Tự động điền CV đã tải lên trong tài khoản
        if (user.uploadedCvName) {
          setCvFile({
            name: user.uploadedCvName,
            size: 'Đã lưu trong hồ sơ tài khoản',
            content: user.rawInputContent || user.uploadedCvExtractedSummary || `[Hồ sơ CV: ${user.uploadedCvName}]`
          });
        }

        // Điền mô tả nếu có
        if (user.rawInputContent && !user.uploadedCvName) {
          setUserBio(user.rawInputContent);
        }
      }

      // 2. Nạp lộ trình đã sinh trước đó
      const saved = localStorage.getItem('aiia_personalized_roadmap');
      if (saved) {
        const parsed = JSON.parse(saved) as PersonalizedRoadmap;
        if (parsed?.milestones?.length) {
          setGeneratedRoadmap(parsed);
          setStep(5);
        }
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    // Đọc nội dung nếu là file text/markdown, hoặc lấy metadata cho PDF/DOC
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        setCvFile({ name: file.name, size: sizeStr, content: text });
      };
      reader.readAsText(file);
    } else {
      // PDF hoặc định dạng khác
      setCvFile({ name: file.name, size: sizeStr, content: `[Tập tin CV: ${file.name}]` });
    }
  };

  const backgroundOptions = [
    {
      id: 'software_dev' as BackgroundType,
      title: 'Software Developer (FE/BE/Fullstack)',
      desc: 'Đã biết lập trình (JS/TS, Python, C#, Java...), muốn chuyển dịch sang AI Engineer / RAG.',
      icon: Code,
      badge: 'Phù hợp AI Engineering'
    },
    {
      id: 'non_tech' as BackgroundType,
      title: 'Non-Tech / PM / BA / Vận Hành',
      desc: 'Chưa có nền tảng lập trình sâu, muốn hiểu tư duy AI Product, Prompting & tự động hóa.',
      icon: Briefcase,
      badge: 'Phù hợp AI Product'
    },
    {
      id: 'data_analyst' as BackgroundType,
      title: 'Data Analyst / Data Specialist',
      desc: 'Quen thuộc với SQL, Python data, muốn làm chủ Data Pipeline, Vector DB & Text-to-SQL.',
      icon: Database,
      badge: 'Phù hợp AI Data & Infra'
    },
    {
      id: 'student' as BackgroundType,
      title: 'Sinh Viên / Người Mới Bắt Đầu',
      desc: 'Muốn học bài bản từ L0 theo chuẩn quốc tế SFIA để xây dựng CV tuyển dụng.',
      icon: GraduationCap,
      badge: 'Chuẩn SFIA 8 Quốc Tế'
    }
  ];

  const commitmentOptions = [
    {
      hours: 5,
      title: '5 - 7 Giờ / Tuần (Bận rộn)',
      desc: 'Mỗi ngày 30 - 45 phút. AI Mentor sẽ tinh gọn 70% lý thuyết dài dòng, chỉ học kiến thức cốt lõi.',
      tag: 'Bite-Sized Sprint'
    },
    {
      hours: 15,
      title: '15 - 20 Giờ / Tuần (Tập trung)',
      desc: 'Mỗi ngày 2 tiếng. Cân bằng hoàn hảo giữa kiến trúc, toán học và 12 bài Lab thực hành.',
      tag: 'Khuyên Dùng ⭐'
    },
    {
      hours: 40,
      title: '35 - 40 Giờ / Tuần (Bootcamp Tốc Độ Cao)',
      desc: 'Toàn thời gian. Hoàn thành trọn bộ 12 Modules và xây dựng Enterprise Portfolio trong 30 ngày.',
      tag: 'Intensive Track'
    }
  ];

  const goalOptions = [
    {
      id: 'build_saas',
      title: 'Xây Dựng AI Agent & Khởi Nghiệp AI SaaS',
      desc: 'Làm chủ RAG, Multi-Agent LangGraph, Function Calling và triển khai sản phẩm thương mại.',
      icon: Zap
    },
    {
      id: 'career_ai_engineer',
      title: 'Chuyển Việc Trở Thành AI Solution Architect / AI Engineer',
      desc: 'Nắm chắc kiến trúc Transformer, HNSW Vector Search, Fine-tuning LoRA và MLOps Cloud.',
      icon: BrainCircuit
    },
    {
      id: 'automation_work',
      title: 'Tự Động Hóa Công Việc & Tối Ưu Quy Trình Doanh Nghiệp',
      desc: 'Ứng dụng Prompt Engineering chuyên sâu, tích hợp API, tư duy PRD & giảm thiểu chi phí token.',
      icon: Target
    },
    {
      id: 'sfia_certification',
      title: 'Đạt Chuẩn Năng Lực Quốc Tế SFIA 8 (Level 2 - 4)',
      desc: 'Luyện đề thi Mock Tests L1-L4 có chấm điểm, rà soát lỗ hổng và nhận chứng chỉ định danh.',
      icon: Award
    }
  ];

  // Chuyển từ Bước 3 sang Bước 4 (Kích hoạt phân tích AI)
  const handleProceedToAnalysis = () => {
    setIsAnalyzing(true);

    // Thu thập profile của user (CV, Bio và thông tin tài khoản đã đồng bộ)
    const profileInput: UserProfileInput = {
      cvFileName: cvFile?.name || syncedUser?.uploadedCvName,
      cvFileSize: cvFile?.size,
      cvContentText: cvFile?.content || syncedUser?.uploadedCvExtractedSummary || syncedUser?.rawInputContent,
      bioDescription: [
        userBio.trim(),
        syncedUser?.verifiedSkills?.length ? `Kỹ năng đã xác minh: ${syncedUser.verifiedSkills.join(', ')}` : '',
        syncedUser?.identifiedGaps?.length ? `Lỗ hổng kỹ năng cần bổ sung: ${syncedUser.identifiedGaps.join(', ')}` : '',
        syncedUser?.currentSfiaLevel ? `Cấp độ SFIA hiện tại: ${syncedUser.currentSfiaLevel}` : ''
      ].filter(Boolean).join('\n') || undefined
    };

    // Giả lập AI phân tích profile và sinh câu hỏi thích ứng
    setTimeout(() => {
      const generated = generateAdaptiveQuestions(background, coreGoal, weeklyHours, profileInput);
      setAdaptiveQuestions(generated);

      // Khởi tạo câu trả lời mặc định cho các câu hỏi thích ứng
      const initialAnswers: Record<string, AdaptiveAnswer> = {};
      generated.forEach(q => {
        const firstOpt = q.options[0];
        if (firstOpt) {
          initialAnswers[q.id] = {
            questionId: q.id,
            selectedOptionId: firstOpt.id
          };
        }
      });
      setAnswers(initialAnswers);

      setIsAnalyzing(false);
      setStep(4);
    }, 1200);
  };

  // Chọn option cho câu hỏi thích ứng
  const handleSelectAdaptiveOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        selectedOptionId: optionId
      }
    }));
  };

  // Tổng hợp lộ trình 4 Sprints độc bản (Bước 4 -> Bước 5)
  const handleSynthesizeRoadmap = () => {
    setIsSynthesizing(true);

    setTimeout(() => {
      // Cập nhật custom notes vào câu trả lời
      const finalAnswers = { ...answers };
      const firstQ = adaptiveQuestions[0];
      if (customNotes.trim() && firstQ) {
        const existingAns = finalAnswers[firstQ.id];
        finalAnswers[firstQ.id] = {
          questionId: firstQ.id,
          selectedOptionId: existingAns?.selectedOptionId || (firstQ.options[0]?.id ?? ''),
          customText: customNotes.trim()
        };
      }

      const profileInput: UserProfileInput = {
        cvFileName: cvFile?.name || syncedUser?.uploadedCvName,
        cvFileSize: cvFile?.size,
        cvContentText: cvFile?.content || syncedUser?.uploadedCvExtractedSummary || syncedUser?.rawInputContent,
        bioDescription: [
          userBio.trim(),
          syncedUser?.verifiedSkills?.length ? `Kỹ năng đã xác minh: ${syncedUser.verifiedSkills.join(', ')}` : '',
          syncedUser?.identifiedGaps?.length ? `Lỗ hổng kỹ năng cần bổ sung: ${syncedUser.identifiedGaps.join(', ')}` : '',
          syncedUser?.currentSfiaLevel ? `Cấp độ SFIA hiện tại: ${syncedUser.currentSfiaLevel}` : ''
        ].filter(Boolean).join('\n') || undefined
      };

      const roadmap = synthesizePersonalizedRoadmap(background, coreGoal, weeklyHours, finalAnswers, profileInput);
      setGeneratedRoadmap(roadmap);

      try {
        localStorage.setItem('aiia_personalized_roadmap', JSON.stringify(roadmap));
      } catch (err) {
        console.error('Failed to save roadmap to localStorage', err);
      }

      setIsSynthesizing(false);
      setStep(5);
      if (onRoadmapGenerated) {
        onRoadmapGenerated(roadmap);
      }
    }, 1500);
  };

  const handleResetSurvey = () => {
    try {
      localStorage.removeItem('aiia_personalized_roadmap');
    } catch {
      // ignore
    }
    setGeneratedRoadmap(null);
    setCvFile(null);
    setUserBio('');
    setStep(1);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0b1329] border border-cyan-500/30 p-5 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-2xl font-sans">
      {/* Background Neon Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[11px] font-bold uppercase tracking-wider border border-cyan-500/20">
                AI MENTOR 1-ON-1
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {step <= 3 && `Giai đoạn 1: Nền Tảng (Bước ${step}/3)`}
                {step === 4 && 'Giai đoạn 2: AI Phỏng Vấn Cá Nhân Hóa'}
                {step === 5 && 'Giai đoạn 3: Lộ Trình 4 Sprints Độc Bản'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
              Khởi Tạo Lộ Trình Tự Học AI Cá Nhân Hóa
            </h2>
          </div>
        </div>

        {step === 5 && (
          <button
            onClick={handleResetSurvey}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khảo Sát Lại</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* THẺ ĐỒNG BỘ DỮ LIỆU TÀI KHOẢN & ĐỐI CHIẾU THƯ VIỆN HỌC TẬP MỞ             */}
      {/* ========================================================================= */}
      <div className="relative z-10 my-4 p-4 sm:p-5 rounded-2xl bg-[#080f24]/90 border border-sky-500/30 backdrop-blur-md shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 font-bold mt-0.5 sm:mt-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm">
                {syncedUser?.name ? `Học viên: ${syncedUser.name}` : 'Đối Chiếu Năng Lực Với Thư Viện Mở'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30">
                Đối Chiếu 12 Chuyên Đề SFIA
              </span>
              {syncedUser?.tier === 'Pro' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  PRO VIP
                </span>
              )}
            </div>
            <p className="text-slate-300 text-[11px] sm:text-xs mt-1 leading-relaxed">
              AI Mentor tự động trích xuất thông tin hồ sơ của bạn (CV, định hướng, kinh nghiệm), đối chiếu trực tiếp với <strong>12 Chuyên đề trong Thư viện học tập</strong> để lập lộ trình 4 Sprints may đo độc bản, bỏ qua phần bạn đã nắm vững và tập trung vào lỗ hổng cần nâng cao.
            </p>
          </div>
        </div>

        {syncedUser?.currentSfiaLevel && syncedUser.currentSfiaLevel !== 'undetermined' && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] shrink-0 text-center">
            Năng lực: SFIA {syncedUser.currentSfiaLevel}
          </div>
        )}
      </div>

      {/* Progress Bar (Chỉ hiển thị khi đang làm khảo sát steps 1-4) */}
      {step <= 4 && (
        <div className="relative z-10 my-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Tiến độ thiết lập</span>
            <span className="text-cyan-400 font-bold">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRẠNG THÁI CHỜ PHÂN TÍCH (AI ANALYZING STATE)                              */}
      {/* ========================================================================= */}
      {isAnalyzing && (
        <div className="py-16 text-center space-y-6 animate-fadeIn">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20 mx-auto">
              <BrainCircuit className="w-10 h-10 animate-spin text-cyan-400" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-wide">
              AI Mentor Đang Đối Chiếu Hồ Sơ & 12 Chuyên Đề Thư Viện...
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              {cvFile 
                ? `Đang đối chiếu dữ liệu CV "${cvFile.name}" và hồ sơ tài khoản với 12 Chuyên đề chuẩn SFIA (v8) trong Thư viện học tập...`
                : 'Đang đối chiếu mục tiêu và dữ liệu kinh nghiệm với 12 Chuyên đề chuẩn SFIA (v8) trong Thư viện học tập...'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRẠNG THÁI CHỜ TỔNG HỢP (AI SYNTHESIZING ROADMAP)                         */}
      {/* ========================================================================= */}
      {isSynthesizing && (
        <div className="py-16 text-center space-y-6 animate-fadeIn">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/20 mx-auto">
              <Sparkles className="w-10 h-10 animate-bounce text-indigo-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-wide">
              AI Mentor Đang Kiến Tạo Lộ Trình 4 Sprints...
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Đang tuyển chọn các chuyên đề tối ưu từ Thư viện học tập, cá nhân hóa theo năng lực thực tế của bạn và gán đề bài Boss Fight thực chiến.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 1: NẠP HỒ SƠ CV / TEXT & CHỌN NỀN TẢNG (BACKGROUND)                  */}
      {/* ========================================================================= */}
      {!isAnalyzing && !isSynthesizing && step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* PHẦN 1.1: TẢI LÊN CV HOẶC DÁN BIO KINH NGHIỆM */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#080f24] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Nạp Hồ Sơ Năng Lực Cho AI Mentor (CV / Giới Thiệu Bản Thân)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Giúp AI hiểu chính xác xuất phát điểm để may đo câu hỏi và đề bài Capstone
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Tùy Chọn / Khuyên Dùng ⭐
              </span>
            </div>

            {/* Input file ẩn */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />

            {/* Dropzone hoặc File Badge */}
            {cvFile ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/60 shadow-lg shadow-cyan-500/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                      <span>{cvFile.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">✅ Đã tải lên</span>
                    </div>
                    <div className="text-[11px] text-cyan-300/80 font-mono mt-0.5">
                      {cvFile.size} • AI Mentor đã sẵn sàng thẩm định kỹ năng từ file CV này
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCvFile(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0 ml-2"
                  title="Gỡ bỏ file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDragOver 
                    ? 'border-cyan-400 bg-cyan-500/15 scale-[1.01]' 
                    : 'border-slate-800 hover:border-cyan-500/40 bg-[#0b1329]/60 hover:bg-[#0b1329]'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-cyan-400">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Tải lên file CV của bạn (PDF / DOC / TXT)</span>
                    <span className="text-xs text-slate-400"> hoặc kéo thả file vào đây</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Tối đa 10MB • AI Mentor sẽ đọc kỹ năng, kinh nghiệm và dự án trong CV</p>
                </div>
              </div>
            )}

            {/* Textarea chia sẻ hồ sơ cá nhân */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Hoặc chia sẻ ngắn về bản thân, công việc & mục tiêu học AI:</span>
                <span className="text-[11px] text-slate-500 font-normal">Tự do chia sẻ</span>
              </label>
              <textarea
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                placeholder="Ví dụ: Mình là Backend Dev 2 năm kinh nghiệm với Java/Spring Boot và PostgreSQL, chưa từng học Python. Hiện tại muốn chuyển sang làm AI Engineer chuyên về RAG và Multi-Agent..."
                className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 min-h-[75px] resize-none leading-relaxed"
              />

              {/* Quick Template Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-mono mr-1">Điền mẫu nhanh:</span>
                <button
                  type="button"
                  onClick={() => {
                    setBackground('software_dev');
                    setUserBio('Tôi là Developer có 2 năm kinh nghiệm với TypeScript và Java, muốn học chuyên sâu về kiến trúc RAG, Vector Search và chuyển sang AI Engineer.');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition"
                >
                  💻 Dev 2 năm (Java/TS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBackground('non_tech');
                    setUserBio('Tôi làm Product Manager / BA, muốn học AI để tự động hóa tài liệu, viết PRD chuẩn và hiểu cách tính ROI dự án AI.');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition"
                >
                  📊 PM / Non-Tech
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBackground('student');
                    setUserBio('Tôi là sinh viên năm 3 ngành CNTT, muốn học bài bản chuẩn quốc tế SFIA và làm đồ án Capstone để chuẩn bị xin việc.');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition"
                >
                  🎓 Sinh viên CNTT
                </button>
              </div>
            </div>
          </div>

          {/* PHẦN 1.2: CHỌN NHÓM XUẤT PHÁT ĐIỂM CHÍNH */}
          <div>
            <h3 className="text-base font-bold text-white">
              Xác nhận nhóm xuất phát điểm chính của bạn:
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              AI Mentor sẽ điều chỉnh khung lý thuyết và ngôn ngữ thực hành phù hợp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {backgroundOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = background === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setBackground(opt.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                      : 'bg-[#0b1329]/60 border-slate-800 hover:border-slate-700 hover:bg-[#0b1329]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-end">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Tiếp tục (Chọn Thời Gian Học)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 2: CHỌN QUỸ THỜI GIAN HỌC MỖI TUẦN (COMMITMENT)                     */}
      {/* ========================================================================= */}
      {!isAnalyzing && !isSynthesizing && step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-white">
              2. Bạn có thể dành bao nhiêu thời gian mỗi tuần để tự học?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              AI Mentor sẽ chia nhỏ lộ trình thành các bài học vừa vặn với quỹ thời gian rảnh của bạn.
            </p>
          </div>

          <div className="space-y-3">
            {commitmentOptions.map((opt) => {
              const isSelected = weeklyHours === opt.hours;
              return (
                <div
                  key={opt.hours}
                  onClick={() => setWeeklyHours(opt.hours)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-[#0b1329]/60 border-slate-800 hover:border-slate-700 hover:bg-[#0b1329]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{opt.desc}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold uppercase transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 3: CHỌN MỤC TIÊU CỐT LÕI (CORE GOAL)                                 */}
      {/* ========================================================================= */}
      {!isAnalyzing && !isSynthesizing && step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-white">
              3. Mục tiêu lớn nhất của bạn khi hoàn thành lộ trình là gì?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              AI Mentor sẽ định hình toàn bộ đề tài thực chiến và bài thi năng lực tốt nghiệp theo mục tiêu này.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goalOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = coreGoal === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setCoreGoal(opt.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                      : 'bg-[#0b1329]/60 border-slate-800 hover:border-slate-700 hover:bg-[#0b1329]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2">{opt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{opt.desc}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-end">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold uppercase transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={handleProceedToAnalysis}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gửi AI Phân Tích & Phỏng Vấn →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 4: AI PHỎNG VẤN CÁ NHÂN HÓA (ADAPTIVE DEEP-DIVE QUESTIONS)          */}
      {/* ========================================================================= */}
      {!isAnalyzing && !isSynthesizing && step === 4 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Diagnostic Note */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
            <Bot className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-300 uppercase tracking-wider font-mono">
                  AI Chẩn Đoán Hồ Sơ
                </span>
                {cvFile && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    📄 Đã đọc CV: {cvFile.name}
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">
                Dựa trên {cvFile ? `hồ sơ CV và ` : ''}xuất phát điểm <strong>{backgroundOptions.find(b => b.id === background)?.title.split('(')[0]}</strong>, AI Mentor cần hỏi thêm bạn {adaptiveQuestions.length} câu hỏi đào sâu sau đây để may đo lộ trình chính xác nhất.
              </p>
            </div>
          </div>

          {/* Adaptive Questions List */}
          <div className="space-y-6">
            {adaptiveQuestions.map((q, idx) => {
              const currentAns = answers[q.id]?.selectedOptionId;
              return (
                <div key={q.id} className="p-5 rounded-2xl bg-[#080f24] border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                        Câu Hỏi Chuyên Sâu 0{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{q.question}</h4>
                    <p className="text-xs text-slate-400">{q.contextNote}</p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = currentAns === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectAdaptiveOption(q.id, opt.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-bold text-white">{opt.label}</span>
                              {opt.tag && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 shrink-0">
                                  {opt.tag}
                                </span>
                              )}
                            </div>
                            {opt.description && (
                              <p className="text-[11px] text-slate-400 leading-relaxed">{opt.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-end mt-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Custom Notes Input */}
            <div className="p-4 rounded-2xl bg-[#080f24] border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bạn có dự án hoặc nguyện vọng đặc thù nào muốn AI giải quyết không? (Không bắt buộc)</span>
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ví dụ: Mình muốn xây dựng bot tra cứu văn bản pháp luật cho công ty bất động sản, tích hợp vào Telegram..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 min-h-[70px] resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold uppercase transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={handleSynthesizeRoadmap}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Tổng Hợp Lộ Trình 4 Sprints Độc Bản →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 5: HIỂN THỊ LỘ TRÌNH 4 SPRINTS ĐỘC BẢN (GENERATED ROADMAP VIEW)       */}
      {/* ========================================================================= */}
      {!isAnalyzing && !isSynthesizing && step === 5 && generatedRoadmap && (
        <div className="space-y-8 animate-fadeIn">
          {/* AI Mentor 1-on-1 Advice Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/40 to-sky-950/40 border border-cyan-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lời Khuyên Cố Vấn 1-on-1 Từ AI Mentor</h4>
                  <p className="text-[11px] text-cyan-300 font-mono">Đối chiếu hồ sơ tài khoản & 12 Chuyên đề Thư viện học tập</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  #Thư-Viện-12-Modules
                </span>
                {generatedRoadmap.personalized_tags?.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/40 p-4 rounded-2xl border border-slate-800 whitespace-pre-line">
              &quot;{generatedRoadmap.ai_mentor_advice}&quot;
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#080e21] border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Thời lượng</div>
                <div className="text-sm font-bold text-cyan-400 font-mono">8 Tuần (2 Tháng)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080e21] border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Quỹ thời gian</div>
                <div className="text-sm font-bold text-indigo-400 font-mono">{generatedRoadmap.weekly_hours_budget} Giờ / Tuần</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080e21] border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Tổng mục tiêu</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">{generatedRoadmap.total_target_hours} Giờ Học</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080e21] border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Chuẩn Quốc Tế</div>
                <div className="text-sm font-bold text-amber-400 font-mono">SFIA 8 (L1-L4)</div>
              </div>
            </div>
          </div>

          {/* 4 Milestones Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>4 Chặng Sprints May Đo Riêng Cho Bạn</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Tuần tự vượt ải</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedRoadmap.milestones.map((ms) => (
                <div 
                  key={ms.id}
                  className="p-5 rounded-2xl bg-[#080f24] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold">
                        Sprint {ms.sprint_number} • {ms.target_days} Ngày
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ms.selected_lesson_ids.length} Chuyên đề
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{ms.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{ms.description}</p>
                  </div>

                  {/* Boss Fight Task */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[10px] uppercase font-mono">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Thử Thách Boss Fight:</span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                      {ms.boss_fight_task}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Call to Learn */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Lộ trình đã sẵn sàng trên Bàn học của bạn!</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Hãy bắt đầu với Sprint 1 ngay hôm nay để tích lũy những giờ học đầu tiên trong hành trình 1000h.
              </p>
            </div>

            <button
              onClick={() => {
                if (onRoadmapGenerated && generatedRoadmap) {
                  onRoadmapGenerated(generatedRoadmap);
                }
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-2 shadow-lg shadow-cyan-500/20 self-start sm:self-auto"
            >
              <BookOpen className="w-4 h-4" />
              <span>Bắt Đầu Học Sprint 1 Ngay →</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
