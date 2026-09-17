'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Star,
  Send,
  Loader2,
  Sparkles,
  User,
  Mail,
  RotateCcw,
  Palette,
  Gift,
  AlertTriangle,
  Lightbulb,
  HeartHandshake,
  Clock,
  Award,
  Wallet,
  Coins,
  CheckSquare,
  Square,
  AlertCircle,
  Hash,
  HelpCircle,
} from 'lucide-react';

const surveyClientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Vui lòng nhập họ và tên hoặc biệt danh (tối thiểu 2 ký tự)' }),
  studentId: z
    .string()
    .trim()
    .min(2, { message: 'Vui lòng nhập mã học viên của bạn (ví dụ: 02733)' })
    .max(30, { message: 'Mã học viên không được vượt quá 30 ký tự' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Vui lòng nhập địa chỉ email hợp lệ để nhận xác nhận' }),
  background: z
    .string({ required_error: 'Vui lòng chọn nền tảng học tập của bạn' })
    .min(1, { message: 'Vui lòng chọn nền tảng học tập của bạn' }),
  rewardAccount: z
    .string()
    .trim()
    .min(3, { message: 'Vui lòng nhập Số MoMo hoặc STK + Tên ngân hàng để nhận thưởng' }),
  selfAwarenessOfGaps: z
    .string({ required_error: 'Vui lòng trả lời câu 1' })
    .min(1, { message: 'Vui lòng trả lời câu 1' }),
  primaryPainPoints: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ít nhất 1 khó khăn bạn gặp phải (Câu 2)' }),
  timeWasted: z
    .string({ required_error: 'Vui lòng chọn thời gian bạn thường mất (Câu 3)' })
    .min(1, { message: 'Vui lòng chọn thời gian bạn thường mất (Câu 3)' }),
  currentWorkarounds: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ít nhất 1 cách bạn xử lý khi kẹt bài (Câu 4)' }),
  solutionFeasibility: z
    .string({ required_error: 'Vui lòng đánh giá tính khả thi (Câu 5)' })
    .min(1, { message: 'Vui lòng đánh giá tính khả thi (Câu 5)' }),
  wantPersonalizedRoadmap: z
    .string({ required_error: 'Vui lòng chọn ý kiến về lộ trình cá nhân hóa (Câu 6)' })
    .min(1, { message: 'Vui lòng chọn ý kiến về lộ trình cá nhân hóa (Câu 6)' }),
  wantAiGapFilling: z
    .string({ required_error: 'Vui lòng chọn ý kiến về bài học bù đắp kiến thức (Câu 7)' })
    .min(1, { message: 'Vui lòng chọn ý kiến về bài học bù đắp kiến thức (Câu 7)' }),
  mostWantedFeatures: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ít nhất 1 tính năng bạn muốn dùng (Câu 8)' }),
  overallRating: z
    .number({ invalid_type_error: 'Vui lòng chọn điểm đánh giá ý tưởng (Câu 9)' })
    .min(1, { message: 'Vui lòng đánh giá từ 1 đến 5 sao' })
    .max(5),
  usabilityRating: z
    .string({ required_error: 'Vui lòng đánh giá độ trực quan của giao diện (Câu 10)' })
    .min(1, { message: 'Vui lòng đánh giá độ trực quan của giao diện (Câu 10)' }),
  uiImprovements: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ít nhất 1 ý kiến về giao diện (Câu 11)' }),
  willingToTest: z
    .string({ required_error: 'Vui lòng chọn mức độ sẵn sàng dùng thử (Câu 12)' })
    .min(1, { message: 'Vui lòng chọn mức độ sẵn sàng dùng thử (Câu 12)' }),
  generalFeedback: z.string().optional(),
  contactHandle: z.string().optional(),
});

type SurveyFormData = z.infer<typeof surveyClientSchema>;

// TÙY CHỌN 12 CÂU HỎI
const BACKGROUND_OPTIONS = [
  'Dân Công nghệ thông tin (Đã biết lập trình)',
  'Người học trái ngành (Chưa từng học code / AI)',
  'Đang theo chuyên sâu về Data / AI',
];

