"use client";

// ═══════════════════════════════════════════════════════
// Track — Live wash status tracker
// Auto-advances status every 8 seconds for demo
// Reads active wash from sessionStorage (set by Book page)
// Falls back to DEMO_ACTIVE_WASH
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  STATUS_FLOW,
  DEMO_ACTIVE_WASH,
  type ActiveWash,
} from "@/lib/demo-data";

const WASH_STORAGE_KEY = "urrutia_active_wash";

function loadActiveWash(): ActiveWash {
  try {
    const raw = sessionStorage.getItem(WASH_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ActiveWash;
  } catch {
    // Ignore
  }
  return DEMO_ACTIVE_WASH;
}

export default function TrackPage() {
  const [wash, setWash] = useState<ActiveWash | null>(null);

  // Hydrate from storage on mount, then start the demo timer
  useEffect(() => {
    const initial = loadActiveWash();
    setWash(initial);

    const t = setInterval(() => {
      setWash((prev) => {
        if (!prev) return prev;
        if (prev.statusIndex >= STATUS_FLOW.length - 1) return prev;
        const next: ActiveWash = {
          ...prev,
          statusIndex: prev.statusIndex + 1,
          eta: Math.max(0, prev.eta - 6),
        };
        // Persist updated state
        try {
          sessionStorage.setItem(WASH_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    }, 8000);

    return () => clearInterval(t);
  }, []);

  // Before hydration
  if (wash === null) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>
          Loading…
        </p>
      </div>
    );
  }

  const current = STATUS_FLOW[wash.statusIndex];
  const isReady = wash.statusIndex >= STATUS_FLOW.length - 1;

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div>
        <p
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "#8B95A8" }}
        >
          LIVE STATUS
        </p>
        <h2 className="text-3xl font-bold mt-1">{current.label}</h2>
        {isReady ? (
          <p className="text-sm mt-1" style={{ color: "#10B981" }}>
            Walk out and drive home clean.
          </p>
        ) : (
          <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
            ~{wash.eta} min remaining
          </p>
        )}
      </div>

      {/* ── Hero status badge ── */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: isReady
            ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.02))"
            : "linear-gradient(135deg, rgba(0,180,255,0.12), rgba(0,180,255,0.02))",
          border:
            "1px solid " +
            (isReady ? "rgba(16,185,129,0.5)" : "rgba(0,180,255,0.4)"),
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-3 rounded-full grid place-items-center"
          style={{
            background: isReady
              ? "rgba(16,185,129,0.15)"
              : "rgba(0,180,255,0.15)",
          }}
        >
          {isReady ? (
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ background: "#00B4FF" }}
            />
          )}
        </div>
        <p
          className="text-sm font-mono tracking-widest"
          style={{ color: isReady ? "#10B981" : "#00B4FF" }}
        >
          {isReady ? "YOUR CAR IS READY" : current.desc.toUpperCase()}
        </p>
        <p className="text-xs mt-2 font-mono" style={{ color: "#8B95A8" }}>
          {wash.service} · {wash.vehicle} · {wash.location}
        </p>
      </div>

      {/* ── Status timeline ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <p
          className="text-xs font-mono tracking-widest mb-4"
          style={{ color: "#8B95A8" }}
        >
          WASH TIMELINE
        </p>
        <div className="space-y-3">
          {STATUS_FLOW.map((s, i) => {
            const done = i < wash.statusIndex;
            const active = i === wash.statusIndex;
            return (
              <div key={s.key} className="flex items-start gap-3">
                <div className="relative">
                  <div
                    className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold"
                    style={{
                      background: done
                        ? "#00B4FF"
                        : active
                          ? "rgba(0,180,255,0.15)"
                          : "#11172A",
                      border:
                        "1px solid " +
                        (done ? "#00B4FF" : active ? "#00B4FF" : "#1B2236"),
                      color: done ? "#08101F" : active ? "#00B4FF" : "#8B95A8",
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-7 w-px h-6"
                      style={{ background: done ? "#00B4FF" : "#1B2236" }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: active || done ? "white" : "#8B95A8",
                    }}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8B95A8" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Before / After photo placeholders ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <p
          className="text-xs font-mono tracking-widest mb-3"
          style={{ color: "#8B95A8" }}
        >
          BEFORE / AFTER · UPDATING LIVE
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* Before — warm placeholder */}
          <div
            className="aspect-[4/3] rounded-xl"
            style={{
              background: "linear-gradient(135deg, #2a1a0a, #1a0a05)",
            }}
          />
          {/* After — pending */}
          <div
            className="aspect-[4/3] rounded-xl grid place-items-center"
            style={{
              background: "#11172A",
              border: "1px dashed #1B2236",
            }}
          >
            <p className="text-[10px] font-mono" style={{ color: "#8B95A8" }}>
              PENDING
            </p>
          </div>
        </div>
      </div>

      {/* ── Empty state (when no wash — not reachable in demo but guarded above) ── */}
    </div>
  );
}

// ── Empty state exported for completeness (not used directly) ──────────
export function TrackEmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-sm" style={{ color: "#8B95A8" }}>
        No active wash right now.
      </p>
      <Link
        href="/book"
        className="mt-4 inline-block px-5 py-2.5 rounded-full text-sm font-bold"
        style={{
          background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
          color: "#08101F",
        }}
      >
        Book a wash
      </Link>
    </div>
  );
}
