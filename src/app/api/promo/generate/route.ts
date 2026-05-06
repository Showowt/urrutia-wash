import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyPromoUnlock } from "@/lib/telegram";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "URR-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body as { phone?: string };

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { data: null, error: "invalid_phone", message: "Valid 10-digit phone number required" },
        { status: 400 },
      );
    }

    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
    const supabase = createServiceClient();

    // Check if this phone already has a promo code
    const { data: existingRaw } = await supabase
      .from("promo_codes")
      .select("code, used")
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (existingRaw) {
      if (existingRaw.used) {
        return NextResponse.json(
          { data: null, error: "already_used", message: "This phone number has already used a promo code" },
          { status: 409 },
        );
      }
      return NextResponse.json({
        data: { code: existingRaw.code, discount_percent: 10, free_addon: "Free Spray Wax" },
        error: null,
        message: "Promo code retrieved",
      });
    }

    // Generate unique code (retry on collision)
    let code = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: collision } = await supabase
        .from("promo_codes")
        .select("id")
        .eq("code", code)
        .maybeSingle();

      if (!collision) break;
      code = generateCode();
      attempts++;
    }

    // Insert new promo code
    const { error: insertError } = await supabase
      .from("promo_codes")
      .insert({
        phone: normalizedPhone,
        code,
        discount_percent: 10,
        free_addon: "spray_wax",
      });

    if (insertError) {
      console.error("[promo/generate]", insertError);
      return NextResponse.json(
        { data: null, error: "insert_failed", message: "Failed to generate promo code" },
        { status: 500 },
      );
    }

    // Notify owner via Telegram
    await notifyPromoUnlock(normalizedPhone, code);

    return NextResponse.json({
      data: { code, discount_percent: 10, free_addon: "Free Spray Wax" },
      error: null,
      message: "Promo code created",
    });
  } catch (error) {
    console.error("[promo/generate]", error);
    return NextResponse.json(
      { data: null, error: "server_error", message: "Internal server error" },
      { status: 500 },
    );
  }
}
