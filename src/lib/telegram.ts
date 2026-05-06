// ═══════════════════════════════════════════════════════
// URRUTIA — Telegram Bot Notifications
// Sends alerts to the business owner via Telegram
// ═══════════════════════════════════════════════════════

interface SendResult {
  ok: boolean;
  error?: string;
}

async function send(text: string, parseMode: "HTML" | "Markdown" = "HTML"): Promise<SendResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { ok: false, error: "Telegram not configured" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[telegram] Send failed:", body);
      return { ok: false, error: body };
    }

    return { ok: true };
  } catch (err) {
    console.error("[telegram] Network error:", err);
    return { ok: false, error: String(err) };
  }
}

/** New promo code unlocked — someone entered their phone */
export async function notifyPromoUnlock(phone: string, code: string): Promise<SendResult> {
  return send(
    `<b>NEW LEAD</b>\n\n` +
    `Phone: <code>${phone}</code>\n` +
    `Promo Code: <b>${code}</b>\n` +
    `Discount: 10% OFF + Free Spray Wax\n\n` +
    `<i>Customer entered their number on washduringworkout.com</i>`
  );
}

/** Promo code used at checkout */
export async function notifyPromoUsed(code: string, description: string, amountCents: number, discountCents: number): Promise<SendResult> {
  return send(
    `<b>PROMO CODE USED</b>\n\n` +
    `Code: <b>${code}</b>\n` +
    `Service: ${description}\n` +
    `Discount: -$${(discountCents / 100).toFixed(2)}\n` +
    `Charged: <b>$${(amountCents / 100).toFixed(2)}</b>\n\n` +
    `<i>Customer applied promo at checkout</i>`
  );
}

/** New booking created */
export async function notifyBooking(details: {
  name: string;
  phone: string;
  service: string;
  vehicle?: string;
  plate?: string;
  when?: string;
}): Promise<SendResult> {
  const lines = [
    `<b>NEW BOOKING</b>\n`,
    `Name: ${details.name}`,
    `Phone: <code>${details.phone}</code>`,
    `Service: ${details.service}`,
  ];
  if (details.vehicle) lines.push(`Vehicle: ${details.vehicle}`);
  if (details.plate) lines.push(`Plate: ${details.plate}`);
  if (details.when) lines.push(`When: ${details.when}`);
  return send(lines.join("\n"));
}

/** Payment completed */
export async function notifyPayment(reference: string, amountCents: number, description: string): Promise<SendResult> {
  return send(
    `<b>PAYMENT RECEIVED</b>\n\n` +
    `Ref: <code>${reference}</code>\n` +
    `Amount: <b>$${(amountCents / 100).toFixed(2)}</b>\n` +
    `${description}`
  );
}
