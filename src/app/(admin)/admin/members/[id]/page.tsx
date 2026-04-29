// ═══════════════════════════════════════════════════════
// Admin Member Detail — Full profile for one member
// Shows: profile, vehicles, wash history, LTV, referrals
// Actions: comp wash, issue credit, change tier
// Server Component — data fetching ready.
// ═══════════════════════════════════════════════════════

import type { Metadata } from "next";
import Link from "next/link";
import type { MembershipTier, MembershipStatus } from "@/types/database";

// ── Demo data builder (in production: fetch from Supabase) ─
interface MemberDetail {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: MembershipTier;
  status: MembershipStatus;
  joined: string;
  lastWash: string;
  washesTotal: number;
  ltv: number;
  referralCode: string;
  referralsMade: number;
  creditsBalance: number;
  vehicles: {
    id: string;
    year: number;
    make: string;
    model: string;
    color: string;
    plate: string;
    isPrimary: boolean;
  }[];
  history: {
    id: string;
    date: string;
    service: string;
    vehicle: string;
    amount: number;
    status: "complete" | "cancelled";
  }[];
}

function getDemoMember(id: string): MemberDetail {
  // Return the same rich demo member regardless of ID for prototype
  void id;
  return {
    id: "m1",
    name: "Marcus Reed",
    phone: "+1 702 555 0142",
    email: "marcus@example.com",
    tier: "DUO",
    status: "active",
    joined: "Feb 12, 2026",
    lastWash: "Apr 22, 2026",
    washesTotal: 18,
    ltv: 1342,
    referralCode: "MARCUS-X1A2",
    referralsMade: 3,
    creditsBalance: 75,
    vehicles: [
      {
        id: "v1",
        year: 2023,
        make: "Ford",
        model: "Raptor",
        color: "Lead Foot Gray",
        plate: "NV 8H4-LX9",
        isPrimary: true,
      },
      {
        id: "v2",
        year: 2021,
        make: "BMW",
        model: "M340i",
        color: "Tanzanite Blue",
        plate: "NV B12-MMX",
        isPrimary: false,
      },
    ],
    history: [
      {
        id: "w1",
        date: "Apr 22, 2026",
        service: "Wash + Interior",
        vehicle: "Raptor",
        amount: 75,
        status: "complete",
      },
      {
        id: "w2",
        date: "Apr 15, 2026",
        service: "Express Hand Wash",
        vehicle: "M340i",
        amount: 35,
        status: "complete",
      },
      {
        id: "w3",
        date: "Apr 8, 2026",
        service: "Express Hand Wash",
        vehicle: "Raptor",
        amount: 35,
        status: "complete",
      },
      {
        id: "w4",
        date: "Apr 1, 2026",
        service: "Full Detail",
        vehicle: "Raptor",
        amount: 295,
        status: "complete",
      },
      {
        id: "w5",
        date: "Mar 24, 2026",
        service: "Wash + Interior",
        vehicle: "M340i",
        amount: 75,
        status: "complete",
      },
      {
        id: "w6",
        date: "Mar 17, 2026",
        service: "Express Hand Wash",
        vehicle: "Raptor",
        amount: 35,
        status: "complete",
      },
    ],
  };
}

