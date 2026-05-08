// ═══ Pricing constants — safe for client + server ═══

export type VehicleSize = 'small' | 'medium' | 'large';
export type WashScope = 'exterior' | 'full';
export type ServiceId =
  | 'small_exterior'
  | 'small_full'
  | 'medium_exterior'
  | 'medium_full'
  | 'large_exterior'
  | 'large_full'
  | 'detail';
export type WeeklyPlanId =
  | 'weekly_small_exterior'
  | 'weekly_small_full'
  | 'weekly_medium_exterior'
  | 'weekly_medium_full'
  | 'weekly_large_exterior'
  | 'weekly_large_full';

export interface AddOn {
  id: string;
  label: string;
  priceCents: number;
  priceRange?: string; // e.g. "$55–$75" for variable pricing
}

export interface ServiceConfig {
  id: ServiceId;
  label: string;
  priceCents: number;
  size?: VehicleSize;
  scope?: WashScope;
}

export interface WeeklyPlanConfig {
  id: WeeklyPlanId;
  label: string;
  monthlyCents: number;
  washesPerMonth: number;
  size: VehicleSize;
  scope: WashScope;
}

// ── Single Wash Services ─────────────────────────────────────
export const SERVICES: Record<ServiceId, ServiceConfig> = {
  small_exterior: {
    id: 'small_exterior',
    label: 'Small — Exterior Only',
    priceCents: 3500,
    size: 'small',
    scope: 'exterior',
  },
  small_full: {
    id: 'small_full',
    label: 'Small — Interior + Exterior',
    priceCents: 5500,
    size: 'small',
    scope: 'full',
  },
  medium_exterior: {
    id: 'medium_exterior',
    label: 'Medium — Exterior Only',
    priceCents: 4000,
    size: 'medium',
    scope: 'exterior',
  },
  medium_full: {
    id: 'medium_full',
    label: 'Medium — Interior + Exterior',
    priceCents: 6500,
    size: 'medium',
    scope: 'full',
  },
  large_exterior: {
    id: 'large_exterior',
    label: 'Large — Exterior Only',
    priceCents: 4500,
    size: 'large',
    scope: 'exterior',
  },
  large_full: {
    id: 'large_full',
    label: 'Large — Interior + Exterior',
    priceCents: 7500,
    size: 'large',
    scope: 'full',
  },
  detail: {
    id: 'detail',
    label: 'Full Detail',
    priceCents: 29500,
  },
};

// ── Universal Add-Ons (apply to any wash) ────────────────────
export const ADD_ONS: AddOn[] = [
  { id: 'deep_wheel', label: 'Deep wheel clean', priceCents: 1500 },
  { id: 'spray_wax', label: 'Spray wax', priceCents: 2500 },
  { id: 'hand_wax', label: 'Hand wax', priceCents: 5500, priceRange: '$55–$75' },
  { id: 'leather', label: 'Leather conditioner', priceCents: 2500, priceRange: '$25–$35' },
  { id: 'engine_bay', label: 'Engine bay', priceCents: 4500, priceRange: '$45–$55' },
  { id: 'shampoo', label: 'Shampoo', priceCents: 6500, priceRange: 'starting at $65' },
  { id: 'headlight', label: 'Headlight restoration', priceCents: 10000, priceRange: '$100/set' },
];

// ── Weekly Plans (paid on 1st of month, 4 washes/mo) ─────────
export const WEEKLY_PLANS: Record<WeeklyPlanId, WeeklyPlanConfig> = {
  weekly_small_exterior: {
    id: 'weekly_small_exterior',
    label: 'Weekly — Small Exterior',
    monthlyCents: 12000,
    washesPerMonth: 4,
    size: 'small',
    scope: 'exterior',
  },
  weekly_small_full: {
    id: 'weekly_small_full',
    label: 'Weekly — Small Interior + Exterior',
    monthlyCents: 18000,
    washesPerMonth: 4,
    size: 'small',
    scope: 'full',
  },
  weekly_medium_exterior: {
    id: 'weekly_medium_exterior',
    label: 'Weekly — Medium Exterior',
    monthlyCents: 13000,
    washesPerMonth: 4,
    size: 'medium',
    scope: 'exterior',
  },
  weekly_medium_full: {
    id: 'weekly_medium_full',
    label: 'Weekly — Medium Interior + Exterior',
    monthlyCents: 22000,
    washesPerMonth: 4,
    size: 'medium',
    scope: 'full',
  },
  weekly_large_exterior: {
    id: 'weekly_large_exterior',
    label: 'Weekly — Large Exterior',
    monthlyCents: 15000,
    washesPerMonth: 4,
    size: 'large',
    scope: 'exterior',
  },
  weekly_large_full: {
    id: 'weekly_large_full',
    label: 'Weekly — Large Interior + Exterior',
    monthlyCents: 25000,
    washesPerMonth: 4,
    size: 'large',
    scope: 'full',
  },
};

// Keep legacy type alias for backward compat in checkout
export type MembershipId = WeeklyPlanId;
export const MEMBERSHIPS = WEEKLY_PLANS;

export function calculateTotal(serviceId: ServiceId, addOnIds: string[]): number {
  const service = SERVICES[serviceId];
  const base = service.priceCents;
  const addOnTotal = addOnIds.reduce((sum, id) => {
    const addOn = ADD_ONS.find((a) => a.id === id);
    return sum + (addOn?.priceCents ?? 0);
  }, 0);
  return base + addOnTotal;
}
