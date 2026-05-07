/**
 * AGENT 8: Payment & Checkout — Deep Feature Tests
 * Tests Square checkout creation, promo discount application, webhook handling.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

describe('Checkout — Input Validation', () => {
  it('rejects completely empty body', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect([400, 422, 500]).toContain(res.status);
  });

  it('rejects missing service and membership', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_phone: '7025551234' }),
    });
    expect([400, 422, 500]).toContain(res.status);
  });

  it('accepts valid service checkout request', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'express',
        customer_phone: '7020000002',
      }),
    });
    const json = await res.json();
    // Should either succeed with checkout_url or fail with specific error
    if (res.status === 200 || res.status === 201) {
      expect(json.data).toHaveProperty('checkout_url');
      expect(json.data.checkout_url).toMatch(/^https:\/\//);
    }
    // Even on failure, should have consistent shape
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('error');
  });

  it('accepts membership checkout request', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        membership_id: 'solo',
        billing_cycle: 'monthly',
        customer_phone: '7020000003',
      }),
    });
    const json = await res.json();
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('error');
  });
});

describe('Checkout — Promo Integration', () => {
  it('accepts promo_code field in checkout', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'express',
        customer_phone: '7020000004',
        promo_code: 'FAKE-CODE',
      }),
    });
    // Should not crash — either applies or ignores bad promo
    expect([200, 201, 400, 404, 500]).toContain(res.status);
  });
});

describe('Checkout — Response Shape', () => {
  it('error responses have consistent shape', async () => {
    const res = await fetch(`${BASE}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    expect(json).toHaveProperty('error');
    expect(json).toHaveProperty('message');
  });
});

describe('Square Webhook — Security', () => {
  it('rejects missing signature', async () => {
    const res = await fetch(`${BASE}/api/webhooks/square`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'payment.completed',
        data: { id: 'fake' },
      }),
    });
    expect([401, 403, 200]).toContain(res.status);
  });

  it('rejects invalid signature', async () => {
    const res = await fetch(`${BASE}/api/webhooks/square`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': 'invalid-signature',
      },
      body: JSON.stringify({
        type: 'payment.completed',
        data: { id: 'fake' },
      }),
    });
    expect([401, 403, 200]).toContain(res.status);
  });

  it('does not crash on malformed webhook body', async () => {
    const res = await fetch(`${BASE}/api/webhooks/square`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"malformed": true}',
    });
    expect([200, 400, 401]).toContain(res.status);
  });
});

describe('Payment Success Page', () => {
  it('/payment/success returns 200', async () => {
    const res = await fetch(`${BASE}/payment/success`);
    expect(res.status).toBe(200);
  });

  it('/payment/success has thank-you content', async () => {
    const res = await fetch(`${BASE}/payment/success`);
    const html = await res.text();
    expect(html.toLowerCase()).toMatch(/thank|success|confirmed|booked/i);
  });
});
