import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const update: Record<string, unknown> = {};
  if (body.contact_name  !== undefined) update.contact_name  = body.contact_name;
  if (body.status        !== undefined) update.status        = body.status;
  if (body.notes         !== undefined) update.notes         = body.notes;
  if (body.subtotal      !== undefined) update.subtotal      = body.subtotal;
  if (body.total         !== undefined) update.total         = body.total;
  if (body.follow_up_date !== undefined) update.follow_up_date = body.follow_up_date || null;
  if (body.follow_up_note !== undefined) update.follow_up_note = body.follow_up_note || null;

  const { error } = await supabase.from('quotes').update(update).eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { error } = await supabase.from('quotes').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
