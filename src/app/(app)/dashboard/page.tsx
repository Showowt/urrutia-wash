// ═══════════════════════════════════════════════════════
// Dashboard — Home view
// Greeting · active wash card · quick actions
// Membership card preview · vehicle garage
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import PunchCard from "@/components/app/PunchCard";
import {
  DEMO_USER,
  DEMO_VEHICLES,
  DEMO_ACTIVE_WASH,
  STATUS_FLOW,
} from "@/lib/demo-data";

const TIER_COLORS: Record<string, string> = {
  SOLO: "#00B4FF",
  DUO: "#00B4FF",
  FLEET: "#FF6B1A",
};

export default function DashboardPage() {
  const user = DEMO_USER;
  const vehicles = DEMO_VEHICLES;
  const activeWash = DEMO_ACTIVE_WASH;

  const tierColor = TIER_COLORS[user.tier] ?? "#8B95A8";
  const dateStr = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  const memberSinceStr = new Date(user.memberSince)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();

  const washInProgress =
    activeWash && activeWash.statusIndex < STATUS_FLOW.length - 1;

  return (
    <div className="space-y-5">
      {/* ── Greeting ── */}
      <div>
        <p
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "#8B95A8" }}
        >
          {dateStr}
        </p>
        <h2 className="text-3xl font-bold mt-1">
          Hey, {user.name.split(" ")[0]}.
        </h2>
        <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
          Ready when you are.
        </p>
      </div>

      {/* ── Active wash card ── */}
      {washInProgress && (
        <Link
          href="/track"
          className="block w-full text-left rounded-2xl p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,180,255,0.02))",
            border: "1px solid rgba(0,180,255,0.4)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="font-mono text-[10px] tracking-widest"
              style={{ color: "#00B4FF" }}
            >
              WASH IN PROGRESS
            </span>
            <span className="font-mono text-xs flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#00B4FF" }}
              />
              LIVE
            </span>
          </div>
          <p className="text-lg font-bold">
            {STATUS_FLOW[activeWash.statusIndex].label}
          </p>
          <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
            {activeWash.service} · {activeWash.vehicle}
          </p>
          <p
            className="text-xs mt-3 font-mono"
            style={{ color: "#00B4FF" }}
          >
            ~{activeWash.eta} min remaining →
          </p>
        </Link>
      )}

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Book a wash */}
        <Link
          href="/book"
          className="rounded-2xl p-4 text-left"
          style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
        >
          <div
            className="w-9 h-9 rounded-lg grid place-items-center mb-3"
            style={{ background: "rgba(255,107,26,0.1)", color: "#FF6B1A" }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <p className="text-sm font-semibold">Book a wash</p>
          <p className="text-xs mt-0.5" style={{ color: "#8B95A8" }}>
            LVAC or mobile
          </p>
        </Link>

        {/* Live status */}
        <Link
          href="/track"
          className="rounded-2xl p-4 text-left"
          style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
        >
          <div
            className="w-9 h-9 rounded-lg grid place-items-center mb-3"
            style={{ background: "rgba(0,180,255,0.1)", color: "#00B4FF" }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <p className="text-sm font-semibold">Live status</p>
          <p className="text-xs mt-0.5" style={{ color: "#8B95A8" }}>
            Track current wash
          </p>
        </Link>
      </div>

      {/* ── Membership card preview ── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #11172A, #0B0F1A)",
          border: "1px solid #1B2236",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: tierColor }}
          >
            URRUTIA CLUB · {user.tier}
          </span>
          <span
            className="font-mono text-[10px]"
            style={{ color: "#8B95A8" }}
          >
            SINCE {memberSinceStr}
          </span>
        </div>
        <PunchCard count={user.punchCount} />
        <Link
          href="/member"
          className="mt-4 block text-xs font-mono tracking-widest"
          style={{ color: "#00B4FF" }}
        >
          VIEW MEMBERSHIP →
        </Link>
      </div>

      {/* ── Vehicle garage ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p
            className="font-mono text-[10px] tracking-widest"
            style={{ color: "#8B95A8" }}
          >
            YOUR GARAGE
          </p>
          <button
            className="text-xs font-mono"
            style={{ color: "#00B4FF" }}
          >
            + Add
          </button>
        </div>

        <div className="space-y-2">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
            >
              <div
                className="w-10 h-10 rounded-lg grid place-items-center"
                style={{ background: "#11172A" }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00B4FF"
                  strokeWidth="2"
                >
                  <path d="M3 13l2-5h14l2 5M5 13v5a1 1 0 001 1h2a1 1 0 001-1v-2h6v2a1 1 0 001 1h2a1 1 0 001-1v-5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {v.year} {v.make} {v.model}
                </p>
                <p
                  className="text-xs truncate font-mono"
                  style={{ color: "#8B95A8" }}
                >
                  {v.color} · {v.plate}
                </p>
              </div>
              {v.primary && (
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: "rgba(0,180,255,0.15)",
                    color: "#00B4FF",
                  }}
                >
                  PRIMARY
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
