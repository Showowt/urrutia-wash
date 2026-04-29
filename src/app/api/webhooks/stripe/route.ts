// ═══════════════════════════════════════════════════════
// URRUTIA — POST /api/webhooks/stripe
// Handles Stripe webhook events for subscriptions and
// invoice payments. Stripe v22 compatible:
// - Response<T> = T & { lastResponse }  (access fields directly)
// - Subscription.current_period_end is on items.data[0]
// - Invoice.parent.subscription_details.subscription (not invoice.subscription)
// ═══════════════════════════════════════════════════════

import { getStripe } from "@/lib/stripe/config";
import { MEMBERSHIP_PRICES } from "@/lib/stripe/config";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTemplateSMS } from "@/lib/twilio/sms";
import type { MembershipTier } from "@/types/database";
import type Stripe from "stripe";

// Required so Next.js does not parse the body before Stripe signature check
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Subscription metadata must carry { tier: 'SOLO' | 'DUO' | 'FLEET' }
function tierFromMetadata(meta: Stripe.Metadata): MembershipTier | null {
  const t = meta["tier"] as MembershipTier | undefined;
  if (t === "SOLO" || t === "DUO" || t === "FLEET") return t;
  return null;
}

function washesAllowedForTier(tier: MembershipTier): number | null {
  const config = MEMBERSHIP_PRICES[tier];
  return config.washes === -1 ? null : config.washes;
}

// In Stripe v22, current_period_end lives on SubscriptionItem, not Subscription
function getPeriodEnd(subscription: Stripe.Subscription): string | null {
  const item = subscription.items?.data?.[0];
  if (!item) return null;
  return new Date(item.current_period_end * 1000).toISOString();
}

// In Stripe v22, Invoice.parent holds subscription details
function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent;
  if (!parent || parent.type !== "subscription_details") return null;
  const sub = parent.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

