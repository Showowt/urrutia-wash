"use client";

// ═══════════════════════════════════════════════════════
// Admin Members — Member list with search + filters
// 10 demo members. Click row → /admin/members/[id]
// ═══════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { MembershipTier, MembershipStatus } from "@/types/database";

// ── Types ────────────────────────────────────────────────
interface DemoMember {
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
}

// ── Demo members ─────────────────────────────────────────
const DEMO_MEMBERS: DemoMember[] = [
  {
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
  },
  {
    id: "m2",
    name: "Sophia Torres",
    phone: "+1 702 555 0198",
    email: "sophia@example.com",
    tier: "SOLO",
    status: "active",
    joined: "Mar 1, 2026",
    lastWash: "Apr 28, 2026",
    washesTotal: 9,
    ltv: 543,
  },
  {
    id: "m3",
    name: "Diego Ramirez",
    phone: "+1 702 555 0210",
    email: "diego@example.com",
    tier: "FLEET",
    status: "active",
    joined: "Jan 15, 2026",
    lastWash: "Apr 27, 2026",
    washesTotal: 44,
    ltv: 4890,
  },
  {
    id: "m4",
    name: "Aaliyah Johnson",
    phone: "+1 702 555 0301",
    email: "aaliyah@example.com",
    tier: "DUO",
    status: "active",
    joined: "Jan 20, 2026",
    lastWash: "Apr 26, 2026",
    washesTotal: 31,
    ltv: 2805,
  },
  {
    id: "m5",
    name: "James Kim",
    phone: "+1 702 555 0411",
    email: "james@example.com",
    tier: "SOLO",
    status: "paused",
    joined: "Feb 28, 2026",
    lastWash: "Apr 10, 2026",
    washesTotal: 7,
    ltv: 378,
  },
  {
    id: "m6",
    name: "Maria Lopez",
    phone: "+1 702 555 0502",
    email: "maria@example.com",
    tier: "SOLO",
    status: "cancelled",
    joined: "Jan 5, 2026",
    lastWash: "Mar 28, 2026",
    washesTotal: 12,
    ltv: 624,
  },
  {
    id: "m7",
    name: "Tyler Washington",
    phone: "+1 702 555 0603",
    email: "tyler@example.com",
    tier: "DUO",
    status: "active",
    joined: "Mar 10, 2026",
    lastWash: "Apr 29, 2026",
    washesTotal: 8,
    ltv: 892,
  },
  {
    id: "m8",
    name: "Priya Patel",
    phone: "+1 702 555 0714",
    email: "priya@example.com",
    tier: "FLEET",
    status: "active",
    joined: "Feb 8, 2026",
    lastWash: "Apr 28, 2026",
    washesTotal: 38,
    ltv: 5460,
  },
  {
    id: "m9",
    name: "Connor Walsh",
    phone: "+1 702 555 0815",
    email: "connor@example.com",
    tier: "SOLO",
    status: "active",
    joined: "Apr 1, 2026",
    lastWash: "Apr 25, 2026",
    washesTotal: 4,
    ltv: 196,
  },
  {
    id: "m10",
    name: "Natalie Vega",
    phone: "+1 702 555 0916",
    email: "natalie@example.com",
    tier: "DUO",
    status: "active",
    joined: "Mar 22, 2026",
    lastWash: "Apr 23, 2026",
    washesTotal: 6,
    ltv: 714,
  },
];

