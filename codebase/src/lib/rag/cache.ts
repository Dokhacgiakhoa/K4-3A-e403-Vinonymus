import crypto from 'crypto';
import { supabase } from '@/lib/supabase/client';
import { normalizeText } from './normalize';
import type { CitationItem } from '@/types/chat';

export interface CachedResponse {
  answer: string;
  citations: CitationItem[];
}

function hashQuestion(question: string): string {
  const norm = normalizeText(question);
  return crypto.createHash('sha256').update(norm, 'utf8').digest('hex');
}

export async function getSemanticCache(question: string): Promise<CachedResponse | null> {
  if (!question || !question.trim()) return null;

  try {
    const qHash = hashQuestion(question);
    const { data, error } = await supabase
      .from('semantic_cache')
      .select('answer, citations, expires_at, hit_count, id')
      .eq('question_hash', qHash)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error || !data) return null;

    const record = data as unknown as {
      id: string;
      answer: string;
      citations: CitationItem[];
      hit_count: number;
    };

    // Tăng hit_count bất đồng bộ
    Promise.resolve(
      supabase
        .from('semantic_cache')
        .update({ hit_count: (record.hit_count || 0) + 1 })
        .eq('id', record.id)
    ).catch(() => {});

    return {
      answer: record.answer,
      citations: Array.isArray(record.citations) ? record.citations : [],
    };
  } catch (err) {
    console.warn('[getSemanticCache] Exception:', err);
    return null;
  }
}

export async function setSemanticCache(
  question: string,
  answer: string,
  citations: CitationItem[] = [],
  ttlDays = 7
): Promise<void> {
  if (!question || !answer || !question.trim() || !answer.trim()) return;

  try {
    const qHash = hashQuestion(question);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();

    await supabase.from('semantic_cache').upsert(
      {
        question_hash: qHash,
        question: question.trim(),
        answer: answer.trim(),
        citations: citations as any,
        expires_at: expiresAt,
      },
      { onConflict: 'question_hash' }
    );
  } catch (err) {
    console.warn('[setSemanticCache] Exception:', err);
  }
}
