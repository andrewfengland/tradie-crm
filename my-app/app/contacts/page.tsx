'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';
import { contacts } from '../lib/contacts';

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) => {
    const q = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(q) ||
      contact.company.toLowerCase().includes(q) ||
      contact.phone.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q)
    );
  });

  const clearFilters = () => setSearchQuery('');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Contacts</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Contacts</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    A simple list of contacts so you can quickly find the people and companies you work with.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/contacts/new" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                    Add Contact
                  </Link>
                  <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Import CSV
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
                    Search contacts
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name, company, phone, or email…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'} found
                  </p>
                  {searchQuery && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="overflow-hidden rounded-3xl">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Name</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Company</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Role</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Phone</th>
                      <th className="px-4 py-4 text-left font-semibold text-slate-700">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                          No contacts match your search.
                        </td>
                      </tr>
                    ) : filteredContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 text-slate-900"><Link href={`/contacts/${contact.id}`} className="text-slate-900 hover:text-blue-600">{contact.name}</Link></td>
                        <td className="px-4 py-4 text-slate-600">{contact.company}</td>
                        <td className="px-4 py-4 text-slate-600">{contact.role}</td>
                        <td className="px-4 py-4 text-slate-600">{contact.phone}</td>
                        <td className="px-4 py-4 text-slate-600">{contact.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredContacts.map((contact) => (
                <Link key={contact.id} href={`/contacts/${contact.id}`} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{contact.company}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>{contact.role}</p>
                    <p>{contact.phone}</p>
                    <p>{contact.email}</p>
                  </div>
                </Link>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
