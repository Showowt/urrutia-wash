// Standalone layout for the login page.
// Intentionally does NOT inherit the marketing SiteNav/SiteFooter
// so the login experience is focused and uncluttered.

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Login — URRUTIA Car Wash',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-void flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-water focus:text-void focus:rounded-lg focus:font-bold"
      >
        Skip to login form
      </a>
      <main id="login-form" className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
