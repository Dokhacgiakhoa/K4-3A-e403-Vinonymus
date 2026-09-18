import { FlaskConical } from 'lucide-react';

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div
      role="note"
      className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
    >
      <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" />
      <span>
        <strong className="text-amber-200">Bản demo giao diện</strong> — chưa nối backend, dữ liệu là mẫu và chỉ lưu trên trình duyệt này.
        {children ? <> {children}</> : null}
      </span>
    </div>
  );
}
