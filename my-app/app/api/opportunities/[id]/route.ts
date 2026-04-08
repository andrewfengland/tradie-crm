import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing opportunity id.' }, { status: 400 });
  }

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
  const { error } = await supabase
    .from('opportunities')
    .update({
      title,
      contact_name: (body.contact_name as string) || null,
      stage:        (body.stage        as string) || null,
      value:        body.value != null && body.value !== '' ? Number(body.value) : null,
      notes:        (body.notes        as string) || null,
    })
    .eq('id', id);

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
  if (!id) {
    return NextResponse.json({ error: 'Missing opportunity id.' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.from('opportunities').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
