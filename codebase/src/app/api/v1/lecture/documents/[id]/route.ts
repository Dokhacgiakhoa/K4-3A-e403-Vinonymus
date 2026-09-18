import { handler } from '@/backend/modules/lecture/lecture.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler('document');
export const PUT = handler('updateDocument');
export const DELETE = handler('deleteDocument');
