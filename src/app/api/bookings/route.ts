// ═══════════════════════════════════════════════════════
// URRUTIA — POST /api/bookings
// Creates a wash booking: find/create user + vehicle,
// insert wash row, send confirmation SMS, log it.
// ═══════════════════════════════════════════════════════

import { bookingSchema } from "@/lib/validators/booking";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTemplateSMS } from "@/lib/twilio/sms";
import { SERVICES } from "@/lib/square/pricing";
import type { ServiceType } from "@/types/database";
import { notifyBooking } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── 1. Validate input ──────────────────────────────
    const parsed = bookingSchema.safeParse(body);
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

    const {
      name,
      phone,
      vehicle: vehicleLabel,
      plate,
      service_type,
      location,
      mobile_address,
      scheduled_for,
      referral_code: inboundReferralCode,
    } = parsed.data;

    const supabase = createServiceClient();

    // ── 2. Find or create user by phone ───────────────
    const { data: existingUser, error: userFetchError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (userFetchError) {
      console.error("[POST /api/bookings] user fetch error", userFetchError);
      return Response.json(
        { data: null, error: "Database error", message: "Failed to look up user" },
        { status: 500 }
      );
    }

    let userId: string;
    let userName: string;

    if (existingUser) {
      userId = existingUser.id;
      userName = existingUser.name ?? name;

      // Update name if it was missing
      if (!existingUser.name && name) {
        await supabase.from("users").update({ name }).eq("id", userId);
      }
    } else {
      // Generate a short referral code: first 6 chars of a uuid
      const newReferralCode = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

      // Resolve referred_by if a referral code was provided
      let referredBy: string | null = null;
      if (inboundReferralCode) {
        const { data: referrer } = await supabase
          .from("users")
          .select("id")
          .eq("referral_code", inboundReferralCode.toUpperCase())
          .maybeSingle();
        referredBy = referrer?.id ?? null;
      }

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          phone,
          name,
          referral_code: newReferralCode,
          referred_by: referredBy,
        })
        .select("id, name")
        .single();

      if (createError || !newUser) {
        console.error("[POST /api/bookings] user create error", createError);
        return Response.json(
          { data: null, error: "Database error", message: "Failed to create user" },
          { status: 500 }
        );
      }

      userId = newUser.id;
      userName = newUser.name ?? name;
    }

    // ── 3. Find or create vehicle ──────────────────────
    let vehicleId: string | null = null;

    if (plate) {
      const normalizedPlate = plate.toUpperCase().replace(/\s/g, "");

      const { data: existingVehicle } = await supabase
        .from("vehicles")
        .select("id")
        .eq("user_id", userId)
        .eq("plate", normalizedPlate)
        .maybeSingle();

      if (existingVehicle) {
        vehicleId = existingVehicle.id;
      } else {
        // Parse "2019 Honda Civic" style label if provided
        let year: number | undefined;
        let make: string | undefined;
        let model: string | undefined;

        if (vehicleLabel) {
          const parts = vehicleLabel.trim().split(/\s+/);
          const parsedYear = parseInt(parts[0], 10);
          if (!isNaN(parsedYear) && parsedYear > 1900 && parsedYear < 2100) {
            year = parsedYear;
            make = parts[1];
            model = parts.slice(2).join(" ") || undefined;
          } else {
            make = parts[0];
            model = parts.slice(1).join(" ") || undefined;
          }
        }

        const { data: newVehicle, error: vehicleError } = await supabase
          .from("vehicles")
          .insert({
            user_id: userId,
            plate: normalizedPlate,
            year,
            make,
            model,
          })
          .select("id")
          .single();

        if (vehicleError || !newVehicle) {
          console.error("[POST /api/bookings] vehicle create error", vehicleError);
          return Response.json(
            { data: null, error: "Database error", message: "Failed to create vehicle" },
            { status: 500 }
          );
        }

        vehicleId = newVehicle.id;
      }
    }

    // ── 4. Create wash record ──────────────────────────
    const amountCents = SERVICES[service_type as keyof typeof SERVICES]?.priceCents ?? 3500;

    const { data: wash, error: washError } = await supabase
      .from("washes")
      .insert({
        user_id: userId,
        vehicle_id: vehicleId ?? undefined,
        service_type: service_type as ServiceType,
        location,
        mobile_address: mobile_address ?? null,
        scheduled_for: scheduled_for ?? null,
        amount_cents: amountCents,
      })
      .select("*")
      .single();

    if (washError || !wash) {
      console.error("[POST /api/bookings] wash create error", washError);
      return Response.json(
        { data: null, error: "Database error", message: "Failed to create booking" },
        { status: 500 }
      );
    }

    // ── 5a. Notify owner via Telegram ──────────────────
    await notifyBooking({
      name: userName,
      phone,
      service: service_type,
      vehicle: vehicleLabel,
      plate,
      when: scheduled_for ?? undefined,
    });

    // ── 5. Send confirmation SMS ───────────────────────
    const serviceLabel =
      service_type === "express"
        ? "Express Hand Wash"
        : service_type === "classic"
          ? "Wash + Interior"
          : service_type === "detail"
            ? "Full Detail"
            : "Ceramic Coating";

    const timeLabel = scheduled_for
      ? new Date(scheduled_for).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/Los_Angeles",
        })
      : "today";

    const { sid: smsSid, error: smsError } = await sendTemplateSMS(
      phone,
      "booking_confirmed",
      { name: userName, service: serviceLabel, time: timeLabel }
    );

    if (smsError) {
      console.error("[POST /api/bookings] SMS send failed", smsError);
      // Non-fatal — booking is confirmed, SMS failure should not block the response
    }

    // ── 6. Log SMS ─────────────────────────────────────
    if (smsSid) {
      const { error: logError } = await supabase.from("sms_log").insert({
        user_id: userId,
        wash_id: wash.id,
        template: "booking_confirmed",
        body: `URRUTIA: Hey ${userName}, you're booked for ${serviceLabel} ${timeLabel}. Reply CHANGE to reschedule.`,
        twilio_sid: smsSid,
      });

      if (logError) {
        console.error("[POST /api/bookings] sms_log insert error", logError);
      }
    }

    // ── 7. Return ──────────────────────────────────────
    return Response.json(
      { data: wash, error: null, message: "Booking confirmed" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return Response.json(
      { data: null, error: "Internal server error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
