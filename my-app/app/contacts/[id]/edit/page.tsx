'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../../app/components/Sidebar';
import TopNav from '../../../../app/components/TopNav';
import { getContactById, updateContact } from '../../../lib/contacts';

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [contactId, setContactId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setContactId(id);

      const contact = getContactById(id);
      if (!contact) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setFormData({
        name: contact.name,
        company: contact.company,
        role: contact.role,
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        notes: contact.notes,
      });
      setIsLoading(false);
    })();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    updateContact(contactId, formData);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSaving(false);
    router.push(`/contacts/${contactId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">Loading…</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">Contact not found.</p>
                <Link
                  href="/contacts"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back to contacts
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Edit Contact</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">{formData.name}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Update the details for this contact.
                  </p>
                </div>
                <Link
                  href={`/contacts/${contactId}`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-900">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Olivia Hart"
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-900">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Hart Electrical"
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-900">
                      Role
                    </label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Owner"
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-900">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. (03) 9123 4567"
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. olivia@hart-electrical.com"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-900">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 14 Baker Street, Melbourne, VIC 3000"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-900">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes about this contact…"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

              </div>
            </section>

            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/contacts/${contactId}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
