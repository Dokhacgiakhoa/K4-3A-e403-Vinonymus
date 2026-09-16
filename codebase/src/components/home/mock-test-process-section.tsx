'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';

export function MockTestProcessSection() {
  const steps = [
    { step: "01", title: "Chọn Cấp Độ SFIA", desc: "Lựa chọn bộ đề L1-L2 (Foundation) hoặc L3-L4 (Advanced Engineering)." },
    { step: "02", title: "Xác Nhận Quy Chế", desc: "Cam kết bài thi mô phỏng học thuật độc lập và kích hoạt phòng thi." },
    { step: "03", title: "Làm Bài 30 Phút", desc: "Trả lời các câu hỏi tình huống thực tế có đồng hồ đếm ngược." },
    { step: "04", title: "Nhận Báo Cáo & Rank", desc: "Xem điểm số, xếp hạng bậc SFIA và đọc phân tích lý thuyết chi tiết." }
  ];

  return (
    <section className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-10 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-medium text-amber-400 uppercase tracking-wider">100% Mock Practice</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide text-shadow-clean">Quy Trình Thi Thử & Đánh Giá Năng Lực</h2>
        <p className="text-xs sm:text-sm text-slate-300 font-normal">
          Hệ thống phòng thi trực tuyến tự động chấm điểm và phân tích giải thích lý thuyết chi tiết.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#0b1329]/75 border border-slate-700/60 hover:border-sky-400/60 backdrop-blur-md space-y-2 shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="text-xl font-bold text-sky-400 font-mono">{s.step}</div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">{s.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Link
          href="/test"
          className="px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto w-fit uppercase tracking-wider"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Vào Phòng Thi Thử Mô Phỏng Ngay</span>
        </Link>
      </div>
    </section>
  );
}
