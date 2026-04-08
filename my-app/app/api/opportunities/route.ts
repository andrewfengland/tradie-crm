import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const title = (body.title as string | undefined)?.trim();
  if (!title) {
    return NextResponse.json({ error: 'title is required.' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { error } = await supabase.from('opportunities').insert([{
    title,
    contact_name: (body.contact_name as string) || null,
    stage:        (body.stage        as string) || null,
    value:        body.value != null && body.value !== '' ? Number(body.value) : null,
    notes:        (body.notes        as string) || null,
  }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
