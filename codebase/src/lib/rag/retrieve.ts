import { supabase } from '@/lib/supabase/client';
import type { CitationItem } from '@/types/chat';

export interface RetrievalResult {
  citations: CitationItem[];
  maxScore: number;
}

export async function retrieveChunks(
  queryText: string,
  queryEmbedding: number[] | null = null,
  matchCount = 8,
  minScore = 0.015
): Promise<RetrievalResult> {
  if (!queryText || !queryText.trim()) {
    return { citations: [], maxScore: 0 };
  }

  try {
    if (queryEmbedding && queryEmbedding.length > 0) {
      const { data, error } = await supabase.rpc('search_chunks_hybrid' as any, {
        query_text: queryText,
        query_embedding: queryEmbedding,
        match_count: matchCount,
        rrf_k: 60,
      });

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

        return { citations, maxScore };
      }
    }

    // Fallback FTS nếu không có queryEmbedding
    const { data: ftsData, error: ftsError } = await supabase.rpc('search_chunks_fts' as any, {
      query_text: queryText,
      match_count: matchCount,
    });

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

      return { citations, maxScore };
    }
  } catch (err) {
    console.warn('[retrieveChunks] Exception:', err);
  }

  return { citations: [], maxScore: 0 };
}
