'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { opportunities } from '../lib/opportunities';

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');

  // Extract unique stages and staff members
  const stages = Array.from(new Set(opportunities.map(o => o.stage))).sort();
  const staffMembers = Array.from(new Set(opportunities.map(o => o.assignedStaff))).sort();

  // Filter opportunities based on search and filters
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === '' || opp.stage === selectedStage;
    const matchesStaff = selectedStaff === '' || opp.assignedStaff === selectedStaff;
    return matchesSearch && matchesStage && matchesStaff;
  });

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
                <Link
                  href="/opportunities/new"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New Opportunity
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {/* Search Input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
                    Search by title or contact
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Filters */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Stage Filter */}
                  <div>
                    <label htmlFor="stage-filter" className="block text-sm font-medium text-slate-700 mb-2">
                      Filter by stage
                    </label>
                    <select
                      id="stage-filter"
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">All stages</option>
                      {stages.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assigned Staff Filter */}
                  <div>
                    <label htmlFor="staff-filter" className="block text-sm font-medium text-slate-700 mb-2">
                      Filter by assigned staff
                    </label>
                    <select
                      id="staff-filter"
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">All staff</option>
                      {staffMembers.map((staff) => (
                        <option key={staff} value={staff}>
                          {staff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Result count */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{filteredOpportunities.length}</span> of{' '}
                    <span className="font-semibold text-slate-900">{opportunities.length}</span> opportunities
                  </p>
                </div>
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
                    {filteredOpportunities.length > 0 ? (
                      filteredOpportunities.map((opportunity) => (
                        <tr key={opportunity.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 text-slate-900">
                            <Link href={`/opportunities/${opportunity.id}`} className="text-slate-900 hover:text-blue-600">
                              {opportunity.title}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            <Link href={`/contacts/${opportunity.contactId}`} className="text-slate-900 hover:text-blue-600">
                              {opportunity.contact}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{opportunity.stage}</td>
                          <td className="px-4 py-4 text-slate-600">${opportunity.estimatedValue.toLocaleString()}</td>
                          <td className="px-4 py-4 text-slate-600">{opportunity.assignedStaff}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No opportunities match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {filteredOpportunities.length > 0 && (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredOpportunities.map((opportunity) => (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}