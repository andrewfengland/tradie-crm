'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../../app/components/Sidebar';
import TopNav from '../../../../app/components/TopNav';
import { quotes, getQuoteById } from '../../../lib/quotes';

const statuses = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quoteId, setQuoteId] = useState<string>('');
  const [formData, setFormData] = useState({
    clientName: '',
    jobAddress: '',
    status: '',
    createdDate: '',
    expiryDate: '',
    lineItems: [] as { description: string; quantity: number; unitPrice: number; total: number }[],
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quoteNotFound, setQuoteNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setQuoteId(id);

      const quote = getQuoteById(id);
      if (!quote) {
        setQuoteNotFound(true);
        setIsLoading(false);
        return;
      }

      setFormData({
        clientName: quote.clientName,
        jobAddress: quote.jobAddress,
        status: quote.status,
        createdDate: quote.createdDate,
        expiryDate: quote.expiryDate,
        lineItems: [...quote.lineItems],
        notes: quote.notes,
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

  const handleLineItemChange = (index: number, field: string, value: string | number) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value,
    };
    // Recalculate total for the line item
    if (field === 'quantity' || field === 'unitPrice') {
      newLineItems[index].total = newLineItems[index].quantity * newLineItems[index].unitPrice;
    }
    setFormData((prev) => ({
      ...prev,
      lineItems: newLineItems,
    }));
  };

  const handleAddLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const handleRemoveLineItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.total, 0);
    const gst = Math.round(subtotal * 0.1);
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const handleSave = async () => {
    setIsSaving(true);

    const { subtotal, gst, total } = calculateTotals();

    // Find the quote and update it in the mock data
    const quoteIndex = quotes.findIndex((q) => q.id === quoteId);
    if (quoteIndex !== -1) {
      quotes[quoteIndex] = {
        ...quotes[quoteIndex],
        clientName: formData.clientName,
        jobAddress: formData.jobAddress,
        status: formData.status,
        createdDate: formData.createdDate,
        expiryDate: formData.expiryDate,
        lineItems: formData.lineItems,
        subtotal,
        gst,
        total,
        notes: formData.notes,
      };
      console.log('Quote updated (mock save):', quotes[quoteIndex]);
    }

    // Simulate a brief save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    router.push(`/quotes/${quoteId}`);
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

  if (quoteNotFound) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">Quote not found.</p>
                <Link
                  href="/quotes"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back to quotes
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { subtotal, gst, total } = calculateTotals();

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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Edit Quote</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Edit Quote</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Update quote details, line items, and pricing.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                {/* Client Name */}
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-slate-900">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Job Address */}
                <div>
                  <label htmlFor="jobAddress" className="block text-sm font-medium text-slate-900">
                    Job Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="jobAddress"
                    name="jobAddress"
                    value={formData.jobAddress}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-900">
                    Status
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

                {/* Created Date */}
                <div>
                  <label htmlFor="createdDate" className="block text-sm font-medium text-slate-900">
                    Created Date
                  </label>
                  <input
                    type="date"
                    id="createdDate"
                    name="createdDate"
                    value={formData.createdDate}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-900">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Line Items */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">
                    Line Items
                  </label>
                  <div className="space-y-3">
                    {formData.lineItems.map((item, index) => (
                      <div key={index} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] items-end">
                        <div>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            placeholder="Qty"
                            min="0"
                            step="0.01"
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            placeholder="Unit Price"
                            min="0"
                            step="0.01"
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={item.total.toFixed(2)}
                            readOnly
                            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(index)}
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    + Add Line Item
                  </button>
                </div>

                {/* Totals */}
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-700">Subtotal</span>
                      <span className="font-medium text-slate-900">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">GST (10%)</span>
                      <span className="font-medium text-slate-900">${gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="text-lg font-semibold text-slate-900">Total</span>
                      <span className="text-lg font-semibold text-slate-900">${total.toLocaleString()}</span>
                    </div>
                  </div>
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
                    href={`/quotes/${quoteId}`}
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