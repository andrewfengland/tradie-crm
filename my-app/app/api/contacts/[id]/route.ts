import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing contact id.' }, { status: 400 });
  }

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
  const { error } = await supabase
    .from('customers')
    .update({
      full_name,
      phone:    (body.phone    as string) || null,
      email:    (body.email    as string) || null,
      suburb:   (body.suburb   as string) || null,
      job_type: (body.job_type as string) || null,
      status:   (body.status   as string) || 'new',
      notes:    (body.notes    as string) || null,
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
    return NextResponse.json({ error: 'Missing contact id.' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from('customers').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
