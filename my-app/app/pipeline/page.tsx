'use client';

import Sidebar from '../../app/components/Sidebar';
import TopNav from '../../app/components/TopNav';

const columns = [
  { id: 'new-lead', title: 'New Lead', color: 'bg-blue-50 border-blue-200' },
  { id: 'contacted', title: 'Contacted', color: 'bg-amber-50 border-amber-200' },
  { id: 'site-visit', title: 'Site Visit Booked', color: 'bg-purple-50 border-purple-200' },
  { id: 'quote-sent', title: 'Quote Sent', color: 'bg-green-50 border-green-200' },
  { id: 'deposit-pending', title: 'Deposit Pending', color: 'bg-orange-50 border-orange-200' },
  { id: 'won', title: 'Won', color: 'bg-emerald-50 border-emerald-200' },
];

const sampleCards = {
  'new-lead': [
    { id: 1, name: 'ABC Construction', value: '$8,500', contact: 'David Lee' },
    { id: 2, name: 'Green Builders', value: '$12,000', contact: 'Lisa Wong' },
  ],
  'contacted': [
    { id: 3, name: 'HomeReno Ltd', value: '$6,200', contact: 'James Hart' },
  ],
  'site-visit': [
    { id: 4, name: 'New Property Co', value: '$15,000', contact: 'Sarah Chen' },
    { id: 5, name: 'Urban Development', value: '$9,800', contact: 'Mike Johnson' },
  ],
  'quote-sent': [
    { id: 6, name: 'Modern Spaces', value: '$11,500', contact: 'Emma Taylor' },
  ],
  'deposit-pending': [
    { id: 7, name: 'Classic Homes', value: '$18,200', contact: 'Robert Brown' },
  ],
  'won': [
    { id: 8, name: 'Future Builders', value: '$22,000', contact: 'Priya Patel' },
  ],
};

function Card({ name, value, contact }: { name: string; value: string; contact: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="font-medium text-slate-900 text-sm mb-2">{name}</p>
      <p className="text-lg font-semibold text-slate-700 mb-2">{value}</p>
      <p className="text-xs text-slate-500">👤 {contact}</p>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-60">
        <TopNav />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            {/* Header Section */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pipeline</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sales Pipeline</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Track your leads through each stage from initial contact to project completion.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                  Add Lead
                </button>
              </div>
            </section>

            {/* Kanban Board */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <div className="flex gap-6 pb-2 min-w-min">
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex-shrink-0 w-80"
                    >
                      {/* Column Header */}
                      <div className="mb-4">
                        <h2 className="font-semibold text-slate-900 text-sm">
                          {column.title}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {sampleCards[column.id as keyof typeof sampleCards]?.length || 0} items
                        </p>
                      </div>

                      {/* Column Background */}
                      <div className={`rounded-xl border-2 ${column.color} p-4 min-h-96 space-y-3`}>
                        {/* Cards */}
                        {sampleCards[column.id as keyof typeof sampleCards]?.map((card) => (
                          <Card key={card.id} name={card.name} value={card.value} contact={card.contact} />
                        ))}

                        {/* Empty State */}
                        {(!sampleCards[column.id as keyof typeof sampleCards] || sampleCards[column.id as keyof typeof sampleCards].length === 0) && (
                          <div className="flex items-center justify-center h-32 text-slate-400">
                            <p className="text-sm">No deals yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {columns.map((column) => (
                <div key={`stat-${column.id}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-500 mb-2">{column.title}</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {sampleCards[column.id as keyof typeof sampleCards]?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
