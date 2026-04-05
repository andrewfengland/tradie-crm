'use client';

import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';

const jobs = [
  { id: 1, title: 'Bathroom Refurb', client: 'Olivia Hart', due: 'Apr 15', status: 'Awaiting Deposit' },
  { id: 2, title: 'Roof Replacement', client: 'Ethan Reed', due: 'Apr 22', status: 'Ready to Schedule' },
  { id: 3, title: 'Kitchen Fitout', client: 'Mia Carter', due: 'Apr 28', status: 'In Progress' },
  { id: 4, title: 'Deck Installation', client: 'Noah Turner', due: 'May 3', status: 'Complete' },
];

const badgeClasses: Record<string, string> = {
  'Awaiting Deposit': 'bg-amber-100 text-amber-800',
  'Ready to Schedule': 'bg-sky-100 text-sky-800',
  'In Progress': 'bg-emerald-100 text-emerald-800',
  Complete: 'bg-slate-100 text-slate-700',
};

export default function JobsPage() {
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Jobs</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Jobs</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    A clean view of your current jobs with status and next action details.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                  New Job
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{job.title}</p>
                        <p className="text-sm text-slate-500">{job.client}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeClasses[job.status]}`}>
                          {job.status}
                        </span>
                        <span className="text-sm font-medium text-slate-700">Due {job.due}</span>
                      </div>
                    </div>
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
