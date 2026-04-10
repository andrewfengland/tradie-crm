'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../app/components/Sidebar';
import TopNav from '../../../app/components/TopNav';

type DraftItem = {
  description: string;
  quantity: number;
  unit_price: number;
};

const STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

export default function NewQuotePage() {
  const router = useRouter();

  const [contact_name, setContactName] = useState('');
  const [job_address,  setJobAddress]  = useState('');
  const [status, setStatus]           = useState('Draft');
  const [notes, setNotes]             = useState('');
  const [items, setItems]             = useState<DraftItem[]>([]);
  const [newItem, setNewItem]         = useState<DraftItem>({ description: '', quantity: 1, unit_price: 0 });
  const [isSaving, setIsSaving]       = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const lineTotal = (item: DraftItem) => item.quantity * item.unit_price;
  const subtotal  = items.reduce((sum, i) => sum + lineTotal(i), 0);

  function addItem() {
    if (!newItem.description.trim()) return;
    setItems((prev) => [...prev, { ...newItem }]);
    setNewItem({ description: '', quantity: 1, unit_price: 0 });
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    const quoteRes = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_name, status, notes, job_address: job_address || null }),
    });
    const quoteData = await quoteRes.json();
    if (!quoteRes.ok) {
      setError(quoteData.error ?? 'Failed to create quote.');
      setIsSaving(false);
      return;
    }

    const quoteId: string = quoteData.id;

    for (const item of items) {
      const res = await fetch(`/api/quotes/${quoteId}/line-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: item.description, quantity: item.quantity, unit_price: item.unit_price }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to save line items.');
        setIsSaving(false);
        return;
      }
    }

    router.push(`/quotes/${quoteId}`);
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-4xl space-y-6">

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New Quote</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create Quote</h1>
                </div>
                <Link
                  href="/quotes"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </section>

            {error && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <p className="text-sm text-red-700">{error}</p>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-slate-900">Contact Name</label>
                <input
                  id="contact_name"
                  type="text"
                  value={contact_name}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sarah Mitchell"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="job_address" className="block text-sm font-medium text-slate-900">Job / Site Address</label>
                <input
                  id="job_address"
                  type="text"
                  value={job_address}
                  onChange={(e) => setJobAddress(e.target.value)}
                  placeholder="e.g. 14 Baker Street, Melbourne VIC 3000"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-900">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none sm:max-w-xs"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-900">Notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any relevant notes…"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Line Items</h2>

              {items.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-2 pr-4 text-left font-medium text-slate-600">Description</th>
                        <th className="py-2 pr-4 text-right font-medium text-slate-600">Qty</th>
                        <th className="py-2 pr-4 text-right font-medium text-slate-600">Unit Price</th>
                        <th className="py-2 pr-4 text-right font-medium text-slate-600">Total</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-3 pr-4 text-slate-900">{item.description}</td>
                          <td className="py-3 pr-4 text-right text-slate-600">{item.quantity}</td>
                          <td className="py-3 pr-4 text-right text-slate-600">${item.unit_price.toLocaleString()}</td>
                          <td className="py-3 pr-4 text-right font-medium text-slate-900">${lineTotal(item).toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <button onClick={() => removeItem(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-200">
                        <td colSpan={3} className="py-3 pr-4 text-right text-sm font-semibold text-slate-700">Subtotal</td>
                        <td className="py-3 pr-4 text-right font-semibold text-slate-900">${subtotal.toLocaleString()}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_80px_110px_auto]">
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem((p) => ({ ...p, quantity: Number(e.target.value) }))}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Unit price"
                  value={newItem.unit_price}
                  onChange={(e) => setNewItem((p) => ({ ...p, unit_price: Number(e.target.value) }))}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={addItem}
                  disabled={!newItem.description.trim()}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving…' : 'Save Quote'}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
