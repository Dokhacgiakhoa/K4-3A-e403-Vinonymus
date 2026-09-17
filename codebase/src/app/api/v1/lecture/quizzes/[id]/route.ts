import { handler } from '@/backend/platform/controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler('lectureQuiz');
export const PUT = handler('updateQuiz');
export const DELETE = handler('deleteQuiz');
