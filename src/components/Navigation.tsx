'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { Button } from './shared/Button';

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/dashboard/panchang', label: TELUGU_LABELS.nav.panchang },
    { href: '/dashboard/kundali', label: TELUGU_LABELS.nav.kundali },
    { href: '/dashboard/matchmaking', label: TELUGU_LABELS.nav.matchmaking },
    { href: '/dashboard/saved', label: TELUGU_LABELS.nav.saved },
  ];

  if (!mounted) {
    // Render a skeleton or just the static parts to match server
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center px-2 py-2 text-xl font-bold text-primary-600">
                {TELUGU_LABELS.app.shortName}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 py-2 text-xl font-bold text-primary-600">
              {TELUGU_LABELS.app.shortName}
            </Link>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === item.href
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                {TELUGU_LABELS.nav.logout}
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {TELUGU_LABELS.nav.login}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    {TELUGU_LABELS.nav.signup}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
