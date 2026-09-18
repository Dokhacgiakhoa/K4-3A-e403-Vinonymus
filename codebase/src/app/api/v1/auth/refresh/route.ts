import { handler } from '@/backend/modules/auth/auth.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = handler('refresh');
