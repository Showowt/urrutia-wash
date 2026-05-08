import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyPromoUnlock } from "@/lib/telegram";

const MAX_ATTEMPTS_PER_IP = 5;   // per hour
const CODE_EXPIRY_DAYS = 30;

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "URR-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
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
    const clientIp = getClientIp(request);
    const supabase = createServiceClient();

    // ── Rate limiting by IP ──────────────────────────────────
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentAttempts } = await supabase
      .from("promo_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIp)
      .gte("attempted_at", oneHourAgo);

    if ((recentAttempts ?? 0) >= MAX_ATTEMPTS_PER_IP) {
      return NextResponse.json(
        { data: null, error: "rate_limited", message: "Too many attempts. Try again in an hour." },
        { status: 429 },
      );
    }

    // Log this attempt
    await supabase.from("promo_rate_limits").insert({
      ip_address: clientIp,
    });

    // ── Check existing code for this phone ───────────────────
    const { data: existingRaw } = await supabase
      .from("promo_codes")
      .select("code, used, expires_at")
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (existingRaw) {
      if (existingRaw.used) {
        return NextResponse.json(
          { data: null, error: "already_used", message: "This phone number has already used a promo code" },
          { status: 409 },
        );
      }
      // Check if expired
      if (new Date(existingRaw.expires_at) < new Date()) {
        return NextResponse.json(
          { data: null, error: "expired", message: "Your promo code has expired. Contact us for a new one." },
          { status: 410 },
        );
      }
      return NextResponse.json({
        data: { code: existingRaw.code, discount_percent: 10, free_addon: "Free Spray Wax" },
        error: null,
        message: "Promo code retrieved",
      });
    }

    // ── Generate unique code (retry on collision) ────────────
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

    // ── Insert new promo code with expiration + IP ───────────
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from("promo_codes")
      .insert({
        phone: normalizedPhone,
        code,
        discount_percent: 10,
        free_addon: "spray_wax",
        expires_at: expiresAt,
        ip_address: clientIp,
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
