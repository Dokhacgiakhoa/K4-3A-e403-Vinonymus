import { handler } from '@/backend/modules/admin/admin.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler('adminDocument');
export const DELETE = handler('adminDelete');
