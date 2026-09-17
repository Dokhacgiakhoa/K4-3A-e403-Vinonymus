import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { generateRoadmap } from '@/backend/platform/mentor';
import { plannerApiInputSchema } from '@/lib/prompts/planner';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const parsed = plannerApiInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: issue?.message ?? 'Dữ liệu không hợp lệ', field: issue?.path.join('.') }, {status:400});
  }
  const result = await generateRoadmap({ background: parsed.data.background, availableMinutes: parsed.data.available_minutes,
    labId: parsed.data.lab_id, note: parsed.data.note }, req);
  return NextResponse.json(result, {headers:{'x-planner-request-id':randomUUID(),'Cache-Control':'no-store'}});
}
