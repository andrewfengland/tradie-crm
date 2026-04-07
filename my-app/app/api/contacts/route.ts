import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const full_name = (body.full_name as string | undefined)?.trim();
  if (!full_name) {
    return NextResponse.json({ error: 'full_name is required.' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from('customers').insert([{
    full_name,
    phone:    (body.phone    as string) || null,
    email:    (body.email    as string) || null,
    suburb:   (body.suburb   as string) || null,
    job_type: (body.job_type as string) || null,
    status:   (body.status   as string) || 'new',
    notes:    (body.notes    as string) || null,
  }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
