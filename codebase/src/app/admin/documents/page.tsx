import type { Metadata } from 'next';
import { DocumentReviewView } from '@/components/admin/document-review-view';

export const metadata: Metadata = {
  title: 'Duyệt tài liệu',
  robots: { index: false, follow: false },
};

export default function DocumentReviewPage() {
  return <DocumentReviewView />;
}
