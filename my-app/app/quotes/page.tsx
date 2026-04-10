'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { getSupabase, type Quote } from '../lib/supabase';

const STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

const badgeClasses: Record<string, string> = {
  'Draft':    'bg-slate-100 text-slate-700',
  'Sent':     'bg-blue-100 text-blue-800',
  'Accepted': 'bg-emerald-100 text-emerald-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Expired':  'bg-amber-100 text-amber-800',
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true);
      setError(null);
      const { data, error } = await getSupabase()
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setQuotes(data ?? []);
      }
      setLoading(false);
    }
    fetchQuotes();
  }, []);

  const filtered = quotes.filter((q) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !term || (q.contact_name ?? '').toLowerCase().includes(term);
    const matchesStatus = !statusFilter || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">

            {/* Header */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quotes</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Quotes</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Build and manage quotes for your clients.
                  </p>
                </div>
                <Link
                  href="/quotes/new"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New Quote
                </Link>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center pt-4 border-t border-slate-100 mt-4">
                <input
                  type="text"
                  placeholder="Search by contact…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                >
                  <option value="">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Loading */}
            {loading && (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <p className="text-sm text-slate-500">Loading…</p>
              </section>
            )}

            {/* Error */}
            {!loading && error && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <p className="font-medium text-red-700">Failed to load quotes</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </section>
            )}

            {/* Empty state */}
            {!loading && !error && quotes.length === 0 && (
              <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 shadow-sm text-center">
                <p className="text-slate-500 font-medium">No quotes yet</p>
                <p className="mt-1 text-sm text-slate-400">Create your first quote to get started.</p>
                <Link
                  href="/quotes/new"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New Quote
                </Link>
              </section>
            )}

            {/* List */}
            {!loading && !error && quotes.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-3">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No quotes match your search.</p>
                  ) : (
                    filtered.map((q) => (
                      <Link
                        key={q.id}
                        href={`/quotes/${q.id}`}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 hover:border-slate-300 transition-all"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {q.contact_name ?? <span className="text-slate-400 italic">No contact</span>}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {new Date(q.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          {q.follow_up_date && (
                            <p className="mt-0.5 text-xs text-amber-600">📅 Follow-up {q.follow_up_date}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {q.total != null && (
                            <p className="text-sm font-semibold text-slate-700">${q.total.toLocaleString()}</p>
                          )}
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses[q.status] ?? 'bg-slate-100 text-slate-700'}`}>
                            {q.status}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
