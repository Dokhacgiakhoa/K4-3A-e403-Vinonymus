import { NextResponse } from 'next/server';
import { getAllLocalFaqs } from '@/lib/faqs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const faqs = getAllLocalFaqs();
    const activeFaqs = faqs.filter((item) => item.is_active);
    return NextResponse.json({ faqs: activeFaqs });
  } catch (error) {
    console.error('API /api/faqs error:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách FAQ' }, { status: 500 });
  }
}
