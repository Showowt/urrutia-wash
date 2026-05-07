/**
 * AGENT 9: Webhooks & Inbound Messages — Deep Feature Tests
 * Tests Telegram, Square, and Twilio webhook handlers for resilience.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_URL || 'https://washduringworkout.com';

describe('Twilio Inbound SMS Webhook', () => {
  it('responds to STATUS keyword', async () => {
    const res = await fetch(`${BASE}/api/webhooks/twilio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'Body=STATUS&From=%2B17025551234',
    });
    expect([200, 400, 403]).toContain(res.status);
    if (res.status === 200) {
      const text = await res.text();
      // Should return TwiML
      expect(text).toMatch(/<Response>|<Message>|xml/i);
    }
  });

  it('responds to STOP keyword', async () => {
    const res = await fetch(`${BASE}/api/webhooks/twilio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'Body=STOP&From=%2B17025551234',
    });
    expect([200, 400, 403]).toContain(res.status);
  });

  it('responds to CHANGE keyword', async () => {
    const res = await fetch(`${BASE}/api/webhooks/twilio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'Body=CHANGE&From=%2B17025551234',
    });
    expect([200, 400, 403]).toContain(res.status);
  });

  it('responds to START keyword', async () => {
    const res = await fetch(`${BASE}/api/webhooks/twilio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'Body=START&From=%2B17025551234',
    });
    expect([200, 400, 403]).toContain(res.status);
  });

  it('handles unrecognized message', async () => {
    const res = await fetch(`${BASE}/api/webhooks/twilio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'Body=Hello+I+need+help&From=%2B17025551234',
    });
    expect([200, 400, 403]).toContain(res.status);
  });

  it('handles empty body', async () => {
    const res = await fetch(`${BASE}/api/webhooks/twilio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: '',
    });
    expect([200, 400, 403, 500]).toContain(res.status);
  });

  it('handles missing From field', async () => {
    const res = await fetch(`${BASE}/api/webhooks/twilio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'Body=STATUS',
    });
    expect([200, 400, 403, 500]).toContain(res.status);
  });
});

describe('Telegram Webhook — Edge Cases', () => {
  it('handles edited_message (not message)', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        edited_message: { chat: { id: 0 }, text: 'edited', message_id: 1 },
      }),
    });
    expect(res.status).toBe(200);
  });

  it('handles callback_query (not message)', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: { id: '123', data: 'test' },
      }),
    });
    expect(res.status).toBe(200);
  });

  it('handles channel_post (not message)', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel_post: { chat: { id: 0, type: 'channel' }, text: 'broadcast' },
      }),
    });
    expect(res.status).toBe(200);
  });

  it('handles completely empty JSON', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    expect(res.status).toBe(200);
  });

  it('handles invalid JSON gracefully', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json at all',
    });
    // Should not 500 — should handle parse error
    expect([200, 400]).toContain(res.status);
  });

  it('handles document upload (not photo)', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 0 },
          document: { file_id: 'test', file_name: 'test.pdf' },
          message_id: 1,
        },
      }),
    });
    expect(res.status).toBe(200);
  });

  it('handles sticker (not photo)', async () => {
    const res = await fetch(`${BASE}/api/webhooks/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 0 },
          sticker: { file_id: 'test', width: 512, height: 512 },
          message_id: 1,
        },
      }),
    });
    expect(res.status).toBe(200);
  });
});

describe('Square Webhook — Edge Cases', () => {
  it('handles unknown event type', async () => {
    const res = await fetch(`${BASE}/api/webhooks/square`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'unknown.event', data: {} }),
    });
    expect([200, 401]).toContain(res.status);
  });

  it('handles empty body', async () => {
    const res = await fetch(`${BASE}/api/webhooks/square`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    expect([200, 400, 401]).toContain(res.status);
  });
});
