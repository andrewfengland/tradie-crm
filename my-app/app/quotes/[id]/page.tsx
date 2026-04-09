'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';
import TopNav from '@/app/components/TopNav';
import { getSupabase, type Quote, type QuoteLineItem } from '@/app/lib/supabase';

const badgeClasses: Record<string, string> = {
  'Draft':    'bg-slate-100 text-slate-700',
  'Sent':     'bg-blue-100 text-blue-800',
  'Accepted': 'bg-emerald-100 text-emerald-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Expired':  'bg-amber-100 text-amber-800',
};

type NewItem = { description: string; quantity: number; unit_price: number };

export default function QuoteDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [quote,     setQuote]     = useState<Quote | null>(null);
  const [items,     setItems]     = useState<QuoteLineItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);
  const [addErr,    setAddErr]    = useState<string | null>(null);
  const [adding,    setAdding]    = useState(false);
  const [newItem,   setNewItem]   = useState<NewItem>({ description: '', quantity: 1, unit_price: 0 });

  const subtotal = items.reduce((sum, i) => sum + (i.line_total ?? 0), 0);

  async function load() {
    const supabase = getSupabase();
    const [quoteRes, itemsRes] = await Promise.all([
      supabase.from('quotes').select('*').eq('id', id).single(),
      supabase.from('quote_line_items').select('*').eq('quote_id', id).order('created_at', { ascending: true }),
    ]);
    if (quoteRes.error || !quoteRes.data) {
      setNotFound(true);
    } else {
      setQuote(quoteRes.data);
      setItems(itemsRes.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this quote? This cannot be undone.')) return;
    setDeleting(true);
    setDeleteErr(null);
    const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setDeleteErr(data.error ?? 'Failed to delete quote.');
      setDeleting(false);
    } else {
      router.push('/quotes');
    }
  }

  async function handleAddItem() {
    if (!newItem.description.trim()) return;
    setAdding(true);
    setAddErr(null);
    const res = await fetch(`/api/quotes/${id}/line-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    const data = await res.json();
    if (!res.ok) {
      setAddErr(data.error ?? 'Failed to add item.');
      setAdding(false);
      return;
    }
    setNewItem({ description: '', quantity: 1, unit_price: 0 });
    setAdding(false);
    await load();
  }

  async function handleRemoveItem(itemId: string) {
    const res = await fetch(`/api/quotes/${id}/line-items/${itemId}`, { method: 'DELETE' });
    if (res.ok) await load();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 p-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Loading…</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (notFound || !quote) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 p-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-700">Quote not found.</p>
              <Link href="/quotes" className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Back to quotes
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const createdDate = new Date(quote.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quote</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                    {quote.contact_name ?? <span className="italic text-slate-400">No contact</span>}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                  <Link href="/quotes" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Back to quotes
                  </Link>
                </div>
              </div>
            </section>

            {deleteErr && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <p className="text-sm text-red-700">{deleteErr}</p>
              </section>
            )}

            {/* Details */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                  <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses[quote.status] ?? 'bg-slate-100 text-slate-700'}`}>
                    {quote.status}
                  </span>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Created</p>
                  <p className="mt-2 font-medium text-slate-900">{createdDate}</p>
                </div>
                {quote.notes && (
                  <div className="rounded-3xl bg-slate-50 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Notes</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{quote.notes}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Line items */}
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
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 pr-4 text-slate-900">{item.description}</td>
                          <td className="py-3 pr-4 text-right text-slate-600">{item.quantity}</td>
                          <td className="py-3 pr-4 text-right text-slate-600">${Number(item.unit_price).toLocaleString()}</td>
                          <td className="py-3 pr-4 text-right font-medium text-slate-900">${Number(item.line_total).toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <button onClick={() => handleRemoveItem(item.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
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

              {addErr && <p className="mt-3 text-sm text-red-600">{addErr}</p>}

              {/* Add item */}
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
                  onClick={handleAddItem}
                  disabled={adding || !newItem.description.trim()}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40"
                >
                  {adding ? '…' : 'Add'}
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
