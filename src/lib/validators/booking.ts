import { z } from "zod";

export const bookingSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100)
    .regex(/^[\p{L}\p{M}'\- ]+$/u, "Invalid name"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Invalid phone format"),
  email: z.string().email().max(254).optional(),
  vehicle: z
    .string()
    .max(60)
    .regex(/^[\w\s\-,.()]+$/, "Invalid vehicle description")
    .optional(),
  plate: z
    .string()
    .max(10)
    .regex(/^[A-Z0-9\- ]+$/i, "Invalid plate")
    .optional(),
  service_type: z.enum(["express", "classic", "detail", "ceramic"]),
  location: z.enum(["lvac", "mobile"]),
  mobile_address: z.string().max(500).optional(),
  scheduled_for: z.string().datetime({ offset: true }).optional(),
  referral_code: z.string().max(20).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const statusUpdateSchema = z.object({
  wash_id: z.string().uuid(),
  status: z.enum([
    "queued",
    "started",
    "washing",
    "detailing",
    "finishing",
    "ready",
    "complete",
  ]),
});

export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;

export const referralSchema = z.object({
  referrer_code: z.string().min(1).max(20),
  referee_phone: z
    .string()
    .min(10)
    .max(20)
    .regex(/^[+\d\s()-]+$/),
});

export type ReferralInput = z.infer<typeof referralSchema>;
