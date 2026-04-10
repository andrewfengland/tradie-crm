'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';
import TopNav from '@/app/components/TopNav';
import { createTask, type RelatedType } from '@/app/lib/tasks';

const relatedTypeOptions: { value: RelatedType; label: string }[] = [
  { value: 'contact', label: 'Contact' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'quote', label: 'Quote' },
  { value: 'job', label: 'Job' },
];

function NewTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prefillType = (searchParams.get('type') as RelatedType | null) ?? 'contact';
  const prefillId   = searchParams.get('id') ?? '';

  const [title, setTitle]             = useState('');
  const [dueDate, setDueDate]         = useState('');
  const [relatedType, setRelatedType] = useState<RelatedType>(prefillType);
  const [relatedId, setRelatedId]     = useState(prefillId);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');

  function handleSave() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!relatedId.trim()) {
      setError('Related ID is required.');
      return;
    }
    setSaving(true);
    createTask({
      title: title.trim(),
      status: 'Todo',
      dueDate: dueDate || undefined,
      relatedType,
      relatedId: relatedId.trim(),
    });
    router.back();
  }

  return (
    <div className="space-y-6">
      {error && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-sm text-red-700">{error}</p>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-900">
              Task title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Follow up on deposit"
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-900">
              Due date (optional)
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="relatedType" className="block text-sm font-medium text-slate-900">
                Related to <span className="text-red-500">*</span>
              </label>
              <select
                id="relatedType"
                value={relatedType}
                onChange={(e) => setRelatedType(e.target.value as RelatedType)}
                className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                {relatedTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="relatedId" className="block text-sm font-medium text-slate-900">
                Record ID <span className="text-red-500">*</span>
              </label>
              <input
                id="relatedId"
                type="text"
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
                placeholder="ID of the related record"
                className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Task'}
            </button>
            <Link
              href="/tasks"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function NewTaskPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-4xl space-y-6">

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tasks</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">New Task</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Create a task and link it to a contact, opportunity, quote, or job.
                </p>
              </div>
            </section>

            <Suspense fallback={<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Loading…</p></div>}>
              <NewTaskForm />
            </Suspense>

          </div>
        </main>
      </div>
    </div>
  );
}
