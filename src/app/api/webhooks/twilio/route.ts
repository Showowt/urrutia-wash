// ═══════════════════════════════════════════════════════
// URRUTIA — POST /api/webhooks/twilio
// Handles inbound SMS from customers.
// Responds with TwiML XML. Twilio requires a 200 + XML.
// Handles: CHANGE keyword (reschedule info), STOP (opt-out)
// ═══════════════════════════════════════════════════════

import { createServiceClient } from "@/lib/supabase/server";

// Twilio posts application/x-www-form-urlencoded
export const dynamic = "force-dynamic";

function twimlResponse(message: string): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`;
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

function emptyTwiml(): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(request: Request) {
  try {
    // ── 1. Parse Twilio form body ──────────────────────
    const formData = await request.formData();
    const from: string = (formData.get("From") as string | null) ?? "";
    const body: string = (formData.get("Body") as string | null) ?? "";
    const keyword = body.trim().toUpperCase();

    // ── 2. STOP — respect opt-out immediately ─────────
    // Twilio handles STOP natively, but we return empty TwiML
    // so Twilio's compliance engine takes over without a reply loop.
    if (keyword === "STOP" || keyword === "STOPALL" || keyword === "UNSUBSCRIBE" || keyword === "CANCEL" || keyword === "END" || keyword === "QUIT") {
      // Log the opt-out server-side for records
      console.error("[POST /api/webhooks/twilio] STOP received from", from);
      return emptyTwiml();
    }

    // ── 3. CHANGE — reschedule instructions ───────────
    if (keyword.startsWith("CHANGE")) {
      const supabase = createServiceClient();

      // Normalize phone: strip non-digits for lookup
      const normalizedPhone = from.replace(/\D/g, "");

      const { data: user } = await supabase
        .from("users")
        .select("id")
        .ilike("phone", `%${normalizedPhone.slice(-10)}`)
        .maybeSingle();

      if (!user) {
        return twimlResponse(
          "URRUTIA: We couldn't find your booking. Call us at (725) 200-0000 or visit urrutiawash.com to reschedule."
        );
      }

      // Find their latest non-complete wash
      const { data: latestWash } = await supabase
        .from("washes")
        .select("id, status, scheduled_for, service_type")
        .eq("user_id", user.id)
        .not("status", "eq", "complete")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latestWash) {
        return twimlResponse(
          "URRUTIA: No active booking found. Visit urrutiawash.com to book a new appointment."
        );
      }

      // If wash is already started or further, changes are not possible
      const activeStatuses = ["started", "washing", "detailing", "finishing", "ready"];
      if (activeStatuses.includes(latestWash.status)) {
        return twimlResponse(
          "URRUTIA: Your car is already in progress — changes aren't possible at this stage. Call (725) 200-0000 if you need help."
        );
      }

      return twimlResponse(
        "URRUTIA: To reschedule, visit urrutiawash.com/book or call (725) 200-0000. Have your booking ID ready: " +
          latestWash.id.slice(0, 8).toUpperCase()
      );
    }

    // ── 4. START — opt back in ─────────────────────────
    if (keyword === "START" || keyword === "YES" || keyword === "UNSTOP") {
      return twimlResponse(
        "URRUTIA: You're back! You'll receive booking updates and wash alerts. Reply STOP anytime to opt out."
      );
    }

    // ── 5. STATUS — quick check ────────────────────────
    if (keyword === "STATUS") {
      const supabase = createServiceClient();
      const normalizedPhone = from.replace(/\D/g, "");

      const { data: user } = await supabase
        .from("users")
        .select("id")
        .ilike("phone", `%${normalizedPhone.slice(-10)}`)
        .maybeSingle();

      if (!user) {
        return twimlResponse(
          "URRUTIA: No account found for this number. Book at urrutiawash.com."
        );
      }

      const { data: latestWash } = await supabase
        .from("washes")
        .select("status, service_type, scheduled_for")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latestWash) {
        return twimlResponse(
          "URRUTIA: No recent washes found. Book at urrutiawash.com."
        );
      }

      const statusLabel: Record<string, string> = {
        queued: "queued and waiting",
        started: "in the bay",
        washing: "being washed",
        detailing: "being detailed",
        finishing: "almost done",
        ready: "ready for pickup",
        complete: "complete",
      };

      return twimlResponse(
        `URRUTIA: Your ${latestWash.service_type} is ${statusLabel[latestWash.status] ?? latestWash.status}.`
      );
    }

    // ── 6. Unrecognized — friendly fallback ───────────
    return twimlResponse(
      "URRUTIA: Reply CHANGE to reschedule, STATUS for an update, or visit urrutiawash.com. Reply STOP to opt out."
    );
  } catch (error) {
    console.error("[POST /api/webhooks/twilio]", error);
    // Always return valid TwiML — never let Twilio see a 500
    return twimlResponse("URRUTIA: Something went wrong. Please call (725) 200-0000.");
  }
}
