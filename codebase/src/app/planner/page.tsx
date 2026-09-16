import type { Metadata } from 'next';
import { StudyPlanner } from '@/components/planner/study-planner';

export const metadata: Metadata = {
  title: 'AI Diagnostic Study Planner',
  description: 'Lập kế hoạch tự học 3 việc trọng tâm cho bài lab tiếp theo, theo nền tảng và thời gian rảnh.',
};

export default function PlannerPage() {
  return <StudyPlanner />;
}
