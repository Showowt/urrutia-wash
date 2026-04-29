// ═══════════════════════════════════════════════════════
// URRUTIA — POST /api/referrals
// Looks up referrer by code, creates a referral record
// linking the referrer to the new referee (by phone).
// Credit is applied when the referee completes first wash.
// ═══════════════════════════════════════════════════════

import { referralSchema } from "@/lib/validators/booking";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── 1. Validate input ──────────────────────────────
    const parsed = referralSchema.safeParse(body);
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

    const { referrer_code, referee_phone } = parsed.data;

    const supabase = createServiceClient();

    // ── 2. Look up referrer by code ────────────────────
    const { data: referrer, error: referrerError } = await supabase
      .from("users")
      .select("id, name, phone")
      .eq("referral_code", referrer_code.toUpperCase())
      .maybeSingle();

    if (referrerError) {
      console.error("[POST /api/referrals] referrer lookup error", referrerError);
      return Response.json(
        { data: null, error: "Database error", message: "Failed to look up referral code" },
        { status: 500 }
      );
    }

    if (!referrer) {
      return Response.json(
        { data: null, error: "Not found", message: "Referral code not found" },
        { status: 404 }
      );
    }

    // ── 3. Look up or verify referee exists ────────────
    const { data: referee, error: refereeError } = await supabase
      .from("users")
      .select("id")
      .eq("phone", referee_phone)
      .maybeSingle();

    if (refereeError) {
      console.error("[POST /api/referrals] referee lookup error", refereeError);
      return Response.json(
        { data: null, error: "Database error", message: "Failed to look up referee" },
        { status: 500 }
      );
    }

    if (!referee) {
      return Response.json(
        {
          data: null,
          error: "Not found",
          message: "Referee phone not found — they must book first, then the referral is applied",
        },
        { status: 404 }
      );
    }

    // ── 4. Guard: prevent self-referral ───────────────
    if (referrer.id === referee.id) {
      return Response.json(
        { data: null, error: "Invalid", message: "Cannot refer yourself" },
        { status: 422 }
      );
    }

    // ── 5. Guard: prevent duplicate referrals ─────────
    const { data: existing } = await supabase
      .from("referrals")
      .select("id, status")
      .eq("referrer_id", referrer.id)
      .eq("referee_id", referee.id)
      .maybeSingle();

    if (existing) {
      return Response.json(
        {
          data: existing,
          error: null,
          message: `Referral already exists with status: ${existing.status}`,
        },
        { status: 200 }
      );
    }

    // ── 6. Create referral record ──────────────────────
    const { data: referral, error: referralError } = await supabase
      .from("referrals")
      .insert({
        referrer_id: referrer.id,
        referee_id: referee.id,
      })
      .select("*")
      .single();

    if (referralError || !referral) {
      console.error("[POST /api/referrals] referral insert error", referralError);
      return Response.json(
        { data: null, error: "Database error", message: "Failed to create referral" },
        { status: 500 }
      );
    }

    // ── 7. Return ──────────────────────────────────────
    return Response.json(
      {
        data: referral,
        error: null,
        message: "Referral created. Credit applied after referee completes first wash.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/referrals]", error);
    return Response.json(
      { data: null, error: "Internal server error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
