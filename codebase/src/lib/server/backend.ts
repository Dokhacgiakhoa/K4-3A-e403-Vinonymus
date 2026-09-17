/**
 * Địa chỉ backend .NET cho các lời gọi từ server.
 * Trả `null` khi chưa cấu hình: khi đó app chưa bắt đăng nhập, để web thật không bị khoá
 * trong lúc backend chưa được deploy.
 */
export function getBackendUrl(): string | null {
  const url = process.env.BACKEND_CORE_URL || process.env.NEXT_PUBLIC_BACKEND_CORE_URL;
  return url ? url.replace(/\/+$/, '') : null;
}

export async function fetchBackend(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  const base = getBackendUrl();
  if (!base) throw new Error('Backend chưa được cấu hình');

  const { timeoutMs = 4000, ...rest } = init;
  return fetch(`${base}${path}`, {
    ...rest,
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  });
}
