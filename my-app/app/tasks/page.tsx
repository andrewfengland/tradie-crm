'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';
import TopNav from '@/app/components/TopNav';
import { tasks, toggleTaskStatus, type RelatedType } from '@/app/lib/tasks';

const relatedLabels: Record<RelatedType, string> = {
  contact: 'Contact',
  opportunity: 'Opportunity',
  quote: 'Quote',
  job: 'Job',
};

const statusFilters = ['All', 'Todo', 'Done'] as const;

export default function TasksPage() {
  const [, forceUpdate] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Todo' | 'Done'>('All');

  function handleToggle(id: string) {
    toggleTaskStatus(id);
    forceUpdate((n) => n + 1);
  }

  const filtered = tasks.filter(
    (t) => statusFilter === 'All' || t.status === statusFilter,
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-4xl space-y-6">

            {/* Header */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tasks</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Tasks</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Track follow-up work across contacts, opportunities, quotes, and jobs.
                  </p>
                </div>
                <Link
                  href="/tasks/new"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  New Task
                </Link>
              </div>
            </section>

            {/* Filter */}
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 gap-1">
                {statusFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      statusFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </section>

            {/* Tasks list */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-400 italic">
                    {tasks.length === 0
                      ? 'No tasks yet. Create one to get started.'
                      : 'No tasks match this filter.'}
                  </p>
                  {tasks.length === 0 && (
                    <Link
                      href="/tasks/new"
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                    >
                      New Task
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <button
                        onClick={() => handleToggle(task.id)}
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 transition-colors ${
                          task.status === 'Done'
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                        aria-label={task.status === 'Done' ? 'Mark as todo' : 'Mark as done'}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium ${
                            task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {relatedLabels[task.relatedType]}
                          {task.dueDate ? ` · Due ${task.dueDate}` : ''}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          task.status === 'Done'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
