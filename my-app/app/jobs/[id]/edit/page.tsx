'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../../app/components/Sidebar';
import TopNav from '../../../../app/components/TopNav';
import { jobs, getJobById } from '../../../lib/jobs';

const staffMembers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];
const statuses = ['Scheduled', 'In Progress', 'Awaiting Approval', 'Completed', 'On Hold'];

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [jobId, setJobId] = useState<string>('');
  const [formData, setFormData] = useState({
    siteAddress: '',
    status: '',
    assignedStaff: '',
    scheduledDate: '',
    startDate: '',
    endDate: '',
    timeWindow: '',
    assignedCrew: '',
    scope: '',
    materialsNeeded: [] as string[],
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobNotFound, setJobNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setJobId(id);

      const job = getJobById(id);
      if (!job) {
        setJobNotFound(true);
        setIsLoading(false);
        return;
      }

      setFormData({
        siteAddress: job.siteAddress,
        status: job.status,
        assignedStaff: job.assignedStaff,
        scheduledDate: job.scheduledDate,
        startDate: job.startDate ?? '',
        endDate: job.endDate ?? '',
        timeWindow: job.timeWindow ?? '',
        assignedCrew: job.assignedCrew ?? '',
        scope: job.scope,
        materialsNeeded: [...job.materialsNeeded],
        notes: job.notes,
      });
      setIsLoading(false);
    })();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materialsNeeded];
    newMaterials[index] = value;
    setFormData((prev) => ({
      ...prev,
      materialsNeeded: newMaterials,
    }));
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

    // Find the job and update it in the mock data
    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex] = {
        ...jobs[jobIndex],
        siteAddress: formData.siteAddress,
        status: formData.status,
        assignedStaff: formData.assignedStaff,
        scheduledDate: formData.scheduledDate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timeWindow: formData.timeWindow,
        assignedCrew: formData.assignedCrew,
        scope: formData.scope,
        materialsNeeded: formData.materialsNeeded,
        notes: formData.notes,
      };
      console.log('Job updated (mock save):', jobs[jobIndex]);
    }

    // Simulate a brief save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    router.push(`/jobs/${jobId}`);
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
                <p className="text-slate-700">Loading...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (jobNotFound) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">Job not found.</p>
                <Link
                  href="/jobs"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back to jobs
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Edit Job</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Edit Job</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Update job details and schedule.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                {/* Site Address */}
                <div>
                  <label htmlFor="siteAddress" className="block text-sm font-medium text-slate-900">
                    Site Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="siteAddress"
                    name="siteAddress"
                    value={formData.siteAddress}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Job Status */}
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

                {/* Assigned Staff */}
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

                {/* Scheduled Date */}
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-slate-900">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
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
                      type="date"
                      id="startDate"
                      name="startDate"
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
                      type="date"
                      id="endDate"
                      name="endDate"
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
                      type="text"
                      id="assignedCrew"
                      name="assignedCrew"
                      value={formData.assignedCrew}
                      onChange={handleChange}
                      placeholder="e.g. John Doe, Mike Chen"
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Scope */}
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
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Materials Needed */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">
                    Materials Needed
                  </label>
                  <div className="space-y-3">
                    {formData.materialsNeeded.map((material, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={material}
                          onChange={(e) => handleMaterialChange(index, e.target.value)}
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
                    rows={4}
                    placeholder="Add any additional notes..."
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link
                    href={`/jobs/${jobId}`}
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