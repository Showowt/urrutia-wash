import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body as { code?: string };

    if (!code || code.trim().length < 4) {
      return NextResponse.json(
        { data: null, error: "invalid_code", message: "Promo code is required" },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    const { data: promoRaw, error: fetchError } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .maybeSingle();

    if (fetchError) {
      console.error("[promo/validate]", fetchError);
      return NextResponse.json(
        { data: null, error: "lookup_failed", message: "Failed to validate promo code" },
        { status: 500 },
      );
    }

    if (!promoRaw) {
      return NextResponse.json(
        { data: null, error: "not_found", message: "Invalid promo code" },
        { status: 404 },
      );
    }

    if (promoRaw.used) {
      return NextResponse.json(
        { data: null, error: "already_used", message: "This promo code has already been used" },
        { status: 410 },
      );
    }

    return NextResponse.json({
      data: {
        code: promoRaw.code,
        discount_percent: promoRaw.discount_percent,
        free_addon: "Free Spray Wax",
        valid: true,
      },
      error: null,
      message: "Promo code is valid",
    });
  } catch (error) {
    console.error("[promo/validate]", error);
    return NextResponse.json(
      { data: null, error: "server_error", message: "Internal server error" },
      { status: 500 },
    );
  }
}
