import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const CHAT_IDS = (process.env.TELEGRAM_CHAT_ID || '').trim().split(',').map(s => s.trim()).filter(Boolean);
const ANTHROPIC_API_KEY = (process.env.ANTHROPIC_API_KEY || '').trim();
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://washduringworkout.com').trim();

function isAuthorized(chatId: string): boolean {
  return CHAT_IDS.includes(chatId);
}

// Send a message to ALL authorized chat IDs (for notifications)
async function broadcastMessage(text: string) {
  for (const id of CHAT_IDS) {
    await sendTelegramMessage(id, text);
  }
}

async function sendTelegramMessage(chatId: string | number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

async function getFileUrl(fileId: string): Promise<string | null> {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
  const json = await res.json();
  if (!json.ok) return null;
  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${json.result.file_path}`;
}

async function analyzeCarPhoto(imageUrl: string): Promise<{
  make: string;
  model: string;
  color: string;
  year: string;
  label: string;
  category: string;
  description: string;
} | null> {
  if (!ANTHROPIC_API_KEY) return null;

  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      console.error('[telegram webhook] Image download failed:', imgRes.status);
      return null;
    }
    const imgBuffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(imgBuffer).toString('base64');
    const rawType = imgRes.headers.get('content-type') || 'image/jpeg';
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const mediaType = ALLOWED_TYPES.includes(rawType) ? rawType : 'image/jpeg';

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: base64 },
              },
              {
                type: 'text',
                text: `You are a car identification expert for a premium car wash gallery. Analyze this car photo and respond with ONLY valid JSON (no markdown, no backticks):
{"make":"Brand","model":"Model","color":"Color Name","year":"Year or empty string if unsure","label":"MAKE MODEL · COLOR (uppercase, for gallery label)","category":"express|detail|ceramic|trucks (pick best guess based on vehicle type — trucks/SUVs = trucks, luxury/exotic = ceramic, sports = detail, everything else = express)","description":"One sentence describing the vehicle and its condition/finish"}

If this is NOT a photo of a car/vehicle, respond with: {"error":"not a vehicle"}`,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[telegram webhook] Claude API error:', res.status, errBody);
      return null;
    }

    const data = await res.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) return null;

    try {
      const parsed = JSON.parse(text);
      if (parsed.error) return null;
      return parsed;
    } catch {
      console.error('[telegram webhook] Failed to parse Claude response:', text);
      return null;
    }
  } catch (err) {
    console.error('[telegram webhook] analyzeCarPhoto error:', err);
    return null;
  }
}

// ─── COMMAND HANDLERS ──────────────────────────────────────

async function handleHelp(chatId: string) {
  await sendTelegramMessage(chatId,
    `<b>URRUTIA Command Center</b>\n\n` +
    `<b>GALLERY</b>\n` +
    `Send a photo → AI adds to gallery\n` +
    `/gallery — This help\n` +
    `/count — Gallery photo count\n` +
    `/photos — List recent gallery photos\n` +
    `/delete [#] — Delete photo by number\n` +
    `/hide [#] — Hide photo from site\n` +
    `/show [#] — Show hidden photo\n\n` +
    `<b>REVIEWS</b>\n` +
    `/reviews — List all reviews\n` +
    `/addreview — Add a new review\n` +
    `/hidereview [#] — Hide review from site\n` +
    `/showreview [#] — Show hidden review\n\n` +
    `<b>BUSINESS</b>\n` +
    `/stats — Today's numbers\n` +
    `/queue — Active wash queue\n` +
    `/promos — Active promo codes\n` +
    `/members — Membership count\n\n` +
    `<b>SITE</b>\n` +
    `/health — Test all endpoints\n` +
    `/site — Site links`
  );
}

async function handleCount(chatId: string) {
  const supabase = createServiceClient();
  const { count: total } = await supabase.from('gallery_photos').select('*', { count: 'exact', head: true });
  const { count: featured } = await supabase.from('gallery_photos').select('*', { count: 'exact', head: true }).eq('featured', true);
  await sendTelegramMessage(chatId, `<b>Gallery:</b> ${featured ?? 0} visible / ${total ?? 0} total`);
}

async function handlePhotos(chatId: string) {
  const supabase = createServiceClient();
  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('sort_order, label, category, featured, created_at')
    .order('sort_order', { ascending: false })
    .limit(10);

  if (!photos || photos.length === 0) {
    await sendTelegramMessage(chatId, 'No photos in gallery yet.');
    return;
  }

  const lines = photos.map(p => {
    const vis = p.featured ? '' : ' [HIDDEN]';
    return `#${p.sort_order} — ${p.label} (${p.category})${vis}`;
  });

  await sendTelegramMessage(chatId,
    `<b>Recent Gallery Photos</b>\n\n${lines.join('\n')}\n\nUse /delete # or /hide # to manage.`
  );
}

async function handleDeletePhoto(chatId: string, args: string) {
  const num = parseInt(args.trim());
  if (!num) {
    await sendTelegramMessage(chatId, 'Usage: /delete 3\n(Use /photos to see numbers)');
    return;
  }

  const supabase = createServiceClient();
  const { data: photo } = await supabase
    .from('gallery_photos')
    .select('id, label, storage_path')
    .eq('sort_order', num)
    .maybeSingle();

  if (!photo) {
    await sendTelegramMessage(chatId, `Photo #${num} not found. Use /photos to see list.`);
    return;
  }

  // Delete from storage
  if (photo.storage_path) {
    await supabase.storage.from('gallery').remove([photo.storage_path]);
  }

  // Delete from DB
  await supabase.from('gallery_photos').delete().eq('id', photo.id);

  await sendTelegramMessage(chatId, `Deleted #${num} — ${photo.label}`);
}

async function handleTogglePhoto(chatId: string, args: string, show: boolean) {
  const num = parseInt(args.trim());
  if (!num) {
    await sendTelegramMessage(chatId, `Usage: /${show ? 'show' : 'hide'} 3`);
    return;
  }

  const supabase = createServiceClient();
  const { data: photo, error } = await supabase
    .from('gallery_photos')
    .update({ featured: show })
    .eq('sort_order', num)
    .select('label')
    .maybeSingle();

  if (error || !photo) {
    await sendTelegramMessage(chatId, `Photo #${num} not found.`);
    return;
  }

  await sendTelegramMessage(chatId,
    `${show ? 'Showing' : 'Hidden'}: #${num} — ${photo.label}\n${show ? 'Now visible on site.' : 'Removed from site (not deleted).'}`
  );
}

async function handleReviews(chatId: string) {
  const supabase = createServiceClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('sort_order, name, stars, featured, text')
    .order('sort_order', { ascending: true })
    .limit(15);

  if (!reviews || reviews.length === 0) {
    await sendTelegramMessage(chatId, 'No reviews yet.');
    return;
  }

  const lines = reviews.map(r => {
    const vis = r.featured ? '' : ' [HIDDEN]';
    const stars = '★'.repeat(r.stars);
    return `#${r.sort_order} ${stars} ${r.name}${vis}\n<i>${r.text.slice(0, 60)}${r.text.length > 60 ? '...' : ''}</i>`;
  });

  await sendTelegramMessage(chatId,
    `<b>Reviews</b>\n\n${lines.join('\n\n')}\n\nUse /hidereview # or /showreview # to manage.\nUse /addreview to add new.`
  );
}

async function handleAddReview(chatId: string, args: string) {
  // Format: /addreview Name | 5 | Review text | 1 week ago
  const parts = args.split('|').map(s => s.trim());
  if (parts.length < 3) {
    await sendTelegramMessage(chatId,
      `<b>Add Review</b>\n\nFormat:\n/addreview Name | Stars | Review text | Time ago\n\nExample:\n/addreview John Smith | 5 | Amazing detail work on my Tesla! | 2 weeks ago`
    );
    return;
  }

  const [name, starsStr, text, ago] = parts;
  const stars = parseInt(starsStr) || 5;

  const supabase = createServiceClient();

  // Get next sort order
  const { data: last } = await supabase
    .from('reviews')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.sort_order ?? 0) + 1;

  const { error } = await supabase.from('reviews').insert({
    name,
    stars: Math.min(5, Math.max(1, stars)),
    text,
    ago: ago || 'recently',
    source: 'google',
    featured: true,
    sort_order: nextOrder,
  });

  if (error) {
    await sendTelegramMessage(chatId, `Failed to add review: ${error.message}`);
    return;
  }

  await sendTelegramMessage(chatId,
    `<b>Review Added</b>\n\n${'★'.repeat(stars)} ${name}\n<i>${text}</i>\n\n#${nextOrder} — Live on site now.`
  );
}

