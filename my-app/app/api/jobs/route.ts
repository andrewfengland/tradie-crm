import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';
import { dbJobToJob } from '@/app/lib/jobs';

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, jobs: (data ?? []).map(dbJobToJob) });
}

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

  const year = new Date().getFullYear();
  const jobNumber =
    (body.jobNumber as string | undefined)?.trim() ||
    `J-${year}-${Date.now().toString().slice(-6)}`;

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      job_number:     jobNumber,
      client_name:    (body.clientName    as string | undefined) || null,
      client_id:      (body.clientId      as string | undefined) || null,
      site_address:   (body.siteAddress   as string | undefined) || null,
      status:         (body.status        as string | undefined) || 'Scheduled',
      assigned_staff: (body.assignedStaff as string | undefined) || null,
      scheduled_date: (body.scheduledDate as string | undefined) || null,
      start_date:     (body.startDate     as string | undefined) || null,
      end_date:       (body.endDate       as string | undefined) || null,
      time_window:    (body.timeWindow    as string | undefined) || null,
      assigned_crew:  (body.assignedCrew  as string | undefined) || null,
      scope:          (body.scope         as string | undefined) || null,
      notes:          (body.notes         as string | undefined) || null,
      quote_id:       (body.quoteId       as string | undefined) || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, job: dbJobToJob(data) }, { status: 201 });
}
