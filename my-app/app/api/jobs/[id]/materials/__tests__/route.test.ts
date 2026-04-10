import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/app/lib/supabase-server', () => ({
  getSupabaseServer: vi.fn(),
}));

import { GET, POST } from '../route';
import { PATCH, DELETE } from '../[materialId]/route';
import { getSupabaseServer } from '@/app/lib/supabase-server';

const mockGetSupabaseServer = vi.mocked(getSupabaseServer);

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeClient(
  authenticated: boolean,
  dbError: string | null = null,
  rows: unknown[] = []
) {
  const eqChain = {
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({
      data: rows,
      error: dbError ? { message: dbError } : null,
    }),
  };
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: authenticated ? { id: 'uid-1' } : null },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue(eqChain),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'mat-uuid-1' },
            error: dbError ? { message: dbError } : null,
          }),
        }),
      }),
      update: vi.fn().mockReturnValue(eqChain),
      delete: vi.fn().mockReturnValue(eqChain),
    }),
  };
}

const JOB_ID = 'job-1';

function makeReq(body: unknown, method = 'POST', path = `/api/jobs/${JOB_ID}/materials`) {
  return new NextRequest(`http://localhost${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const routeParams = { params: Promise.resolve({ id: JOB_ID }) };
const materialParams = { params: Promise.resolve({ id: JOB_ID, materialId: 'mat-uuid-1' }) };

// ── GET /api/jobs/[id]/materials ─────────────────────────────────────────────

describe('GET /api/jobs/[id]/materials', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const req = new NextRequest(`http://localhost/api/jobs/${JOB_ID}/materials`, { method: 'GET' });
    const res = await GET(req, routeParams);
    expect(res.status).toBe(401);
  });

  it('returns materials when authenticated', async () => {
    const rows = [{ id: 'm1', description: 'Timber', status: 'Needed', job_id: JOB_ID, created_at: new Date().toISOString() }];
    mockGetSupabaseServer.mockResolvedValue(makeClient(true, null, rows) as never);
    const req = new NextRequest(`http://localhost/api/jobs/${JOB_ID}/materials`, { method: 'GET' });
    const res = await GET(req, routeParams);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.materials)).toBe(true);
  });
});

// ── POST /api/jobs/[id]/materials ────────────────────────────────────────────

describe('POST /api/jobs/[id]/materials', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const res = await POST(makeReq({ description: 'Timber', status: 'Needed' }), routeParams);
    expect(res.status).toBe(401);
  });

  it('returns 400 when description is missing', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeReq({ description: '', status: 'Needed' }), routeParams);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/description/i);
  });

  it('returns 400 when status is invalid', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeReq({ description: 'Timber', status: 'Broken' }), routeParams);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/status/i);
  });

  it('creates a material and returns ok', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeReq({ description: 'Timber', status: 'Ordered' }), routeParams);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.id).toBe('mat-uuid-1');
  });
});

// ── PATCH /api/jobs/[id]/materials/[materialId] ───────────────────────────────

describe('PATCH /api/jobs/[id]/materials/[materialId]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const req = makeReq({ status: 'Delivered' }, 'PATCH');
    const res = await PATCH(req, materialParams);
    expect(res.status).toBe(401);
  });

  it('returns 400 when status is invalid', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const req = makeReq({ status: 'Unknown' }, 'PATCH');
    const res = await PATCH(req, materialParams);
    expect(res.status).toBe(400);
  });

  it('updates status and returns ok', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const req = makeReq({ status: 'Delivered' }, 'PATCH');
    const res = await PATCH(req, materialParams);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});

// ── DELETE /api/jobs/[id]/materials/[materialId] ──────────────────────────────

describe('DELETE /api/jobs/[id]/materials/[materialId]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const req = new NextRequest(`http://localhost/api/jobs/${JOB_ID}/materials/mat-uuid-1`, { method: 'DELETE' });
    const res = await DELETE(req, materialParams);
    expect(res.status).toBe(401);
  });

  it('deletes and returns ok when authenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const req = new NextRequest(`http://localhost/api/jobs/${JOB_ID}/materials/mat-uuid-1`, { method: 'DELETE' });
    const res = await DELETE(req, materialParams);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
