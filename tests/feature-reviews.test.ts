/**
 * AGENT 6: Reviews System — Deep Feature Tests
 * Tests public read, admin CRUD, auth guards, data integrity.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

describe('Reviews — Public Access', () => {
  it('returns featured reviews without auth', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    // All returned reviews should be featured
    for (const review of json.data) {
      expect(review.featured).toBe(true);
    }
  });

  it('reviews are ordered by sort_order', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (let i = 1; i < json.data.length; i++) {
      expect(json.data[i].sort_order).toBeGreaterThanOrEqual(json.data[i - 1].sort_order);
    }
  });

  it('each review has all required fields', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (const review of json.data) {
      expect(review).toHaveProperty('id');
      expect(review).toHaveProperty('name');
      expect(review).toHaveProperty('text');
      expect(review).toHaveProperty('stars');
      expect(review).toHaveProperty('source');
      expect(review).toHaveProperty('featured');
      expect(review).toHaveProperty('sort_order');
    }
  });

  it('all reviews are from Google source', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (const review of json.data) {
      expect(review.source).toBe('google');
    }
  });

  it('returns at least 5 reviews', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    expect(json.data.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Reviews — Admin Auth Guards', () => {
  it('POST rejects without auth', async () => {
    const res = await fetch(`${BASE}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', text: 'Test review', stars: 5 }),
    });
    expect([401, 403]).toContain(res.status);
  });

  it('PUT rejects without auth', async () => {
    const res = await fetch(`${BASE}/api/reviews`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: '00000000-0000-0000-0000-000000000000', stars: 4 }),
    });
    expect([401, 403]).toContain(res.status);
  });

  it('DELETE rejects without auth', async () => {
    const res = await fetch(`${BASE}/api/reviews`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: '00000000-0000-0000-0000-000000000000' }),
    });
    expect([401, 403]).toContain(res.status);
  });

  it('POST rejects with invalid Bearer token', async () => {
    const res = await fetch(`${BASE}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token-123',
      },
      body: JSON.stringify({ name: 'Test', text: 'Test review', stars: 5 }),
    });
    expect([401, 403]).toContain(res.status);
  });
});

describe('Reviews — Data Integrity', () => {
  it('all star ratings are between 1 and 5', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (const review of json.data) {
      expect(review.stars).toBeGreaterThanOrEqual(1);
      expect(review.stars).toBeLessThanOrEqual(5);
    }
  });

  it('no review has empty text', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    for (const review of json.data) {
      expect(review.text.trim().length).toBeGreaterThan(0);
    }
  });

  it('no duplicate review IDs', async () => {
    const res = await fetch(`${BASE}/api/reviews`);
    const json = await res.json();
    const ids = json.data.map((r: { id: string }) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
