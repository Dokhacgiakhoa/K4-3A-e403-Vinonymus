import { supabase } from '@/lib/supabase/client';
import { createFeedbackController } from '../controllers/feedback.controller';
import { createSupabaseFeedbackRepository } from '../repositories/supabase-feedback.repository';
import { createFeedbackService } from '../services/feedback.service';

const repository = createSupabaseFeedbackRepository(supabase);
const service = createFeedbackService(repository);
export const feedbackController = createFeedbackController(service);
