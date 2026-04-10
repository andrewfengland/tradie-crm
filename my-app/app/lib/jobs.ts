export type Job = {
  id: string;
  jobNumber: string;
  clientName: string;
  clientId: string;
  siteAddress: string;
  status: string;
  assignedStaff: string;
  scheduledDate: string;
  startDate?: string;
  endDate?: string;
  timeWindow?: string;
  assignedCrew?: string;
  scope: string;
  materialsNeeded: string[];
  notes: string;
  quoteId?: string;
};

export const JOB_STAGES = [
  'Scheduled',
  'In Progress',
  'Awaiting Materials',
  'Completed',
  'Invoiced',
] as const;

export const JOB_STAGE_BADGE: Record<string, string> = {
  'Scheduled':          'bg-blue-100 text-blue-800',
  'In Progress':        'bg-emerald-100 text-emerald-800',
  'Awaiting Materials': 'bg-amber-100 text-amber-800',
  'Completed':          'bg-slate-100 text-slate-700',
  'Invoiced':           'bg-purple-100 text-purple-800',
  // Legacy fallbacks — keep existing records clean
  'Awaiting Approval':  'bg-amber-100 text-amber-800',
  'On Hold':            'bg-amber-100 text-amber-800',
  'Draft':              'bg-slate-100 text-slate-700',
};

export function updateJobStage(id: string, newStage: string) {
  const job = jobs.find((j) => j.id === id);
  if (job) {
    job.status = newStage;
  }
}

export const jobs: Job[] = [
  {
    id: '1',
    jobNumber: 'J-2024-001',
    clientName: 'Olivia Hart',
    clientId: '1',
    siteAddress: '14 Baker Street, Melbourne, VIC 3000',
    status: 'In Progress',
    assignedStaff: 'John Doe',
    scheduledDate: '2024-04-10',
    startDate: '2024-04-10',
    endDate: '2024-04-12',
    timeWindow: 'Morning (7am–12pm)',
    assignedCrew: 'John Doe, Mike Chen',
    scope: 'Kitchen renovation including cabinet installation, countertop replacement, and appliance hookup.',
    materialsNeeded: [
      'Kitchen cabinets (30 linear feet)',
      'Granite countertop (40 sq ft)',
      'Stainless steel appliances',
      'Tile backsplash (20 sq ft)',
    ],
    notes: 'Customer present during installation. Ensure morning schedule. Sand and seal existing floors after kitchen work.',
  },
  {
    id: '2',
    jobNumber: 'J-2024-002',
    clientName: 'Ethan Reed',
    clientId: '2',
    siteAddress: '9 River Road, Geelong, VIC 3220',
    status: 'Scheduled',
    assignedStaff: 'Jane Smith',
    scheduledDate: '2024-04-08',
    startDate: '2024-04-08',
    endDate: '2024-04-09',
    timeWindow: 'Full Day',
    assignedCrew: 'Jane Smith',
    scope: 'Full bathroom renovation including new tiles, fixtures, and ventilation system.',
    materialsNeeded: [
      'Bathroom tiles (200 sq ft)',
      'Bathroom fixtures (sink, toilet, shower)',
      'Ventilation fan with ducting',
      'Waterproofing membrane',
    ],
    notes: 'Water must be shut off before 8 AM. Subcontractor plumber Mike Chen to handle rough-in work.',
  },
  {
    id: '3',
    jobNumber: 'J-2024-003',
    clientName: 'Mia Carter',
    clientId: '3',
    siteAddress: '27 High Street, Bendigo, VIC 3550',
    status: 'Completed',
    assignedStaff: 'Bob Johnson',
    scheduledDate: '2024-03-15',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    timeWindow: 'Afternoon (12pm–5pm)',
    assignedCrew: 'Bob Johnson',
    scope: 'Custom office shelving and desk installation.',
    materialsNeeded: [
      'Custom shelving units (5 units)',
      'Wooden desk top (6ft x 3ft)',
      'Desk frame and legs',
      'Mounting hardware',
    ],
    notes: 'Project completed ahead of schedule. Client very satisfied with quality. Final inspection passed.',
  },
  // ── Temporary schedule test records (Step 52) ────────────────────────────
  {
    id: '4',
    jobNumber: 'J-2024-004',
    clientName: 'Schedule Test A',
    clientId: '',
    siteAddress: '10 Test Street',
    status: 'Scheduled',
    assignedStaff: 'Crew Alpha',
    scheduledDate: '2026-04-08',
    startDate: '2026-04-08',
    endDate: '2026-04-08',
    timeWindow: 'AM',
    assignedCrew: 'Crew Alpha',
    scope: 'Patio install test A',
    materialsNeeded: [],
    notes: 'Temporary test record for Step 52 schedule view.',
  },
  {
    id: '5',
    jobNumber: 'J-2024-005',
    clientName: 'Schedule Test B',
    clientId: '',
    siteAddress: '20 Test Street',
    status: 'Scheduled',
    assignedStaff: 'Crew Beta',
    scheduledDate: '2026-04-10',
    startDate: '2026-04-10',
    endDate: '2026-04-10',
    timeWindow: 'PM',
    assignedCrew: 'Crew Beta',
    scope: 'Deck build test B',
    materialsNeeded: [],
    notes: 'Temporary test record for Step 52 schedule view.',
  },
  {
    id: '6',
    jobNumber: 'J-2024-006',
    clientName: 'Schedule Test C',
    clientId: '',
    siteAddress: '30 Test Street',
    status: 'Draft',
    assignedStaff: '',
    scheduledDate: '',
    startDate: '',
    endDate: '',
    timeWindow: '',
    assignedCrew: '',
    scope: 'Carport unscheduled test',
    materialsNeeded: [],
    notes: 'Temporary test record for Step 52 schedule view. Intentionally unscheduled.',
  },
];

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}

