import SiteNav from '@/components/sections/SiteNav';
import Link from 'next/link';

const FOOTER_NAV = {
  explore: [
    { href: '/services', label: 'Services' },
    { href: '/memberships', label: 'Memberships' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/refund-policy', label: 'Refund Policy' },
    { href: '/sms-consent', label: 'SMS Consent' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
};

function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-water-deep to-water glow-water grid place-items-center">
              <span className="text-[10px] font-black tracking-tighter text-white">URR</span>
            </div>
            <span className="wordmark text-lg">URRUTIA</span>
          </Link>
          <p className="text-sm text-muted leading-relaxed">
            Premium hand wash and detail at LVAC Henderson. Mobile service available valley-wide.
          </p>
          <p className="text-xs text-muted mt-4">
            Fully insured &amp; bonded · Henderson, NV
          </p>
        </div>

        {/* Explore */}
        <div>
          <p className="font-mono text-[10px] text-muted tracking-widest mb-4">EXPLORE</p>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_NAV.explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted hover:text-ink transition-colors duration-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Location */}
        <div>
          <p className="font-mono text-[10px] text-muted tracking-widest mb-4">LOCATION</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>1195 Wellness Pl</li>
            <li>Henderson, NV 89074</li>
            <li className="mt-3">Mon–Sat · 7:00–4:30</li>
            <li className="text-muted/60 text-xs">Sunday · Closed</li>
          </ul>
          <a
            href="https://instagram.com/lvacwashndetail"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-sm text-muted hover:text-ink transition-colors duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.85 5.85 0 0 0 1.38 2.13 5.85 5.85 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
            </svg>
            @lvacwashndetail
          </a>
        </div>

        {/* Legal */}
        <div>
          <p className="font-mono text-[10px] text-muted tracking-widest mb-4">LEGAL</p>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_NAV.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted hover:text-ink transition-colors duration-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted font-mono">
          <p>© 2026 URRUTIA Carwash and Detailing. All rights reserved.</p>
          <p>Crafted by <span className="text-water">MachineMind</span></p>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-water focus:text-void focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>
      <SiteNav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
