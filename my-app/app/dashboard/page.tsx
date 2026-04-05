'use client';

import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';

export default function DashboardPage() {
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
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
          </div>
        </main>
      </div>
    </div>
  );
}
