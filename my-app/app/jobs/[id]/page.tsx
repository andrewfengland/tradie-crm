import Link from 'next/link';
import Sidebar from '../../../app/components/Sidebar';
import TopNav from '../../../app/components/TopNav';
import { getJobById } from '../../lib/jobs';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">Job not found.</p>
                <Link
                  href="/jobs"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back to jobs
                </Link>
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Job detail</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">{job.jobNumber}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Review job details, materials, and progress.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Edit Job
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                    Mark Complete
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                    View Related Quote
                  </button>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Job details</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Job Number</p>
                      <p className="mt-2 font-medium text-slate-900">{job.jobNumber}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Client</p>
                      <p className="mt-2 font-medium text-slate-900">{job.clientName}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Site Address</p>
                      <p className="mt-2 font-medium text-slate-900">{job.siteAddress}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                      <p className="mt-2 font-medium text-slate-900">{job.status}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Assigned Staff</p>
                      <p className="mt-2 font-medium text-slate-900">{job.assignedStaff}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scheduled Date</p>
                      <p className="mt-2 font-medium text-slate-900">{job.scheduledDate}</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Scope</h2>
                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">{job.scope}</p>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Materials Needed</h2>
                  <div className="mt-6 space-y-3">
                    {job.materialsNeeded.map((material, index) => (
                      <div key={index} className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-700">{material}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Notes</h2>
                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">{job.notes}</p>
                  </div>
                </section>
              </div>

              <div className="space-y-4">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-slate-900">Status Summary</h2>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current Status</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{job.status}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scheduled For</p>
                      <p className="mt-2 font-medium text-slate-900">{job.scheduledDate}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Materials Count</p>
                      <p className="mt-2 font-medium text-slate-900">{job.materialsNeeded.length} items</p>
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