'use client';

import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';

export default function DashboardPage() {
  // Sample metrics data
  const metrics = [
    { label: 'Leads This Week', value: '5' },
    { label: 'Quotes Sent', value: '2' },
    { label: 'Won Jobs', value: '1' },
    { label: 'Pipeline Value', value: '$70,000' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    Build Day 26
                  </div>
                  <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Overview</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    A clean snapshot of your tradie business with the most important items at a glance.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                  New quote
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Key Metrics</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
