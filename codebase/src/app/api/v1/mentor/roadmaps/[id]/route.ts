import { handler } from '@/backend/modules/mentor/mentor.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler('roadmap');
export const DELETE = handler('deleteRoadmap');
