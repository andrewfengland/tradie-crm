import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';
import { dbJobToJob } from '@/app/lib/jobs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized – please sign in.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, job: dbJobToJob(data) });
}

const ALLOWED_PATCH_FIELDS: Record<string, string> = {
  status:        'status',
  clientName:    'client_name',
  siteAddress:   'site_address',
  assignedStaff: 'assigned_staff',
  scheduledDate: 'scheduled_date',
  startDate:     'start_date',
  endDate:       'end_date',
  timeWindow:    'time_window',
  assignedCrew:  'assigned_crew',
  scope:         'scope',
  notes:         'notes',
};

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

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_PATCH_FIELDS[key] !== undefined) {
      updates[ALLOWED_PATCH_FIELDS[key]] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Job not found.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, job: dbJobToJob(data) });
}
