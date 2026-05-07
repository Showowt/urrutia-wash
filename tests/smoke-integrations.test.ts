/**
 * AGENT 3: Integration & Data Integrity Tests
 * Tests Supabase connectivity, storage, data integrity, and cross-system flows.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

describe('Gallery Data Integrity', () => {
  it('gallery photos have required fields', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    expect(res.status).toBe(200);
    for (const photo of json.data || []) {
      expect(photo).toHaveProperty('image_url');
      expect(photo).toHaveProperty('label');
      expect(photo).toHaveProperty('make');
      expect(photo).toHaveProperty('model');
      expect(photo.image_url).toMatch(/^https?:\/\//);
    }
  });

  it('gallery image URLs are accessible', async () => {
    const res = await fetch(`${BASE}/api/gallery?limit=3`);
    const json = await res.json();
    for (const photo of (json.data || []).slice(0, 3)) {
      const imgRes = await fetch(photo.image_url, { method: 'HEAD' });
      expect(imgRes.status).toBe(200);
    }
  });
});

describe('Reviews Data Integrity', () => {
  it('reviews have valid star ratings (1-5)', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (const review of json.data || []) {
      expect(review.stars).toBeGreaterThanOrEqual(1);
      expect(review.stars).toBeLessThanOrEqual(5);
    }
  });

  it('reviews have non-empty names', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (const review of json.data || []) {
      expect(review.name.length).toBeGreaterThan(0);
    }
  });

  it('reviews have non-empty text', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (const review of json.data || []) {
      expect(review.text.length).toBeGreaterThan(0);
    }
  });
});

describe('Cross-Page Content Consistency', () => {
  it('homepage loads gallery section', async () => {
    const res = await fetch(`${BASE}/`);
    const html = await res.text();
    expect(html).toMatch(/gallery|Gallery/i);
  });

  it('homepage loads reviews section', async () => {
    const res = await fetch(`${BASE}/`);
    const html = await res.text();
    expect(html).toMatch(/review|Review|Google/i);
  });

  it('services page has pricing info', async () => {
    const res = await fetch(`${BASE}/services`);
    const html = await res.text();
    expect(html).toMatch(/\$/);
  });

  it('contact page has address', async () => {
    const res = await fetch(`${BASE}/contact`);
    const html = await res.text();
    expect(html).toMatch(/1195|Wellness|Henderson/i);
  });

  it('about page has LVAC Henderson reference', async () => {
    const res = await fetch(`${BASE}/about`);
    const html = await res.text();
    expect(html).toMatch(/LVAC|Henderson|1195/i);
  });

  it('memberships page has pricing tiers', async () => {
    const res = await fetch(`${BASE}/memberships`);
    const html = await res.text();
    expect(html).toMatch(/\$/);
  });
});

describe('Telegram Webhook Resilience', () => {
  it('handles missing message gracefully', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ update_id: 999 }),
    });
    expect(res.status).toBe(200);
  });

  it('handles text-only message (no photo)', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: { chat: { id: 0 }, text: 'hello', message_id: 1 },
      }),
    });
    expect(res.status).toBe(200);
  });

  it('ignores messages from wrong chat ID', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 999999 },
          photo: [{ file_id: 'fake', width: 100, height: 100 }],
          message_id: 1,
        },
      }),
    });
    expect(res.status).toBe(200);
  });
});

describe('Payment Flow Guards', () => {
  it('checkout rejects missing service type', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+15555555555' }),
    });
    expect([400, 422, 500]).toContain(res.status);
  });

  it('checkout rejects malformed phone', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: 'express', phone: 'not-a-phone' }),
    });
    expect([400, 422, 500]).toContain(res.status);
  });
});

describe('Promo System', () => {
  it('validate endpoint handles nonexistent code', async () => {
    const res = await fetch(`${BASE}/api/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'NONEXISTENT99' }),
    });
    expect([400, 404]).toContain(res.status);
  });

  it('generate endpoint requires valid phone', async () => {
    const res = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect([400, 401, 403]).toContain(res.status);
  });
});

describe('Performance Baseline', () => {
  it('homepage loads in under 3 seconds', async () => {
    const start = Date.now();
    await fetch(`${BASE}/`);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  it('gallery API responds in under 2 seconds', async () => {
    const start = Date.now();
    await fetch(`${BASE}/api/gallery`);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });

  it('reviews API responds in under 2 seconds', async () => {
    const start = Date.now();
    await fetch(`${BASE}/api/reviews`);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });
});
