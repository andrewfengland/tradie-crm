'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../app/components/Sidebar';
import TopNav from '../../../app/components/TopNav';
import { contacts } from '../../lib/contacts';
import { opportunities } from '../../lib/opportunities';

const stages = ['Lead', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
const staffMembers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];

export default function NewOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contactId: '',
    title: '',
    stage: 'Lead',
    estimatedValue: '',
    expectedCloseDate: '',
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.contactId || !formData.title || !formData.estimatedValue) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);

    // Mock save - in a real app, this would be an API call
    const selectedContact = contacts.find((c) => c.id === formData.contactId);
    if (!selectedContact) {
      alert('Invalid contact selected');
      setIsSaving(false);
      return;
    }

    // Generate new ID
    const maxId = Math.max(...opportunities.map((o) => parseInt(o.id, 10)), 0);
    const newId = (maxId + 1).toString();

    // Create new opportunity object
    const newOpportunity = {
      id: newId,
      title: formData.title,
      contactId: formData.contactId,
      contact: selectedContact.name,
      stage: formData.stage,
      estimatedValue: parseInt(formData.estimatedValue, 10),
      assignedStaff: staffMembers[0], // Default to first staff member
      source: 'Manual Entry',
      notes: formData.notes,
    };

    // In a real app, you'd persist this. For now, just redirect
    console.log('New opportunity (mock save):', newOpportunity);

    // Simulate a brief save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    router.push('/opportunities');
  };

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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New Opportunity</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create Opportunity</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Add a new sales opportunity to your pipeline.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                {/* Contact */}
                <div>
                  <label htmlFor="contactId" className="block text-sm font-medium text-slate-900">
                    Customer / Contact <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contactId"
                    name="contactId"
                    value={formData.contactId}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select a contact</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-900">
                    Opportunity Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Kitchen Renovation Project"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Pipeline Stage */}
                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-slate-900">
                    Pipeline Stage
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Value */}
                <div>
                  <label htmlFor="estimatedValue" className="block text-sm font-medium text-slate-900">
                    Estimated Value ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="estimatedValue"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    placeholder="e.g., 25000"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Expected Close Date */}
                <div>
                  <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-slate-900">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    id="expectedCloseDate"
                    name="expectedCloseDate"
                    value={formData.expectedCloseDate}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-900">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes or details..."
                    rows={4}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-2 border-t border-slate-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Opportunity'}
                  </button>
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}