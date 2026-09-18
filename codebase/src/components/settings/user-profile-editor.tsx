'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientStorage, type StoredUser, type SkillVerificationStatus } from '@/lib/client-storage';
import { 
  User, 
  Mail, 
  Crown, 
  Sparkles, 
  Brain, 
  Target, 
  Clock, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Award, 
  BookOpen, 
  TrendingUp, 
  LogOut,
  Zap,
  Lock,
  FileCode2,
  FileImage,
  Send,
  HelpCircle,
  X,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface UserProfileEditorProps {
  onLogout: () => void;
}

interface DiagnosticQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctOption: string;
  skillTag: string;
  explanation: string;
}

interface CvDiagnosticApiQuestion {
  skillId: string;
  question: string;
  choices: { text: string }[];
  correctChoiceIndex: number;
  explanation: string;
}

interface CvDiagnosticApiResponse {
  source: 'ai' | 'rules';
  analysis: {
    profileSummary: string;
    knownSkills: { skillId: string }[];
    weakSkillIds: string[];
  };
  questions: CvDiagnosticApiQuestion[];
}

const SAMPLE_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: "Trong Python, khi truyền một `list` vào hàm và thực hiện `lst.append(10)`, điều gì thực sự xảy ra trong bộ nhớ RAM?",
    options: [
      { id: 'A', text: 'Python tạo một bản sao mới (Pass-by-value), danh sách gốc bên ngoài hàm không đổi' },
      { id: 'B', text: 'Python truyền tham chiếu đối tượng (Pass-by-object-reference), làm biến đổi trực tiếp danh sách trên Heap' },
      { id: 'C', text: 'Hàm trả về lỗi do danh sách là kiểu dữ liệu bất biến (Immutable)' },
      { id: 'D', text: 'Python tự động cấp phát lại ô nhớ trên Stack và giải phóng Heap' }
    ],
    correctOption: 'B',
    skillTag: 'Python Memory Model',
    explanation: 'Python sử dụng Pass-by-object-reference. List là mutable object trên Heap nên mọi thao tác append sẽ thay đổi trực tiếp vùng nhớ gốc.'
  },
  {
    id: 2,
    question: "Tại sao thuật toán Tokenizer BPE (Byte-Pair Encoding) lại tối ưu hơn Tokenizer chia từ theo khoảng trắng (Word-level)?",
    options: [
      { id: 'A', text: 'Vì BPE loại bỏ hoàn toàn các ký tự dấu câu và emoji để tiết kiệm dung lượng' },
      { id: 'B', text: 'Vì BPE giải quyết triệt để từ hiếm (OOV - Out of Vocabulary) bằng cách chia từ thành các subwords nhỏ hơn' },
      { id: 'C', text: 'Vì BPE dịch toàn bộ văn bản sang mã nhị phân 0 và 1 trước khi đưa vào LLM' },
      { id: 'D', text: 'Vì BPE chỉ hỗ trợ bảng chữ cái tiếng Anh nên tốc độ xử lý nhanh gấp đôi' }
    ],
    correctOption: 'B',
    skillTag: 'LLM Tokenization & BPE',
    explanation: 'BPE gom cụm các cặp byte xuất hiện nhiều nhất thành subwords, giúp biểu diễn bất kỳ từ mới nào mà không bị lỗi Out of Vocabulary.'
  },
  {
    id: 3,
    question: "Công thức Attention của Transformer là QK^T / sqrt(d_k). Vai trò cốt lõi của việc chia cho căn bậc 2 của d_k (sqrt(d_k)) là gì?",
    options: [
      { id: 'A', text: 'Giảm số lượng tham số cần huấn luyện của mô hình đi 50%' },
      { id: 'B', text: 'Tránh hiện tượng tích vô hướng quá lớn làm Gradient của hàm Softmax bị bão hòa triệt tiêu (Vanishing Gradient)' },
      { id: 'C', text: 'Chuyển đổi ma trận Attention về dạng ma trận tam giác dưới' },
      { id: 'D', text: 'Mã hóa vị trí không gian (Positional Encoding) của các tokens trong chuỗi' }
    ],
    correctOption: 'B',
    skillTag: 'Transformer Attention Math',
    explanation: 'Khi d_k lớn, tích QK^T tăng độ biến thiên, đẩy Softmax về các vùng có đạo hàm cực nhỏ (vanishing gradient). Chia sqrt(d_k) giúp ổn định phương sai.'
  },
  {
    id: 4,
    question: "Khi xây dựng hệ thống Hybrid RAG, Reciprocal Rank Fusion (RRF) kết hợp kết quả tìm kiếm như thế nào?",
    options: [
      { id: 'A', text: 'Lấy trung bình cộng Cosine Similarity của Dense Vector và Sparse BM25' },
      { id: 'B', text: 'Tính điểm tổng hợp nghịch đảo dựa trên thứ hạng (Rank) của tài liệu: score = sum(1 / (k + rank_i))' },
      { id: 'C', text: 'Chỉ lấy 5 tài liệu có điểm Cosine cao nhất và loại bỏ hoàn toàn từ khóa BM25' },
      { id: 'D', text: 'Gửi toàn bộ tài liệu cho LLM tự đọc và chọn lọc' }
    ],
    correctOption: 'B',
    skillTag: 'Hybrid RAG & Vector Search',
    explanation: 'RRF là thuật toán xếp hạng phi tham số, dựa vào thứ tự xếp hạng (1/(k+rank)) để dung hòa giữa tìm kiếm ngữ nghĩa và từ khóa chính xác.'
  },
  {
    id: 5,
    question: "Kỹ thuật LoRA (Low-Rank Adaptation) trong Fine-tuning PEFT giúp giảm tải bộ nhớ bằng cách nào?",
    options: [
      { id: 'A', text: 'Xóa bớt 90% số lớp Attention trong mô hình gốc' },
      { id: 'B', text: 'Đóng băng trọng số gốc W0 và phân rã ma trận cập nhật Delta W thành tích hai ma trận hạng thấp: B * A (r << d)' },
      { id: 'C', text: 'Lượng tử hóa mô hình từ FP32 xuống INT1 (1-bit)' },
      { id: 'D', text: 'Chỉ huấn luyện các token xuất hiện trong tập dữ liệu tiếng Việt' }
    ],
    correctOption: 'B',
    skillTag: 'Fine-Tuning PEFT & LoRA',
    explanation: 'LoRA giữ nguyên W0, chỉ huấn luyện 2 ma trận nhỏ A và B với rank r rất nhỏ (r=8, 16), giảm 95% tham số cần cập nhật.'
  }
];

