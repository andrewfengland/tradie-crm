'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { getSupabase, type Opportunity } from '../lib/supabase';

const stageBadge: Record<string, string> = {
  'New Lead':   'bg-slate-100 text-slate-700',
  'Contacted':  'bg-blue-100 text-blue-800',
  'Quoted':     'bg-purple-100 text-purple-800',
  'Follow Up':  'bg-amber-100 text-amber-800',
  'Won':        'bg-emerald-100 text-emerald-800',
  'Lost':       'bg-red-100 text-red-800',
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchOpportunities() {
      setLoading(true);
      setError(null);
      const { data, error } = await getSupabase()
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setOpportunities(data ?? []);
      }
      setLoading(false);
    }
    fetchOpportunities();
  }, []);

  const filtered = opportunities.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      (o.contact_name ?? '').toLowerCase().includes(q) ||
      (o.stage ?? '').toLowerCase().includes(q)
    );
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Opportunities</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Opportunities</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Track your sales opportunities from first contact to won job.
                  </p>
                </div>
                <Link
                  href="/opportunities/new"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New Opportunity
                </Link>
              </div>
            </section>

            {/* Search */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <input
                type="text"
                placeholder="Search by title, contact, or stage…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-3 text-sm text-slate-500">
                {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'opportunity' : 'opportunities'} found`}
              </p>
            </section>

            {/* Loading */}
            {loading && (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <p className="text-sm text-slate-500">Loading opportunities…</p>
              </section>
            )}

            {/* Error */}
            {!loading && error && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <p className="font-medium text-red-700">Failed to load opportunities</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </section>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <p className="text-sm text-slate-500">
                  {searchQuery ? 'No opportunities match your search.' : 'No opportunities yet.'}
                </p>
              </section>
            )}

            {/* Table */}
            {!loading && !error && filtered.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Title</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Contact</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Stage</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filtered.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                            <Link href={`/opportunities/${o.id}`} className="hover:underline">
                              {o.title}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{o.contact_name ?? '—'}</td>
                          <td className="px-4 py-4">
                            {o.stage ? (
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageBadge[o.stage] ?? 'bg-slate-100 text-slate-700'}`}>
                                {o.stage}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {o.value != null ? `$${o.value.toLocaleString()}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
