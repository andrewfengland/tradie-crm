'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../app/components/Sidebar';
import TopNav from '../../../app/components/TopNav';
import { jobs } from '../../lib/jobs';

const staffMembers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];
const statuses = ['Scheduled', 'In Progress', 'Awaiting Approval', 'Completed', 'On Hold'];

export default function NewJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: '',
    siteAddress: '',
    status: 'Scheduled',
    assignedStaff: staffMembers[0],
    scheduledDate: '',
    startDate: '',
    endDate: '',
    timeWindow: '',
    assignedCrew: '',
    scope: '',
    materialsNeeded: [''],
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

  const handleMaterialChange = (index: number, value: string) => {
    setFormData((prev) => {
      const nextMaterials = [...prev.materialsNeeded];
      nextMaterials[index] = value;
      return { ...prev, materialsNeeded: nextMaterials };
    });
  };

  const handleAddMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materialsNeeded: [...prev.materialsNeeded, ''],
    }));
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materialsNeeded: prev.materialsNeeded.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    const maxId = Math.max(...jobs.map((job) => parseInt(job.id, 10)), 0);
    const newJob = {
      id: (maxId + 1).toString(),
      jobNumber: `J-2024-${String(maxId + 1).padStart(3, '0')}`,
      clientName: formData.clientName || 'New Client',
      clientId: '',
      siteAddress: formData.siteAddress,
      status: formData.status,
      assignedStaff: formData.assignedStaff,
      scheduledDate: formData.scheduledDate,
      startDate: formData.startDate,
      endDate: formData.endDate,
      timeWindow: formData.timeWindow,
      assignedCrew: formData.assignedCrew,
      scope: formData.scope,
      materialsNeeded: formData.materialsNeeded.filter((item) => item.trim() !== ''),
      notes: formData.notes,
    };

    jobs.push(newJob);
    console.log('Mock saved job:', newJob);

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSaving(false);
    router.push('/jobs');
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New Job</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create Job</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Add a new job record and schedule it for your team.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-slate-900">
                    Client Name
                  </label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="e.g. Olivia Hart"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="siteAddress" className="block text-sm font-medium text-slate-900">
                    Site Address
                  </label>
                  <input
                    id="siteAddress"
                    name="siteAddress"
                    type="text"
                    value={formData.siteAddress}
                    onChange={handleChange}
                    placeholder="e.g. 14 Baker Street, Melbourne, VIC 3000"
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-900">
                      Job Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="assignedStaff" className="block text-sm font-medium text-slate-900">
                      Assigned Staff / Subcontractor
                    </label>
                    <select
                      id="assignedStaff"
                      name="assignedStaff"
                      value={formData.assignedStaff}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      {staffMembers.map((staff) => (
                        <option key={staff} value={staff}>
                          {staff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-slate-900">
                    Scheduled Date
                  </label>
                  <input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Scheduling */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-900">
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-900">
                      End Date
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="timeWindow" className="block text-sm font-medium text-slate-900">
                      Time Window
                    </label>
                    <select
                      id="timeWindow"
                      name="timeWindow"
                      value={formData.timeWindow}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select time window</option>
                      <option value="Morning (7am–12pm)">Morning (7am–12pm)</option>
                      <option value="Afternoon (12pm–5pm)">Afternoon (12pm–5pm)</option>
                      <option value="Full Day">Full Day</option>
                      <option value="TBC">TBC</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="assignedCrew" className="block text-sm font-medium text-slate-900">
                      Assigned Crew
                    </label>
                    <input
                      id="assignedCrew"
                      name="assignedCrew"
                      type="text"
                      value={formData.assignedCrew}
                      onChange={handleChange}
                      placeholder="e.g. John Doe, Mike Chen"
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="scope" className="block text-sm font-medium text-slate-900">
                    Scope / Description
                  </label>
                  <textarea
                    id="scope"
                    name="scope"
                    value={formData.scope}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the job scope and details."
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">Materials Needed</label>
                  <div className="space-y-3">
                    {formData.materialsNeeded.map((material, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={material}
                          onChange={(event) => handleMaterialChange(index, event.target.value)}
                          placeholder={`Material ${index + 1}`}
                          className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    + Add Material
                  </button>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-900">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add job notes or reminders."
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Job'}
                  </button>
                  <Link
                    href="/jobs"
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