import { handler } from '@/backend/modules/lecture/lecture.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler('reviews');
