'use client';

import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { opportunities, Opportunity } from '../lib/opportunities';

const STAGES: { label: string; color: string }[] = [
  { label: 'New Lead',   color: 'bg-blue-50 border-blue-200' },
  { label: 'Contacted',  color: 'bg-amber-50 border-amber-200' },
  { label: 'Quoted',     color: 'bg-purple-50 border-purple-200' },
  { label: 'Follow Up',  color: 'bg-orange-50 border-orange-200' },
  { label: 'Won',        color: 'bg-emerald-50 border-emerald-200' },
  { label: 'Lost',       color: 'bg-slate-50 border-slate-200' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
}

function OpportunityCard({ opp }: { opp: Opportunity }) {
  return (
    <Link href={`/opportunities/${opp.id}`}>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <p className="font-medium text-slate-900 text-sm mb-1">{opp.title}</p>
        <p className="text-base font-semibold text-slate-700 mb-2">{formatCurrency(opp.estimatedValue)}</p>
        <p className="text-xs text-slate-500 mb-1">👤 {opp.contact}</p>
        <p className="text-xs text-slate-400">Close: {opp.expectedCloseDate}</p>
      </div>
    </Link>
  );
}

export default function PipelinePage() {
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pipeline</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sales Pipeline</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Track your leads through each stage from initial contact to project completion.
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

            {/* Stage Board */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-2 min-w-min">
                  {STAGES.map(({ label, color }) => {
                    const cards = opportunities.filter((o) => o.stage === label);
                    const total = cards.reduce((sum, o) => sum + o.estimatedValue, 0);
                    return (
                      <div key={label} className="flex-shrink-0 w-72">
                        {/* Column header */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-slate-900 text-sm">{label}</h2>
                            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                              {cards.length}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(total)}</p>
                        </div>

                        {/* Column body */}
                        <div className={`rounded-xl border-2 ${color} p-3 min-h-80 space-y-3`}>
                          {cards.map((opp) => (
                            <OpportunityCard key={opp.id} opp={opp} />
                          ))}
                          {cards.length === 0 && (
                            <div className="flex items-center justify-center h-24 text-slate-400">
                              <p className="text-sm">No opportunities</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

