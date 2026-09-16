const EMBEDDING_DIM = 768;
const BATCH_SIZE = 20;
const MAX_RETRIES = 4;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryDelayMs(errorBody: string): number | null {
  const match = errorBody.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
  if (!match || !match[1]) return null;
  return Math.ceil(parseFloat(match[1]) * 1000);
}

// Quota theo NGÀY (vd. EmbedContentRequestsPerDayPerProjectPerModel-FreeTier) không
// tự hồi phục trong vài giây/phút như quota theo RPM, nên retry/backoff vô ích — dừng ngay.
function isDailyQuotaExceeded(errorBody: string): boolean {
  return /"quotaId"\s*:\s*"[^"]*PerDay[^"]*"/.test(errorBody);
}

export class DailyQuotaExceededError extends Error {
  constructor() {
    super('Gemini embedding daily quota exceeded');
    this.name = 'DailyQuotaExceededError';
  }
}

async function embedRequest(
  batch: string[],
  apiKey: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'
): Promise<(number[] | null)[]> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: batch.map((text) => ({
            model: 'models/gemini-embedding-001',
            content: {
              parts: [{ text }],
            },
            taskType,
            outputDimensionality: EMBEDDING_DIM,
          })),
        }),
      }
    );

    if (response.ok) {
      const data = (await response.json()) as {
        embeddings?: Array<{ values?: number[] }>;
      };

      if (data.embeddings && Array.isArray(data.embeddings)) {
        return data.embeddings.map((item) =>
          item?.values && Array.isArray(item.values) ? item.values : null
        );
      }
      return batch.map(() => null);
    }

    const errorBody = await response.text();

    if (response.status === 429 && isDailyQuotaExceeded(errorBody)) {
      console.warn(`[embedBatch] Quota theo NGÀY đã cạn, dừng ngay (không retry): ${errorBody}`);
      throw new DailyQuotaExceededError();
    }

    if (response.status === 429 && attempt < MAX_RETRIES) {
      const suggestedDelay = parseRetryDelayMs(errorBody);
      // Nếu suggestedDelay rỗng hoặc <= 0, dùng exponential backoff tối thiểu 2000ms
      const backoffMs = (suggestedDelay && suggestedDelay > 0)
        ? suggestedDelay
        : Math.max(2000, 2 ** attempt * 2000);
      console.warn(`[embedBatch] Rate limited (429), retry sau ${backoffMs}ms (lần ${attempt + 1}/${MAX_RETRIES})`);
      await sleep(backoffMs);
      continue;
    }

    console.warn(`[embedBatch] Error ${response.status}: ${errorBody}`);
    return batch.map(() => null);
  }

  return batch.map(() => null);
}

export async function embedBatch(
  texts: string[],
  apiKey: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'
): Promise<(number[] | null)[]> {
  if (!apiKey || !texts.length) {
    return texts.map(() => null);
  }

  const results: (number[] | null)[] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    if (i > 0) {
      // Nghỉ 500ms giữa các batch để tránh mỏi rate limit
      await sleep(500);
    }
    const batch = texts.slice(i, i + BATCH_SIZE);
    try {
      const batchResults = await embedRequest(batch, apiKey, taskType);
      results.push(...batchResults);
    } catch (error) {
      if (error instanceof DailyQuotaExceededError) {
        throw error;
      }
      console.warn('[embedBatch] Failed to fetch embeddings:', error);
      results.push(...batch.map(() => null));
    }
  }

  return results;
}
