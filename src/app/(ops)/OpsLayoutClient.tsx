"use client";

// ═══════════════════════════════════════════════════════
// OpsLayoutClient — Client shell for operator console.
// Handles live clock, shift state, and sidebar.
// ═══════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import OpsNav from "@/components/ops/OpsNav";

// Demo: shift start time
const SHIFT_START = new Date();
SHIFT_START.setHours(7, 0, 0, 0);

const DEMO_OPERATOR = "Carlos V.";
const DEMO_WASH_COUNT = 8;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatShiftDuration(startTime: Date, now: Date): string {
  const diffMs = now.getTime() - startTime.getTime();
  if (diffMs < 0) return "0h 0m";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export default function OpsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [now, setNow] = useState<Date>(new Date());
  const [shiftActive, setShiftActive] = useState(true);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10_000); // update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const shiftDuration = formatShiftDuration(SHIFT_START, now);

  return (
    // Full viewport height, no max-width — this is for a tablet
    <div
      className="flex flex-col"
      style={{
        minHeight: "100dvh",
        background: "#050810",
        color: "#F5F7FA",
      }}
    >
      {/* ══ TOP BAR ══════════════════════════════════════════════ */}
      <header
        className="flex items-center justify-between gap-4 flex-shrink-0"
        style={{
          background: "#0B0F1A",
          borderBottom: "1px solid #1B2236",
          padding: "0 20px",
          height: "64px",
          minHeight: "64px",
        }}
      >
        {/* Left: wordmark */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl grid place-items-center font-black text-xs tracking-tighter flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #0066CC, #00B4FF)",
              boxShadow: "0 0 20px rgba(0,180,255,0.35)",
              color: "#050810",
            }}
          >
            URR
          </div>
          <div>
            <p className="font-black tracking-widest text-sm" style={{ color: "#F5F7FA" }}>
              URRUTIA
            </p>
            <p className="text-xs font-mono tracking-wider" style={{ color: "#8B95A8" }}>
              OPERATIONS
            </p>
          </div>
        </div>

        {/* Center: operator info + shift */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          {/* Operator */}
          <div
            className="flex items-center gap-2 px-4 rounded-xl"
            style={{
              background: "#11172A",
              border: "1px solid #1B2236",
              height: "44px",
            }}
          >
            <div
              className="w-7 h-7 rounded-full grid place-items-center font-bold text-xs flex-shrink-0"
              style={{
                background: "rgba(0,180,255,0.15)",
                color: "#00B4FF",
                border: "1px solid rgba(0,180,255,0.3)",
              }}
              aria-hidden="true"
            >
              {DEMO_OPERATOR.charAt(0)}
            </div>
            <span className="font-mono font-bold text-sm" style={{ color: "#F5F7FA" }}>
              {DEMO_OPERATOR}
            </span>
          </div>

          {/* Shift indicator */}
          <button
            onClick={() => setShiftActive((s) => !s)}
            className="flex items-center gap-2 px-4 rounded-xl transition-colors"
            style={{
              background: shiftActive
                ? "rgba(16,185,129,0.1)"
                : "rgba(139,149,168,0.08)",
              border: `1px solid ${shiftActive ? "rgba(16,185,129,0.35)" : "#1B2236"}`,
              height: "44px",
              color: shiftActive ? "#10B981" : "#8B95A8",
              minWidth: "140px",
            }}
            aria-label={shiftActive ? "Shift active — tap to end" : "Start shift"}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: shiftActive ? "#10B981" : "#8B95A8",
                boxShadow: shiftActive ? "0 0 8px rgba(16,185,129,0.8)" : "none",
              }}
              aria-hidden="true"
            />
            <span className="font-mono font-bold text-xs tracking-wider">
              {shiftActive ? `SHIFT · ${shiftDuration}` : "OFF SHIFT"}
            </span>
          </button>
        </div>

        {/* Right: clock + wash count */}
        <div className="flex items-center gap-3">
          {/* Wash count */}
          <div
            className="flex flex-col items-center justify-center px-4 rounded-xl"
            style={{
              background: "rgba(255,107,26,0.08)",
              border: "1px solid rgba(255,107,26,0.2)",
              height: "44px",
            }}
            aria-label={`${DEMO_WASH_COUNT} washes today`}
          >
            <span
              className="font-black text-base leading-none"
              style={{ color: "#FF6B1A" }}
            >
              {DEMO_WASH_COUNT}
            </span>
            <span className="text-[10px] font-mono tracking-widest" style={{ color: "#8B95A8" }}>
              TODAY
            </span>
          </div>

          {/* Clock */}
          <div
            className="flex items-center justify-center px-4 rounded-xl font-mono font-bold text-base tracking-wider"
            style={{
              background: "#11172A",
              border: "1px solid #1B2236",
              height: "44px",
              color: "#F5F7FA",
              minWidth: "100px",
            }}
            aria-live="polite"
            aria-label={`Current time: ${formatTime(now)}`}
          >
            {formatTime(now)}
          </div>
        </div>
      </header>

      {/* ══ BODY: sidebar + content ══════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <OpsNav washCountToday={DEMO_WASH_COUNT} />

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "#050810" }}
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
