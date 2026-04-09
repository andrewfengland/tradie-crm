import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id: quote_id, itemId } = await params;

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { error } = await supabase.from('quote_line_items').delete().eq('id', itemId);
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
