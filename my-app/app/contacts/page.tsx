'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { getSupabase, type Customer } from '../lib/supabase';

const EMPTY_FORM = {
  full_name: '',
  phone: '',
  email: '',
  suburb: '',
  job_type: '',
  status: 'new',
  notes: '',
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function fetchContacts() {
    setLoading(true);
    setError(null);
    const { data, error } = await getSupabase()
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setContacts(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchContacts(); }, []);

  const filtered = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      (c.phone ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.suburb ?? '').toLowerCase().includes(q)
    );
  });

  function openDrawer() {
    setForm(EMPTY_FORM);
    setSaveError(null);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!form.full_name.trim()) return;
    setSaving(true);
    setSaveError(null);

    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setSaveError(data.error ?? 'Failed to save contact.');
      setSaving(false);
    } else {
      setDrawerOpen(false);
      await fetchContacts();
      setSaving(false);
    }
  }

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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Contacts</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Contacts</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    A simple list of contacts so you can quickly find the people you work with.
                  </p>
                </div>
                <button
                  onClick={openDrawer}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </section>

            {/* Search */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search by name, phone, email, or suburb…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'contact' : 'contacts'} found`}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Loading */}
            {loading && (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <p className="text-sm text-slate-500">Loading contacts…</p>
              </section>
            )}

            {/* Error */}
            {!loading && error && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <p className="font-medium text-red-700">Failed to load contacts</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </section>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <p className="text-sm text-slate-500">
                  {searchQuery ? 'No contacts match your search.' : 'No contacts yet.'}
                </p>
              </section>
            )}

            {/* Table */}
            {!loading && !error && filtered.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Name</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Phone</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Email</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Suburb</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Job Type</th>
                        <th className="px-4 py-4 text-left font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filtered.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                            <Link href={`/contacts/${c.id}`} className="hover:underline">
                              {c.full_name}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{c.phone ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{c.email ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{c.suburb ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{c.job_type ?? '—'}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              c.status === 'active' ? 'bg-green-100 text-green-700'
                              : c.status === 'new' ? 'bg-blue-100 text-blue-700'
                              : c.status === 'inactive' ? 'bg-red-100 text-red-600'
                              : 'bg-slate-100 text-slate-600'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={closeDrawer}
          />

          {/* Panel */}
          <div className="relative z-50 w-full max-w-md bg-white h-full shadow-xl flex flex-col overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">New Contact</h2>
              <button
                onClick={closeDrawer}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 px-6 py-6 space-y-5">

              {saveError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{saveError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-900">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Mitchell"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0412 345 678"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="sarah@example.com"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Suburb</label>
                  <input
                    name="suburb"
                    type="text"
                    value={form.suburb}
                    onChange={handleChange}
                    placeholder="e.g. Bondi"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Job Type</label>
                  <input
                    name="job_type"
                    type="text"
                    value={form.job_type}
                    onChange={handleChange}
                    placeholder="e.g. Electrical"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900">Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes…"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

            </div>

            {/* Drawer footer */}
            <div className="flex gap-3 px-6 py-5 border-t border-slate-200">
              <button
                onClick={closeDrawer}
                className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.full_name.trim()}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

