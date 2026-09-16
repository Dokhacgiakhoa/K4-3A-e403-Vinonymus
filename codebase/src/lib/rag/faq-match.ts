import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { supabase } from '@/lib/supabase/client';
import { normalizeText } from './normalize';
import type { MediaLinkItem } from '@/lib/faqs';

export interface FaqMatchResult {
  faqId: string;
  question: string;
  answer: string;
  matchType: 'exact' | 'trigram' | 'vector';
  score: number;
  priority: number;
  isVerified?: boolean;
  verificationSource?: string;
  title?: string;
  media_links?: MediaLinkItem[];
  /** Slug file local (vd: "phieu-an-cang-tin") — dùng để join lại metadata local, khác với faqId (UUID trên Supabase). */
  sourceSlug?: string;
}

interface LocalFaq {
  fileId: string;
  question: string;
  category?: string;
  variants: string[];
  answer: string;
  priority: number;
  isVerified?: boolean;
  verificationSource?: string;
  relatedQuestions?: string[];
  title?: string;
  mediaLinks?: MediaLinkItem[];
}

/** DB trả về faq_id (UUID) — không khớp trực tiếp với fileId (slug) của local markdown.
 *  Phải suy ra slug từ source_path để join ngược lại metadata local (is_verified, media_links...). */
function slugFromSourcePath(sourcePath?: string | null): string | undefined {
  if (!sourcePath) return undefined;
  return path.basename(sourcePath).replace(/\.md$/, '');
}

let localFaqsCache: LocalFaq[] | null = null;

function getLocalFaqs(): LocalFaq[] {
  if (localFaqsCache) return localFaqsCache;

  const faqsDir = path.join(process.cwd(), 'data', 'faqs');
  if (!fs.existsSync(faqsDir)) return [];

  const files = fs.readdirSync(faqsDir).filter((f) => f.endsWith('.md'));
  const list: LocalFaq[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(faqsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      list.push({
        fileId: file.replace('.md', ''),
        question: data.question || '',
        category: typeof data.category === 'string' ? data.category : undefined,
        variants: Array.isArray(data.variants) ? data.variants : [],
        answer: content.trim(),
        priority: typeof data.priority === 'number' ? data.priority : 0,
        isVerified: typeof data.is_verified === 'boolean' ? data.is_verified : undefined,
        verificationSource: typeof data.verification_source === 'string' ? data.verification_source : undefined,
        relatedQuestions: Array.isArray(data.related_questions)
          ? data.related_questions
          : Array.isArray(data.relatedQuestions)
          ? data.relatedQuestions
          : undefined,
        title: typeof data.title === 'string' ? data.title : undefined,
        mediaLinks: Array.isArray(data.media_links) ? (data.media_links as MediaLinkItem[]) : undefined,
      });
    } catch {
      // Ignore bad files
    }
  }

  localFaqsCache = list;
  return list;
}

/** So khớp bằng cách "chứa nhau" (includes) chỉ an toàn khi vế ngắn hơn có đủ ngữ cảnh (>=3 từ) —
 *  nếu không, một câu hỏi ngắn/chung chung (vd "giá vé") sẽ luôn "nằm trong" một câu hỏi FAQ dài
 *  bất kỳ có chứa cụm đó, gây khớp sai tự tin tuyệt đối (score 1.0) dù thực chất mơ hồ. */
function isConfidentContainmentMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const shorter = a.length <= b.length ? a : b;
  if (shorter.split(/\s+/).filter(Boolean).length < 3) return false;
  return a.includes(b) || b.includes(a);
}

function matchFaqLocal(normInput: string): FaqMatchResult | null {
  const faqs = getLocalFaqs();
  if (faqs.length === 0) return null;

  for (const faq of faqs) {
    const normQ = normalizeText(faq.question);
    if (isConfidentContainmentMatch(normInput, normQ)) {
      return {
        faqId: faq.fileId,
        question: faq.question,
        answer: faq.answer,
        matchType: 'exact',
        score: 1.0,
        priority: faq.priority,
        isVerified: faq.isVerified,
        verificationSource: faq.verificationSource,
        title: faq.title,
        media_links: faq.mediaLinks,
        sourceSlug: faq.fileId,
      };
    }

    for (const v of faq.variants) {
      const normV = normalizeText(v);
      if (isConfidentContainmentMatch(normInput, normV)) {
        return {
          faqId: faq.fileId,
          question: faq.question,
          answer: faq.answer,
          matchType: 'exact',
          score: 1.0,
          priority: faq.priority,
          isVerified: faq.isVerified,
          verificationSource: faq.verificationSource,
        };
      }
    }
  }

  return null;
}

