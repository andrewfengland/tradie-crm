import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the server Supabase client before any route imports
vi.mock('@/app/lib/supabase-server', () => ({
  getSupabaseServer: vi.fn(),
}));

import { POST } from '../route';
import { PATCH } from '../[id]/route';
import { getSupabaseServer } from '@/app/lib/supabase-server';

const mockGetSupabaseServer = vi.mocked(getSupabaseServer);

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeClient(authenticated: boolean, dbError: string | null = null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: authenticated ? { id: 'uid-1' } : null },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        error: dbError ? { message: dbError } : null,
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: dbError ? { message: dbError } : null,
        }),
      }),
    }),
  };
}

function makeRequest(body: unknown, method = 'POST') {
  return new NextRequest('http://localhost/api/opportunities', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ── POST /api/opportunities ──────────────────────────────────────────────────

describe('POST /api/opportunities', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when user is not authenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const res = await POST(makeRequest({ title: 'New Roof' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/Unauthorized/i);
  });

  it('returns 400 when title is missing', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeRequest({ contact_name: 'Joe Smith' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/title/i);
  });

  it('creates an opportunity and returns ok when authenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeRequest({ title: 'Kitchen Reno', stage: 'New Lead', value: 5000 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});

// ── PATCH /api/opportunities/[id] ───────────────────────────────────────────

describe('PATCH /api/opportunities/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  const params = Promise.resolve({ id: 'opp-abc-123' });

  it('returns 401 when user is not authenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const res = await PATCH(makeRequest({ stage: 'Won' }, 'PATCH'), { params });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/Unauthorized/i);
  });

  it('returns 400 for an invalid stage value', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await PATCH(makeRequest({ stage: 'Banana' }, 'PATCH'), { params });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/stage/i);
  });

  it('updates the stage and returns ok when authenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await PATCH(makeRequest({ stage: 'Won' }, 'PATCH'), { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
