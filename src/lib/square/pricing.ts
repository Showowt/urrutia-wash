// ═══ Pricing constants — safe for client + server ═══

export type ServiceId = 'express' | 'classic' | 'detail' | 'ceramic';
export type MembershipId = 'solo' | 'duo' | 'fleet';

export interface AddOn {
  id: string;
  label: string;
  priceCents: number;
}

export interface ServiceConfig {
  id: ServiceId;
  label: string;
  priceCents: number;
  addOns: AddOn[];
}

export interface MembershipConfig {
  id: MembershipId;
  label: string;
  monthlyCents: number;
  annualMonthlyCents: number;
}

export const SERVICES: Record<ServiceId, ServiceConfig> = {
  express: {
    id: 'express',
    label: 'Express Hand Wash',
    priceCents: 3500,
    addOns: [
      { id: 'vacuum', label: 'Interior vacuum', priceCents: 1500 },
      { id: 'tire_shine', label: 'Tire shine upgrade', priceCents: 1000 },
      { id: 'ceramic_spray', label: 'Ceramic spray sealant', priceCents: 2500 },
    ],
  },
  classic: {
    id: 'classic',
    label: 'Wash + Interior',
    priceCents: 7500,
    addOns: [
      { id: 'leather', label: 'Leather conditioning', priceCents: 3000 },
      { id: 'pet_hair', label: 'Pet hair removal', priceCents: 2500 },
      { id: 'odor', label: 'Odor elimination', priceCents: 2000 },
    ],
  },
  detail: {
    id: 'detail',
    label: 'Full Detail',
    priceCents: 29500,
    addOns: [
      { id: 'paint_correction', label: 'Two-stage paint correction', priceCents: 15000 },
      { id: 'ceramic_topper', label: 'Ceramic spray topper', priceCents: 7500 },
      { id: 'pet_hair', label: 'Pet hair removal', priceCents: 3500 },
      { id: 'ozone', label: 'Ozone odor elimination', priceCents: 5000 },
    ],
  },
  ceramic: {
    id: 'ceramic',
    label: 'Ceramic Coating',
    priceCents: 89500,
    addOns: [
      { id: 'fabric_coating', label: 'Interior fabric coating', priceCents: 15000 },
      { id: 'graphene', label: 'Graphene top coat upgrade', priceCents: 20000 },
    ],
  },
};

export const MEMBERSHIPS: Record<MembershipId, MembershipConfig> = {
  solo: {
    id: 'solo',
    label: 'SOLO Membership',
    monthlyCents: 8900,
    annualMonthlyCents: 7600,
  },
  duo: {
    id: 'duo',
    label: 'DUO Membership',
    monthlyCents: 14900,
    annualMonthlyCents: 12700,
  },
  fleet: {
    id: 'fleet',
    label: 'FLEET Membership',
    monthlyCents: 27900,
    annualMonthlyCents: 23700,
  },
};

export function calculateTotal(serviceId: ServiceId, addOnIds: string[]): number {
  const service = SERVICES[serviceId];
  const base = service.priceCents;
  const addOnTotal = addOnIds.reduce((sum, id) => {
    const addOn = service.addOns.find((a) => a.id === id);
    return sum + (addOn?.priceCents ?? 0);
  }, 0);
  return base + addOnTotal;
}
