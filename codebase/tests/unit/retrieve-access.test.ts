import { beforeEach, describe, expect, it, vi } from 'vitest';

const { anonRpc, adminRpc, adminFrom, audienceIn } = vi.hoisted(() => ({
  anonRpc: vi.fn(),
  adminRpc: vi.fn(),
  adminFrom: vi.fn(),
  audienceIn: vi.fn(),
}));

vi.mock('../../src/lib/supabase/client', () => ({ supabase: { rpc: anonRpc } }));
vi.mock('../../src/lib/supabase/admin', () => ({
  supabaseAdmin: {
    rpc: adminRpc,
    from: adminFrom,
  },
}));

import { retrieveChunks } from '../../src/lib/rag/retrieve';

const emptyResult = { data: [], error: null };
const ftsResult = {
  data: [
    {
      chunk_id: 'chunk-public',
      document_id: 'doc-public',
      content: 'Thông tin tuyển sinh công khai',
      heading_path: null,
      document_title: 'Tuyển sinh',
      rank: 0.2,
    },
    {
      chunk_id: 'chunk-learning',
      document_id: 'doc-learning',
      content: 'Nội dung bài học riêng cho học viên',
      heading_path: null,
      document_title: 'Bài học',
      rank: 0.1,
    },
  ],
  error: null,
};

beforeEach(() => {
  anonRpc.mockReset().mockResolvedValue(emptyResult);
  adminRpc.mockReset().mockResolvedValue(emptyResult);
  audienceIn.mockReset().mockResolvedValue({
    data: [
      { id: 'doc-public', audience: 'public' },
      { id: 'doc-learning', audience: 'learning' },
    ],
    error: null,
  });
  adminFrom.mockReset().mockReturnValue({
    select: vi.fn().mockReturnValue({ in: audienceIn }),
  });
});

describe('RAG document access', () => {
  it('dùng anon client cho Visitor và chỉ giữ tài liệu public', async () => {
    anonRpc.mockResolvedValueOnce(ftsResult);

    const result = await retrieveChunks('thông tin tuyển sinh');

    expect(anonRpc).toHaveBeenCalledWith('search_chunks_fts', expect.any(Object));
    expect(adminRpc).not.toHaveBeenCalled();
    expect(result.citations.map((item) => item.documentId)).toEqual(['doc-public']);
  });

  it('dùng service role khi backend cho phép nội dung học và giữ public + learning', async () => {
    adminRpc.mockResolvedValueOnce(ftsResult);

    const result = await retrieveChunks('giải thích function calling', null, 8, 0.015, true);

    expect(adminRpc).toHaveBeenCalledWith('search_chunks_fts', expect.any(Object));
    expect(anonRpc).not.toHaveBeenCalled();
    expect(result.citations.map((item) => item.documentId)).toEqual(['doc-public', 'doc-learning']);
  });
});
