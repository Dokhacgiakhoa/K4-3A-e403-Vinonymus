import { createHash } from 'node:crypto';
import { fetchBackend, getBackendUrl } from '@/lib/server/backend';

export const GUEST_DAILY_LIMIT = 10;
// Cả lớp học có thể dùng chung một IP, nên hạn mức theo IP cao hơn nhiều.
const GUEST_IP_DAILY_LIMIT = 200;

export interface GuestQuotaResult {
  allowed: boolean;
  limit: number;
  remaining: number;
}

export function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
}

function vietnamDay(now: Date): string {
  return new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

// Chỉ dùng khi chưa có backend: bộ đếm nằm trong bộ nhớ của một instance server,
// nên trên Vercel chỉ chặn được một phần.
const memoryCounters = new Map<string, number>();

export function consumeInMemory(sessionHash: string, ipHash: string, now = new Date()): GuestQuotaResult {
  const day = vietnamDay(now);
  for (const key of memoryCounters.keys()) {
    if (!key.startsWith(day)) memoryCounters.delete(key);
  }

  const sKey = `${day}:s:${sessionHash}`;
  const iKey = `${day}:i:${ipHash}`;
  const sessionCount = (memoryCounters.get(sKey) ?? 0) + 1;
  const ipCount = (memoryCounters.get(iKey) ?? 0) + 1;

  if (sessionCount > GUEST_DAILY_LIMIT || ipCount > GUEST_IP_DAILY_LIMIT) {
    return { allowed: false, limit: GUEST_DAILY_LIMIT, remaining: 0 };
  }

  memoryCounters.set(sKey, sessionCount);
  memoryCounters.set(iKey, ipCount);
  return { allowed: true, limit: GUEST_DAILY_LIMIT, remaining: GUEST_DAILY_LIMIT - sessionCount };
}

export function resetInMemoryQuotaForTests(): void {
  memoryCounters.clear();
}

/** Trừ một lượt hỏi của khách. Chỉ gửi mã băm ra ngoài, không gửi IP hay mã phiên gốc. */
export async function consumeGuestQuota(sessionId: string | null, ip: string): Promise<GuestQuotaResult> {
  // Thiếu mã phiên thì gộp theo IP, để không lách được hạn mức bằng cách bỏ header.
  const sessionHash = sha256Hex(`session:${sessionId || `ip:${ip}`}`);
  const ipHash = sha256Hex(`ip:${ip}`);

  if (getBackendUrl()) {
    try {
      const res = await fetchBackend('/api/v1/quota/helpdesk/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionHash, ipHash }),
      });
      if (res.ok) {
        const body = (await res.json()) as { data?: GuestQuotaResult };
        if (body.data) return body.data;
      }
    } catch {
      // Backend lỗi: rơi về bộ đếm trong bộ nhớ thay vì chặn hết khách.
    }
  }

  return consumeInMemory(sessionHash, ipHash);
}
