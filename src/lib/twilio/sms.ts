import "server-only";
import twilio from "twilio";

let _client: ReturnType<typeof twilio> | null = null;

function getClient() {
  if (!_client) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error("[Twilio] TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required");
    }
    _client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return _client;
}

// ═══ SMS Templates ═══
const TEMPLATES = {
  booking_confirmed: ({ name, service, time }: { name: string; service: string; time: string }) =>
    `URRUTIA: Hey ${name}, you're booked for ${service} ${time}. Reply CHANGE to reschedule.`,

  wash_started: ({ vehicle }: { vehicle: string }) =>
    `URRUTIA: Your ${vehicle} is in the bay. We'll text you when it's almost done.`,

  almost_ready: ({ minutes }: { minutes: number }) =>
    `URRUTIA: ~${minutes} min until your car is ready.`,

  ready: ({ vehicle }: { vehicle: string }) =>
    `URRUTIA: Your ${vehicle} is ready. Walk out anytime.`,

  punch_milestone: ({ count, free }: { count: number; free: boolean }) =>
    free
      ? `URRUTIA: You earned a free wash! It's locked into your account - book anytime.`
      : `URRUTIA: ${count}/10 washes. ${10 - count} more until your free wash.`,

  referral_credit: ({ amount, friend }: { amount: number; friend: string }) =>
    `URRUTIA: ${friend} just used your code! $${amount} credit added to your account.`,

  member_renewal: ({ tier, amount }: { tier: string; amount: number }) =>
    `URRUTIA: Your ${tier} membership renewed - $${amount}. New cycle washes available.`,
} as const;

type TemplateKey = keyof typeof TEMPLATES;

export async function sendSMS(to: string, body: string) {
  try {
    const message = await getClient().messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });
    return { sid: message.sid, error: null };
  } catch (error) {
    console.error("[Twilio] SMS send failed:", error);
    return { sid: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendTemplateSMS<K extends TemplateKey>(
  to: string,
  template: K,
  data: Parameters<(typeof TEMPLATES)[K]>[0]
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (TEMPLATES[template] as (data: any) => string)(data);
  return sendSMS(to, body);
}

export { TEMPLATES };
