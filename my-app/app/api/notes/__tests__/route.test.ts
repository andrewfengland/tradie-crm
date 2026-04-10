import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the server Supabase client before any route imports
vi.mock('@/app/lib/supabase-server', () => ({
  getSupabaseServer: vi.fn(),
}));

import { GET, POST } from '../route';
import { DELETE } from '../[id]/route';
import { getSupabaseServer } from '@/app/lib/supabase-server';

const mockGetSupabaseServer = vi.mocked(getSupabaseServer);

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeClient(authenticated: boolean, dbError: string | null = null, rows: unknown[] = []) {
  const eqChain = {
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: rows, error: dbError ? { message: dbError } : null }),
    single: vi.fn().mockResolvedValue({
      data: rows[0] ?? { id: 'note-uuid-1' },
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
            data: { id: 'note-uuid-1' },
            error: dbError ? { message: dbError } : null,
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue(eqChain),
    }),
  };
}

function makeRequest(body: unknown, method = 'POST', url = 'http://localhost/api/notes') {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ── GET /api/notes ─────────────────────────────────────────────────────────

describe('GET /api/notes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when parent_type or parent_id is missing', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const req = new NextRequest('http://localhost/api/notes?parent_type=job', { method: 'GET' });
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/parent_type and parent_id/i);
  });

  it('returns 401 when unauthenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const req = new NextRequest('http://localhost/api/notes?parent_type=job&parent_id=1', { method: 'GET' });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('returns notes when authenticated', async () => {
    const notesData = [{ id: 'n1', body: 'A note', parent_type: 'job', parent_id: '1', created_at: new Date().toISOString() }];
    mockGetSupabaseServer.mockResolvedValue(makeClient(true, null, notesData) as never);
    const req = new NextRequest('http://localhost/api/notes?parent_type=job&parent_id=1', { method: 'GET' });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.notes)).toBe(true);
  });
});

// ── POST /api/notes ────────────────────────────────────────────────────────

describe('POST /api/notes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const res = await POST(makeRequest({ body: 'Test note', parent_type: 'job', parent_id: '1' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 when body text is missing', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeRequest({ body: '', parent_type: 'job', parent_id: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/body/i);
  });

  it('returns 400 when parent_type is missing', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeRequest({ body: 'Note text', parent_id: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/parent_type/i);
  });

  it('creates a note and returns ok when authenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const res = await POST(makeRequest({ body: 'Internal note', parent_type: 'job', parent_id: '1' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.id).toBe('note-uuid-1');
  });
});

// ── DELETE /api/notes/[id] ─────────────────────────────────────────────────

describe('DELETE /api/notes/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(false) as never);
    const req = new NextRequest('http://localhost/api/notes/note-uuid-1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'note-uuid-1' }) });
    expect(res.status).toBe(401);
  });

  it('returns ok when authenticated', async () => {
    mockGetSupabaseServer.mockResolvedValue(makeClient(true) as never);
    const req = new NextRequest('http://localhost/api/notes/note-uuid-1', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'note-uuid-1' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