async function handleToggleReview(chatId: string, args: string, show: boolean) {
  const num = parseInt(args.trim());
  if (!num) {
    await sendTelegramMessage(chatId, `Usage: /${show ? 'showreview' : 'hidereview'} 3`);
    return;
  }

  const supabase = createServiceClient();
  const { data: review, error } = await supabase
    .from('reviews')
    .update({ featured: show })
    .eq('sort_order', num)
    .select('name')
    .maybeSingle();

  if (error || !review) {
    await sendTelegramMessage(chatId, `Review #${num} not found.`);
    return;
  }

  await sendTelegramMessage(chatId,
    `${show ? 'Showing' : 'Hidden'}: Review #${num} by ${review.name}\n${show ? 'Now visible on site.' : 'Removed from site (not deleted).'}`
  );
}

async function handleStats(chatId: string) {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  // Today's washes
  const { count: todayWashes } = await supabase
    .from('washes')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`);

  // Total washes ever
  const { count: totalWashes } = await supabase
    .from('washes')
    .select('*', { count: 'exact', head: true });

  // Total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Active members
  const { count: activeMembers } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Gallery photos
  const { count: galleryCount } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact', head: true })
    .eq('featured', true);

  // Reviews
  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('featured', true);

  // Today's revenue
  const { data: todayRevData } = await supabase
    .from('washes')
    .select('amount_cents')
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`);
  const todayRevenue = (todayRevData || []).reduce((sum, w) => sum + (w.amount_cents || 0), 0);

  await sendTelegramMessage(chatId,
    `<b>Dashboard — ${today}</b>\n\n` +
    `<b>TODAY</b>\n` +
    `Washes: ${todayWashes ?? 0}\n` +
    `Revenue: $${(todayRevenue / 100).toFixed(2)}\n\n` +
    `<b>ALL TIME</b>\n` +
    `Total washes: ${totalWashes ?? 0}\n` +
    `Customers: ${totalUsers ?? 0}\n` +
    `Active members: ${activeMembers ?? 0}\n` +
    `Gallery photos: ${galleryCount ?? 0}\n` +
    `Reviews: ${reviewCount ?? 0}`
  );
}

