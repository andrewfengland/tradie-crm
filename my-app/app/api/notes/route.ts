import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parentType = searchParams.get('parent_type');
  const parentId   = searchParams.get('parent_id');

  if (!parentType || !parentId) {
    return NextResponse.json({ error: 'parent_type and parent_id are required.' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('parent_type', parentType)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, notes: data });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const bodyText   = (body.body as string)?.trim();
  const parentType = body.parent_type as string;
  const parentId   = body.parent_id as string;

  if (!bodyText) {
    return NextResponse.json({ error: 'body is required.' }, { status: 400 });
  }
  if (!parentType || !parentId) {
    return NextResponse.json({ error: 'parent_type and parent_id are required.' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('notes')
    .insert([{ body: bodyText, parent_type: parentType, parent_id: parentId }])
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
