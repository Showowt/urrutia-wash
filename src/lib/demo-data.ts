// ═══════════════════════════════════════════════════════
// URRUTIA — Demo Data
// Hardcoded for prototype. Wire to Supabase in production.
// ═══════════════════════════════════════════════════════

import type { WashStatus } from "@/types/database";

export const DEMO_USER = {
  name: "Marcus Reed",
  phone: "+1 702 555 0142",
  memberSince: "2026-02-12",
  tier: "DUO" as const,
  punchCount: 6,
  referralCode: "MARCUS-X1A2",
  referralsClosed: 3,
  referralCredits: 75,
} satisfies {
  name: string;
  phone: string;
  memberSince: string;
  tier: "SOLO" | "DUO" | "FLEET";
  punchCount: number;
  referralCode: string;
  referralsClosed: number;
  referralCredits: number;
};

export const DEMO_VEHICLES = [
  {
    id: "v1",
    year: 2023,
    make: "Ford",
    model: "Raptor",
    color: "Lead Foot Gray",
    plate: "NV·8H4-LX9",
    primary: true,
  },
  {
    id: "v2",
    year: 2021,
    make: "BMW",
    model: "M340i",
    color: "Tanzanite Blue",
    plate: "NV·B12-MMX",
    primary: false,
  },
] as const;

export type DemoVehicle = (typeof DEMO_VEHICLES)[number] & { primary: boolean };

export const DEMO_HISTORY = [
  {
    id: "w1",
    date: "2026-04-22",
    service: "Wash + Interior",
    vehicle: "Raptor",
    amount: 75,
    status: "complete" as const,
  },
  {
    id: "w2",
    date: "2026-04-15",
    service: "Express Hand Wash",
    vehicle: "M340i",
    amount: 35,
    status: "complete" as const,
  },
  {
    id: "w3",
    date: "2026-04-08",
    service: "Express Hand Wash",
    vehicle: "Raptor",
    amount: 35,
    status: "complete" as const,
  },
  {
    id: "w4",
    date: "2026-04-01",
    service: "Full Detail",
    vehicle: "Raptor",
    amount: 295,
    status: "complete" as const,
  },
];

export const SERVICES = [
  {
    id: "small_exterior" as const,
    name: "Small — Exterior Only",
    duration: 30,
    price: 35,
    desc: "Hand wash, dry, wheels, tires, windows",
  },
  {
    id: "small_full" as const,
    name: "Small — Interior + Exterior",
    duration: 45,
    price: 55,
    desc: "Full hand wash + vacuum, dash, door jambs",
  },
  {
    id: "medium_exterior" as const,
    name: "Medium — Exterior Only",
    duration: 35,
    price: 40,
    desc: "Hand wash, dry, wheels, tires, windows",
  },
  {
    id: "medium_full" as const,
    name: "Medium — Interior + Exterior",
    duration: 50,
    price: 65,
    desc: "Full hand wash + vacuum, dash, door jambs",
  },
  {
    id: "large_exterior" as const,
    name: "Large — Exterior Only",
    duration: 40,
    price: 45,
    desc: "Hand wash, dry, wheels, tires, windows",
  },
  {
    id: "large_full" as const,
    name: "Large — Interior + Exterior",
    duration: 60,
    price: 75,
    desc: "Full hand wash + vacuum, dash, door jambs",
  },
  {
    id: "detail" as const,
    name: "Full Detail",
    duration: 180,
    price: 295,
    desc: "Clay bar, hand wax, deep interior, leather",
  },
];

export type ServiceId = (typeof SERVICES)[number]["id"];

export const STATUS_FLOW: Array<{
  key: WashStatus;
  label: string;
  desc: string;
}> = [
  {
    key: "queued",
    label: "In Queue",
    desc: "Your detailer will start shortly",
  },
  {
    key: "started",
    label: "Wash Started",
    desc: "Pre-rinse + foam soak",
  },
  {
    key: "washing",
    label: "Hand Washing",
    desc: "Two-bucket method · soft mitt",
  },
  {
    key: "detailing",
    label: "Detail Work",
    desc: "Wheels · windows · interior",
  },
  {
    key: "finishing",
    label: "Final Touches",
    desc: "Tire shine · dressings · inspection",
  },
  {
    key: "ready",
    label: "Ready",
    desc: "Walk out and drive home clean",
  },
];

export interface ActiveWash {
  id: string;
  service: string;
  vehicle: string;
  statusIndex: number;
  eta: number;
  location: string;
}

export const DEMO_ACTIVE_WASH: ActiveWash = {
  id: "wASH-NOW",
  service: "Wash + Interior",
  vehicle: "Raptor",
  statusIndex: 1,
  eta: 22,
  location: "LVAC Henderson",
};

export const TIME_SLOTS = [
  "Tomorrow · 7:30 AM",
  "Tomorrow · 8:30 AM",
  "Tomorrow · 10:00 AM",
  "Tomorrow · 11:30 AM",
  "Tomorrow · 1:00 PM",
  "Tomorrow · 2:30 PM",
] as const;
