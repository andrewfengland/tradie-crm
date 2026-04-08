import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/app/lib/supabase-server';

/**
 * Magic-link / OAuth callback handler.
 *
 * Supabase redirects here after the user clicks the magic link:
 *   /auth/callback?code=<PKCE code>
 *
 * This route exchanges the one-time code for a real session and sets the
 * SSR auth cookie, then redirects the user into the app.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Something went wrong — send back to login with an error hint.
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