export async function POST(request: Request) {
  try {
    // ── 1. Verify webhook signature ────────────────────
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return Response.json(
        { data: null, error: "Missing signature", message: "stripe-signature header required" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = await getStripe().webhooks.constructEventAsync(rawBody, signature, WEBHOOK_SECRET);
    } catch (sigError) {
      console.error("[POST /api/webhooks/stripe] signature verification failed", sigError);
      return Response.json(
        { data: null, error: "Invalid signature", message: "Webhook signature invalid" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // ── 2. Route by event type ─────────────────────────
    switch (event.type) {

      // ─ Checkout completed → new subscription created ─
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const subscriptionId = typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;

        if (!subscriptionId) {
          console.error("[stripe webhook] checkout.session.completed missing subscription id");
          break;
        }

        const customerEmail = session.customer_details?.email ?? null;
        const customerPhone = session.customer_details?.phone ?? null;

        // Retrieve subscription to get tier from metadata + period end
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const tier = tierFromMetadata(subscription.metadata);
        const periodEnd = getPeriodEnd(subscription);

        if (!tier) {
          console.error("[stripe webhook] no tier in subscription metadata", subscriptionId);
          break;
        }

        // Find user by email or phone
        let userId: string | null = null;

        if (customerEmail) {
          const { data: userByEmail } = await supabase
            .from("users")
            .select("id")
            .eq("email", customerEmail)
            .maybeSingle();
          userId = userByEmail?.id ?? null;
        }

        if (!userId && customerPhone) {
          const digits = customerPhone.replace(/\D/g, "");
          const { data: userByPhone } = await supabase
            .from("users")
            .select("id")
            .ilike("phone", `%${digits.slice(-10)}`)
            .maybeSingle();
          userId = userByPhone?.id ?? null;
        }

        if (!userId) {
          console.error("[stripe webhook] no matching user for checkout", {
            customerEmail,
            customerPhone,
          });
          break;
        }

        // Upsert membership record
        const { error: membershipError } = await supabase
          .from("memberships")
          .upsert(
            {
              user_id: userId,
              stripe_subscription_id: subscriptionId,
              tier,
              status: "active",
              current_period_end: periodEnd,
              washes_used_this_cycle: 0,
              washes_allowed_this_cycle: washesAllowedForTier(tier),
            },
            { onConflict: "stripe_subscription_id" }
          );

        if (membershipError) {
          console.error("[stripe webhook] membership upsert error", membershipError);
          break;
        }

        // Update user membership_tier
        await supabase
          .from("users")
          .update({
            membership_tier: tier,
            membership_started_at: new Date().toISOString(),
            membership_renews_at: periodEnd,
          })
          .eq("id", userId);

        break;
      }

      // ─ Invoice paid → reset cycle, send renewal SMS ──
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getSubscriptionIdFromInvoice(invoice);
        if (!subscriptionId) break;

        // Retrieve current membership with user data
        const { data: membership, error: membershipFetchError } = await supabase
          .from("memberships")
          .select("id, tier, user_id")
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();

        if (membershipFetchError || !membership) {
          console.error("[stripe webhook] membership not found for invoice.paid", subscriptionId);
          break;
        }

        // Get new period end from subscription items
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const newPeriodEnd = getPeriodEnd(subscription);

        // Reset washes_used_this_cycle for the new billing cycle
        const { error: resetError } = await supabase
          .from("memberships")
          .update({
            washes_used_this_cycle: 0,
            status: "active",
            current_period_end: newPeriodEnd,
          })
          .eq("stripe_subscription_id", subscriptionId);

        if (resetError) {
          console.error("[stripe webhook] invoice.paid membership reset error", resetError);
          break;
        }

        // Sync user renews_at
        await supabase
          .from("users")
          .update({ membership_renews_at: newPeriodEnd })
          .eq("id", membership.user_id);

        // Fetch user phone for SMS
        const { data: user } = await supabase
          .from("users")
          .select("phone")
          .eq("id", membership.user_id)
          .single();

        if (user) {
          const amountDollars = Math.round(invoice.amount_paid / 100);
          const { sid: smsSid, error: smsError } = await sendTemplateSMS(
            user.phone,
            "member_renewal",
            { tier: membership.tier, amount: amountDollars }
          );

          if (smsError) {
            console.error("[stripe webhook] member_renewal SMS failed", smsError);
          }

          if (smsSid) {
            await supabase.from("sms_log").insert({
              user_id: membership.user_id,
              wash_id: null,
              template: "member_renewal",
              body: `URRUTIA: Your ${membership.tier} membership renewed - $${amountDollars}. New cycle washes available.`,
              twilio_sid: smsSid,
            });
          }
        }

        break;
      }

      // ─ Subscription updated (tier change, pause) ─────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        const tier = tierFromMetadata(subscription.metadata);
        const periodEnd = getPeriodEnd(subscription);

        const stripeStatus = subscription.status;
        const status =
          stripeStatus === "active"
            ? "active" as const
            : stripeStatus === "paused"
              ? "paused" as const
              : "cancelled" as const;

        const { data: membership } = await supabase
          .from("memberships")
          .select("user_id")
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();

        if (!membership) {
          console.error("[stripe webhook] subscription.updated — no matching membership", subscriptionId);
          break;
        }

        await supabase
          .from("memberships")
          .update({
            status,
            ...(tier ? { tier, washes_allowed_this_cycle: washesAllowedForTier(tier) } : {}),
            current_period_end: periodEnd,
          })
          .eq("stripe_subscription_id", subscriptionId);

        // Sync tier on user row if it changed
        if (tier) {
          await supabase
            .from("users")
            .update({
              membership_tier: tier,
              membership_renews_at: periodEnd,
            })
            .eq("id", membership.user_id);
        }

        break;
      }

      // ─ Subscription cancelled ────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        const { data: membership } = await supabase
          .from("memberships")
          .select("user_id")
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();

        if (!membership) {
          console.error("[stripe webhook] subscription.deleted — no matching membership", subscriptionId);
          break;
        }

        await supabase
          .from("memberships")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscriptionId);

        // Clear membership_tier from user
        await supabase
          .from("users")
          .update({
            membership_tier: null,
            membership_started_at: null,
            membership_renews_at: null,
          })
          .eq("id", membership.user_id);

        break;
      }

      default:
        // Unhandled event — acknowledge without processing
        break;
    }

    // ── 3. Always return 200 to acknowledge receipt ────
    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/webhooks/stripe]", error);
    return Response.json(
      { data: null, error: "Internal server error", message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
