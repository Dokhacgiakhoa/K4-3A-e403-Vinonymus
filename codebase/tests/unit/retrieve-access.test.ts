import { beforeEach, describe, expect, it, vi } from 'vitest';

const { anonRpc, adminRpc } = vi.hoisted(() => ({
  anonRpc: vi.fn(),
  adminRpc: vi.fn(),
}));

vi.mock('../../src/lib/supabase/client', () => ({ supabase: { rpc: anonRpc } }));
vi.mock('../../src/lib/supabase/admin', () => ({ supabaseAdmin: { rpc: adminRpc } }));

import { retrieveChunks } from '../../src/lib/rag/retrieve';

const emptyResult = { data: [], error: null };

beforeEach(() => {
  anonRpc.mockReset().mockResolvedValue(emptyResult);
  adminRpc.mockReset().mockResolvedValue(emptyResult);
});

describe('RAG document access', () => {
  it('d?ng anon client cho Visitor', async () => {
    await retrieveChunks('th?ng tin tuy?n sinh');

    expect(anonRpc).toHaveBeenCalledWith('search_chunks_fts', expect.any(Object));
    expect(adminRpc).not.toHaveBeenCalled();
  });

  it('ch? d?ng service role khi backend ?? cho ph?p n?i dung h?c', async () => {
    await retrieveChunks('gi?i th?ch function calling', null, 8, 0.015, true);

    expect(adminRpc).toHaveBeenCalledWith('search_chunks_fts', expect.any(Object));
    expect(anonRpc).not.toHaveBeenCalled();
  });
});
