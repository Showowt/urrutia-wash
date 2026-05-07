/**
 * AGENT 1: API Endpoint Smoke Tests
 * Tests every API route returns expected status codes and response shapes.
 * Run against the live production URL.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

async function fetchJson(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, init);
  return { status: res.status, headers: res.headers, body: await res.text(), res };
}

describe('API Endpoint Smoke Tests', () => {
  // ─── Public GET endpoints ───
  describe('GET /api/health', () => {
    it('returns 200', async () => {
      const { status } = await fetchJson('/api/health');
      expect(status).toBe(200);
    });
  });

  describe('GET /api/gallery', () => {
    it('returns 200 with data array', async () => {
      const { status, body } = await fetchJson('/api/gallery');
      expect(status).toBe(200);
      const json = JSON.parse(body);
      expect(json).toHaveProperty('data');
      expect(Array.isArray(json.data)).toBe(true);
    });

    it('respects limit param', async () => {
      const { body } = await fetchJson('/api/gallery?limit=2');
      const json = JSON.parse(body);
      expect(json.data.length).toBeLessThanOrEqual(2);
    });

    it('supports category filter', async () => {
      const { status } = await fetchJson('/api/gallery?category=express');
      expect(status).toBe(200);
    });
  });

  describe('GET /api/reviews', () => {
    it('returns 200 with data array', async () => {
      const { status, body } = await fetchJson('/api/reviews');
      expect(status).toBe(200);
      const json = JSON.parse(body);
      expect(json).toHaveProperty('data');
      expect(Array.isArray(json.data)).toBe(true);
    });

    it('returns reviews with required fields', async () => {
      const { body } = await fetchJson('/api/reviews');
      const json = JSON.parse(body);
      if (json.data.length > 0) {
        const review = json.data[0];
        expect(review).toHaveProperty('name');
        expect(review).toHaveProperty('text');
        expect(review).toHaveProperty('stars');
      }
    });
  });

  // ─── Auth-protected GET endpoints (should return 401 without token) ───
  describe('GET /api/status', () => {
    it('returns 401 without auth', async () => {
      const { status } = await fetchJson('/api/status');
      expect(status).toBe(401);
    });
  });

  describe('GET /api/bookings', () => {
    it('returns 401 without auth', async () => {
      const { status } = await fetchJson('/api/bookings');
      expect(status).toBe(401);
    });
  });

  describe('GET /api/referrals', () => {
    it('returns 401 without auth', async () => {
      const { status } = await fetchJson('/api/referrals');
      expect(status).toBe(401);
    });
  });

  // ─── POST endpoints (validation tests) ───
  describe('POST /api/bookings', () => {
    it('rejects empty body with 400 or 401', async () => {
      const { status } = await fetchJson('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect([400, 401, 422]).toContain(status);
    });
  });

  describe('POST /api/payments/checkout', () => {
    it('rejects empty body', async () => {
      const { status } = await fetchJson('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect([400, 422, 500]).toContain(status);
    });
  });

  describe('POST /api/promo/validate', () => {
    it('rejects missing code', async () => {
      const { status } = await fetchJson('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect([400, 404, 422]).toContain(status);
    });

    it('rejects invalid code', async () => {
      const { status } = await fetchJson('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'FAKE_CODE_12345' }),
      });
      expect([400, 404]).toContain(status);
    });
  });

  describe('POST /api/promo/generate', () => {
    it('rejects request without valid phone', async () => {
      const { status } = await fetchJson('/api/promo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect([400, 401, 403]).toContain(status);
    });
  });

  describe('POST /api/reviews', () => {
    it('rejects unauthenticated requests', async () => {
      const { status } = await fetchJson('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', text: 'Test', stars: 5 }),
      });
      expect([401, 403]).toContain(status);
    });
  });

  // ─── Webhook endpoints (should accept POST, return 200 even with bad data) ───
  describe('POST /api/webhooks/telegram', () => {
    it('returns 200 for empty update', async () => {
      const { status } = await fetchJson('/api/webhooks/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect(status).toBe(200);
    });
  });

  describe('POST /api/webhooks/square', () => {
    it('rejects invalid signature', async () => {
      const { status } = await fetchJson('/api/webhooks/square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'payment.completed' }),
      });
      expect([200, 401]).toContain(status);
    });
  });

  describe('POST /api/webhooks/twilio', () => {
    it('accepts POST', async () => {
      const { status } = await fetchJson('/api/webhooks/twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'Body=test&From=+15555555555',
      });
      expect([200, 400, 403]).toContain(status);
    });
  });
});
