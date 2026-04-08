'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { getSupabase, type Opportunity } from '../lib/supabase';

const STAGES = [
  'New Lead',
  'Contacted',
  'Site Visit',
  'Quote Sent',
  'Deposit Pending',
  'Won',
  'Lost',
];

const stageColor: Record<string, string> = {
  'New Lead':        'bg-slate-100 text-slate-700',
  'Contacted':       'bg-blue-100 text-blue-800',
  'Site Visit':      'bg-indigo-100 text-indigo-800',
  'Quote Sent':      'bg-purple-100 text-purple-800',
  'Deposit Pending': 'bg-amber-100 text-amber-800',
  'Won':             'bg-emerald-100 text-emerald-800',
  'Lost':            'bg-red-100 text-red-800',
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');

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

  async function handleStageChange(id: string, newStage: string) {
    setSaving(id);
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setError(error ?? 'Failed to update stage.');
      } else {
        setOpportunities((prev) =>
          prev.map((o) => (o.id === id ? { ...o, stage: newStage } : o))
        );
      }
    } catch {
      setError('Failed to update stage.');
    } finally {
      setSaving(null);
    }
  }

  const filtered = opportunities.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.title.toLowerCase().includes(q) ||
      (o.contact_name ?? '').toLowerCase().includes(q);
    const matchesStage = !stageFilter || (o.stage ?? 'New Lead') === stageFilter;
    return matchesSearch && matchesStage;
  });

  const byStage = (stage: string) =>
    filtered.filter((o) => (o.stage ?? 'New Lead') === stage);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-[1600px] space-y-6">

            {/* Header */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Opportunities</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Pipeline</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Track your opportunities from first contact to won job.
                  </p>
                </div>
                <Link
                  href="/opportunities/new"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New Opportunity
                </Link>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Search by title or contact…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                />
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                >
                  <option value="">All stages</option>
                  {STAGES.map((s) => (
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
                <p className="font-medium text-red-700">Failed to load opportunities</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </section>
            )}

            {/* Board */}
            {!loading && !error && (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4" style={{ minWidth: `${STAGES.length * 220}px` }}>
                  {STAGES.map((stage) => {
                    const cards = byStage(stage);
                    return (
                      <div key={stage} className="flex-1 min-w-[200px] space-y-3">
                        {/* Column header */}
                        <div className="flex items-center gap-2 px-1">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColor[stage] ?? 'bg-slate-100 text-slate-700'}`}>
                            {stage}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{cards.length}</span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2">
                          {cards.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center">
                              <p className="text-xs text-slate-400">Empty</p>
                            </div>
                          ) : (
                            cards.map((o) => (
                              <div
                                key={o.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                              >
                                <Link href={`/opportunities/${o.id}`} className="block">
                                  <p className="text-sm font-medium text-slate-900 leading-snug">{o.title}</p>
                                  {o.contact_name && (
                                    <p className="mt-1 text-xs text-slate-500">{o.contact_name}</p>
                                  )}
                                  {o.value != null && (
                                    <p className="mt-2 text-xs font-semibold text-slate-700">
                                      ${o.value.toLocaleString()}
                                    </p>
                                  )}
                                </Link>
                                <select
                                  value={o.stage ?? 'New Lead'}
                                  onChange={(e) => handleStageChange(o.id, e.target.value)}
                                  disabled={saving === o.id}
                                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:outline-none focus:border-blue-400 disabled:opacity-50 cursor-pointer"
                                >
                                  {STAGES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
