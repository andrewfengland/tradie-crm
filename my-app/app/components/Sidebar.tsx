'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/contacts', label: 'Contacts', icon: '👥' },
    { href: '/pipeline', label: 'Pipeline', icon: '🔄' },
    { href: '/opportunities', label: 'Opportunities', icon: '💼' },
    { href: '/quotes', label: 'Quotes', icon: '📄' },
    { href: '/jobs', label: 'Jobs', icon: '🔨' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile menu button - shown only on small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative md:block w-60 h-screen bg-gray-900 text-white transition-all duration-300 z-40 ${
          isOpen ? 'left-0' : '-left-60 md:left-0'
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Tradie CRM</h1>
          <p className="text-xs text-gray-400 mt-1">Multi-tenant</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center text-lg">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </aside>
    </>
  );
}
