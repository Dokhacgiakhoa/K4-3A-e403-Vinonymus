import { handler } from '@/backend/modules/learning/learning.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler('progress');
export const POST = handler('updateProgress');
