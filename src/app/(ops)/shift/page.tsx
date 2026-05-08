"use client";

// ═══════════════════════════════════════════════════════
// /ops/shift — Shift management: clock in/out, tip summary
// Stub — Drop 006 will wire real GPS + Stripe Connect.
// ═══════════════════════════════════════════════════════

import { useState } from "react";

const CREW = [
  { id: "c-001", name: "Carlos V.", hoursWorked: 7.5, tipsCents: 8500, status: "active" },
  { id: "c-002", name: "Miguel R.", hoursWorked: 6.0, tipsCents: 6200, status: "active" },
];

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ShiftPage() {
  const [clockedIn, setClockedIn] = useState(true);
  const [clockInTime] = useState("8:00 AM");

  const totalTips = CREW.reduce((sum, c) => sum + c.tipsCents, 0);

  return (
    <div className="p-5 space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
          Shift
        </h1>
        <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
          Today &middot; Apr 29, 2026
        </p>
      </div>

      {/* Clock in/out */}
      <div
        className="p-5 rounded-2xl space-y-4"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
              Carlos V.
            </p>
            <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
              {clockedIn ? `Clocked in at ${clockInTime}` : "Not clocked in"}
            </p>
          </div>
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: clockedIn ? "#10B981" : "#8B95A8",
              boxShadow: clockedIn ? "0 0 8px rgba(16,185,129,0.8)" : "none",
            }}
            aria-hidden="true"
          />
        </div>

        <button
          onClick={() => setClockedIn((c) => !c)}
          className="w-full rounded-2xl font-black font-mono text-base tracking-widest transition-all active:scale-[0.97]"
          style={{
            height: "64px",
            background: clockedIn
              ? "rgba(239,68,68,0.1)"
              : "rgba(16,185,129,0.1)",
            border: clockedIn
              ? "1px solid rgba(239,68,68,0.3)"
              : "1px solid rgba(16,185,129,0.3)",
            color: clockedIn ? "#EF4444" : "#10B981",
          }}
        >
          {clockedIn ? "CLOCK OUT" : "CLOCK IN"}
        </button>
      </div>

      {/* Crew summary */}
      <div>
        <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
          TODAY&apos;S CREW
        </p>
        <div className="space-y-3">
          {CREW.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl flex items-center justify-between"
              style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
            >
              <div>
                <p className="font-bold" style={{ color: "#F5F7FA" }}>{member.name}</p>
                <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                  {member.hoursWorked}h worked
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg" style={{ color: "#FF6B1A" }}>
                  {formatDollars(member.tipsCents)}
                </p>
                <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>tips</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total tips */}
      <div
        className="p-5 rounded-2xl flex items-center justify-between"
        style={{
          background: "rgba(255,107,26,0.06)",
          border: "1px solid rgba(255,107,26,0.2)",
        }}
      >
        <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
          Total Tips Today
        </p>
        <p className="font-black text-2xl" style={{ color: "#FF6B1A" }}>
          {formatDollars(totalTips)}
        </p>
      </div>

      <p className="text-center text-xs font-mono" style={{ color: "#8B95A8" }}>
        Tip distribution via Stripe Connect — Drop 006
      </p>
    </div>
  );
}
