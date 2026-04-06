'use client';

import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { opportunities } from '../lib/opportunities';

export default function OpportunitiesPage() {
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Opportunities</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Opportunities</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Manage sales opportunities and track their progress through the pipeline.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                  New Opportunity
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="overflow-hidden rounded-3xl">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Title</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Contact</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Stage</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Estimated Value</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Assigned Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {opportunities.map((opportunity) => (
                      <tr key={opportunity.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 text-slate-900">{opportunity.title}</td>
                        <td className="px-4 py-4 text-slate-600">
                          <Link href={`/contacts/${opportunity.contactId}`} className="text-slate-900 hover:text-blue-600">
                            {opportunity.contact}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{opportunity.stage}</td>
                        <td className="px-4 py-4 text-slate-600">${opportunity.estimatedValue.toLocaleString()}</td>
                        <td className="px-4 py-4 text-slate-600">{opportunity.assignedStaff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-900">{opportunity.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Contact: <Link href={`/contacts/${opportunity.contactId}`} className="text-slate-900 hover:text-blue-600">{opportunity.contact}</Link>
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Stage: {opportunity.stage}</p>
                    <p>Value: ${opportunity.estimatedValue.toLocaleString()}</p>
                    <p>Assigned: {opportunity.assignedStaff}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}