const SELF_AWARENESS_OPTIONS = [
  'Hoàn toàn không biết — Chỉ khi vào lớp làm bài bị lỗi hoặc testcase fail mới biết mình hổng',
  'Biết là mình chưa hiểu, nhưng chịu không biết phải đọc phần nào để bù vào',
  'Tôi tự biết rõ mình thiếu gì và tự tìm tài liệu bù đắp được',
];

const PAIN_POINT_OPTIONS = [
  'Tài liệu bị vứt rải rác nhiều nơi (Discord, VLearn, GitHub, Drive) — mất công đi nhặt từng link',
  'Slide quá dài (50-60 trang) — đọc lan man không biết đâu là trọng tâm buổi lab sẽ chấm',
  'Thời gian rảnh quá ít (dưới 1 tiếng) — không đủ để tự mò mẫm từ đầu đến cuối',
  'Hỏi AI Tutor trên VLearn nhưng câu trả lời chung chung — không chỉ ra bước tiếp theo cần làm',
  'Không có bài test trắc nghiệm ngắn để kiểm tra nhanh xem mình đã hiểu bài hay chưa',
  'Làm bài cập rập, đến sát hạn 23h59 mới cuống cuồng nộp bài hoặc bị nộp muộn',
];

const TIME_WASTED_OPTIONS = [
  'Dưới 15 phút',
  '15 – 30 phút',
  '30 – 45 phút',
  'Trên 45 phút',
];

const WORKAROUND_OPTIONS = [
  'Hỏi bạn bè / đồng đội trong nhóm',
  'Dùng AI bên ngoài (ChatGPT, Claude, Gemini...) paste code hoặc hỏi bài',
  'Hỏi AI Tutor trên VLearn',
  'Đợi đến giờ lên lớp hỏi Mentor / Trợ giảng',
  'Cố gắng tự search Google / StackOverflow mò mẫm',
];

const FEASIBILITY_OPTIONS = [
  'Rất thiết thực — Đúng thứ tôi cần để tiết kiệm thời gian',
  'Cần xem thử — Phải xem gợi ý có đúng với nội dung kiểm tra trên lớp không đã',
  'Không cần thiết — Tôi thích tự học theo cách cũ hơn',
];

const PERSONALIZED_ROADMAP_OPTIONS = [
  'Có, rất muốn — Đỡ mất công tự lên lịch học',
  'Muốn dùng thử xem sao — Hiệu quả thì dùng tiếp',
  'Không — Tôi tự sắp xếp thời gian của mình tốt rồi',
];

const GAP_FILLING_OPTIONS = [
  'Có, rất cần — Học đúng thứ mình thiếu sẽ tự tin làm bài hơn',
  'Chỉ cần đưa link tài liệu gốc, không cần AI tóm tắt hay giảng giải',
  'Không cần — Tôi tự tìm hiểu được',
];

const WANTED_FEATURES_OPTIONS = [
  'AI Mentor: Bài test chẩn đoán ngắn (Diagnostic Test) chỉ ra chính xác mình đang yếu phần nào',
  'AI Mentor: Checklist 3 việc trọng tâm kèm ước lượng thời gian & lộ trình theo số phút rảnh',
  'AI Mentor: Gom sẵn link repo mẫu, slide, link lab chuẩn catalog — bấm là mở, không lo trôi link',
  'AI Helpdesk 24/7: Trợ lý hỏi đáp quy chế, giải thích bài lab và gỡ kẹt kỹ thuật tức thì',
  'Cảnh báo nguy cơ trễ hạn nộp bài (deadline) & gợi ý lộ trình kỹ năng chuẩn SFIA',
];

const USABILITY_OPTIONS = [
  'Đẹp và rất dễ dùng — Nhìn phát hiểu ngay cần bấm vào đâu',
  'Tạm ổn — Sử dụng được nhưng cần tinh gọn bớt chi tiết',
  'Khó dùng — Nhìn bị rối mắt và khó tìm thông tin',
];