// ── Helpers ──────────────────────────────────────────────
function TierBadge({ tier }: { tier: MembershipTier }) {
  const config: Record<MembershipTier, { color: string; bg: string; border: string }> = {
    SOLO: { color: "#00B4FF", bg: "rgba(0,180,255,0.1)", border: "rgba(0,180,255,0.3)" },
    DUO: { color: "#6366F1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.3)" },
    FLEET: { color: "#FF6B1A", bg: "rgba(255,107,26,0.1)", border: "rgba(255,107,26,0.3)" },
  };
  const c = config[tier];
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-mono font-bold"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
    >
      {tier}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid #1B2236",
      }}
    >
      <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: "#8B95A8" }}>
        {label}
      </p>
      <p className="text-2xl font-black" style={{ color: accent ?? "#F5F7FA" }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: "#8B95A8" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function ActionButton({
  label,
  color,
  icon,
}: {
  label: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color: color,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = getDemoMember(id);
  return { title: `${member.name} — URRUTIA Admin` };
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = getDemoMember(id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: "#8B95A8" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All Members
      </Link>

      {/* Profile header */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid #1B2236",
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center flex-shrink-0 text-lg font-black"
              style={{
                background: "rgba(0,180,255,0.12)",
                border: "1px solid rgba(0,180,255,0.25)",
                color: "#00B4FF",
              }}
            >
              {member.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-black" style={{ color: "#F5F7FA" }}>
                {member.name}
              </h1>
              <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                {member.phone}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "#8B95A8" }}>
                {member.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <TierBadge tier={member.tier} />
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs"
                  style={{
                    color: "#10B981",
                    background: "rgba(16,185,129,0.1)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {member.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
              Member since
            </p>
            <p className="text-sm font-bold" style={{ color: "#F5F7FA" }}>
              {member.joined}
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: "#8B95A8" }}>
              Last wash: {member.lastWash}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Lifetime Value"
          value={`$${member.ltv.toLocaleString()}`}
          sub="total spent"
          accent="#00B4FF"
        />
        <StatCard
          label="Total Washes"
          value={String(member.washesTotal)}
          sub="all time"
        />
        <StatCard
          label="Referrals"
          value={String(member.referralsMade)}
          sub={`code: ${member.referralCode}`}
          accent="#6366F1"
        />
        <StatCard
          label="Credits Balance"
          value={`$${member.creditsBalance}`}
          sub="available"
          accent="#FF6B1A"
        />
      </div>

      {/* Actions */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #1B2236",
        }}
      >
        <p
          className="text-xs font-mono tracking-widest uppercase mb-4"
          style={{ color: "#8B95A8" }}
        >
          Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            label="Comp Wash"
            color="#10B981"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            }
          />
          <ActionButton
            label="Issue Credit"
            color="#00B4FF"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            }
          />
          <ActionButton
            label="Change Tier"
            color="#6366F1"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polyline points="17 11 21 7 17 3" />
                <path d="M21 7H9M7 21l-4-4 4-4M3 17h12" />
              </svg>
            }
          />
          <ActionButton
            label="Send SMS"
            color="#F59E0B"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Vehicles */}
      <section aria-labelledby="vehicles-heading">
        <h2
          id="vehicles-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Vehicles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {member.vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: v.isPrimary
                  ? "1px solid rgba(0,180,255,0.3)"
                  : "1px solid #1B2236",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
                style={{ background: "rgba(0,180,255,0.08)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="w-5 h-5"
                  style={{ color: "#00B4FF" }}
                >
                  <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2" />
                  <circle cx="9" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold" style={{ color: "#F5F7FA" }}>
                  {v.year} {v.make} {v.model}
                </p>
                <p className="text-xs font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                  {v.plate} · {v.color}
                </p>
              </div>
              {v.isPrimary && (
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    color: "#00B4FF",
                    background: "rgba(0,180,255,0.1)",
                  }}
                >
                  PRIMARY
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Wash history */}
      <section aria-labelledby="history-heading">
        <h2
          id="history-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Wash History
        </h2>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid #1B2236", background: "rgba(255,255,255,0.015)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr style={{ borderBottom: "1px solid #1B2236" }}>
                  {["Date", "Service", "Vehicle", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-mono tracking-widest uppercase"
                      style={{ color: "#8B95A8" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {member.history.map((wash, idx) => (
                  <tr
                    key={wash.id}
                    style={{
                      borderTop: idx > 0 ? "1px solid rgba(27,34,54,0.5)" : undefined,
                    }}
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#8B95A8" }}>
                      {wash.date}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#F5F7FA" }}>
                      {wash.service}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#8B95A8" }}>
                      {wash.vehicle}
                    </td>
                    <td
                      className="px-4 py-3 text-sm font-bold whitespace-nowrap"
                      style={{ color: "#00B4FF" }}
                    >
                      ${wash.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                        style={{
                          color: wash.status === "complete" ? "#10B981" : "#8B95A8",
                          background:
                            wash.status === "complete"
                              ? "rgba(16,185,129,0.1)"
                              : "rgba(139,149,168,0.1)",
                        }}
                      >
                        {wash.status === "complete" ? "Complete" : "Cancelled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
