import { Github, Users, Crown } from 'lucide-react';

// Thông tin nhóm khớp bảng thành viên trong README.md — sửa ở cả hai nơi nếu đổi.
const TEAM_MEMBERS = [
  {
    name: 'Đỗ Khắc Gia Khoa',
    studentId: '02733',
    role: 'PM (Đội trưởng)',
    responsibility:
      'Chốt Canvas & lát cắt, khảo sát nỗi đau, viết spec.md, điều phối checkpoint & nộp form, slide + pitch, validation (R6)',
    isLead: true,
  },
  {
    name: 'Trần Nhật Minh',
    studentId: '02483',
    role: 'BE',
    responsibility:
      'Backend/API cho prototype (/api/roadmap), tích hợp lời gọi AI qua LLM router, quản lý biến môi trường',
    isLead: false,
  },
  {
    name: 'Đinh Ngọc Đức',
    studentId: '02935',
    role: 'AI',
    responsibility:
      'Thiết kế prompt/pipeline AI, xây golden set & chạy eval (eval/), phân tích lỗi và kịch bản rủi ro',
    isLead: false,
  },
  {
    name: 'Nguyễn Việt Thành',
    studentId: '02924',
    role: 'FE',
    responsibility:
      'Giao diện & luồng người dùng (CP2), mock bấm được, quay video thao tác CP3 và video demo dự phòng CP5',
    isLead: false,
  },
];

export function AuthorContactView() {
  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* HERO — thông tin đội thi */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-2xl border border-sky-500/30">
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-medium uppercase tracking-wider backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Nhóm Vinonymus · Lớp 3A · Phòng E403 · Cụm C2</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide uppercase leading-tight text-shadow-clean">
            AI Diagnostic Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl">
            Mini Hackathon AI · Batch 04 · Track E — Làn mở. Bốn thành viên phụ trách bốn phần việc, mỗi người
            giải thích được đúng phần có tên mình.
          </p>
          <a
            href="https://github.com/Dokhacgiakhoa/K4-3A-e403-Vinonymus"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b1329]/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition shadow-sm"
          >
            <Github className="w-4 h-4 text-sky-400" />
            <span>Repo GitHub</span>
          </a>
        </div>
      </div>

      {/* DANH SÁCH THÀNH VIÊN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.studentId}
            className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-700/80 space-y-2 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              {member.isLead && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
              <h3 className="text-sm font-bold text-white">{member.name}</h3>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-mono uppercase">
                {member.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Mã học viên: {member.studentId}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{member.responsibility}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
