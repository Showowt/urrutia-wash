import crypto from "crypto";

export const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;
export const SQUARE_WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

const SQUARE_API_BASE =
  process.env.SQUARE_ENVIRONMENT === "sandbox"
    ? "https://connect.squareupsandbox.com/v2"
    : "https://connect.squareup.com/v2";

export interface SquareCheckoutResult {
  paymentLinkUrl: string;
  orderId: string;
  reference: string;
}

export async function createSquareCheckout(data: {
  amountCents: number;
  currency: string;
  reference: string;
  description: string;
  customerEmail?: string;
  redirectUrl: string;
}): Promise<SquareCheckoutResult> {
  if (!SQUARE_ACCESS_TOKEN) throw new Error("SQUARE_ACCESS_TOKEN not configured");
  if (!SQUARE_LOCATION_ID) throw new Error("SQUARE_LOCATION_ID not configured");

  const idempotencyKey = crypto.randomUUID();

  const body = {
    idempotency_key: idempotencyKey,
    quick_pay: {
      name: data.description,
      price_money: {
        amount: data.amountCents,
        currency: data.currency,
      },
      location_id: SQUARE_LOCATION_ID,
    },
    checkout_options: {
      redirect_url: data.redirectUrl,
      ask_for_shipping_address: false,
    },
    pre_populated_data: data.customerEmail
      ? { buyer_email: data.customerEmail }
      : undefined,
    payment_note: data.reference,
  };

  const response = await fetch(`${SQUARE_API_BASE}/online-checkout/payment-links`, {
    method: "POST",
    headers: {
      "Square-Version": "2024-12-18",
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Square API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const result = await response.json();

  return {
    paymentLinkUrl: result.payment_link.url,
    orderId: result.payment_link.order_id,
    reference: data.reference,
  };
}

export function verifySquareWebhook(
  body: string,
  signature: string,
  webhookUrl: string,
): boolean {
  if (!SQUARE_WEBHOOK_SIGNATURE_KEY) return false;

  try {
    const hmac = crypto.createHmac("sha256", SQUARE_WEBHOOK_SIGNATURE_KEY);
    hmac.update(webhookUrl + body);
    const expectedSignature = hmac.digest("base64");

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(signature);
    if (expected.length !== received.length) return false;
    return crypto.timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}
