/**
 * AI in Action (AIIA) - Spaced Repetition Engine (Thuật toán lặp lại ngắt quãng xoắn ốc)
 * Features:
 * 1. Target Lesson Questions (70% weight)
 * 2. Past Milestone Review Questions (30% weight) to reinforce long-term memory
 * 3. Tagging questions as [Mới] vs [Ôn Tập Mốc Trước]
 * 4. Shuffling & Smart Queueing
 */

import { getAllLessons, getLessonById, type MicroLesson, type MicroQuizQuestion } from '@/data/MicroCurriculumData';

export interface SpacedQuizQuestion extends MicroQuizQuestion {
  originLessonId: string;
  originLessonTitle: string;
  isReviewQuestion: boolean;
}

export interface SpacedRepetitionSession {
  targetLessonId: string;
  targetLessonTitle: string;
  totalQuestions: number;
  newQuestionsCount: number;
  reviewQuestionsCount: number;
  questions: SpacedQuizQuestion[];
  estimatedMinutes: number;
}

/**
 * Xáo trộn mảng ngẫu nhiên (Fisher-Yates shuffle)
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }
  return arr;
}

/**
 * Tạo một phiên học Spaced Repetition cho một bài học/mốc mục tiêu
 * @param targetLessonId ID của bài học đang chọn
 * @param completedLessonIds Danh sách các bài học đã hoàn thành trước đó
 * @param maxReviewCount Số lượng câu hỏi ôn tập tối đa cần trộn vào (mặc định 2-3 câu)
 */
export function generateSpacedRepetitionSession(
  targetLessonId: string,
  completedLessonIds: string[] = [],
  maxReviewCount: number = 2
): SpacedRepetitionSession {
  const targetLesson = getLessonById(targetLessonId);
  const allLessons = getAllLessons();

  if (!targetLesson) {
    // Fallback nếu không tìm thấy bài
    const firstLesson = allLessons[0];
    return {
      targetLessonId: firstLesson?.id ?? 'py-01',
      targetLessonTitle: firstLesson?.title ?? 'Nhập môn',
      totalQuestions: firstLesson?.quizQuestions.length ?? 0,
      newQuestionsCount: firstLesson?.quizQuestions.length ?? 0,
      reviewQuestionsCount: 0,
      questions: (firstLesson?.quizQuestions ?? []).map(q => ({
        ...q,
        originLessonId: firstLesson?.id ?? 'py-01',
        originLessonTitle: firstLesson?.title ?? 'Nhập môn',
        isReviewQuestion: false
      })),
      estimatedMinutes: firstLesson?.estimatedMinutes ?? 15
    };
  }

  // 1. Lấy tất cả câu hỏi của bài học hiện tại (Target Questions)
  const currentQuestions: SpacedQuizQuestion[] = targetLesson.quizQuestions.map(q => ({
    ...q,
    originLessonId: targetLesson.id,
    originLessonTitle: targetLesson.title,
    isReviewQuestion: false
  }));

  // 2. Thu thập câu hỏi từ các bài học đã hoàn thành trước đó (trừ bài hiện tại)
  const previousCompletedIds = completedLessonIds.filter(id => id !== targetLessonId);
  const reviewPool: SpacedQuizQuestion[] = [];

  for (const prevId of previousCompletedIds) {
    const prevLesson = getLessonById(prevId);
    if (prevLesson && prevLesson.quizQuestions.length > 0) {
      for (const q of prevLesson.quizQuestions) {
        reviewPool.push({
          ...q,
          originLessonId: prevLesson.id,
          originLessonTitle: prevLesson.title,
          isReviewQuestion: true
        });
      }
    }
  }

  // 3. Nếu người dùng chưa hoàn thành bài nào trước đó, nhưng đây là bài học từ bài 2 trở lên,
  // ta vẫn có thể lấy ngẫu nhiên 1-2 câu từ các bài đứng trước trong cùng môn để tạo tính liên kết
  if (reviewPool.length === 0 && targetLesson.order > 1) {
    const priorLessonsInSubject = allLessons.filter(
      l => l.subjectId === targetLesson.subjectId && l.order < targetLesson.order
    );
    for (const prior of priorLessonsInSubject) {
      for (const q of prior.quizQuestions) {
        reviewPool.push({
          ...q,
          originLessonId: prior.id,
          originLessonTitle: prior.title,
          isReviewQuestion: true
        });
      }
    }
  }

  // 4. Lấy ngẫu nhiên các câu hỏi review
  const shuffledReviewPool = shuffleArray(reviewPool);
  const selectedReviewQuestions = shuffledReviewPool.slice(0, maxReviewCount);

  // 5. Kết hợp câu hỏi mới + câu hỏi review và xáo trộn
  const finalQuestions = shuffleArray([...currentQuestions, ...selectedReviewQuestions]);

  return {
    targetLessonId: targetLesson.id,
    targetLessonTitle: targetLesson.title,
    totalQuestions: finalQuestions.length,
    newQuestionsCount: currentQuestions.length,
    reviewQuestionsCount: selectedReviewQuestions.length,
    questions: finalQuestions,
    estimatedMinutes: targetLesson.estimatedMinutes
  };
}
