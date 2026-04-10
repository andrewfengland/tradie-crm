'use client';

import { useEffect, useState } from 'react';
import type { Note } from '@/app/lib/supabase';

export default function NotesSection({
  parentType,
  parentId,
}: {
  parentType: 'job' | 'quote';
  parentId: string;
}) {
  const [notes,   setNotes]   = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBody, setNewBody] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function fetchNotes() {
    const res = await fetch(`/api/notes?parent_type=${parentType}&parent_id=${encodeURIComponent(parentId)}`);
    const data = await res.json();
    if (res.ok) setNotes(data.notes ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchNotes(); }, [parentType, parentId]);

  async function handleAdd() {
    if (!newBody.trim()) return;
    setSaving(true);
    setError(null);
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: newBody.trim(), parent_type: parentType, parent_id: parentId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Failed to save note.');
      setSaving(false);
      return;
    }
    setNewBody('');
    setSaving(false);
    await fetchNotes();
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Internal Notes</h2>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
        Internal use only — not visible to clients
      </p>

      <div className="mt-4 space-y-2">
        <textarea
          rows={3}
          placeholder="Add an internal note…"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            disabled={saving || !newBody.trim()}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Add note'}
          </button>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : notes.length === 0 ? (
          <p className="text-sm italic text-slate-400">No internal notes yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-800">{note.body}</p>
                <p className="mt-1.5 text-xs text-slate-400">{formatDate(note.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
