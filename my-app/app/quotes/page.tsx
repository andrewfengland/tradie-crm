'use client';

import Link from 'next/link';
import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';

const quoteRequests = [
  { id: 1, name: 'Smith Renovations', amount: '$9,200', status: 'Draft' },
  { id: 2, name: 'Lakeside Decks', amount: '$4,800', status: 'Sent' },
  { id: 3, name: 'City Kitchen Fitout', amount: '$15,500', status: 'Approved' },
];

export default function QuotesPage() {
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
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quotes</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Quotes</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Review and manage quote requests for your clients.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                  New quote
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                {quoteRequests.map((quote) => (
                  <Link key={quote.id} href={`/quotes/${quote.id}`} className="block rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{quote.name}</p>
                        <p className="text-sm text-slate-500">{quote.status}</p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{quote.amount}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