export function createJobFromQuote(quote: Pick<import('./quotes').Quote, 'quoteNumber' | 'clientName' | 'clientId' | 'jobAddress' | 'lineItems' | 'notes'>): string {
  const newId = String(jobs.length + 1);
  const year = new Date().getFullYear();
  const newJobNumber = `J-${year}-${String(jobs.length + 1).padStart(3, '0')}`;
  const scope = quote.lineItems.map((item) => item.description).join(', ') + '.';
  const newJob: Job = {
    id: newId,
    jobNumber: newJobNumber,
    clientName: quote.clientName,
    clientId: quote.clientId,
    siteAddress: quote.jobAddress,
    status: 'Scheduled',
    assignedStaff: '',
    scheduledDate: '',
    startDate: '',
    endDate: '',
    timeWindow: '',
    assignedCrew: '',
    scope,
    materialsNeeded: [],
    notes: `Converted from quote ${quote.quoteNumber}. ${quote.notes}`,
  };
  jobs.push(newJob);
  return newId;
}

/** Create a job from a live Supabase quote + its line items. */
export function createJobFromSupabaseQuote(
  quote: { id: string; created_at: string; contact_name: string | null; job_address: string | null; notes: string | null },
  lineItems: { description: string }[]
): string {
  const newId = String(jobs.length + 1);
  const year = new Date().getFullYear();
  const newJobNumber = `J-${year}-${String(jobs.length + 1).padStart(3, '0')}`;

  const scopeParts = lineItems.map((i) => i.description).filter(Boolean);
  const scope = scopeParts.length > 0 ? scopeParts.join(', ') + '.' : '';

  const quoteRef = new Date(quote.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const noteParts = [`Converted from quote created ${quoteRef}.`];
  if (quote.notes?.trim()) noteParts.push(quote.notes.trim());

  const newJob: Job = {
    id: newId,
    jobNumber: newJobNumber,
    clientName: quote.contact_name ?? '',
    clientId: '',
    siteAddress: quote.job_address ?? '',
    status: 'Scheduled',
    assignedStaff: '',
    scheduledDate: '',
    startDate: '',
    endDate: '',
    timeWindow: '',
    assignedCrew: '',
    scope,
    materialsNeeded: [],
    notes: noteParts.join(' '),
    quoteId: quote.id,
  };
  jobs.push(newJob);
  return newId;
}