import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("[Stripe] STRIPE_SECRET_KEY is required");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

// Re-export pricing constants for server-side use
// For client components, import from "@/lib/stripe/pricing" instead
export { MEMBERSHIP_PRICES, SERVICE_PRICES } from "./pricing";
