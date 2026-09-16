import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

function basicHealth() {
  return NextResponse.json({
    status: 'ok',
    appName: 'AIIA Notebook',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  // Chưa cấu hình CRON_SECRET ở môi trường này → giữ hành vi cũ, không đụng Supabase (đúng tinh
  // thần FR-53.4: thiếu cấu hình phụ trợ không được chặn app, chỉ tắt phần tính năng liên quan).
  if (!cronSecret) {
    return basicHealth();
  }

  const authHeader = req.headers.get('authorization');
  const provided = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // Header sai/thiếu → vẫn trả health-check cơ bản (không lộ thông tin qua mã lỗi khác biệt),
  // chỉ bỏ qua phần đụng Supabase — tránh biến endpoint này thành nơi dò secret.
  if (provided !== cronSecret) {
    return basicHealth();
  }

  let db: 'connected' | 'error' = 'connected';
  try {
    const { error } = await supabaseAdmin.from('categories').select('slug').limit(1);
    if (error) db = 'error';

    await supabaseAdmin.from('semantic_cache').delete().lt('expires_at', new Date().toISOString());
  } catch (err) {
    console.warn('[api/health] Lỗi khi ping Supabase / dọn semantic_cache:', err);
    db = 'error';
  }

  return NextResponse.json({
    status: 'ok',
    appName: 'AIIA Notebook',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    db,
  });
}
