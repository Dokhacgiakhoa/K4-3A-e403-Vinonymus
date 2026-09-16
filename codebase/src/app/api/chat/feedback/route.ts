import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { queryLogId, rating, reason, note, clientSessionId } = body;

    if (!queryLogId || typeof rating !== 'number' || ![-1, 1].includes(rating)) {
      return NextResponse.json(
        { error: 'Dữ liệu đánh giá không hợp lệ (rating phải là 1 hoặc -1)' },
        { status: 400 }
      );
    }

    // Dùng RPC thay vì upsert trực tiếp: query_feedback chỉ có policy INSERT, mà upsert (để hỗ trợ
    // "đổi ý", FR-18 AC4) còn đòi quyền UPDATE + SELECT — mở 2 quyền đó cho anon thì ai cũng sửa
    // được đánh giá và đọc được ghi chú của người khác. Xem migration 0014.
    const { error } = await supabase.rpc('submit_feedback' as never, {
      p_query_log_id: queryLogId,
      p_rating: rating,
      p_reason: reason ?? null,
      p_note: note ?? null,
      p_client_session_id: clientSessionId ?? null,
    } as never);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}
