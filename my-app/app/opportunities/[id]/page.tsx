'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import TopNav from '@/app/components/TopNav';
import { getSupabase, type Opportunity } from '@/app/lib/supabase';
import TasksSection from '@/app/components/TasksSection';

const stageBadge: Record<string, string> = {
  'New Lead':        'bg-slate-100 text-slate-700',
  'Contacted':       'bg-blue-100 text-blue-800',
  'Site Visit':      'bg-indigo-100 text-indigo-800',
  'Quote Sent':      'bg-purple-100 text-purple-800',
  'Deposit Pending': 'bg-amber-100 text-amber-800',
  'Won':             'bg-emerald-100 text-emerald-800',
  'Lost':            'bg-red-100 text-red-800',
};

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [creatingQuote, setCreatingQuote] = useState(false);
  const [createQuoteError, setCreateQuoteError] = useState<string | null>(null);

  async function handleCreateQuote() {
    if (!opportunity) return;
    setCreatingQuote(true);
    setCreateQuoteError(null);
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        opportunity_id: opportunity.id,
        contact_name:   opportunity.contact_name ?? null,
        status:         'Draft',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCreateQuoteError(data.error ?? 'Failed to create quote.');
      setCreatingQuote(false);
    } else {
      router.push(`/quotes/${data.id}`);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this opportunity? This cannot be undone.')) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setDeleteError(data.error ?? 'Failed to delete opportunity.');
      setDeleting(false);
    } else {
      router.push('/opportunities');
    }
  }

  useEffect(() => {
    async function fetchOpportunity() {
      const { data, error } = await getSupabase()
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setOpportunity(data);
      }
      setLoading(false);
    }
    fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 p-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Loading…</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (notFound || !opportunity) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 p-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-700">Opportunity not found.</p>
              <Link
                href="/opportunities"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Back to opportunities
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const createdDate = new Date(opportunity.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Opportunity</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">{opportunity.title}</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCreateQuote}
                    disabled={creatingQuote}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {creatingQuote ? 'Creating…' : 'Create Quote'}
                  </button>
                  <Link
                    href={`/opportunities/${opportunity.id}/edit`}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Edit Opportunity
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Back to opportunities
                  </Link>
                </div>
              </div>
            </section>

            {deleteError && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <p className="text-sm text-red-700">{deleteError}</p>
              </section>
            )}
            {createQuoteError && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <p className="text-sm text-red-700">{createQuoteError}</p>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Title</p>
                  <p className="mt-2 font-medium text-slate-900">{opportunity.title}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact</p>
                  <p className="mt-2 font-medium text-slate-900">{opportunity.contact_name ?? '—'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Stage</p>
                  <p className="mt-2">
                    {opportunity.stage ? (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageBadge[opportunity.stage] ?? 'bg-slate-100 text-slate-700'}`}>
                        {opportunity.stage}
                      </span>
                    ) : '—'}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Value</p>
                  <p className="mt-2 font-medium text-slate-900">
                    {opportunity.value != null ? `$${opportunity.value.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Created</p>
                  <p className="mt-2 font-medium text-slate-900">{createdDate}</p>
                </div>
              </div>
              {opportunity.notes && (
                <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Notes</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{opportunity.notes}</p>
                </div>
              )}
            </section>

            <TasksSection relatedType="opportunity" relatedId={id} />

          </div>
        </main>
      </div>
    </div>
  );
}