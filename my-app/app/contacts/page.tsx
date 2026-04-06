'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { getSupabase, type Customer } from '../lib/supabase';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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

    fetchContacts();
  }, []);

  const filtered = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      (c.phone ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.suburb ?? '').toLowerCase().includes(q)
    );
  });

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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/contacts/new"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                  >
                    Add Contact
                  </Link>
                </div>
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
                            {c.full_name}
                          </td>
                          <td className="px-4 py-4 text-slate-600">{c.phone ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{c.email ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{c.suburb ?? '—'}</td>
                          <td className="px-4 py-4 text-slate-600">{c.job_type ?? '—'}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                c.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : c.status === 'new'
                                  ? 'bg-blue-100 text-blue-700'
                                  : c.status === 'inactive'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
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
    </div>
  );
}


