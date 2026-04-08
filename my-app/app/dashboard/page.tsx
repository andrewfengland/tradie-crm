'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { getSupabase, type Customer, type Opportunity, type Quote } from '../lib/supabase';

const quoteBadge: Record<string, string> = {
  'Draft':    'bg-slate-100 text-slate-700',
  'Sent':     'bg-blue-100 text-blue-800',
  'Accepted': 'bg-emerald-100 text-emerald-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Expired':  'bg-amber-100 text-amber-800',
};

const stageBadge: Record<string, string> = {
  'New Lead':        'bg-slate-100 text-slate-700',
  'Contacted':       'bg-blue-100 text-blue-800',
  'Site Visit':      'bg-indigo-100 text-indigo-800',
  'Quote Sent':      'bg-purple-100 text-purple-800',
  'Deposit Pending': 'bg-amber-100 text-amber-800',
  'Won':             'bg-emerald-100 text-emerald-800',
  'Lost':            'bg-red-100 text-red-800',
};

const quickLinks = [
  { label: 'New Contact',     href: '/contacts/new' },
  { label: 'New Opportunity', href: '/opportunities/new' },
  { label: 'New Quote',       href: '/quotes/new' },
  { label: 'View Pipeline',   href: '/pipeline' },
];

const OPEN_QUOTE_STATUSES = new Set(['Draft', 'Sent']);
const CLOSED_OPP_STAGES   = new Set(['Won', 'Lost']);

function formatAUD(value: number) {
  return value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
}

export default function DashboardPage() {
  const [customers,     setCustomers]     = useState<Customer[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [quotes,        setQuotes]        = useState<Quote[]>([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const supabase = getSupabase();
      const [custRes, oppRes, quoteRes] = await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('opportunities').select('*').order('created_at', { ascending: false }),
        supabase.from('quotes').select('*').order('created_at', { ascending: false }),
      ]);
      setCustomers(custRes.data ?? []);
      setOpportunities(oppRes.data ?? []);
      setQuotes(quoteRes.data ?? []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const openOppValue = opportunities
    .filter((o) => !CLOSED_OPP_STAGES.has(o.stage ?? ''))
    .reduce((sum, o) => sum + (o.value ?? 0), 0);

  const openQuoteValue = quotes
    .filter((q) => OPEN_QUOTE_STATUSES.has(q.status))
    .reduce((sum, q) => sum + (q.total ?? 0), 0);

  const summaryTiles = [
    { label: 'Total Contacts',      value: loading ? '—' : String(customers.length),      href: '/contacts' },
    { label: 'Total Opportunities', value: loading ? '—' : String(opportunities.length),  href: '/opportunities' },
    { label: 'Total Quotes',        value: loading ? '—' : String(quotes.length),          href: '/quotes' },
    { label: 'Open Opp. Value',     value: loading ? '—' : formatAUD(openOppValue),        href: '/opportunities' },
    { label: 'Open Quote Value',    value: loading ? '—' : formatAUD(openQuoteValue),      href: '/quotes' },
    { label: 'Won',                 value: loading ? '—' : String(opportunities.filter((o) => o.stage === 'Won').length), href: '/opportunities' },
  ];

  const metrics = [
    {
      label: 'Leads This Week',
      value: loading ? '—' : String(opportunities.filter((o) => new Date(o.created_at) >= weekStart).length),
    },
    {
      label: 'Pipeline Value',
      value: loading ? '—' : '$' + openOppValue.toLocaleString(),
    },
    {
      label: 'Won',
      value: loading ? '—' : String(opportunities.filter((o) => o.stage === 'Won').length),
    },
    {
      label: 'Quotes Sent',
      value: loading ? '—' : String(quotes.filter((q) => q.status === 'Sent').length),
    },
  ];

  const recentContacts      = customers.slice(0, 3);
  const recentOpportunities = opportunities.slice(0, 3);
  const recentQuotes        = quotes.slice(0, 3);

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
                  <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    Step 47
                  </div>
                  <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Overview</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    A clean snapshot of your tradie business with the most important items at a glance.
                  </p>
                </div>
                <Link
                  href="/quotes/new"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New quote
                </Link>
              </div>
            </section>

            {/* Summary Strip */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-5">Business summary</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {summaryTiles.map((tile) => (
                  <Link
                    key={tile.label}
                    href={tile.href}
                    className="flex flex-col gap-1 rounded-3xl bg-slate-50 p-4 hover:bg-slate-100 transition-colors"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 leading-snug">{tile.label}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900 truncate">{tile.value}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick actions</h2>
              <div className="flex flex-wrap gap-3">
                {quickLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </section>

            {/* Metrics */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Key metrics</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Records */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent records</h2>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {/* Recent Contacts */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contacts</h3>
                    <Link href="/contacts" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                      View all →
                    </Link>
                  </div>
                  {loading ? (
                    <p className="text-xs text-slate-400 py-2">Loading…</p>
                  ) : recentContacts.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No contacts yet.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {recentContacts.map((c) => (
                        <li key={c.id} className="py-2.5">
                          <Link href={`/contacts/${c.id}`} className="group flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 truncate">{c.full_name}</span>
                            <span className="text-xs text-slate-500 truncate">{c.suburb ?? c.email ?? '—'}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recent Opportunities */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Opportunities</h3>
                    <Link href="/opportunities" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                      View all →
                    </Link>
                  </div>
                  {loading ? (
                    <p className="text-xs text-slate-400 py-2">Loading…</p>
                  ) : recentOpportunities.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No opportunities yet.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {recentOpportunities.map((o) => (
                        <li key={o.id} className="py-2.5">
                          <Link href={`/opportunities/${o.id}`} className="group flex items-start justify-between gap-2">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 truncate">{o.title}</span>
                            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${stageBadge[o.stage ?? ''] ?? 'bg-slate-100 text-slate-700'}`}>
                              {o.stage ?? 'New Lead'}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recent Quotes */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Quotes</h3>
                    <Link href="/quotes" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                      View all →
                    </Link>
                  </div>
                  {loading ? (
                    <p className="text-xs text-slate-400 py-2">Loading…</p>
                  ) : recentQuotes.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No quotes yet.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {recentQuotes.map((q) => (
                        <li key={q.id} className="py-2.5">
                          <Link href={`/quotes/${q.id}`} className="group flex items-start justify-between gap-2">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 truncate">
                              {q.contact_name ?? <span className="italic text-slate-400">No contact</span>}
                            </span>
                            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${quoteBadge[q.status] ?? 'bg-slate-100 text-slate-700'}`}>
                              {q.status}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
