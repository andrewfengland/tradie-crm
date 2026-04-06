import Link from 'next/link';
import Sidebar from '../../../app/components/Sidebar';
import TopNav from '../../../app/components/TopNav';
import { getQuoteById } from '../../lib/quotes';

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = getQuoteById(id);

  if (!quote) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-60">
          <TopNav />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-7xl">
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quote detail</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">{quote.quoteNumber}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Review quote details, line items, and totals.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/quotes/${quote.id}/edit`}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Edit Quote
                  </Link>
                  <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                    Mark Accepted
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                    Convert to Job
                  </button>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Quote details</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Quote Number</p>
                      <p className="mt-2 font-medium text-slate-900">{quote.quoteNumber}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Client</p>
                      <p className="mt-2 font-medium text-slate-900">{quote.clientName}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Job Address</p>
                      <p className="mt-2 font-medium text-slate-900">{quote.jobAddress}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                      <p className="mt-2 font-medium text-slate-900">{quote.status}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Created Date</p>
                      <p className="mt-2 font-medium text-slate-900">{quote.createdDate}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Expiry Date</p>
                      <p className="mt-2 font-medium text-slate-900">{quote.expiryDate}</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Line Items</h2>
                  <div className="mt-6 overflow-hidden rounded-3xl">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-4 text-left font-semibold text-slate-700">Description</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-700">Qty</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-700">Unit Price</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-700">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {quote.lineItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 text-slate-900">{item.description}</td>
                            <td className="px-4 py-4 text-slate-600">{item.quantity}</td>
                            <td className="px-4 py-4 text-slate-600">${item.unitPrice.toLocaleString()}</td>
                            <td className="px-4 py-4 text-slate-600">${item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Totals</h2>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-700">Subtotal</span>
                      <span className="font-medium text-slate-900">${quote.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">GST (10%)</span>
                      <span className="font-medium text-slate-900">${quote.gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-4">
                      <span className="text-lg font-semibold text-slate-900">Total</span>
                      <span className="text-lg font-semibold text-slate-900">${quote.total.toLocaleString()}</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Notes</h2>
                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">{quote.notes}</p>
                  </div>
                </section>
              </div>

              <div className="space-y-4">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-slate-900">Related jobs</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      0 items
                    </span>
                  </div>
                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-slate-500">No jobs yet</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}