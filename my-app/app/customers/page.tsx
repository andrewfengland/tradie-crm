'use client';

// CRM data is always user-specific — opt out of static pre-rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import TopNav from '@/app/components/TopNav';
import { getSupabase, type Customer } from '@/app/lib/supabase';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError(null);

      const { data, error } = await getSupabase()
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setCustomers(data ?? []);
      }

      setLoading(false);
    }

    fetchCustomers();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-4xl space-y-6">

            {/* Header */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Supabase</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Customers</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Live data from Supabase — the single backend for this app.
              </p>
            </section>

            {/* Loading state */}
            {loading && (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <p className="text-slate-500 text-sm">Loading customers…</p>
              </section>
            )}

            {/* Error state */}
            {!loading && error && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <p className="font-medium text-red-700">Failed to load customers</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
                <p className="mt-3 text-xs text-red-500">
                  Make sure your <code>.env.local</code> has the correct{' '}
                  <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> values.
                </p>
              </section>
            )}

            {/* Empty state */}
            {!loading && !error && customers.length === 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <p className="text-slate-500 text-sm">No customers yet.</p>
                <p className="mt-1 text-xs text-slate-400">
                  Add rows via the Supabase dashboard or run the seed in{' '}
                  <code>supabase/migrations/0001_create_customers.sql</code>.
                </p>
              </section>
            )}

            {/* Customer list */}
            {!loading && !error && customers.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <p className="text-sm text-slate-500">
                    {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
                  </p>
                </div>
                <ul className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <li key={c.id} className="flex items-start gap-4 px-6 py-4">
                      {/* Avatar initial */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                        {c.full_name.charAt(0).toUpperCase()}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{c.full_name}</p>
                        <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
                          {c.email && <span>{c.email}</span>}
                          {c.phone && <span>{c.phone}</span>}
                          {c.suburb && <span>{c.suburb}</span>}
                        </div>
                        {c.notes && (
                          <p className="mt-1 text-xs text-slate-400 truncate">{c.notes}</p>
                        )}
                      </div>

                      {/* Status + job type */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            c.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : c.status === 'lead'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.status}
                        </span>
                        {c.job_type && (
                          <span className="text-xs text-slate-400">{c.job_type}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
