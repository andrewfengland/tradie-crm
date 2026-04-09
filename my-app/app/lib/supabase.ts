import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Customer = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  suburb: string | null;
  job_type: string | null;
  status: 'new' | 'active' | 'inactive' | string;
  notes: string | null;
};

export type Opportunity = {
  id: string;
  created_at: string;
  title: string;
  contact_name: string | null;
  customer_id: string | null;
  stage: string | null;
  value: number | null;
  notes: string | null;
};

export type Quote = {
  id: string;
  created_at: string;
  contact_name: string | null;
  opportunity_id: string | null;
  status: string;
  subtotal: number | null;
  margin: number | null;
  deposit_percent: number | null;
  total: number | null;
  notes: string | null;
};

export type QuoteLineItem = {
  id: string;
  created_at: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

// ── Client (lazy singleton via createBrowserClient) ──────────────────────────
// createBrowserClient from @supabase/ssr stores the session in cookies, which
// allows server-side helpers to read auth state on every request.

export function getSupabase(): SupabaseClient {
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

  return createBrowserClient(url, key);
}

