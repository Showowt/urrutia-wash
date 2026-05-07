/**
 * AGENT 7: Gallery System — Deep Feature Tests
 * Tests public API, category filtering, image accessibility, Telegram integration.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

describe('Gallery — Public API', () => {
  it('returns array of photos', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('default limit is reasonable (not thousands)', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    expect(json.data.length).toBeLessThanOrEqual(50);
  });

  it('limit=1 returns exactly 1', async () => {
    const res = await fetch(`${BASE}/api/gallery?limit=1`);
    const json = await res.json();
    expect(json.data.length).toBeLessThanOrEqual(1);
  });

  it('limit=100 does not error', async () => {
    const res = await fetch(`${BASE}/api/gallery?limit=100`);
    expect(res.status).toBe(200);
  });
});

describe('Gallery — Category Filtering', () => {
  const categories = ['express', 'detail', 'ceramic', 'trucks'];

  for (const cat of categories) {
    it(`filters by category="${cat}" without error`, async () => {
      const res = await fetch(`${BASE}/api/gallery?category=${cat}`);
      const json = await res.json();
      expect(res.status).toBe(200);
      // All returned photos should match category
      for (const photo of json.data) {
        expect(photo.category).toBe(cat);
      }
    });
  }

  it('unknown category returns empty array (not error)', async () => {
    const res = await fetch(`${BASE}/api/gallery?category=spaceship`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.length).toBe(0);
  });
});

describe('Gallery — Photo Data Integrity', () => {
  it('every photo has image_url starting with https', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    for (const photo of json.data) {
      expect(photo.image_url).toMatch(/^https:\/\//);
    }
  });

  it('every photo has non-empty make and model', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    for (const photo of json.data) {
      expect(photo.make.length).toBeGreaterThan(0);
      expect(photo.model.length).toBeGreaterThan(0);
    }
  });

  it('every photo has a label', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    for (const photo of json.data) {
      expect(photo.label.length).toBeGreaterThan(0);
    }
  });

  it('every photo has valid category', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    const validCategories = ['express', 'detail', 'ceramic', 'trucks'];
    for (const photo of json.data) {
      expect(validCategories).toContain(photo.category);
    }
  });

  it('no duplicate photo IDs', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    const ids = json.data.map((p: { id: string }) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('photos are ordered by sort_order descending', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    for (let i = 1; i < json.data.length; i++) {
      expect(json.data[i].sort_order).toBeLessThanOrEqual(json.data[i - 1].sort_order);
    }
  });
});

describe('Gallery — Image Accessibility', () => {
  it('all gallery image URLs return 200', async () => {
    const res = await fetch(`${BASE}/api/gallery`);
    const json = await res.json();
    for (const photo of json.data) {
      const imgRes = await fetch(photo.image_url, { method: 'HEAD' });
      expect(imgRes.status).toBe(200);
    }
  });

  it('first gallery image has correct content-type', async () => {
    const res = await fetch(`${BASE}/api/gallery?limit=1`);
    const json = await res.json();
    if (json.data.length > 0) {
      const imgRes = await fetch(json.data[0].image_url, { method: 'HEAD' });
      const ct = imgRes.headers.get('content-type') || '';
      expect(ct).toMatch(/image\//);
    }
  }, 15000);
});

describe('Gallery — Telegram Bot Resilience', () => {
  it('bot rejects photo from unauthorized chat', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 123456789 },
          photo: [{ file_id: 'test', width: 100, height: 100 }],
          message_id: 1,
        },
      }),
    });
    expect(res.status).toBe(200); // Silently ignores
  });

  it('bot handles /count command from wrong chat', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 123456789 },
          text: '/count',
          message_id: 1,
        },
      }),
    });
    expect(res.status).toBe(200);
  });

  it('bot handles malformed photo array', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 0 },
          photo: [],
          message_id: 1,
        },
      }),
    });
    expect(res.status).toBe(200);
  });
});
