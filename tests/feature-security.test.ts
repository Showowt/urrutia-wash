/**
 * AGENT 10: Security & Hardening Tests
 * Tests XSS, injection, auth bypass, header security, content types.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

describe('XSS Prevention', () => {
  it('booking API rejects unauthenticated XSS attempt', async () => {
    const res = await fetch(`${BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '<img src=x onerror=alert(1)>',
        phone: '7025551234',
        service_type: 'express',
        location: 'lvac',
      }),
    });
    // Auth blocks before validation — either 400 (rejected) or 401 (auth first)
    expect([400, 401]).toContain(res.status);
  });

  it('promo generate rejects XSS in phone', async () => {
    const res = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '<script>alert(1)</script>' }),
    });
    expect(res.status).toBe(400);
  });
});

describe('SQL Injection Prevention', () => {
  it('promo validate handles SQL injection in code gracefully', async () => {
    const res = await fetch(`${BASE}/api/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: "'; DROP TABLE promo_codes; --" }),
    });
    // Supabase parameterized queries prevent actual injection
    // May return 404 (not found) or 500 (query error) — both safe
    expect([400, 404, 500]).toContain(res.status);
    // Verify the response is JSON (not a raw error page)
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('gallery category whitelist blocks injection', async () => {
    const res = await fetch(`${BASE}/api/gallery?category='; DROP TABLE gallery_photos; --`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual([]);
  });

  it('gallery handles special characters in category', async () => {
    const res = await fetch(`${BASE}/api/gallery?category=<script>`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual([]);
  });

  it('promo generate handles injection in phone', async () => {
    const res = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: "'; DELETE FROM users; --" }),
    });
    expect(res.status).toBe(400);
  });
});

describe('Auth Bypass Prevention', () => {
  it('status API rejects empty Authorization header', async () => {
    const res = await fetch(`${BASE}/api/status`, {
      headers: { Authorization: '' },
    });
    expect(res.status).toBe(401);
  });

  it('status API rejects "Bearer " with no token', async () => {
    const res = await fetch(`${BASE}/api/status`, {
      headers: { Authorization: 'Bearer ' },
    });
    expect(res.status).toBe(401);
  });

  it('reviews POST rejects "Bearer null"', async () => {
    const res = await fetch(`${BASE}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer null',
      },
      body: JSON.stringify({ name: 'Hack', text: 'test', stars: 5 }),
    });
    expect([401, 403]).toContain(res.status);
  });

  it('reviews POST rejects "Bearer undefined"', async () => {
    const res = await fetch(`${BASE}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer undefined',
      },
      body: JSON.stringify({ name: 'Hack', text: 'test', stars: 5 }),
    });
    expect([401, 403]).toContain(res.status);
  });

  it('bookings rejects forged session cookie', async () => {
    const res = await fetch(`${BASE}/api/bookings`, {
      headers: {
        Cookie: 'sb-access-token=fake.jwt.token',
      },
    });
    expect(res.status).toBe(401);
  });
});

describe('Security Headers', () => {
  it('X-Frame-Options: DENY on all pages', async () => {
    const pages = ['/', '/services', '/gallery', '/contact', '/about'];
    for (const page of pages) {
      const res = await fetch(`${BASE}${page}`);
      expect(res.headers.get('x-frame-options')).toBe('DENY');
    }
  });

  it('X-Content-Type-Options: nosniff', async () => {
    const res = await fetch(`${BASE}/`);
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('HSTS with long max-age', async () => {
    const res = await fetch(`${BASE}/`);
    const hsts = res.headers.get('strict-transport-security') || '';
    expect(hsts).toContain('max-age=');
    const maxAge = parseInt(hsts.match(/max-age=(\d+)/)?.[1] || '0');
    expect(maxAge).toBeGreaterThanOrEqual(31536000);
  });

  it('no X-Powered-By header', async () => {
    const res = await fetch(`${BASE}/`);
    expect(res.headers.get('x-powered-by')).toBeNull();
  });

  it('Referrer-Policy is set', async () => {
    const res = await fetch(`${BASE}/`);
    expect(res.headers.get('referrer-policy')).toBeTruthy();
  });

  it('Permissions-Policy restricts camera/mic', async () => {
    const res = await fetch(`${BASE}/`);
    const pp = res.headers.get('permissions-policy');
    expect(pp).toBeTruthy();
    expect(pp).toContain('camera=()');
  });
});

describe('Content Security', () => {
  it('API endpoints return JSON content-type', async () => {
    const endpoints = ['/api/health', '/api/gallery', '/api/reviews'];
    for (const ep of endpoints) {
      const res = await fetch(`${BASE}${ep}`);
      const ct = res.headers.get('content-type') || '';
      expect(ct).toContain('application/json');
    }
  });

  it('pages return HTML content-type', async () => {
    const res = await fetch(`${BASE}/`);
    const ct = res.headers.get('content-type') || '';
    expect(ct).toContain('text/html');
  });
});

describe('Method Restrictions', () => {
  it('DELETE on gallery API is not allowed', async () => {
    const res = await fetch(`${BASE}/api/gallery`, { method: 'DELETE' });
    expect([404, 405]).toContain(res.status);
  });

  it('PUT on gallery API is not allowed', async () => {
    const res = await fetch(`${BASE}/api/gallery`, { method: 'PUT' });
    expect([404, 405]).toContain(res.status);
  });
});
