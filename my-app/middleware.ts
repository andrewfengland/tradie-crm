import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase SSR session-refresh middleware.
 *
 * Must run on every request so that:
 *  1. The JWT is refreshed before it expires.
 *  2. Updated set-cookie headers are forwarded to the browser.
 *  3. Unauthenticated users are redirected to /login.
 *
 * IMPORTANT: Do not add logic between createServerClient and auth.getUser().
 * See: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  // Start with a plain pass-through response.
  // createServerClient will mutate this to forward refreshed cookies.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies back onto the request so later middleware can read them.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Rebuild the response so it carries the refreshed Set-Cookie headers.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validate the session server-side. This also refreshes the JWT when needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Allow the login page and auth callback through without a session.
  const isPublicPath =
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth');

  if (!user && !isPublicPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // IMPORTANT: return supabaseResponse (not a new NextResponse) so the
  // refreshed cookies are forwarded to the browser.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on all paths except Next.js internals and static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
