import type { Metadata } from 'next';
import { LecturerDocumentsView } from '@/components/lecturer/lecturer-documents-view';

export const metadata: Metadata = {
  title: 'Tài liệu của tôi',
  robots: { index: false, follow: false },
};

export default function LecturerDocumentsPage() {
  return <LecturerDocumentsView />;
}
