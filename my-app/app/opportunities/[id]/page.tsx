import Link from 'next/link';
import Sidebar from '../../../app/components/Sidebar';
import TopNav from '../../../app/components/TopNav';
import { getOpportunityById } from '../../lib/opportunities';
import StageUpdater from './StageUpdater';

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = getOpportunityById(id);

  if (!opportunity) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">Opportunity not found.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Opportunity detail</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">{opportunity.title}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Review opportunity details, progress, and related quotes or jobs.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/opportunities/${opportunity.id}/edit`}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Edit Opportunity
                  </Link>
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Back to opportunities
                  </Link>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Opportunity details</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Title</p>
                      <p className="mt-2 font-medium text-slate-900">{opportunity.title}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact</p>
                      <p className="mt-2 font-medium text-slate-900">{opportunity.contact}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Stage</p>
                      <p className="mt-2 font-medium text-slate-900">{opportunity.stage}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Estimated Value</p>
                      <p className="mt-2 font-medium text-slate-900">${opportunity.estimatedValue.toLocaleString()}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Assigned Staff</p>
                      <p className="mt-2 font-medium text-slate-900">{opportunity.assignedStaff}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Source</p>
                      <p className="mt-2 font-medium text-slate-900">{opportunity.source}</p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Notes</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{opportunity.notes}</p>
                  </div>
                </section>
              </div>

              <div className="space-y-4">
                <StageUpdater opportunityId={opportunity.id} currentStage={opportunity.stage} />

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-slate-900">Related quotes</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      0 items
                    </span>
                  </div>
                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-slate-500">No quotes yet</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-slate-900">Related jobs</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      0 items
                    </span>
                  </div>
                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-slate-500">No jobs yet</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}