const UI_IMPROVEMENT_OPTIONS = [
  'Bố cục cần gọn gàng, thoáng mắt hơn',
  'Font chữ hoặc kích thước chữ cần tối ưu dễ đọc hơn trên điện thoại',
  'Màu sắc / độ tương phản cần dịu mắt hơn',
  'Cần bổ sung chế độ Light mode (Giao diện sáng)',
  'Giao diện hiện tại đã ổn, không cần sửa gì nhiều',
];

const WILLING_TEST_OPTIONS = [
  'Sẵn sàng! Hãy gửi link cho tôi khi có bản mới',
  'Chưa chắc — Tùy xem lúc đó tôi có bận hay không',
  'Không, tôi không có nhu cầu',
];

export function ContactSurveyForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoveredOverall, setHoveredOverall] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveyClientSchema),
    defaultValues: {
      fullName: '',
      studentId: '',
      email: '',
      background: 'Dân Công nghệ thông tin (Đã biết lập trình)',
      rewardAccount: '',
      selfAwarenessOfGaps: 'Hoàn toàn không biết — Chỉ khi vào lớp làm bài bị lỗi hoặc fail testcase mới biết mình hổng',
      primaryPainPoints: [
        'Tài liệu bị vứt rải rác nhiều nơi (Discord, VLearn, GitHub, Drive) — mất công đi nhặt từng link',
        'Slide quá dài (50-60 trang) — đọc lan man không biết đâu là trọng tâm buổi lab sẽ chấm',
      ],
      timeWasted: '15 – 30 phút',
      currentWorkarounds: ['Dùng AI bên ngoài (ChatGPT, Claude, Gemini...) paste code hoặc hỏi bài'],
      solutionFeasibility: 'Rất thiết thực — Đúng thứ tôi cần để tiết kiệm thời gian',
      wantPersonalizedRoadmap: 'Có, rất muốn — Đỡ mất công tự lên lịch học',
      wantAiGapFilling: 'Có, rất cần — Học đúng thứ mình thiếu sẽ tự tin làm bài hơn',
      mostWantedFeatures: [
        'AI Mentor: Bài test chẩn đoán ngắn (Diagnostic Test) chỉ ra chính xác mình đang yếu phần nào',
        'AI Mentor: Checklist 3 việc trọng tâm kèm ước lượng thời gian & lộ trình theo số phút rảnh',
      ],
      overallRating: 5,
      usabilityRating: 'Đẹp và rất dễ dùng — Nhìn phát hiểu ngay cần bấm vào đâu',
      uiImprovements: ['Giao diện hiện tại đã ổn, không cần sửa gì nhiều'],
      willingToTest: 'Sẵn sàng! Hãy gửi link cho tôi khi có bản mới',
      generalFeedback: '',
      contactHandle: '',
    },
  });

  const overallRating = watch('overallRating');
  const selectedBackground = watch('background');
  const selectedSelfAwareness = watch('selfAwarenessOfGaps');
  const selectedPainPoints = watch('primaryPainPoints') || [];
  const selectedTimeWasted = watch('timeWasted');
  const selectedWorkarounds = watch('currentWorkarounds') || [];
  const selectedFeasibility = watch('solutionFeasibility');
  const selectedRoadmap = watch('wantPersonalizedRoadmap');
  const selectedGapFilling = watch('wantAiGapFilling');
  const selectedWantedFeatures = watch('mostWantedFeatures') || [];
  const selectedUsability = watch('usabilityRating');
  const selectedUiImprovements = watch('uiImprovements') || [];
  const selectedWillingTest = watch('willingToTest');

  const toggleMultiSelect = (
    field: 'primaryPainPoints' | 'currentWorkarounds' | 'mostWantedFeatures' | 'uiImprovements',
    item: string
  ) => {
    const currentList = watch(field) || [];
    let updatedList: string[];
    if (currentList.includes(item)) {
      updatedList = currentList.filter((x) => x !== item);
    } else {
      updatedList = [...currentList, item];
    }
    setValue(field, updatedList, { shouldValidate: true });
  };

  const onSubmit = async (data: SurveyFormData) => {
    setErrorMessage(null);
    try {
      const response = await fetch('/api/contact/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.');
      }

      setTicketCode(result.ticketCode || data.studentId.trim());
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể gửi biểu mẫu vào lúc này.';
      setErrorMessage(msg);
    }
  };

  const handleResetForm = () => {
    reset();
    setIsSubmitted(false);
    setTicketCode('');
    setSubmittedEmail('');
    setErrorMessage(null);
  };

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-[#0f172a]/95 border border-teal-500/40 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fadeIn font-sans">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-400/30 text-teal-400 mx-auto shadow-lg shadow-teal-500/10">
          <Gift className="w-9 h-9" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Đã Lưu Khảo Sát Thành Công!
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Cảm ơn bạn đã đóng góp phản hồi thực tế. Thông tin đã được lưu trực tiếp vào Google Sheet của nhóm.
          </p>
        </div>

        {/* LUCKY DRAW CODE CARD (MÃ HỌC VIÊN) */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#131d36] to-[#0b1329] border border-teal-500/30 max-w-md mx-auto shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Mã Học Viên Dự Thưởng (Duy Nhất)</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-teal-300 tracking-widest drop-shadow-[0_0_12px_rgba(45,212,191,0.4)]">
            {ticketCode}
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 space-y-1 text-left">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Thời gian quay thưởng: 17h20 · Ngày 18/09/2026</span>
            </p>
            <p className="text-slate-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-teal-400" />
              <span>10 giải tri ân: 1 Nhất 100k · 2 Nhì 50k · 3 Ba 20k · 4 Tư 10k (MoMo / STK)</span>
            </p>
            <p className="text-[11px] text-slate-400 italic">
              * Mỗi học viên chỉ có 1 mã dự thưởng duy nhất để đảm bảo công bằng tuyệt đối.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 max-w-lg mx-auto text-left space-y-2">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Email Xác Nhận Đã Được Gửi</span>
          </div>
          <p className="text-xs text-slate-300">
            Thư xác nhận kèm mã học viên dự thưởng <strong className="text-teal-300">{ticketCode}</strong> đã được gửi tới:
          </p>
          <p className="text-xs font-mono font-bold text-teal-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-teal-500/20 break-all">
            {submittedEmail}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-semibold uppercase tracking-wider transition shadow-lg shadow-teal-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Gửi Phản Hồi Khác</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0f172a]/95 border border-slate-700/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8 font-sans">
      {/* LUCKY DRAW BANNER & RULES */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0b1329] border border-slate-800/80 p-5 sm:p-8 space-y-6">
        {/* BANNER ẢNH TRI ÂN */}
        <div className="relative w-full h-40 sm:h-56 rounded-xl overflow-hidden">
          <img
            src="/images/survey-reward-banner.jpg"
            alt="Quay Thưởng Tri Ân Học Viên Khóa 4"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-[#0b1329]/70 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-teal-300 text-[11px] font-medium tracking-wide">
                <Gift className="w-3.5 h-3.5" />
                <span>Tri ân học viên làm khảo sát</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                Quay thưởng may mắn · 10 phần quà
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Quay số 17h20 · 18/09/2026</span>
            </div>
          </div>
        </div>

        {/* THÔNG ĐIỆP TRI ÂN */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Toàn bộ 10 phần quà dưới đây do đội thi{' '}
          <span className="text-slate-200 font-medium">Vinonymus (Phòng E403)</span> tổ chức để tri ân
          những chia sẻ thực chất của các bạn về khó khăn khi tự học trên VLearn và chuẩn bị bài lab —
          mỗi phản hồi là cơ sở giúp nhóm hoàn thiện sản phẩm.
        </p>

        {/* CƠ CẤU GIẢI THƯỞNG & THỂ LỆ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6 pt-6 border-t border-slate-800/80">
          {/* CƠ CẤU GIẢI THƯỞNG */}
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wide">
                <Award className="w-4 h-4 text-teal-400" />
                <span>Cơ cấu giải thưởng</span>
              </div>
              <span className="text-[11px] text-slate-500">10 giải riêng biệt</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {[
                { rank: 1, label: '1 Giải Nhất', amount: '100.000 VNĐ' },
                { rank: 2, label: '2 Giải Nhì', amount: '50.000 VNĐ / giải' },
                { rank: 3, label: '3 Giải Ba', amount: '20.000 VNĐ / giải' },
                { rank: 4, label: '4 Giải Tư', amount: '10.000 VNĐ / giải' },
              ].map((prize) => (
                <div key={prize.rank} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 ${
                        prize.rank === 1
                          ? 'bg-amber-400/15 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {prize.rank}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 font-medium">{prize.label}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-amber-300">
                    {prize.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* THỂ LỆ THAM GIA & CÁCH NHẬN THƯỞNG */}
          <div className="space-y-3 lg:border-l lg:border-slate-800/80 lg:pl-10">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wide pb-1">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Thể lệ & cách nhận thưởng</span>
            </div>

            <ul className="space-y-3">
              {[
                {
                  icon: Hash,
                  title: 'Mã dự thưởng',
                  body: (
                    <>
                      Chính là <strong className="text-slate-200">mã học viên</strong> duy nhất của bạn
                      (ví dụ: <span className="font-mono text-teal-300">02733</span>). Mỗi học viên chỉ có
                      1 mã duy nhất để đảm bảo minh bạch và công bằng.
                    </>
                  ),
                },
                {
                  icon: Clock,
                  title: 'Thời gian quay số',
                  body: (
                    <>
                      Tiến hành quay ngẫu nhiên vào đúng{' '}
                      <strong className="text-slate-200">17h20 · ngày 18/09/2026</strong>.
                    </>
                  ),
                },
                {
                  icon: Wallet,
                  title: 'Hình thức nhận giải',
                  body: (
                    <>
                      Tiền thưởng được chuyển khoản trực tiếp ngay sau khi có kết quả qua số{' '}
                      <strong className="text-slate-200">MoMo</strong> hoặc{' '}
                      <strong className="text-slate-200">STK ngân hàng</strong> bạn đã điền.
                    </>
                  ),
                },
                {
                  icon: Mail,
                  title: 'Email xác nhận',
                  body: (
                    <>
                      Ngay sau khi gửi biểu mẫu, hệ thống sẽ tự động gửi một email xác nhận kèm mã học
                      viên để bạn lưu lại đối chiếu kết quả quay thưởng.
                    </>
                  ),
                },
              ].map((rule) => (
                <li key={rule.title} className="flex items-start gap-3">
                  <rule.icon className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    <span className="text-slate-200 font-medium">{rule.title}: </span>
                    {rule.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Header section của form */}
      <div className="space-y-2 border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-medium uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Khảo Sát Nhu Cầu & Đánh Giá Giải Pháp (12 Câu Hỏi)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Bản Khảo Sát Thực Nghiệm: Hệ Thống Adaptive Learning (AI Mentor & AI Helpdesk)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Ý kiến khách quan của bạn là cơ sở thực chứng quan trọng để nhóm Vinonymus (Phòng E403) chứng minh nỗi đau và hoàn thiện giải pháp tại Mini Hackathon AI Batch 04.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* =================================================================== */}
        {/* THÔNG TIN HỌC VIÊN & NHẬN THƯỞNG */}
        {/* =================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-teal-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Thông Tin Học Viên & Nhận Thưởng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Họ và tên */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Họ và Tên hoặc Biệt danh <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                {...register('fullName')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1329]/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-white placeholder-slate-500 transition outline-none"
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-400">{errors.fullName.message}</p>
              )}
            </div>

            {/* Mã học viên (Mã quay thưởng duy nhất) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-teal-400" />
                <span>Mã Học Viên (Mã Quay Thưởng) <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 02733"
                {...register('studentId')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1329]/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-white font-mono font-bold placeholder-slate-500 transition outline-none"
              />
              {errors.studentId && (
                <p className="text-[11px] text-rose-400">{errors.studentId.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Địa Chỉ Email (để nhận xác nhận) <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                placeholder="email.cua.ban@gmail.com"
                {...register('email')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1329]/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-white placeholder-slate-500 transition outline-none"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Nền tảng học tập */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Nền tảng của bạn <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {BACKGROUND_OPTIONS.map((bg) => {
                const isSelected = selectedBackground === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setValue('background', bg, { shouldValidate: true })}
                    className={`p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                    </div>
                    <span>{bg}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thông tin MoMo / STK nhận thưởng */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Số Điện Thoại MoMo hoặc STK Ngân Hàng (kèm tên ngân hàng & chủ thẻ) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: MoMo 0912345678 hoặc MB Bank 0123456789 - NGUYEN VAN A"
              {...register('rewardAccount')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1329]/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-white placeholder-slate-500 transition outline-none"
            />
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-teal-400" />
              <span>Dùng để chuyển khoản giải thưởng tri ân (1 Nhất 100k, 2 Nhì 50k, 3 Ba 20k, 4 Tư 10k) vào lúc 17h20 ngày 18/09.</span>
            </p>
            {errors.rewardAccount && (
              <p className="text-[11px] text-rose-400">{errors.rewardAccount.message}</p>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* PHẦN 1: NỖI ĐAU THỰC TẾ KHI TỰ HỌC TRÊN VLEARN & LÀM LAB */}
        {/* =================================================================== */}
        <div className="space-y-5 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2 text-teal-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Phần 1: Nỗi Đau Thực Tế Khi Tự Học & Làm Bài Lab (Câu 1 - 4)</span>
          </div>

          {/* Câu 1: Tự nhận biết lỗ hổng (Single-select) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 1: Khi tự chuẩn bị bài trước buổi học, bạn có biết mình đang bị hổng kiến thức ở phần nào không? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-slate-400 font-normal ml-2">(Chọn 1 ý)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SELF_AWARENESS_OPTIONS.map((opt, idx) => {
                const isSelected = selectedSelfAwareness === opt;
                const isLastOdd = idx === SELF_AWARENESS_OPTIONS.length - 1 && SELF_AWARENESS_OPTIONS.length % 2 !== 0;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue('selfAwarenessOfGaps', opt, { shouldValidate: true })}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isLastOdd ? 'sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400 text-teal-100'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Câu 2: Khó khăn gặp phải (MULTI-SELECT CHECKBOXES) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 2: Những khó khăn nào bạn ĐÃ HOẶC ĐANG GẶP PHẢI khi tự học và chuẩn bị bài lab? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-teal-300 font-medium ml-2">(Có thể chọn nhiều ý ☑️)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PAIN_POINT_OPTIONS.map((opt) => {
                const isChecked = selectedPainPoints.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleMultiSelect('primaryPainPoints', opt)}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isChecked
                        ? 'bg-teal-500/15 border-teal-400 text-white shadow-sm'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="shrink-0 text-teal-400">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 fill-teal-500/20" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {errors.primaryPainPoints && (
              <p className="text-[11px] text-rose-400">{errors.primaryPainPoints.message}</p>
            )}
          </div>

          {/* Câu 3: Thời gian lãng phí (Single-select) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 3: Mỗi buổi học, bạn mất bao nhiêu thời gian chỉ để gom đủ link tài liệu và biết mình phải làm gì? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-slate-400 font-normal ml-2">(Chọn 1 ý)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {TIME_WASTED_OPTIONS.map((opt) => {
                const isSelected = selectedTimeWasted === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue('timeWasted', opt, { shouldValidate: true })}
                    className={`p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400 text-teal-100'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Câu 4: Cách xử lý khi kẹt bài (MULTI-SELECT CHECKBOXES) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 4: Khi bị kẹt bài hoặc không hiểu bài, bạn thường xử lý bằng cách nào nhất? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-teal-300 font-medium ml-2">(Có thể chọn nhiều ý ☑️)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WORKAROUND_OPTIONS.map((opt) => {
                const isChecked = selectedWorkarounds.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleMultiSelect('currentWorkarounds', opt)}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isChecked
                        ? 'bg-teal-500/15 border-teal-400 text-white shadow-sm'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="shrink-0 text-teal-400">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 fill-teal-500/20" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {errors.currentWorkarounds && (
              <p className="text-[11px] text-rose-400">{errors.currentWorkarounds.message}</p>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* PHẦN 2: TÍNH KHẢ THI & HỆ THỐNG ADAPTIVE LEARNING (AI MENTOR & AI HELPDESK) */}
        {/* =================================================================== */}
        <div className="space-y-5 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2 text-teal-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Phần 2: Tính Khả Thi Của Hệ Thống Adaptive Learning (AI Mentor & AI Helpdesk)</span>
          </div>

          {/* Câu 5: Tính khả thi (Single-select) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 5: Nếu có AI Mentor giúp bạn chẩn đoán nhanh kiến thức và lọc đúng 3 việc cần học theo số phút rảnh của bạn, bạn thấy thế nào? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-slate-400 font-normal ml-2">(Chọn 1 ý)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FEASIBILITY_OPTIONS.map((opt, idx) => {
                const isSelected = selectedFeasibility === opt;
                const isLastOdd = idx === FEASIBILITY_OPTIONS.length - 1 && FEASIBILITY_OPTIONS.length % 2 !== 0;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue('solutionFeasibility', opt, { shouldValidate: true })}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isLastOdd ? 'sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400 text-teal-100'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Câu 6: Lộ trình cá nhân hóa (Single-select) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 6: Bạn có muốn AI Mentor tự lên kế hoạch học tập thích ứng riêng cho bạn (theo nền tảng và thời gian rảnh hôm đó) không? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-slate-400 font-normal ml-2">(Chọn 1 ý)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PERSONALIZED_ROADMAP_OPTIONS.map((opt, idx) => {
                const isSelected = selectedRoadmap === opt;
                const isLastOdd = idx === PERSONALIZED_ROADMAP_OPTIONS.length - 1 && PERSONALIZED_ROADMAP_OPTIONS.length % 2 !== 0;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue('wantPersonalizedRoadmap', opt, { shouldValidate: true })}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isLastOdd ? 'sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400 text-teal-100'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Câu 7: AI bù đắp kiến thức khuyết thiếu (Single-select) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 7: Bạn có muốn AI Mentor chỉ đích danh bài học ngắn gọn để bù đắp đúng phần kiến thức bạn bị hổng trước giờ vào lớp không? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-slate-400 font-normal ml-2">(Chọn 1 ý)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GAP_FILLING_OPTIONS.map((opt, idx) => {
                const isSelected = selectedGapFilling === opt;
                const isLastOdd = idx === GAP_FILLING_OPTIONS.length - 1 && GAP_FILLING_OPTIONS.length % 2 !== 0;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue('wantAiGapFilling', opt, { shouldValidate: true })}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isLastOdd ? 'sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400 text-teal-100'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Câu 8: Tính năng muốn dùng nhất (MULTI-SELECT CHECKBOXES) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 8: Trong hệ sinh thái Adaptive Learning (AI Mentor & AI Helpdesk), tính năng nào sau đây sẽ khiến bạn muốn dùng mỗi ngày nhất? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-teal-300 font-medium ml-2">(Có thể chọn nhiều ý ☑️)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WANTED_FEATURES_OPTIONS.map((opt) => {
                const isChecked = selectedWantedFeatures.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleMultiSelect('mostWantedFeatures', opt)}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isChecked
                        ? 'bg-teal-500/15 border-teal-400 text-white shadow-sm'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="shrink-0 text-teal-400">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 fill-teal-500/20" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {errors.mostWantedFeatures && (
              <p className="text-[11px] text-rose-400">{errors.mostWantedFeatures.message}</p>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* PHẦN 3: ĐÁNH GIÁ GIAO DIỆN & TRẢI NGHIỆM (UI/UX REVIEW) */}
        {/* =================================================================== */}
        <div className="space-y-5 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2 text-teal-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <Palette className="w-4 h-4" />
            <span>Phần 3: Đánh Giá Giao Diện & Trải Nghiệm (Câu 9 - 11)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Câu 9: Đánh giá tổng thể ý tưởng (Star Rating) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white">
                Câu 9: Đánh giá tổng thể ý tưởng sản phẩm (1 - 5 sao) <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b1329]/70 border border-slate-700/80 w-fit">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled =
                    (hoveredOverall !== null ? hoveredOverall : overallRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredOverall(star)}
                      onMouseLeave={() => setHoveredOverall(null)}
                      onClick={() =>
                        setValue('overallRating', star, { shouldValidate: true })
                      }
                      className="p-1 rounded-lg hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-amber-400 ml-2">
                  {overallRating} / 5 sao
                </span>
              </div>
            </div>

            {/* Câu 10: Độ trực quan giao diện (Single-select) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white">
                Câu 10: Độ trực quan của giao diện trang web hiện tại: <span className="text-rose-400">*</span>
                <span className="text-[11px] text-slate-400 font-normal ml-2">(Chọn 1 ý)</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {USABILITY_OPTIONS.map((opt) => {
                  const isSelected = selectedUsability === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setValue('usabilityRating', opt, { shouldValidate: true })}
                      className={`p-2.5 rounded-xl text-left text-xs font-medium transition border flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                          : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                      </div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Câu 11: Điểm cần cải thiện UI (MULTI-SELECT CHECKBOXES) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 11: Về mặt giao diện, điều gì bạn cảm thấy cần cải thiện nhất? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-teal-300 font-bold ml-2">(Có thể chọn nhiều ý ☑️)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {UI_IMPROVEMENT_OPTIONS.map((opt, idx) => {
                const isChecked = selectedUiImprovements.includes(opt);
                const isLastOdd = idx === UI_IMPROVEMENT_OPTIONS.length - 1 && UI_IMPROVEMENT_OPTIONS.length % 2 !== 0;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleMultiSelect('uiImprovements', opt)}
                    className={`h-full p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-3 ${
                      isLastOdd ? 'sm:col-span-2' : ''
                    } ${
                      isChecked
                        ? 'bg-teal-500/20 border-teal-400 text-white shadow-sm'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="shrink-0 text-teal-400">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 fill-teal-500/20" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {errors.uiImprovements && (
              <p className="text-[11px] text-rose-400">{errors.uiImprovements.message}</p>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* PHẦN 4: ĐĂNG KÝ WILLING USER & ĐÓNG GÓP Ý KIẾN */}
        {/* =================================================================== */}
        <div className="space-y-5 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2 text-teal-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Phần 4: Đăng Ký Trải Nghiệm Sớm & Góp Ý (Câu 12)</span>
          </div>

          {/* Câu 12: Willing User (Single-select) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-white">
              Câu 12: Bạn có sẵn sàng dùng thử bản demo tương tác (bấm được, học thử được) ở đợt tới không? <span className="text-rose-400">*</span>
              <span className="text-[11px] text-slate-400 font-normal ml-2">(Chọn 1 ý)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {WILLING_TEST_OPTIONS.map((opt) => {
                const isSelected = selectedWillingTest === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue('willingToTest', opt, { shouldValidate: true })}
                    className={`p-3 rounded-xl text-left text-xs font-medium transition border flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400 text-teal-100'
                        : 'bg-[#0b1329]/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-teal-400 bg-teal-400' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0b1329]" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discord / Zalo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Tài khoản Discord hoặc số điện thoại Zalo (để nhóm gửi link trải nghiệm sớm)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: discord_tag#1234 hoặc 0912345678"
              {...register('contactHandle')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1329]/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-white placeholder-slate-500 transition outline-none"
            />
          </div>

          {/* Góp ý thêm */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Góp ý tự do cho nhóm phát triển (về giao diện hoặc giải pháp)
            </label>
            <textarea
              rows={3}
              placeholder="Bạn có góp ý gì để nhóm cải tiến sản phẩm tốt hơn không?..."
              {...register('generalFeedback')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1329]/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-white placeholder-slate-500 transition outline-none resize-none"
            />
          </div>
        </div>

        {/* NÚT SUBMIT */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            Mã học viên của bạn chính là Mã Dự Thưởng duy nhất để quay quà tri ân vào lúc 17h20 ngày 18/09.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-lg shadow-teal-500/25 border border-teal-400/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang Lưu Khảo Sát...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi Khảo Sát & Nhận Xác Nhận</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