// ── Sub-components ────────────────────────────────────────
function TierBadge({ tier }: { tier: MembershipTier }) {
  const config: Record<
    MembershipTier,
    { color: string; bg: string; border: string }
  > = {
    SOLO: {
      color: "#00B4FF",
      bg: "rgba(0,180,255,0.1)",
      border: "rgba(0,180,255,0.3)",
    },
    DUO: {
      color: "#6366F1",
      bg: "rgba(99,102,241,0.1)",
      border: "rgba(99,102,241,0.3)",
    },
    FLEET: {
      color: "#FF6B1A",
      bg: "rgba(255,107,26,0.1)",
      border: "rgba(255,107,26,0.3)",
    },
  };
  const c = config[tier];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
    >
      {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: MembershipStatus }) {
  const config: Record<
    MembershipStatus,
    { label: string; color: string; bg: string }
  > = {
    active: { label: "Active", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    paused: { label: "Paused", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    cancelled: {
      label: "Cancelled",
      color: "#8B95A8",
      bg: "rgba(139,149,168,0.1)",
    },
  };
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: c.color, background: c.bg }}
    >
      {status === "active" && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: c.color }}
        />
      )}
      {c.label}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function AdminMembersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<MembershipTier | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<
    MembershipStatus | "ALL"
  >("ALL");

  const filtered = useMemo(() => {
    return DEMO_MEMBERS.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.email.toLowerCase().includes(q);
      const matchTier = tierFilter === "ALL" || m.tier === tierFilter;
      const matchStatus =
        statusFilter === "ALL" || m.status === statusFilter;
      return matchSearch && matchTier && matchStatus;
    });
  }, [search, tierFilter, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "#F5F7FA" }}
          >
            Members
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
            {DEMO_MEMBERS.filter((m) => m.status === "active").length} active ·{" "}
            {DEMO_MEMBERS.length} total
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#8B95A8" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all field"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1B2236",
              color: "#F5F7FA",
            }}
            aria-label="Search members"
          />
        </div>

        {/* Tier filter */}
        <div className="flex items-center gap-1.5">
          {(["ALL", "SOLO", "DUO", "FLEET"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className="px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all"
              style={{
                background:
                  tierFilter === t
                    ? t === "ALL"
                      ? "rgba(0,180,255,0.12)"
                      : t === "SOLO"
                      ? "rgba(0,180,255,0.12)"
                      : t === "DUO"
                      ? "rgba(99,102,241,0.12)"
                      : "rgba(255,107,26,0.12)"
                    : "rgba(255,255,255,0.04)",
                border:
                  tierFilter === t
                    ? t === "ALL"
                      ? "1px solid rgba(0,180,255,0.3)"
                      : t === "SOLO"
                      ? "1px solid rgba(0,180,255,0.3)"
                      : t === "DUO"
                      ? "1px solid rgba(99,102,241,0.3)"
                      : "1px solid rgba(255,107,26,0.3)"
                    : "1px solid #1B2236",
                color:
                  tierFilter === t
                    ? t === "SOLO" || t === "ALL"
                      ? "#00B4FF"
                      : t === "DUO"
                      ? "#6366F1"
                      : "#FF6B1A"
                    : "#8B95A8",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          {(["ALL", "active", "paused", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-lg text-xs font-mono capitalize transition-all"
              style={{
                background:
                  statusFilter === s
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.03)",
                border: statusFilter === s ? "1px solid #8B95A8" : "1px solid #1B2236",
                color: statusFilter === s ? "#F5F7FA" : "#8B95A8",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #1B2236", background: "rgba(255,255,255,0.015)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" aria-label="Member list">
            <thead>
              <tr style={{ borderBottom: "1px solid #1B2236" }}>
                {[
                  "Member",
                  "Phone",
                  "Tier",
                  "Status",
                  "Joined",
                  "Last Wash",
                  "Washes",
                  "LTV",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-mono tracking-widest uppercase whitespace-nowrap"
                    style={{ color: "#8B95A8" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm"
                    style={{ color: "#8B95A8" }}
                  >
                    No members match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m, idx) => (
                  <tr
                    key={m.id}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderTop:
                        idx > 0 ? "1px solid rgba(27,34,54,0.6)" : undefined,
                    }}
                    onClick={() => router.push(`/admin/members/${m.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        router.push(`/admin/members/${m.id}`);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View profile for ${m.name}`}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        "rgba(0,180,255,0.035)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        "transparent";
                    }}
                  >
                    {/* Name + email */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#F5F7FA" }}
                      >
                        {m.name}
                      </p>
                      <p
                        className="text-xs font-mono"
                        style={{ color: "#8B95A8" }}
                      >
                        {m.email}
                      </p>
                    </td>
                    {/* Phone */}
                    <td
                      className="px-4 py-3 text-sm font-mono whitespace-nowrap"
                      style={{ color: "#8B95A8" }}
                    >
                      {m.phone}
                    </td>
                    {/* Tier */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <TierBadge tier={m.tier} />
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={m.status} />
                    </td>
                    {/* Joined */}
                    <td
                      className="px-4 py-3 text-sm whitespace-nowrap"
                      style={{ color: "#8B95A8" }}
                    >
                      {m.joined}
                    </td>
                    {/* Last wash */}
                    <td
                      className="px-4 py-3 text-sm whitespace-nowrap"
                      style={{ color: "#8B95A8" }}
                    >
                      {m.lastWash}
                    </td>
                    {/* Washes total */}
                    <td
                      className="px-4 py-3 text-sm font-mono whitespace-nowrap text-right"
                      style={{ color: "#F5F7FA" }}
                    >
                      {m.washesTotal}
                    </td>
                    {/* LTV */}
                    <td
                      className="px-4 py-3 text-sm font-bold whitespace-nowrap text-right"
                      style={{ color: "#00B4FF" }}
                    >
                      ${m.ltv.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer row */}
        <div
          className="px-4 py-3 border-t flex items-center justify-between"
          style={{ borderColor: "#1B2236" }}
        >
          <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
            Showing {filtered.length} of {DEMO_MEMBERS.length} members
          </p>
          <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
            Total LTV:{" "}
            <span style={{ color: "#F5F7FA" }}>
              ${filtered.reduce((s, m) => s + m.ltv, 0).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
