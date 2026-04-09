'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../../app/components/Sidebar';
import TopNav from '../../../app/components/TopNav';
import { jobs, type Job } from '../../lib/jobs';

// ─── helpers ─────────────────────────────────────────────────────────────────

function effectiveDate(job: Job): string {
  return job.startDate || job.scheduledDate || '';
}

function toDateKey(dateStr: string): string {
  // Normalise to YYYY-MM-DD regardless of input
  return dateStr.slice(0, 10);
}

/** Monday of the ISO week that contains the given date */
function weekStart(d: Date): Date {
  const day = d.getDay(); // 0=Sun …6=Sat
  const diff = (day === 0 ? -6 : 1 - day);
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fmtDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

function fmtWeekRange(mon: Date): string {
  const sun = addDays(mon, 6);
  const a = mon.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  const b = sun.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${a} – ${b}`;
}

// ─── badge colours (matches jobs/page.tsx) ───────────────────────────────────

const badgeClasses: Record<string, string> = {
  'In Progress': 'bg-emerald-100 text-emerald-800',
  'Scheduled':   'bg-blue-100 text-blue-800',
  'Completed':   'bg-slate-100 text-slate-700',
  'On Hold':     'bg-amber-100 text-amber-800',
  'Awaiting Approval': 'bg-purple-100 text-purple-800',
};

// ─── job card ────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  const badge = badgeClasses[job.status] ?? 'bg-slate-100 text-slate-700';
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-900">
            {job.jobNumber} — {job.clientName}
          </p>
          <p className="text-xs text-slate-500">{job.siteAddress}</p>
          {(job.assignedCrew || job.assignedStaff) && (
            <p className="text-xs text-slate-400">
              Crew: {job.assignedCrew || job.assignedStaff}
            </p>
          )}
          {job.timeWindow && (
            <p className="text-xs text-slate-400">{job.timeWindow}</p>
          )}
        </div>
        <span
          className={`self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badge}`}
        >
          {job.status}
        </span>
      </div>
    </Link>
  );
}

// ─── day column ──────────────────────────────────────────────────────────────

function DayColumn({ dateKey, dayJobs }: { dateKey: string; dayJobs: Job[] }) {
  const today = isoDate(new Date());
  const isToday = dateKey === today;

  return (
    <div className="space-y-3">
      <div
        className={`rounded-2xl px-4 py-3 ${
          isToday ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
        }`}
      >
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isToday ? 'text-slate-300' : 'text-slate-500'}`}>
          {isToday ? 'Today' : ''}
        </p>
        <p className={`text-sm font-semibold ${isToday ? 'text-white' : 'text-slate-900'}`}>
          {fmtDay(dateKey)}
        </p>
      </div>
      {dayJobs.length === 0 ? (
        <p className="px-1 text-sm text-slate-400 italic">No jobs scheduled</p>
      ) : (
        <div className="space-y-2">
          {dayJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function JobsSchedulePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState<'day' | 'week'>('week');
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [weekMonday, setWeekMonday] = useState<Date>(weekStart(today));

  // Partition jobs by effective date
  const scheduledByDate = new Map<string, Job[]>();
  const unscheduled: Job[] = [];

  for (const job of jobs) {
    const eff = effectiveDate(job);
    if (!eff) {
      unscheduled.push(job);
    } else {
      const key = toDateKey(eff);
      if (!scheduledByDate.has(key)) scheduledByDate.set(key, []);
      scheduledByDate.get(key)!.push(job);
    }
  }

  // ── Day view nav ──
  const prevDay = () => setSelectedDay((d) => addDays(d, -1));
  const nextDay = () => setSelectedDay((d) => addDays(d, 1));
  const dayKey   = isoDate(selectedDay);
  const dayJobs  = scheduledByDate.get(dayKey) ?? [];

  // ── Week view nav ──
  const prevWeek = () => setWeekMonday((d) => addDays(d, -7));
  const nextWeek = () => setWeekMonday((d) => addDays(d, 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekMonday, i));

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">

            {/* Header */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Jobs</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Schedule</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    See your jobs laid out by day or week.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    ← All Jobs
                  </Link>
                  <Link
                    href="/jobs/new"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                  >
                    New Job
                  </Link>
                </div>
              </div>
            </section>

            {/* View toggle + nav */}
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* View toggle */}
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 gap-1">
                  <button
                    onClick={() => setView('day')}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      view === 'day'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      view === 'week'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Week
                  </button>
                </div>

                {/* Navigation */}
                {view === 'day' ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevDay}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      ‹ Prev
                    </button>
                    <span className="text-sm font-medium text-slate-900 min-w-[160px] text-center">
                      {fmtShort(selectedDay)}
                    </span>
                    <button
                      onClick={() => setSelectedDay(today)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={nextDay}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Next ›
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevWeek}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      ‹ Prev
                    </button>
                    <span className="text-sm font-medium text-slate-900 min-w-[200px] text-center">
                      {fmtWeekRange(weekMonday)}
                    </span>
                    <button
                      onClick={() => setWeekMonday(weekStart(today))}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      This Week
                    </button>
                    <button
                      onClick={nextWeek}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Schedule body */}
            {view === 'day' ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <DayColumn dateKey={dayKey} dayJobs={dayJobs} />
              </section>
            ) : (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-8">
                  {weekDays.map((d) => {
                    const key = isoDate(d);
                    return (
                      <DayColumn
                        key={key}
                        dateKey={key}
                        dayJobs={scheduledByDate.get(key) ?? []}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Unscheduled jobs */}
            {unscheduled.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900 mb-1">Unscheduled jobs</h2>
                <p className="text-sm text-slate-500 mb-4">
                  These jobs have no start date or scheduled date set.{' '}
                  <Link href="/jobs" className="text-slate-700 underline underline-offset-2 hover:text-slate-900">
                    View all jobs →
                  </Link>
                </p>
                <div className="space-y-2">
                  {unscheduled.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
