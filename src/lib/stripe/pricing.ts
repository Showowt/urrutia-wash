// ═══ Client-safe pricing constants ═══
// No secrets — safe to import in client components

export const MEMBERSHIP_PRICES = {
  SOLO: {
    monthly: 8900,
    annual: 76 * 12 * 100,
    washes: 4,
    cars: 1,
    detailDiscount: 0.15,
  },
  DUO: {
    monthly: 14900,
    annual: 127 * 12 * 100,
    washes: 8,
    cars: 2,
    detailDiscount: 0.2,
  },
  FLEET: {
    monthly: 27900,
    annual: 237 * 12 * 100,
    washes: -1,
    cars: 4,
    detailDiscount: 0.3,
  },
} as const;

export const SERVICE_PRICES = {
  express: 3500,
  classic: 7500,
  detail: 29500,
  ceramic: 89500,
} as const;