export async function matchFaq(
  question: string,
  queryEmbedding: number[] | null = null,
  trgmThreshold = 0.75
): Promise<FaqMatchResult | null> {
  if (!question || !question.trim()) return null;

  const normInput = normalizeText(question);

  // 1. Thử RPC Supabase trước
  try {
    const { data, error } = await supabase.rpc('match_faq' as any, {
      p_question: question,
      p_embedding: queryEmbedding ?? undefined,
      p_trgm_threshold: trgmThreshold,
    });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const best = data[0] as {
        faq_id: string;
        question: string;
        answer: string;
        match_type: 'exact' | 'trigram' | 'vector';
        score: number;
        priority: number;
        source_path?: string;
      };

      Promise.resolve(supabase.rpc('increment_faq_view' as any, { p_faq_id: best.faq_id })).catch(() => {});

      const localMeta = getLocalFaqs().find((f) => f.fileId === slugFromSourcePath(best.source_path));
      const isVerified = localMeta?.isVerified ?? false;
      const verificationSource = localMeta?.verificationSource;

      return {
        faqId: best.faq_id,
        question: best.question,
        answer: best.answer,
        matchType: best.match_type,
        score: best.score,
        priority: best.priority,
        isVerified,
        verificationSource,
        title: localMeta?.title,
        media_links: localMeta?.mediaLinks,
        sourceSlug: localMeta?.fileId,
      };
    }
  } catch {
    // Fallback sang local
  }

  // 2. Local Fallback Matcher (Chống crash khi chưa kết nối Supabase)
  return matchFaqLocal(normInput);
}

/**
 * Lấy danh sách ứng viên FAQ khớp mờ theo vector (không chỉ top-1) để LLM
 * xác minh lại xem có FAQ nào thực sự đúng ý định câu hỏi hay không.
 */
export async function matchFaqCandidates(
  question: string,
  queryEmbedding: number[] | null,
  trgmThreshold = 0.75,
  vectorThreshold = 0.55
): Promise<FaqMatchResult[]> {
  if (!question || !question.trim() || !queryEmbedding) return [];

  try {
    const { data, error } = await supabase.rpc('match_faq' as any, {
      p_question: question,
      p_embedding: queryEmbedding,
      p_trgm_threshold: trgmThreshold,
      p_vector_threshold: vectorThreshold,
    });

      const localFaqs = getLocalFaqs();
      return (data as Array<{
        faq_id: string;
        question: string;
        answer: string;
        match_type: 'exact' | 'trigram' | 'vector';
        score: number;
        priority: number;
        source_path?: string;
      }>).map((item) => {
        const localMeta = localFaqs.find((f) => f.fileId === slugFromSourcePath(item.source_path));
        const isVerified = localMeta?.isVerified ?? false;
        const verificationSource = localMeta?.verificationSource;
        return {
          faqId: item.faq_id,
          question: item.question,
          answer: item.answer,
          matchType: item.match_type,
          score: item.score,
          priority: item.priority,
          isVerified,
          verificationSource,
          title: localMeta?.title,
          media_links: localMeta?.mediaLinks,
          sourceSlug: localMeta?.fileId,
        };
      });
  } catch {
    // Không có candidate, để pipeline tự xử lý fallback
  }

  return [];
}

export async function getRelatedFaqQuestions(
  faqId: string,
  sourceSlug?: string,
  limit = 3
): Promise<string[]> {
  const faqs = getLocalFaqs();
  const localKey = sourceSlug ?? faqId;
  const current = faqs.find((f) => f.fileId === localKey);

  // 1. Ưu tiên 1: Lấy danh sách related_questions khai báo thủ công trong file md
  if (current?.relatedQuestions && current.relatedQuestions.length > 0) {
    return current.relatedQuestions.slice(0, limit);
  }

  // 2. Thử truy vấn Supabase nếu DB có khai báo related_questions
  try {
    const { data: faqRow } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', faqId)
      .single();

    const related = (faqRow as any)?.related_questions;
    if (related && Array.isArray(related) && related.length > 0) {
      return (related as string[]).slice(0, limit);
    }
  } catch {
    // Ignore error
  }

  // 3. Ưu tiên 2: Chọn tập câu hỏi gợi ý liên quan theo chuyên mục hoặc danh sách FAQ khác
  const categoryName = current?.category;
  const categorySiblings = categoryName
    ? faqs.filter((f) => f.category === categoryName && f.fileId !== localKey && f.question !== current?.question)
    : [];

  const candidates = categorySiblings.length >= 2
    ? categorySiblings
    : faqs.filter((f) => (current ? f.fileId !== current.fileId && f.question !== current.question : true));

  if (candidates.length === 0) return [];

  // Seed biến thiên theo faqId đảm bảo mỗi FAQ luôn trả về tập câu hỏi gợi ý riêng biệt
  let seed = 0;
  const seedStr = localKey || 'default';
  for (let i = 0; i < seedStr.length; i++) {
    seed += seedStr.charCodeAt(i);
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    const hashA = (a.question.length * 7 + a.priority * 13 + seed) % 31;
    const hashB = (b.question.length * 7 + b.priority * 13 + seed) % 31;
    return hashB - hashA;
  });

  return sortedCandidates.slice(0, limit).map((f) => f.question);
}
