import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { CitationItem } from '@/types/chat';

export interface RetrievalResult {
  citations: CitationItem[];
  maxScore: number;
}

async function filterCitationsByAudience(
  citations: CitationItem[],
  includeLearning: boolean,
): Promise<CitationItem[]> {
  const ids = [...new Set(citations.map((item) => item.documentId))];
  if (ids.length === 0) return citations;

  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('id,audience')
    .in('id', ids);

  if (error || !Array.isArray(data)) return [];

  const allowed = new Set(
    data
      .filter((doc) => doc.audience === 'public' || (includeLearning && doc.audience === 'learning'))
      .map((doc) => doc.id),
  );

  return citations.filter((item) => allowed.has(item.documentId));
}

export async function retrieveChunks(
  queryText: string,
  queryEmbedding: number[] | null = null,
  matchCount = 8,
  minScore = 0.015,
  includeLearning = false,
): Promise<RetrievalResult> {
  if (!queryText || !queryText.trim()) {
    return { citations: [], maxScore: 0 };
  }

  const client = includeLearning ? supabaseAdmin : supabase;
  try {
    if (queryEmbedding && queryEmbedding.length > 0) {
      const { data, error } = await client.rpc('search_chunks_hybrid' as never, {
        query_text: queryText,
        query_embedding: queryEmbedding,
        match_count: matchCount,
        rrf_k: 60,
      } as never);

      if (!error && data && Array.isArray(data)) {
        const items = data as Array<{
          chunk_id: string;
          document_id: string;
          content: string;
          heading_path: string | null;
          document_title: string;
          rrf_score: number;
        }>;

        const maxScore = items.length > 0 ? (items[0]?.rrf_score ?? 0) : 0;
        if (maxScore < minScore) {
          return { citations: [], maxScore };
        }

        const citations: CitationItem[] = items.map((item) => ({
          chunkId: item.chunk_id,
          documentId: item.document_id,
          documentTitle: item.document_title,
          headingPath: item.heading_path,
          content: item.content,
          score: item.rrf_score,
        }));

        const filtered = await filterCitationsByAudience(citations, includeLearning);
        return { citations: filtered, maxScore: filtered.length > 0 ? maxScore : 0 };
      }
    }

    const { data: ftsData, error: ftsError } = await client.rpc('search_chunks_fts' as never, {
      query_text: queryText,
      match_count: matchCount,
    } as never);

    if (!ftsError && ftsData && Array.isArray(ftsData)) {
      const items = ftsData as Array<{
        chunk_id: string;
        document_id: string;
        content: string;
        heading_path: string | null;
        document_title: string;
        rank: number;
      }>;

      const maxScore = items.length > 0 ? (items[0]?.rank ?? 0) : 0;
      const citations: CitationItem[] = items.map((item) => ({
        chunkId: item.chunk_id,
        documentId: item.document_id,
        documentTitle: item.document_title,
        headingPath: item.heading_path,
        content: item.content,
        score: item.rank,
      }));

      const filtered = await filterCitationsByAudience(citations, includeLearning);
      return { citations: filtered, maxScore: filtered.length > 0 ? maxScore : 0 };
    }
  } catch (err) {
    console.warn('[retrieveChunks] Exception:', err);
  }

  return { citations: [], maxScore: 0 };
}
