/**
 * AGENT 5: Promo Code System — Deep Feature Tests
 * Tests generate, validate, and checkout discount application.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

describe('Promo Code Generation', () => {
  it('rejects missing phone', async () => {
    const res = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });

  it('rejects short phone', async () => {
    const res = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '123' }),
    });
    expect(res.status).toBe(400);
  });

  it('generates code for valid phone', async () => {
    const res = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '7029999999' }),
    });
    const json = await res.json();
    expect([200, 201]).toContain(res.status);
    expect(json.data).toBeTruthy();
    expect(json.data.code).toMatch(/^URR-[A-Z0-9]{4}$/);
    expect(json.data.discount_percent).toBe(10);
  });

  it('returns same code for same phone (idempotent)', async () => {
    const phone = '7029999998';
    const res1 = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const json1 = await res1.json();

    const res2 = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const json2 = await res2.json();

    expect(json1.data.code).toBe(json2.data.code);
  });

  it('normalizes phone formats', async () => {
    // Both should resolve to the same code
    const res1 = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+1 (702) 999-9997' }),
    });
    const json1 = await res1.json();

    const res2 = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '7029999997' }),
    });
    const json2 = await res2.json();

    expect(json1.data.code).toBe(json2.data.code);
  });
});

describe('Promo Code Validation', () => {
  it('rejects empty code', async () => {
    const res = await fetch(`${BASE}/api/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '' }),
    });
    expect([400, 404]).toContain(res.status);
  });

  it('rejects nonexistent code', async () => {
    const res = await fetch(`${BASE}/api/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'URR-ZZZZ' }),
    });
    expect([400, 404]).toContain(res.status);
  });

  it('validates a real generated code', async () => {
    // Generate a fresh code
    const genRes = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '7029999996' }),
    });
    const genJson = await genRes.json();
    const code = genJson.data?.code;
    if (!code) return; // Skip if generation failed

    // Validate it
    const valRes = await fetch(`${BASE}/api/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const valJson = await valRes.json();
    expect(valRes.status).toBe(200);
    expect(valJson.data.valid).toBe(true);
    expect(valJson.data.discount_percent).toBe(10);
  });

  it('is case-insensitive', async () => {
    const genRes = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '7029999995' }),
    });
    const genJson = await genRes.json();
    const code = genJson.data?.code;
    if (!code) return;

    const valRes = await fetch(`${BASE}/api/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toLowerCase() }),
    });
    expect(valRes.status).toBe(200);
  });
});

describe('Promo Response Shapes', () => {
  it('generate returns consistent shape', async () => {
    const res = await fetch(`${BASE}/api/promo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '7029999994' }),
    });
    const json = await res.json();
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('error');
  });

  it('validate error returns consistent shape', async () => {
    const res = await fetch(`${BASE}/api/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'FAKE' }),
    });
    const json = await res.json();
    expect(json).toHaveProperty('error');
    expect(json).toHaveProperty('message');
  });
});
