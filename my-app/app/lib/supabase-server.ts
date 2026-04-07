import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client.
 * Returns a fresh client per call — safe for use inside API route handlers.
 * Pass accessToken to run requests as the authenticated user (required for RLS).
 * Never imported by client components (no 'use client' files should import this).
 */
export function getSupabaseServer(accessToken?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables: ' +
        'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.'
    );
  }

  return createClient(url, key, {
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    },
  });
}
