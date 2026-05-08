import { NextRequest, NextResponse } from "next/server";
import { createSquareCheckout } from "@/lib/square/config";
import { createServiceClient } from "@/lib/supabase/server";
import { SERVICES, WEEKLY_PLANS, ADD_ONS, calculateTotal } from "@/lib/square/pricing";
import type { ServiceId, WeeklyPlanId } from "@/lib/square/pricing";
import { notifyPromoUsed, notifyPayment } from "@/lib/telegram";

interface CheckoutBody {
  // For one-time services
  service_id?: ServiceId;
  add_on_ids?: string[];
  // For weekly plans
  membership_id?: WeeklyPlanId;
  // Legacy/direct amount (for walkin or custom)
  amount_cents?: number;
  description?: string;
  // Customer info
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  // Promo code
  promo_code?: string;
}

const VALID_SERVICES: ServiceId[] = ["small_exterior", "small_full", "medium_exterior", "medium_full", "large_exterior", "large_full", "detail"];
const VALID_WEEKLY_PLANS: WeeklyPlanId[] = ["weekly_small_exterior", "weekly_small_full", "weekly_medium_exterior", "weekly_medium_full", "weekly_large_exterior", "weekly_large_full"];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;

    let amountCents: number;
    let description: string;
    let promoApplied = false;
    let discountCents = 0;

    if (body.service_id && VALID_SERVICES.includes(body.service_id)) {
      // Service checkout with optional add-ons
      const service = SERVICES[body.service_id];
      const addOnIds = body.add_on_ids ?? [];
      amountCents = calculateTotal(body.service_id, addOnIds);

      const addOnLabels = addOnIds
        .map((id) => ADD_ONS.find((a) => a.id === id)?.label)
        .filter(Boolean);

      description = addOnLabels.length > 0
        ? `${service.label} + ${addOnLabels.join(", ")}`
        : service.label;

    } else if (body.membership_id && VALID_WEEKLY_PLANS.includes(body.membership_id)) {
      // Weekly plan monthly payment
      const plan = WEEKLY_PLANS[body.membership_id];
      amountCents = plan.monthlyCents;
      description = `${plan.label} — Monthly (4 washes)`;

    } else if (body.amount_cents && body.amount_cents >= 100) {
      // Direct amount (walkin, custom, test)
      amountCents = body.amount_cents;
      description = body.description || "URRUTIA Car Wash";

    } else {
      return NextResponse.json(
        { data: null, error: "invalid_request", message: "Provide service_id, membership_id, or amount_cents (min 100)" },
        { status: 400 },
      );
    }

    // ── Validate and apply promo code ──────────────────────────
    if (body.promo_code && body.promo_code.trim()) {
      const supabase = createServiceClient();
      const code = body.promo_code.trim().toUpperCase();

      let promoRow = (await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code)
        .eq("used", false)
        .maybeSingle()).data;

      // Check expiration
      if (promoRow?.expires_at && new Date(promoRow.expires_at) < new Date()) {
        promoRow = null;
      }

      if (promoRow) {
        // Apply discount
        discountCents = Math.round(amountCents * (promoRow.discount_percent / 100));
        amountCents = amountCents - discountCents;

        // Minimum $1 charge (Square requires at least 100 cents)
        if (amountCents < 100) amountCents = 100;

        // Add free spray wax to description
        if (promoRow.free_addon === "spray_wax") {
          description += " + FREE Spray Wax";
        }

        description += ` (${promoRow.discount_percent}% OFF — code: ${code})`;
        promoApplied = true;

        // Mark code as used
        await supabase.from("promo_codes").update({
          used: true,
          used_at: new Date().toISOString(),
          order_reference: `URRUTIA-${Date.now().toString(36).toUpperCase()}`,
        }).eq("code", code);

        // Notify owner via Telegram (fire-and-forget)
        await notifyPromoUsed(code, description, amountCents, discountCents);
      }
      // If promo not found or already used, proceed without discount silently
    }

    const reference = `URRUTIA-${Date.now().toString(36).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.washduringworkout.com";

    const checkout = await createSquareCheckout({
      amountCents,
      currency: "USD",
      reference,
      description,
      customerEmail: body.customer_email,
      redirectUrl: `${baseUrl}/payment/success?ref=${reference}`,
    });

    // Notify owner via Telegram (fire-and-forget)
    await notifyPayment(reference, amountCents, description);

    return NextResponse.json({
      data: {
        checkout_url: checkout.paymentLinkUrl,
        reference,
        order_id: checkout.orderId,
        amount_cents: amountCents,
        promo_applied: promoApplied,
        discount_cents: discountCents,
      },
      error: null,
      message: promoApplied ? "Checkout created with promo discount" : "Checkout created",
    });
  } catch (error) {
    console.error("[payments/checkout]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { data: null, error: "checkout_failed", message },
      { status: 500 },
    );
  }
}
