import type { Metadata } from 'next';
import { AccountApprovalView } from '@/components/admin/account-approval-view';

export const metadata: Metadata = {
  title: 'Duyệt tài khoản',
  robots: { index: false, follow: false },
};

export default function AccountApprovalPage() {
  return <AccountApprovalView />;
}
