import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; materialId: string }> }
) {
  const { materialId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const VALID_STATUSES = ['Needed', 'Ordered', 'Delivered'];
  const status = body.status as string | undefined;
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'status must be Needed, Ordered, or Delivered.' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { error } = await supabase.from('job_materials').update({ status }).eq('id', materialId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; materialId: string }> }
) {
  const { materialId } = await params;

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { error } = await supabase.from('job_materials').delete().eq('id', materialId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
