'use client';

import { useEffect, useState } from 'react';
import type { JobMaterial, MaterialStatus } from '@/app/lib/supabase';
import { MATERIAL_STATUSES, MATERIAL_BADGE } from '@/app/lib/supabase';

export default function MaterialsSection({ jobId }: { jobId: string }) {
  const [materials, setMaterials] = useState<JobMaterial[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [newDesc,   setNewDesc]   = useState('');
  const [newStatus, setNewStatus] = useState<MaterialStatus>('Needed');
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  async function fetchMaterials() {
    const res = await fetch(`/api/jobs/${jobId}/materials`);
    const data = await res.json();
    if (res.ok) setMaterials(data.materials ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchMaterials(); }, [jobId]);

  async function handleAdd() {
    if (!newDesc.trim()) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/jobs/${jobId}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newDesc.trim(), status: newStatus }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Failed to add material.');
      setSaving(false);
      return;
    }
    setNewDesc('');
    setNewStatus('Needed');
    setSaving(false);
    await fetchMaterials();
  }

  async function handleStatusChange(id: string, status: MaterialStatus) {
    // Optimistic update
    setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    const res = await fetch(`/api/jobs/${jobId}/materials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) await fetchMaterials(); // revert on failure
  }

  async function handleDelete(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    const res = await fetch(`/api/jobs/${jobId}/materials/${id}`, { method: 'DELETE' });
    if (!res.ok) await fetchMaterials(); // revert on failure
  }

  // Status summary counts
  const counts = MATERIAL_STATUSES.reduce<Record<MaterialStatus, number>>(
    (acc, s) => ({ ...acc, [s]: materials.filter((m) => m.status === s).length }),
    { Needed: 0, Ordered: 0, Delivered: 0 }
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Materials</h2>

      {/* Summary counts — only show when there are materials */}
      {materials.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {MATERIAL_STATUSES.map((s) => counts[s] > 0 && (
            <span key={s} className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${MATERIAL_BADGE[s]}`}>
              {s} {counts[s]}
            </span>
          ))}
        </div>
      )}

      {/* Add material form */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Material description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as MaterialStatus)}
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-400"
        >
          {MATERIAL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={saving || !newDesc.trim()}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          {saving ? 'Adding…' : 'Add'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Materials list */}
      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : materials.length === 0 ? (
          <p className="text-sm italic text-slate-400">No materials tracked yet.</p>
        ) : (
          <div className="space-y-2">
            {materials.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="flex-1 text-sm text-slate-900">{m.description}</p>
                <select
                  value={m.status}
                  onChange={(e) => handleStatusChange(m.id, e.target.value as MaterialStatus)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] focus:outline-none cursor-pointer ${MATERIAL_BADGE[m.status as MaterialStatus] ?? 'bg-slate-100 text-slate-700'}`}
                >
                  {MATERIAL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
