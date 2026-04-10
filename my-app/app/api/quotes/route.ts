import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function POST(req: NextRequest) {
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

  const { data, error } = await supabase
    .from('quotes')
    .insert([{
      contact_name:   (body.contact_name as string) || null,
      opportunity_id: (body.opportunity_id as string) || null,
      status:         (body.status as string) || 'Draft',
      notes:          (body.notes as string) || null,
      job_address:    (body.job_address as string) || null,
      subtotal:       0,
      total:          0,
    }])
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
