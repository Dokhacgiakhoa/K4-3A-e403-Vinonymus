import { feedbackController } from '@/backend/composition/feedback';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  return feedbackController.submit(request);
}
