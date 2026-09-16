import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CourseClassroomView } from '@/components/learning/course-classroom-view';
import { AI_FOR_EVERYONE_MODULES } from '@/data/ai-for-everyone-curriculum';
import { SFIA_COMMUNITY_DATA, CurriculumModuleItem } from '@/data/sfia-community-data';
import { COMPREHENSIVE_EXPANDED_MODULES } from '@/data/comprehensive-curriculum-expanded';
import { ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';

interface PageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function CourseClassroomPage({ params }: PageProps) {
  const { moduleId } = await params;

  // Gộp toàn bộ 67 chuyên đề (AI Foundations L0 + SFIA L1-L4)
  const allModules: CurriculumModuleItem[] = [
    ...AI_FOR_EVERYONE_MODULES,
    ...SFIA_COMMUNITY_DATA.curriculumModules,
    ...COMPREHENSIVE_EXPANDED_MODULES
  ];

  // Tìm module theo ID (hỗ trợ so khớp linh hoạt)
  const normalizedId = moduleId.trim().toLowerCase();
  const currentModule = allModules.find(m => {
    const mId = m.id.trim().toLowerCase();
    return mId === normalizedId || mId.replace('-', '') === normalizedId.replace('-', '');
  });

  // Nếu không tìm thấy khóa học
  if (!currentModule) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0b1329]/95 border border-sky-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white uppercase tracking-wide">
              Không Tìm Thấy Chuyên Đề
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mã khóa học <code className="text-amber-400 font-mono px-1.5 py-0.5 rounded bg-slate-900">{moduleId}</code> không tồn tại trong Thư Viện Học Tập hoặc đã được cập nhật đường dẫn mới.
            </p>
          </div>

          <Link
            href="/learning"
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Lại Thư Viện Khóa Học</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CourseClassroomView 
      module={currentModule} 
      allModules={allModules} 
    />
  );
}
