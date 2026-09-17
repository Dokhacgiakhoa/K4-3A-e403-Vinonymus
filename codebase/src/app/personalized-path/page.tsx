import type { Metadata } from 'next';
import { StudyPlanner } from '@/components/planner/study-planner';

export const metadata: Metadata = {
  title: 'Lộ trình cá nhân hoá',
  description: 'Lộ trình cá nhân hoá (Personalized Learning Path): AI Mentor chọn tối đa 3 việc trọng tâm cho bài lab tiếp theo, theo nền tảng và thời gian rảnh của bạn.',
};

export default function PersonalizedPathPage() {
  return <StudyPlanner />;
}
