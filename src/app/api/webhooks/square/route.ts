import { NextRequest, NextResponse } from "next/server";
import { verifySquareWebhook } from "@/lib/square/config";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTemplateSMS } from "@/lib/twilio/sms";
import { notifyPayment } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-square-hmacsha256-signature") || "";
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://www.washduringworkout.com"}/api/webhooks/square`;

    // Verify webhook signature
    if (!verifySquareWebhook(body, signature, webhookUrl)) {
      console.error("[webhooks/square] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event.type as string;

    switch (eventType) {
      case "payment.completed": {
        const payment = event.data?.object?.payment;
        const reference = payment?.note || payment?.reference_id || "";
        const amountCents = payment?.amount_money?.amount || 0;

        console.log("[webhooks/square] Payment completed:", {
          id: payment?.id,
          amount: amountCents,
          reference,
          status: payment?.status,
        });

        // Find the wash by order reference and update status
        const supabase = createServiceClient();
        const washId = reference.replace("URRUTIA-", "").toLowerCase();

        const { data: wash } = await supabase
          .from("washes")
          .select("*")
          .eq("id", washId)
          .maybeSingle();

        if (wash) {
          // Update wash with payment amount
          await supabase
            .from("washes")
            .update({
              amount_cents: amountCents,
              status: "queued",
              status_updated_at: new Date().toISOString(),
            })
            .eq("id", wash.id);

          // Look up user to send confirmation SMS
          const { data: user } = await supabase
            .from("users")
            .select("phone, name")
            .eq("id", wash.user_id)
            .maybeSingle();

          if (user?.phone) {
            await sendTemplateSMS(user.phone, "booking_confirmed", {
              name: user.name || "there",
              service: wash.service_type,
              time: wash.scheduled_for
                ? new Date(wash.scheduled_for).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "today",
            });
          }
        }

        // Notify owner via Telegram
        await notifyPayment(
          reference,
          amountCents,
          `Payment completed via Square`
        );

        break;
      }

      case "payment.updated": {
        const payment = event.data?.object?.payment;
        console.log("[webhooks/square] Payment updated:", {
          id: payment?.id,
          status: payment?.status,
        });

        // Handle failed/cancelled payments
        if (payment?.status === "FAILED" || payment?.status === "CANCELED") {
          const supabase = createServiceClient();
          const reference = payment?.note || "";
          const washId = reference.replace("URRUTIA-", "").toLowerCase();

          if (washId) {
            await supabase
              .from("washes")
              .delete()
              .eq("id", washId)
              .eq("status", "queued");
          }
        }
        break;
      }

      case "order.fulfillment.updated": {
        console.log("[webhooks/square] Order fulfillment updated:", event.data?.object);
        break;
      }

      default:
        console.log("[webhooks/square] Unhandled event:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhooks/square] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
