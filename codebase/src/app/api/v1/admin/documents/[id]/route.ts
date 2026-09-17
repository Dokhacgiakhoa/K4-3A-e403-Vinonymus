import { handler } from '@/backend/platform/controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler('adminDocument');
export const DELETE = handler('adminDelete');
