'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTasksByRelated, toggleTaskStatus, type RelatedType } from '@/app/lib/tasks';

export default function TasksSection({
  relatedType,
  relatedId,
}: {
  relatedType: RelatedType;
  relatedId: string;
}) {
  const [, forceUpdate] = useState(0);

  const taskList = getTasksByRelated(relatedType, relatedId);

  function handleToggle(id: string) {
    toggleTaskStatus(id);
    forceUpdate((n) => n + 1);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
        <Link
          href={`/tasks/new?type=${relatedType}&id=${relatedId}`}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          + Add Task
        </Link>
      </div>

      {taskList.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No tasks yet.</p>
      ) : (
        <div className="space-y-2">
          {taskList.map((task) => (
            <div key={task.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
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
                {task.dueDate && (
                  <p className="text-xs text-slate-400 mt-0.5">Due {task.dueDate}</p>
                )}
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
  );
}
