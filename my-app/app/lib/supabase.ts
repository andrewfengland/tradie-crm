import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Customer = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  suburb: string | null;
  job_type: string | null;
  status: 'lead' | 'active' | 'inactive' | string;
  notes: string | null;
};

// ── Client (lazy singleton) ───────────────────────────────────────────────────
// Initialised on first call so importing this module never throws at build time.
// Real env vars must be present when getSupabase() is first invoked (runtime).

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables.\n' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in:\n' +
        '  • .env.local  — for local development\n' +
        '  • Vercel dashboard → Settings → Environment Variables  — for production'
    );
  }

  _client = createClient(url, key);
  return _client;
}

