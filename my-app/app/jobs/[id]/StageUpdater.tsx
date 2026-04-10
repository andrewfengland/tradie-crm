'use client';

import { useState } from 'react';
import { JOB_STAGES, JOB_STAGE_BADGE, updateJobStage } from '../../lib/jobs';

export default function JobStageUpdater({
  jobId,
  currentStage,
}: {
  jobId: string;
  currentStage: string;
}) {
  const [displayedStage, setDisplayedStage] = useState(currentStage);
  const [selected, setSelected] = useState(
    (JOB_STAGES as readonly string[]).includes(currentStage) ? currentStage : JOB_STAGES[0]
  );
  const [saved, setSaved] = useState(false);

  function handleUpdate() {
    updateJobStage(jobId, selected);
    setDisplayedStage(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const badgeCls = JOB_STAGE_BADGE[displayedStage] ?? 'bg-slate-100 text-slate-700';

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Job stage</h2>
      <div className="mt-4 space-y-4">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">Current stage</p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeCls}`}
          >
            {displayedStage}
          </span>
        </div>

        <div>
          <label htmlFor="job-stage-select" className="block text-sm font-medium text-slate-700 mb-2">
            Change stage
          </label>
          <select
            id="job-stage-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          >
            {JOB_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleUpdate}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          {saved ? 'Stage updated!' : 'Update Stage'}
        </button>
      </div>
    </section>
  );
}
