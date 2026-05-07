/**
 * AGENT 2: Page Availability & SEO Tests
 * Hits every public page, checks status, title tags, meta, headers.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

async function fetchPage(path: string) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
  const html = await res.text();
  return { status: res.status, html, headers: res.headers };
}

// ─── Marketing Pages (public, SEO-critical) ───
const MARKETING_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services' },
  { path: '/gallery', name: 'Gallery' },
  { path: '/memberships', name: 'Memberships' },
  { path: '/contact', name: 'Contact' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/terms', name: 'Terms of Service' },
  { path: '/refund-policy', name: 'Refund Policy' },
  { path: '/sms-consent', name: 'SMS Consent' },
  { path: '/accessibility', name: 'Accessibility' },
  { path: '/login', name: 'Login' },
];

// ─── App Pages (may redirect to login) ───
const APP_PAGES = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/book', name: 'Book' },
  { path: '/member', name: 'Member' },
  { path: '/refer', name: 'Refer' },
  { path: '/track', name: 'Track' },
];

// ─── Ops Pages ───
const OPS_PAGES = [
  { path: '/queue', name: 'Queue' },
  { path: '/lookup', name: 'Lookup' },
  { path: '/schedule', name: 'Schedule' },
  { path: '/shift', name: 'Shift' },
  { path: '/walkin', name: 'Walk-in' },
  { path: '/reviews', name: 'Reviews Admin' },
];

// ─── Admin Pages ───
const ADMIN_PAGES = [
  { path: '/admin/dashboard', name: 'Admin Dashboard' },
  { path: '/admin/members', name: 'Admin Members' },
  { path: '/admin/referrals', name: 'Admin Referrals' },
  { path: '/admin/revenue', name: 'Admin Revenue' },
  { path: '/admin/settings', name: 'Admin Settings' },
  { path: '/admin/sms', name: 'Admin SMS' },
];

describe('Marketing Pages — Status & Content', () => {
  for (const page of MARKETING_PAGES) {
    describe(page.name, () => {
      it(`${page.path} returns 200`, async () => {
        const { status } = await fetchPage(page.path);
        expect(status).toBe(200);
      });

      it(`${page.path} has <title> tag`, async () => {
        const { html } = await fetchPage(page.path);
        expect(html).toMatch(/<title[^>]*>.+<\/title>/i);
      });

      it(`${page.path} has no empty body`, async () => {
        const { html } = await fetchPage(page.path);
        expect(html.length).toBeGreaterThan(500);
      });
    });
  }
});

describe('Marketing Pages — SEO & Meta', () => {
  it('Homepage has meta description', async () => {
    const { html } = await fetchPage('/');
    expect(html).toMatch(/meta\s+name=["']description["']/i);
  });

  it('Homepage has Open Graph tags', async () => {
    const { html } = await fetchPage('/');
    expect(html).toMatch(/property=["']og:title["']/i);
    expect(html).toMatch(/property=["']og:description["']/i);
  });

  it('Homepage has canonical or structured data', async () => {
    const { html } = await fetchPage('/');
    // Check for JSON-LD structured data
    const hasJsonLd = html.includes('application/ld+json');
    const hasCanonical = html.includes('rel="canonical"');
    expect(hasJsonLd || hasCanonical).toBe(true);
  });
});

describe('Security Headers', () => {
  it('has X-Frame-Options', async () => {
    const { headers } = await fetchPage('/');
    expect(headers.get('x-frame-options')).toBe('DENY');
  });

  it('has X-Content-Type-Options', async () => {
    const { headers } = await fetchPage('/');
    expect(headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('has Strict-Transport-Security', async () => {
    const { headers } = await fetchPage('/');
    const hsts = headers.get('strict-transport-security');
    expect(hsts).toBeTruthy();
    expect(hsts).toContain('max-age=');
  });

  it('has Referrer-Policy', async () => {
    const { headers } = await fetchPage('/');
    expect(headers.get('referrer-policy')).toBeTruthy();
  });

  it('does not expose X-Powered-By', async () => {
    const { headers } = await fetchPage('/');
    expect(headers.get('x-powered-by')).toBeNull();
  });
});

describe('App Pages — Respond (200 or redirect)', () => {
  for (const page of APP_PAGES) {
    it(`${page.path} returns 200 or redirect`, async () => {
      const res = await fetch(`${BASE}${page.path}`, { redirect: 'manual' });
      expect([200, 301, 302, 303, 307, 308]).toContain(res.status);
    });
  }
});

describe('Ops Pages — Respond', () => {
  for (const page of OPS_PAGES) {
    it(`${page.path} returns 200 or redirect`, async () => {
      const res = await fetch(`${BASE}${page.path}`, { redirect: 'manual' });
      expect([200, 301, 302, 303, 307, 308]).toContain(res.status);
    });
  }
});

describe('Admin Pages — Respond', () => {
  for (const page of ADMIN_PAGES) {
    it(`${page.path} returns 200 or redirect`, async () => {
      const res = await fetch(`${BASE}${page.path}`, { redirect: 'manual' });
      expect([200, 301, 302, 303, 307, 308]).toContain(res.status);
    });
  }
});

describe('Static Assets & SEO Files', () => {
  it('robots.txt exists', async () => {
    const { status } = await fetchPage('/robots.txt');
    expect(status).toBe(200);
  });

  it('sitemap.xml exists', async () => {
    const { status } = await fetchPage('/sitemap.xml');
    expect(status).toBe(200);
  });

  it('manifest.webmanifest exists', async () => {
    const { status } = await fetchPage('/manifest.webmanifest');
    expect(status).toBe(200);
  });

  it('404 page returns 404', async () => {
    const res = await fetch(`${BASE}/this-page-does-not-exist-abc123`);
    expect(res.status).toBe(404);
  });
});
