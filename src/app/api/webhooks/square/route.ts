import { NextRequest, NextResponse } from "next/server";
import { verifySquareWebhook } from "@/lib/square/config";

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
        console.log("[webhooks/square] Payment completed:", {
          id: payment?.id,
          amount: payment?.amount_money?.amount,
          reference: payment?.note,
          status: payment?.status,
        });
        // Future: update booking status in Supabase, send SMS confirmation
        break;
      }

      case "payment.updated": {
        const payment = event.data?.object?.payment;
        console.log("[webhooks/square] Payment updated:", {
          id: payment?.id,
          status: payment?.status,
        });
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
