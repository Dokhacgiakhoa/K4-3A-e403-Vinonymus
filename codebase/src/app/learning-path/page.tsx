import type { Metadata } from 'next';
import { StudentPathGate } from '@/components/planner/student-path-gate';

export const metadata: Metadata = {
  title: 'Lộ trình cá nhân hoá',
  description: 'Lộ trình cá nhân hoá cho học viên đã đăng nhập: AI Mentor chọn tối đa 3 việc trọng tâm cho bài lab tiếp theo, theo nền tảng và thời gian rảnh.',
};

export default function LearningPathPage() {
  return <StudentPathGate />;
}
