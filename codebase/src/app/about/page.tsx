'use client';

import { ProgramOverviewSection } from '@/components/about/program-overview-section';
import { AlumniInsightsSection } from '@/components/about/alumni-insights-section';
import { SfiaMatrixView } from '@/components/sfia/sfia-matrix-view';

export default function AboutPage() {
  return (
    <div className="space-y-16 animate-fadeIn font-sans">
      {/* 1. GIỚI THIỆU CHƯƠNG TRÌNH AI IN ACTION & 6 ĐIỂM KHÁC BIỆT */}
      <ProgramOverviewSection />

      {/* 2. GÓC NHÌN THỰC CHIẾN TỪ HỌC VIÊN KHÓA 1: TRACK 1 • AI PRODUCT (HIỂU NGƯỜI DÙNG) */}
      <AlumniInsightsSection />

      {/* 3. MA TRẬN NĂNG LỰC SFIA 8 (LEVEL 1 - LEVEL 7) */}
      <div className="space-y-4 border-t border-slate-800 pt-8">
        <SfiaMatrixView onSelectLevel={() => {}} />
      </div>
    </div>
  );
}