export function UserProfileEditor({ onLogout }: UserProfileEditorProps) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // User Editable Only
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  // Multimodal Input Mode
  const [inputType, setInputType] = useState<'text' | 'pdf' | 'image'>('text');
  const [rawTextInput, setRawTextInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Diagnostic Quiz Modal State
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>(SAMPLE_DIAGNOSTIC_QUESTIONS);

  useEffect(() => {
    const current = clientStorage.getUser();
    if (current) {
      setUser(current);
      setName(current.name || '');
      setAvatar(current.avatar || '');
    }
  }, []);

  // 1. Save editable basic info
  const handleSaveBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: StoredUser = {
      ...user,
      name,
      avatar
    };

    clientStorage.setUser(updatedUser);
    setUser(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // 2. AI Multimodal Ingestion Handler
  const handleProcessMultimodalData = () => {
    if (inputType === 'text' && !rawTextInput.trim()) {
      alert('Vui lòng nhập văn bản mô tả kinh nghiệm hoặc dự án của bạn.');
      return;
    }

    setIsAiProcessing(true);
    const cvText =
      inputType === 'text'
        ? rawTextInput
        : `Hoc vien tai len ${inputType.toUpperCase()}: ${
            uploadedFileName || (inputType === 'pdf' ? 'CV_KySu_AI_2026.pdf' : 'BangDiem_ChungChi.png')
          }. Can AI Mentor phan tich CV va tao bai test nang luc online.`;
    void fetch('/api/ai-mentor/cv-diagnostic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: user?.email || 'current-user',
        lab_id: 'lab-prompt-tool-calling',
        cv_text: cvText,
        goal: 'Tao bai test chan doan nang luc tu ho so hoc vien',
        max_questions: 5,
      }),
    })
      .then((response) => (response.ok ? response.json() as Promise<CvDiagnosticApiResponse> : null))
      .then((result) => {
        if (!result) return;
        setDiagnosticQuestions(result.questions.map((question, questionIndex) => ({
          id: questionIndex + 1,
          question: question.question,
          options: question.choices.map((choice, choiceIndex) => ({
            id: String.fromCharCode(65 + choiceIndex),
            text: choice.text,
          })),
          correctOption: String.fromCharCode(65 + question.correctChoiceIndex),
          skillTag: question.skillId,
          explanation: question.explanation,
        })));
      })
      .catch(() => setDiagnosticQuestions(SAMPLE_DIAGNOSTIC_QUESTIONS));
    setTimeout(() => {
      setIsAiProcessing(false);
      const isDevClaim = rawTextInput.toLowerCase().includes('python') || rawTextInput.toLowerCase().includes('code') || inputType === 'pdf';

      const updatedUser: StoredUser = {
        ...user!,
        name,
        verificationStatus: 'pending_verification',
        rawInputType: inputType,
        rawInputContent: inputType === 'text' ? rawTextInput : undefined,
        uploadedCvName: inputType === 'pdf' ? (uploadedFileName || 'CV_KySu_AI_2026.pdf') : (inputType === 'image' ? (uploadedFileName || 'BangDiem_ChungChi.png') : undefined),
        backgroundType: isDevClaim ? 'software_dev' : 'non_tech',
        targetSfiaLevel: isDevClaim ? 'L3' : 'L2',
        currentSfiaLevel: 'undetermined',
        learningStyle: isDevClaim ? 'hands_on' : 'gamified',
        weeklyHoursBudget: 15,
        primaryGoal: inputType === 'text' ? rawTextInput.slice(0, 100) : 'Trở thành Kỹ sư Trí tuệ Nhân tạo thực chiến chuẩn SFIA',
        claimedSkills: isDevClaim 
          ? ['Python Lập Trình Cơ Bản', 'Tư Duy Thuật Toán', 'Gọi LLM API', 'Kiến Thức RAG & Vector'] 
          : ['Tư duy Prompt Engineering', 'Giao tiếp & Ứng dụng AI vào Doanh nghiệp'],
        uploadedCvExtractedSummary: `AI Ingestion (${new Date().toLocaleDateString('vi-VN')}): Đã tiếp nhận và trích xuất dữ liệu. Học viên tự khai báo có nền tảng ${isDevClaim ? 'Lập trình / Backend' : 'Non-tech / Kinh doanh'}. Dữ liệu chưa qua kiểm chứng - Cần làm bài test để sàng lọc Vibe Coding.`
      };

      clientStorage.setUser(updatedUser);
      setUser(updatedUser);
    }, 1500);
  };

  // 3. Diagnostic Quiz Submit
  const handleDiagnosticQuizSubmit = () => {
    let correct = 0;
    const verified: string[] = [];
    const gaps: string[] = [];

    diagnosticQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctOption) {
        correct++;
        verified.push(q.skillTag);
      } else {
        gaps.push(q.skillTag);
      }
    });

    const scorePercent = Math.round((correct / diagnosticQuestions.length) * 100);
    setQuizScore(scorePercent);
    setQuizSubmitted(true);

    const isVerified = scorePercent >= 80;

    const updatedUser: StoredUser = {
      ...user!,
      verificationStatus: isVerified ? 'verified' : 'pending_verification',
      currentSfiaLevel: scorePercent >= 80 ? 'L3' : (scorePercent >= 40 ? 'L2' : 'L1'),
      diagnosticScore: scorePercent,
      diagnosticTestDate: new Date().toLocaleDateString('vi-VN'),
      verifiedSkills: verified,
      identifiedGaps: gaps,
      uploadedCvExtractedSummary: isVerified
        ? `✅ Đã thẩm định thực tế (${new Date().toLocaleDateString('vi-VN')}): Điểm khảo thí ${scorePercent}/100. Đạt chuẩn SFIA L3, không có hiện tượng Vibe Coding. Đủ điều kiện lược bớt các module cơ bản.`
        : `⚠️ Cảnh báo Vibe Coding (${new Date().toLocaleDateString('vi-VN')}): Điểm khảo thí ${scorePercent}/100. Phát hiện hổng kiến thức nền tảng (${gaps.join(', ')}). AI Mentor bắt buộc giữ lại các Module Python & Thuật toán trong Lộ trình để đào tạo lại từ gốc.`
    };

    clientStorage.setUser(updatedUser);
    setUser(updatedUser);
  };

  if (!user) {
    return (
      <div className="p-8 rounded-3xl bg-[#0f172a] border border-slate-800 text-center space-y-4 shadow-xl max-w-xl mx-auto">
        <User className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-base font-bold text-white">Chưa Đăng Nhập Tài Khoản</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Hãy đăng nhập để nạp hồ sơ năng lực và kích hoạt hệ thống AI Mentor xác thực lộ trình học.
        </p>
        <Link
          href="/learning"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
        >
          Đến Trang Học Để Đăng Nhập
        </Link>
      </div>
    );
  }

  const vStatus: SkillVerificationStatus = user.verificationStatus || 'undetermined';

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans">
      
      {/* ========================================================================= */}
      {/* 1. THÔNG TIN CÁ NHÂN (USER ĐƯỢC PHÉP CHỈNH SỬA)                           */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0f172a]/70 backdrop-blur-xl border border-cyan-500/30 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Thông Tin Cá Nhân (Người Dùng Tự Cập Nhật)
              </h2>
              <p className="text-xs text-slate-400">
                Chỉnh sửa họ tên hiển thị và email liên kết trên hệ thống
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border font-mono ${
            user.plan === 'pro'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
          }`}>
            {user.plan === 'pro' ? '👑 Gói Pro Member' : '👤 Thành Viên Free'}
          </span>
        </div>

        <form onSubmit={handleSaveBasicInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Họ và Tên Học Viên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0b1329] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email Tài Khoản</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                title="Email định danh không thể thay đổi"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Đã lưu thông tin cá nhân!</span>
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Lưu Thông Tin Cá Nhân
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2. CĂN CỨ NĂNG LỰC DO AI VÀ HỆ THỐNG QUẢN LÝ (KHÓA SỬA THỦ CÔNG)          */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0f172a]/70 backdrop-blur-xl border border-indigo-500/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Hồ Sơ Năng Lực AI Ground Truth (Khóa Chỉnh Sửa Thủ Công)
                </h3>
                <span title="Chỉ AI và hệ thống kiểm định được phép cập nhật">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toàn bộ dữ liệu năng lực phải qua kiểm định bài test, chống hiện tượng Vibe Coding
              </p>
            </div>
          </div>

          {/* Verification Status Badge */}
          <div className="shrink-0">
            {vStatus === 'undetermined' && (
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold font-mono flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Chưa xác định năng lực</span>
              </span>
            )}
            {vStatus === 'pending_verification' && (
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>⚠️ Chưa kiểm chứng (Cần làm Test)</span>
              </span>
            )}
            {vStatus === 'verified' && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>✅ Đã Thẩm Định ({user.diagnosticScore}/100)</span>
              </span>
            )}
          </div>
        </div>

        {/* Readonly Competency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Nhóm Nền Tảng:</span>
            <span className="font-extrabold text-white text-sm">
              {user.backgroundType === 'software_dev' ? 'Developer / Backend' : 
               user.backgroundType === 'data_analyst' ? 'Data Analyst / Scientist' :
               user.backgroundType === 'non_tech' ? 'Non-tech / Quản lý' :
               user.backgroundType === 'student' ? 'Sinh viên / Fresher' : 'Chưa xác định'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Cấp Độ SFIA Hiện Tại:</span>
            <span className="font-extrabold text-cyan-300 font-mono text-sm">
              {user.currentSfiaLevel && user.currentSfiaLevel !== 'undetermined' ? `SFIA ${user.currentSfiaLevel}` : 'Chưa xác định'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Cấp Độ SFIA Mục Tiêu:</span>
            <span className="font-extrabold text-indigo-300 font-mono text-sm">
              {user.targetSfiaLevel && user.targetSfiaLevel !== 'undetermined' ? `SFIA ${user.targetSfiaLevel}` : 'Chưa xác định'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Điểm Thẩm Định Thực Tế:</span>
            <span className="font-extrabold text-emerald-400 font-mono text-sm">
              {user.diagnosticScore ? `${user.diagnosticScore}/100` : 'Chưa có dữ liệu'}
            </span>
          </div>

        </div>

        {/* AI Extracted Summary & Verified Badges */}
        {user.uploadedCvExtractedSummary && (
          <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Đánh Giá Từ Hệ Thống AI:</span>
              </span>
              {user.diagnosticTestDate && (
                <span className="text-slate-400 text-[11px] font-mono">
                  Ngày làm test: {user.diagnosticTestDate}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {user.uploadedCvExtractedSummary}
            </p>

            {/* Skills Breakdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Verified Skills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Kỹ Năng Đã Thẩm Định Thực Tế ({user.verifiedSkills?.length || 0}):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user.verifiedSkills && user.verifiedSkills.length > 0 ? (
                    user.verifiedSkills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                        ✅ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs italic">Chưa có kỹ năng nào được thẩm định</span>
                  )}
                </div>
              </div>

              {/* Identified Gaps (Vibe Coding) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Lỗ Hổng Cần Đào Tạo Lại ({user.identifiedGaps?.length || 0}):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user.identifiedGaps && user.identifiedGaps.length > 0 ? (
                    user.identifiedGaps.map((g, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                        ⚠️ {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs italic">Chưa phát hiện lỗ hổng</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action: Launch Diagnostic Quiz when pending */}
        {vStatus === 'pending_verification' && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0b1329] to-indigo-500/15 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Yêu Cầu Làm Bài Kiểm Tra Thẩm Định Năng Lực</span>
              </h4>
              <p className="text-xs text-slate-300">
                AI Mentor đã sinh đề thi 5 câu hỏi dựa trên hồ sơ bạn nạp để kiểm tra xem bạn nắm bản chất code hay chỉ &ldquo;Vibe Coding&rdquo;.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setQuizAnswers({});
                setQuizSubmitted(false);
                setShowDiagnosticModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-95 transition cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Bắt Đầu Kiểm Tra Ngay</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. TRƯỜNG NẠP DỮ LIỆU ĐA PHƯƠNG THỨC CHO AI ĐỌC (ẢNH / PDF / TEXT)        */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0f172a]/70 backdrop-blur-xl border border-slate-700/60 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Nạp Dữ Liệu Hồ Sơ Cho AI Đọc & Phân Tích (Multimodal Input)
              </h3>
              <p className="text-xs text-slate-400">
                Tải lên CV (PDF), Ảnh chứng chỉ, hoặc nhập mô tả văn bản để AI trích xuất năng lực
              </p>
            </div>
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputType('text')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              inputType === 'text'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-[#0b1329] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Nhập Văn Bản (Text)</span>
          </button>

          <button
            type="button"
            onClick={() => setInputType('pdf')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              inputType === 'pdf'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                : 'bg-[#0b1329] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tải File PDF (CV / Bảng Điểm)</span>
          </button>

          <button
            type="button"
            onClick={() => setInputType('image')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              inputType === 'image'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-[#0b1329] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>Tải File Ảnh (Chứng Chỉ)</span>
          </button>
        </div>

        {/* Input Form Content */}
        {inputType === 'text' && (
          <div className="space-y-2">
            <textarea
              rows={4}
              value={rawTextInput}
              onChange={(e) => setRawTextInput(e.target.value)}
              placeholder="Nhập thông tin kinh nghiệm của bạn, ví dụ: 'Tôi là lập trình viên 2 năm kinh nghiệm với Python/FastAPI, đã từng làm RAG với Qdrant nhưng chưa hiểu sâu về Toán Transformer Attention và vLLM...'"
              className="w-full bg-[#0b1329] border border-slate-700/80 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
            />
          </div>
        )}

        {(inputType === 'pdf' || inputType === 'image') && (
          <div 
            onClick={() => setUploadedFileName(inputType === 'pdf' ? 'CV_ChuyenSau_AI_2026.pdf' : 'ChungChi_Python_AI.png')}
            className="p-8 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-3xl bg-[#0b1329] text-center cursor-pointer transition space-y-3 group"
          >
            <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-white">
                {uploadedFileName ? `Đã chọn tệp: ${uploadedFileName}` : `Nhấp để chọn tệp ${inputType.toUpperCase()} của bạn`}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hệ thống hỗ trợ OCR tự động đọc bảng điểm, chứng chỉ và CV học thuật
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={handleProcessMultimodalData}
            disabled={isAiProcessing}
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isAiProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>AI Đang Phân Tích & OCR...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                <span>Gửi Dữ Liệu Cho AI Phân Tích & Thẩm Định</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LOGOUT BUTTON (NỀN ĐỎ CHỮ TRẮNG Ở DƯỚI CÙNG)                            */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng Xuất Khỏi Thiết Bị Này</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL BÀI KIỂM TRA THẨM ĐỊNH NĂNG LỰC CÁ NHÂN HÓA (CHỐNG VIBE CODING)  */}
      {/* ========================================================================= */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-cyan-500/50 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    Bài Khảo Thí Thẩm Định Năng Lực Thực Tế
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sàng lọc hiện tượng Vibe Coding • Đánh giá độ hiểu sâu của học viên
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDiagnosticModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions List */}
            {!quizSubmitted ? (
              <div className="space-y-6">
                {diagnosticQuestions.map((q, qIndex) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {qIndex + 1}
                      </span>
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                          {q.skillTag}
                        </span>
                        <p className="text-xs font-bold text-slate-100 leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 pl-8">
                      {q.options.map(opt => {
                        const isSelected = quizAnswers[q.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                            className={`w-full text-left p-3 rounded-xl text-xs transition border cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-sm'
                                : 'bg-[#070d1e] border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {opt.id}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowDiagnosticModal(false)}
                    className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>

                  <button
                    type="button"
                    onClick={handleDiagnosticQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < diagnosticQuestions.length}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer disabled:opacity-40"
                  >
                    Nộp Bài & Chấm Điểm Thẩm Định
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Results View */
              <div className="space-y-6 text-center py-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-black text-white">
                    Kết Quả Thẩm Định Năng Lực: <span className="text-cyan-400 font-mono">{quizScore}/100</span>
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    {quizScore >= 80 ? (
                      <span className="text-emerald-400 font-bold">
                        🎉 Xuất sắc! Bạn nắm vững bản chất kiến trúc và thuật toán. AI Mentor đã xác thực kỹ năng SFIA Level 3 và lược bớt các module cơ bản để bạn tập trung vào bài tập chuyên sâu.
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">
                        ⚠️ Phát hiện lỗ hổng hiểu sâu (Vibe Coding). AI Mentor đã tự động cấu hình lại Lộ trình học, bắt buộc giữ lại các Module Python & Cấu trúc dữ liệu để bạn củng cố gốc rễ!
                      </span>
                    )}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowDiagnosticModal(false)}
                    className="py-3 px-8 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer"
                  >
                    Đóng & Xem Lộ Trình Tinh Chỉnh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
