'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabase } from '@/app/lib/supabase';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError ? 'Sign-in link was invalid or expired. Please try again.' : null
  );

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: otpError } = await getSupabase().auth.signInWithOtp({
      email,
      options: {
        // After clicking the link, Supabase redirects here.
        // The callback route exchanges the code for a real SSR session cookie.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Tradie CRM</p>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          <p className="font-medium">Check your email</p>
          <p className="mt-1 text-emerald-700">
            We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSendLink} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}