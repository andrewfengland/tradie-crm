'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { jobs } from '../lib/jobs';

const badgeClasses: Record<string, string> = {
  'In Progress': 'bg-emerald-100 text-emerald-800',
  'Scheduled': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-slate-100 text-slate-700',
};

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Extract unique statuses
  const statuses = Array.from(new Set(jobs.map(j => j.status))).sort();

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.siteAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === '' || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
  };

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
                <Link
                  href="/jobs/new"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New Job
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {/* Search Input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
                    Search by client name or site address
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Filters */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Status Filter */}
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-2">
                      Filter by status
                    </label>
                    <select
                      id="status-filter"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">All statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Result count */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{filteredJobs.length}</span> of{' '}
                    <span className="font-semibold text-slate-900">{jobs.length}</span> jobs
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{job.jobNumber}</p>
                        <p className="text-sm text-slate-500">{job.clientName}</p>
                        <p className="text-sm text-slate-500">{job.siteAddress}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeClasses[job.status]}`}>
                          {job.status}
                        </span>
                        <span className="text-sm font-medium text-slate-700">Due {new Date(job.scheduledDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
