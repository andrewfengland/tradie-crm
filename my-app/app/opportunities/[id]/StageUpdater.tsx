'use client';

import { useState } from 'react';
import { updateOpportunityStage } from '../../lib/opportunities';

const STAGES = ['New Lead', 'Contacted', 'Quoted', 'Follow Up', 'Won', 'Lost'];

export default function StageUpdater({
  opportunityId,
  currentStage,
}: {
  opportunityId: string;
  currentStage: string;
}) {
  const [displayedStage, setDisplayedStage] = useState(currentStage);
  const [selected, setSelected] = useState(currentStage);
  const [saved, setSaved] = useState(false);

  function handleUpdate() {
    updateOpportunityStage(opportunityId, selected);
    setDisplayedStage(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Pipeline stage</h2>
      <div className="mt-4 space-y-4">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current stage</p>
          <p className="mt-2 font-medium text-slate-900">{displayedStage}</p>
        </div>

        <div>
          <label htmlFor="stage-select" className="block text-sm font-medium text-slate-700 mb-2">
            Update stage
          </label>
          <select
            id="stage-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          >
            {STAGES.map((s) => (
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