async function handleQueue(chatId: string) {
  const supabase = createServiceClient();
  const { data: washes } = await supabase
    .from('washes')
    .select('id, service_type, status, created_at, vehicles(make, model, color), users(name, phone)')
    .in('status', ['queued', 'started', 'washing', 'detailing', 'finishing', 'ready'])
    .order('created_at', { ascending: true })
    .limit(10);

  if (!washes || washes.length === 0) {
    await sendTelegramMessage(chatId, 'No active washes in the queue.');
    return;
  }

  const statusEmoji: Record<string, string> = {
    queued: 'QUEUED', started: 'STARTED', washing: 'WASHING',
    detailing: 'DETAILING', finishing: 'FINISHING', ready: 'READY',
  };

  const lines = washes.map((w: Record<string, unknown>) => {
    const vehicle = w.vehicles as Record<string, string> | null;
    const user = w.users as Record<string, string> | null;
    const veh = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown';
    const name = user?.name || 'Walk-in';
    return `[${statusEmoji[w.status as string] || w.status}] ${veh}\n${name} — ${w.service_type}`;
  });

  await sendTelegramMessage(chatId,
    `<b>Active Queue</b>\n\n${lines.join('\n\n')}`
  );
}

async function handlePromos(chatId: string) {
  const supabase = createServiceClient();
  const { data: promos, count } = await supabase
    .from('promo_codes')
    .select('code, phone, discount_percent, used, created_at', { count: 'exact' })
    .eq('used', false)
    .order('created_at', { ascending: false })
    .limit(10);

  const { count: usedCount } = await supabase
    .from('promo_codes')
    .select('*', { count: 'exact', head: true })
    .eq('used', true);

  if (!promos || promos.length === 0) {
    await sendTelegramMessage(chatId, `No active promo codes.\n${usedCount ?? 0} codes used total.`);
    return;
  }

  const lines = promos.map(p =>
    `<code>${p.code}</code> — ${p.discount_percent}% off\nPhone: ${p.phone}`
  );

  await sendTelegramMessage(chatId,
    `<b>Active Promos</b> (${count ?? 0} unused)\n\n${lines.join('\n\n')}\n\n${usedCount ?? 0} codes used total.`
  );
}

