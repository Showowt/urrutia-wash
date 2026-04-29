// ═══════════════════════════════════════════════════════
// URRUTIA — PATCH /api/status
// Operator endpoint: update wash status, trigger SMS,
// handle punch card milestones.
// ═══════════════════════════════════════════════════════

import { statusUpdateSchema } from "@/lib/validators/booking";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTemplateSMS } from "@/lib/twilio/sms";
import type { WashStatus, Wash } from "@/types/database";

// Optional: estimated minutes from the operator for the "finishing" state
interface StatusUpdateBody {
  wash_id: string;
  status: WashStatus;
  estimated_minutes?: number;
}

// Shape returned by the Supabase join select
interface WashWithUser extends Wash {
  users: {
    id: string;
    phone: string;
    name: string | null;
    punch_count: number;
  } | null;
}

export async function PATCH(request: Request) {
  try {
    const body: StatusUpdateBody = await request.json();

    // ── 1. Validate input ──────────────────────────────
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          data: null,
          error: "Validation failed",
          message: parsed.error.message,
        },
        { status: 400 }
      );
    }

    const { wash_id, status } = parsed.data;
    const estimatedMinutes =
      typeof body.estimated_minutes === "number" ? body.estimated_minutes : 5;

    const supabase = createServiceClient();

    // ── 2. Fetch the wash with user info ───────────────
    // Cast to WashWithUser since Supabase can't infer join types without FK
    // Relationships registered in the schema.
    const { data: wash, error: fetchError } = await supabase
      .from("washes")
      .select("*, users(id, phone, name, punch_count)")
      .eq("id", wash_id)
      .single() as unknown as { data: WashWithUser | null; error: unknown };

    if (fetchError || !wash) {
      console.error("[PATCH /api/status] wash fetch error", fetchError);
      return Response.json(
        { data: null, error: "Not found", message: "Wash not found" },
        { status: 404 }
      );
    }

    // ── 3. Update wash status ──────────────────────────
    const { data: updatedWash, error: updateError } = await supabase
      .from("washes")
      .update({
        status,
        status_updated_at: new Date().toISOString(),
      })
      .eq("id", wash_id)
      .select("*")
      .single();

    if (updateError || !updatedWash) {
      console.error("[PATCH /api/status] wash update error", updateError);
      return Response.json(
        { data: null, error: "Database error", message: "Failed to update status" },
        { status: 500 }
      );
    }

    // ── 4. Resolve user ────────────────────────────────
    const user = wash.users;

    if (!user) {
      console.error("[PATCH /api/status] user not found on wash", wash_id);
      return Response.json(
        {
          data: updatedWash,
          error: null,
          message: "Status updated (no SMS — user missing)",
        },
        { status: 200 }
      );
    }

    const vehicleLabel = "your car";

    // ── 5. Status-driven SMS + side effects ────────────
    let smsSid: string | null = null;
    let smsTemplate: string | null = null;
    let smsBody: string | null = null;

    if (status === "started") {
      smsTemplate = "wash_started";
      smsBody = `URRUTIA: Your ${vehicleLabel} is in the bay. We'll text you when it's almost done.`;
      const result = await sendTemplateSMS(user.phone, "wash_started", {
        vehicle: vehicleLabel,
      });
      smsSid = result.sid;
      if (result.error) {
        console.error("[PATCH /api/status] SMS wash_started failed", result.error);
      }
    }

    if (status === "finishing") {
      smsTemplate = "almost_ready";
      smsBody = `URRUTIA: ~${estimatedMinutes} min until your car is ready.`;
      const result = await sendTemplateSMS(user.phone, "almost_ready", {
        minutes: estimatedMinutes,
      });
      smsSid = result.sid;
      if (result.error) {
        console.error("[PATCH /api/status] SMS almost_ready failed", result.error);
      }
    }

    if (status === "ready") {
      smsTemplate = "ready";
      smsBody = `URRUTIA: Your ${vehicleLabel} is ready. Walk out anytime.`;
      const result = await sendTemplateSMS(user.phone, "ready", {
        vehicle: vehicleLabel,
      });
      smsSid = result.sid;
      if (result.error) {
        console.error("[PATCH /api/status] SMS ready failed", result.error);
      }

      // ── Punch card logic ─────────────────────────────
      const currentPunchCount = user.punch_count;
      const newPunchCount = currentPunchCount + 1;
      const hitMilestone = newPunchCount >= 10;
      const finalPunchCount = hitMilestone ? 0 : newPunchCount;

      const { error: punchError } = await supabase
        .from("users")
        .update({ punch_count: finalPunchCount })
        .eq("id", user.id);

      if (punchError) {
        console.error("[PATCH /api/status] punch_count update error", punchError);
      }

      // Send punch milestone SMS
      const milestoneResult = await sendTemplateSMS(user.phone, "punch_milestone", {
        count: hitMilestone ? 10 : newPunchCount,
        free: hitMilestone,
      });

      if (milestoneResult.error) {
        console.error("[PATCH /api/status] SMS punch_milestone failed", milestoneResult.error);
      }

      // Log the punch milestone SMS
      if (milestoneResult.sid) {
        const milestoneBody = hitMilestone
          ? `URRUTIA: You earned a free wash! It's locked into your account - book anytime.`
          : `URRUTIA: ${newPunchCount}/10 washes. ${10 - newPunchCount} more until your free wash.`;

        const { error: milestoneLogError } = await supabase.from("sms_log").insert({
          user_id: user.id,
          wash_id: wash_id,
          template: "punch_milestone",
          body: milestoneBody,
          twilio_sid: milestoneResult.sid,
        });

        if (milestoneLogError) {
          console.error("[PATCH /api/status] sms_log punch_milestone insert error", milestoneLogError);
        }
      }
    }

    // ── 6. Log status SMS ──────────────────────────────
    if (smsSid && smsTemplate && smsBody) {
      const { error: logError } = await supabase.from("sms_log").insert({
        user_id: user.id,
        wash_id: wash_id,
        template: smsTemplate,
        body: smsBody,
        twilio_sid: smsSid,
      });

      if (logError) {
        console.error("[PATCH /api/status] sms_log insert error", logError);
      }
    }

    // ── 7. Return ──────────────────────────────────────
    return Response.json(
      { data: updatedWash, error: null, message: `Status updated to ${status}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/status]", error);
    return Response.json(
      { data: null, error: "Internal server error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
