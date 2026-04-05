'use client';

export default function TopNav() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="md:ml-0 ml-12">
          <h2 className="text-xl font-semibold text-slate-900">Welcome</h2>
          <p className="text-sm text-slate-600">Manage your trades business</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors rounded-lg">
            🔔
          </button>
          <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors rounded-lg">
            ⚙️ Settings
          </button>
          <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors rounded-lg">
            👤 Profile
          </button>
        </div>
      </div>
    </header>
  );
}