async function handleMembers(chatId: string) {
  const supabase = createServiceClient();

  const { count: active } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { data: byTier } = await supabase
    .from('memberships')
    .select('tier')
    .eq('status', 'active');

  const tiers: Record<string, number> = {};
  for (const m of byTier || []) {
    tiers[m.tier] = (tiers[m.tier] || 0) + 1;
  }

  const tierLines = Object.entries(tiers).map(([t, c]) => `${t.toUpperCase()}: ${c}`).join('\n') || 'None yet';

  await sendTelegramMessage(chatId,
    `<b>Memberships</b>\n\nActive: ${active ?? 0}\n\n${tierLines}`
  );
}

async function handleHealth(chatId: string) {
  await sendTelegramMessage(chatId, 'Running health checks...');

  const endpoints = [
    { name: 'Homepage', path: '/' },
    { name: 'Gallery API', path: '/api/gallery' },
    { name: 'Reviews API', path: '/api/reviews' },
    { name: 'Health API', path: '/api/health' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery Page', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Memberships', path: '/memberships' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
  ];

  const results: string[] = [];
  let allOk = true;

  for (const ep of endpoints) {
    try {
      const start = Date.now();
      const res = await fetch(`${SITE_URL}${ep.path}`, { redirect: 'follow' });
      const ms = Date.now() - start;
      const ok = res.status === 200;
      if (!ok) allOk = false;
      results.push(`${ok ? 'OK' : 'FAIL'} ${ep.name} — ${res.status} (${ms}ms)`);
    } catch (err) {
      allOk = false;
      results.push(`FAIL ${ep.name} — ${err instanceof Error ? err.message : 'Error'}`);
    }
  }

  // Test Supabase connection
  try {
    const supabase = createServiceClient();
    const start = Date.now();
    const { error } = await supabase.from('gallery_photos').select('id').limit(1);
    const ms = Date.now() - start;
    if (error) {
      allOk = false;
      results.push(`FAIL Supabase DB — ${error.message}`);
    } else {
      results.push(`OK Supabase DB — (${ms}ms)`);
    }
  } catch {
    allOk = false;
    results.push('FAIL Supabase DB — Connection error');
  }

  const header = allOk ? '<b>ALL SYSTEMS OK</b>' : '<b>ISSUES DETECTED</b>';

  await sendTelegramMessage(chatId,
    `${header}\n\n${results.join('\n')}`
  );
}

async function handleSiteLinks(chatId: string) {
  await sendTelegramMessage(chatId,
    `<b>Site Links</b>\n\n` +
    `<a href="${SITE_URL}">Homepage</a>\n` +
    `<a href="${SITE_URL}/services">Services</a>\n` +
    `<a href="${SITE_URL}/gallery">Gallery</a>\n` +
    `<a href="${SITE_URL}/memberships">Memberships</a>\n` +
    `<a href="${SITE_URL}/about">About</a>\n` +
    `<a href="${SITE_URL}/contact">Contact</a>\n\n` +
    `<b>Admin</b>\n` +
    `<a href="${SITE_URL}/queue">Wash Queue</a>\n` +
    `<a href="${SITE_URL}/reviews">Review Manager</a>\n` +
    `<a href="${SITE_URL}/admin/dashboard">Admin Dashboard</a>`
  );
}

// ─── ROUTE CONFIG ─────────────────────────────────────────────
export const maxDuration = 60; // Allow up to 60s for photo analysis + upload

// ─── MAIN HANDLER ──────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    const message = update.message;
    if (!message) {
      console.log('[telegram webhook] No message in update:', JSON.stringify(update).slice(0, 200));
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    console.log('[telegram webhook] Received from chat:', chatId, '| Authorized IDs:', CHAT_IDS.join(','), '| Type:', message.chat.type);

    // Allow /debug from anyone so new users can identify their chat ID
    const rawText = (message.text || '').trim().toLowerCase();
    if (rawText === '/debug') {
      const authorized = isAuthorized(chatId);
      await sendTelegramMessage(chatId,
        `<b>Debug Info</b>\n\n` +
        `Chat ID: <code>${chatId}</code>\n` +
        `Chat type: ${message.chat.type}\n` +
        `From: ${message.from?.first_name || 'unknown'} (${message.from?.id || 'unknown'})\n` +
        `Bot token set: ${BOT_TOKEN ? 'YES' : 'NO'}\n` +
        `Anthropic key set: ${ANTHROPIC_API_KEY ? 'YES' : 'NO'}\n` +
        `Supabase URL set: ${SUPABASE_URL ? 'YES' : 'NO'}\n` +
        `Authorized: ${authorized ? 'YES' : 'NO'}\n` +
        `${!authorized ? '\n⚠️ Your Chat ID is NOT authorized. Ask admin to add <code>' + chatId + '</code> to TELEGRAM_CHAT_ID env var.' : '✅ You are authorized.'}`
      );
      return NextResponse.json({ ok: true });
    }

    if (!isAuthorized(chatId)) {
      console.log('[telegram webhook] Unauthorized chat ID:', chatId, '| From:', message.from?.first_name);
      // Send a helpful message to unauthorized users
      await sendTelegramMessage(chatId,
        `Not authorized. Your chat ID: <code>${chatId}</code>\nSend this to the admin to get access.`
      );
      return NextResponse.json({ ok: true });
    }

    // Check if the message has a photo (compressed) or document (uncompressed/file)
    let photos = message.photo;
    let isDocument = false;

    // Handle photos sent as documents (uncompressed / "Send as file")
    if ((!photos || photos.length === 0) && message.document) {
      const doc = message.document;
      const mime = doc.mime_type || '';
      if (mime.startsWith('image/')) {
        // Treat document as a photo
        photos = [{ file_id: doc.file_id, file_unique_id: doc.file_unique_id, width: 0, height: 0, file_size: doc.file_size }];
        isDocument = true;
        console.log('[telegram webhook] Photo sent as document:', doc.file_name, mime);
      }
    }

    if (!photos || photos.length === 0) {
      // Handle text commands
      const raw = (message.text || message.caption || '').trim();
      if (!raw) {
        console.log('[telegram webhook] Empty message (no text, no photo, no document):', JSON.stringify(message).slice(0, 300));
        return NextResponse.json({ ok: true });
      }
      const lower = raw.toLowerCase();
      const [cmd, ...argParts] = lower.split(/\s+/);
      const args = raw.slice(cmd.length).trim();

      switch (cmd) {
        case '/help':
        case '/start':
        case '/gallery':
          await handleHelp(chatId); break;
        case '/count':
          await handleCount(chatId); break;
        case '/photos':
          await handlePhotos(chatId); break;
        case '/delete':
          await handleDeletePhoto(chatId, args); break;
        case '/hide':
          await handleTogglePhoto(chatId, args, false); break;
        case '/show':
          await handleTogglePhoto(chatId, args, true); break;
        case '/reviews':
          await handleReviews(chatId); break;
        case '/addreview':
          await handleAddReview(chatId, args); break;
        case '/hidereview':
          await handleToggleReview(chatId, args, false); break;
        case '/showreview':
          await handleToggleReview(chatId, args, true); break;
        case '/stats':
          await handleStats(chatId); break;
        case '/queue':
          await handleQueue(chatId); break;
        case '/promos':
          await handlePromos(chatId); break;
        case '/members':
          await handleMembers(chatId); break;
        case '/health':
          await handleHealth(chatId); break;
        case '/site':
          await handleSiteLinks(chatId); break;
        case '/debug':
          // Handled above (before auth check) so anyone can use it
          break;
        default:
          // Don't respond to random text — only commands
          console.log('[telegram webhook] Unknown command or text:', raw.slice(0, 100));
          break;
      }

      return NextResponse.json({ ok: true });
    }

    // ─── PHOTO UPLOAD FLOW ───
    console.log('[telegram webhook] Photo received. Count:', photos.length, '| isDocument:', isDocument, '| caption:', message.caption || 'none');

    const photo = photos[photos.length - 1];
    const fileUrl = await getFileUrl(photo.file_id);
    if (!fileUrl) {
      console.error('[telegram webhook] getFile failed for file_id:', photo.file_id);
      await sendTelegramMessage(chatId, 'Could not download photo. Try again.');
      return NextResponse.json({ ok: true });
    }

    console.log('[telegram webhook] File URL obtained, analyzing with Claude...');
    await sendTelegramMessage(chatId, 'Analyzing car...');

    const analysis = await analyzeCarPhoto(fileUrl);
    if (!analysis) {
      console.error('[telegram webhook] Claude analysis returned null for:', fileUrl);
      await sendTelegramMessage(chatId,
        'Could not identify a vehicle in this photo. Make sure the car is clearly visible and try again.'
      );
      return NextResponse.json({ ok: true });
    }

    console.log('[telegram webhook] Analysis result:', JSON.stringify(analysis));

    // Download image and upload to Supabase Storage
    const imgRes = await fetch(fileUrl);
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const filename = `${Date.now()}-${analysis.make.toLowerCase()}-${analysis.model.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const storagePath = `cars/${filename}`;

    const supabase = createServiceClient();
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(storagePath, imgBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('[telegram webhook] Upload error:', uploadError);
      await sendTelegramMessage(chatId, 'Failed to upload photo. Try again.');
      return NextResponse.json({ ok: true });
    }

    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/gallery/${storagePath}`;

    // Get next sort order
    const { data: lastPhoto } = await supabase
      .from('gallery_photos')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();
    const nextOrder = (lastPhoto?.sort_order ?? 0) + 1;

    // Insert into gallery
    const { error: insertError } = await supabase
      .from('gallery_photos')
      .insert({
        image_url: imageUrl,
        storage_path: storagePath,
        make: analysis.make,
        model: analysis.model,
        color: analysis.color,
        year: analysis.year || null,
        label: analysis.label,
        category: analysis.category,
        service_type: analysis.category,
        ai_description: analysis.description,
        featured: true,
        sort_order: nextOrder,
      });

    if (insertError) {
      console.error('[telegram webhook] Insert error:', insertError);
      await sendTelegramMessage(chatId, 'Photo uploaded but failed to add to gallery. Check logs.');
      return NextResponse.json({ ok: true });
    }

    console.log('[telegram webhook] Photo #' + nextOrder + ' inserted successfully:', analysis.label);

    const caption = message.caption;
    const captionLine = caption ? `\nCaption: <i>${caption}</i>` : '';

    await sendTelegramMessage(chatId,
      `<b>Added to Gallery</b>\n\n` +
      `${analysis.label}\n` +
      `Color: ${analysis.color}\n` +
      `${analysis.year ? `Year: ${analysis.year}\n` : ''}` +
      `Category: ${analysis.category}${captionLine}\n\n` +
      `<i>${analysis.description}</i>\n\n` +
      `Photo #${nextOrder} — Live on site now.`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[telegram webhook] Unhandled error:', err);
    // Try to notify via Telegram if possible
    try {
      if (CHAT_IDS.length > 0) {
        await broadcastMessage(`⚠️ Webhook error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } catch { /* ignore */ }
    return NextResponse.json({ ok: true });
  }
}
