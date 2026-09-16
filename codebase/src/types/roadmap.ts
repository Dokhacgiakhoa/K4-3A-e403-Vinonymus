export type BackgroundType = 'non_tech' | 'software_dev' | 'data_analyst' | 'student';

export interface AdaptiveQuestionOption {
  id: string;
  label: string;
  description?: string;
  tag?: string;
}

export interface AdaptiveQuestion {
  id: string;
  question: string;
  contextNote: string;
  options: AdaptiveQuestionOption[];
  customPlaceholder?: string;
}

export interface AdaptiveAnswer {
  questionId: string;
  selectedOptionId: string;
  customText?: string;
}

export interface RoadmapMilestone {
  id: string;
  roadmap_id: string;
  sprint_number: number;
  title: string;
  description: string;
  target_days: number;
  selected_lesson_ids: string[];
  boss_fight_task: string;
  status: 'available' | 'locked' | 'completed';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileInput {
  cvFileName?: string;
  cvFileSize?: string;
  cvContentText?: string;
  bioDescription?: string;
}

export interface PersonalizedRoadmap {
  id: string;
  user_id: string;
  title: string;
  target_goal: string;
  weekly_hours_budget: number;
  total_target_hours: number;
  ai_mentor_advice: string;
  status: 'in_progress' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  milestones: RoadmapMilestone[];
  personalized_tags?: string[];
  focus_topics?: string[];
  userProfile?: UserProfileInput;
}

