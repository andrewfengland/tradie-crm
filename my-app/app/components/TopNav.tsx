'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/app/lib/supabase';

export default function TopNav() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .auth.getUser()
      .then(({ data: { user } }) => setEmail(user?.email ?? null));
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="md:ml-0 ml-12">
          <h2 className="text-xl font-semibold text-slate-900">Welcome</h2>
          <p className="text-sm text-slate-600">Manage your trades business</p>
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden sm:block text-sm text-slate-500 truncate max-w-[200px]">
              {email}
            </span>
          )}
          <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors rounded-lg">
            🔔
          </button>
        </div>
      </div>
    </header>
  );
}
