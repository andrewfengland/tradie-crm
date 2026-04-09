import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: quote_id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const description = (body.description as string | undefined)?.trim();
  if (!description) {
    return NextResponse.json({ error: 'description is required.' }, { status: 400 });
  }

  const quantity   = Number(body.quantity   ?? 1);
  const unit_price = Number(body.unit_price ?? 0);
  const line_total = quantity * unit_price;

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { error } = await supabase.from('quote_line_items').insert([{
    quote_id,
    description,
    quantity,
    unit_price,
    line_total,
  }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Recalculate and persist quote totals
  const { data: items } = await supabase
    .from('quote_line_items')
    .select('line_total')
    .eq('quote_id', quote_id);
  const subtotal = (items ?? []).reduce((sum, i) => sum + (i.line_total ?? 0), 0);
  await supabase.from('quotes').update({ subtotal, total: subtotal }).eq('id', quote_id);

  return NextResponse.json({ ok: true });
}
