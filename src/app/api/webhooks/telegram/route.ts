import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const CHAT_ID = (process.env.TELEGRAM_CHAT_ID || '').trim();
const ANTHROPIC_API_KEY = (process.env.ANTHROPIC_API_KEY || '').trim();
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();

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
  // Download image and convert to base64
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    await sendTelegramMessage(CHAT_ID, `DEBUG: Image download failed ${imgRes.status}`);
    return null;
  }
  const imgBuffer = await imgRes.arrayBuffer();
  const base64 = Buffer.from(imgBuffer).toString('base64');
  const mediaType = imgRes.headers.get('content-type') || 'image/jpeg';

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
    // Send error detail to Telegram for debugging
    await sendTelegramMessage(CHAT_ID, `DEBUG: Claude API ${res.status}\n${errBody.slice(0, 500)}`);
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
    await sendTelegramMessage(CHAT_ID, `DEBUG: analyzeCarPhoto error: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    // Only process messages from the authorized chat
    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    if (chatId !== CHAT_ID) {
      return NextResponse.json({ ok: true });
    }

    // Check if the message has a photo
    const photos = message.photo;
    if (!photos || photos.length === 0) {
      // Handle text commands
      const text = message.text?.toLowerCase();
      if (text === '/gallery') {
        await sendTelegramMessage(chatId,
          '<b>Gallery Bot</b>\n\n' +
          'Send a photo of a car to add it to the gallery.\n' +
          'I\'ll identify the make, model, and color automatically.\n\n' +
          'Commands:\n' +
          '/gallery - This help message\n' +
          '/count - How many photos in gallery'
        );
      } else if (text === '/count') {
        const supabase = createServiceClient();
        const { count } = await supabase.from('gallery_photos').select('*', { count: 'exact', head: true });
        await sendTelegramMessage(chatId, `<b>Gallery:</b> ${count ?? 0} photos`);
      }
      return NextResponse.json({ ok: true });
    }

    // Get the highest resolution photo
    const photo = photos[photos.length - 1];
    const fileUrl = await getFileUrl(photo.file_id);
    if (!fileUrl) {
      await sendTelegramMessage(chatId, 'Could not download photo. Try again.');
      return NextResponse.json({ ok: true });
    }

    await sendTelegramMessage(chatId, 'Analyzing car...');

    // Analyze with Claude Vision
    const analysis = await analyzeCarPhoto(fileUrl);
    if (!analysis) {
      const hasKey = ANTHROPIC_API_KEY.length > 0;
      await sendTelegramMessage(chatId,
        `Could not identify a vehicle in this photo.\nAPI key present: ${hasKey} (${ANTHROPIC_API_KEY.length} chars)\nMake sure the car is clearly visible and try again.`
      );
      return NextResponse.json({ ok: true });
    }

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

    // Build public URL
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

    // Include caption from message if provided
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
    console.error('[telegram webhook] Error:', err);
    return NextResponse.json({ ok: true });
  }
}
