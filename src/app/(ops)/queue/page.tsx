"use client";

// ═══════════════════════════════════════════════════════
// /ops/queue — Live wash queue
// Today's washes as large cards. Single-tap to advance.
// Demo data, hardcoded.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WashStatus } from "@/types/database";
import WashCard, { type WashCardData } from "@/components/ops/WashCard";
import StatusBadge from "@/components/ops/StatusBadge";

// ── Demo queue data ─────────────────────────────────────
const INITIAL_QUEUE: WashCardData[] = [
  {
    id: "w-001",
    customerName: "Marcus Reed",
    vehicleYear: 2023,
    vehicleMake: "Ford",
    vehicleModel: "Raptor",
    vehicleColor: "Lead Foot Gray",
    plate: "NV·8H4-LX9",
    serviceType: "medium_full",
    serviceLabel: "Medium — Int + Ext",
    status: "washing",
    scheduledFor: "8:00 AM",
    operator: "Carlos V.",
    amountCents: 6500,
  },
  {
    id: "w-002",
    customerName: "Diego Arroyo",
    vehicleYear: 2022,
    vehicleMake: "Mercedes",
    vehicleModel: "G63 AMG",
    vehicleColor: "Matte Black",
    plate: "NV·G63-AMG",
    serviceType: "detail",
    serviceLabel: "Full Detail",
    status: "started",
    scheduledFor: "8:30 AM",
    operator: "Miguel R.",
    amountCents: 29500,
  },
  {
    id: "w-003",
    customerName: "Amanda Torres",
    vehicleYear: 2024,
    vehicleMake: "BMW",
    vehicleModel: "X5",
    vehicleColor: "Alpine White",
    plate: "NV·A24-BMW",
    serviceType: "medium_exterior",
    serviceLabel: "Medium — Ext Only",
    status: "queued",
    scheduledFor: "9:00 AM",
    operator: null,
    amountCents: 4000,
  },
  {
    id: "w-004",
    customerName: "James Whitfield",
    vehicleYear: 2023,
    vehicleMake: "Rolls-Royce",
    vehicleModel: "Cullinan",
    vehicleColor: "Andalucian White",
    plate: "NV·RR1-CUL",
    serviceType: "large_full",
    serviceLabel: "Large — Int + Ext",
    status: "detailing",
    scheduledFor: "8:00 AM",
    operator: "Carlos V.",
    amountCents: 7500,
  },
  {
    id: "w-005",
    customerName: "Sofia Martinez",
    vehicleYear: 2021,
    vehicleMake: "Tesla",
    vehicleModel: "Model S",
    vehicleColor: "Midnight Silver",
    plate: "NV·EV9-MSM",
    serviceType: "small_full",
    serviceLabel: "Small — Int + Ext",
    status: "finishing",
    scheduledFor: "8:30 AM",
    operator: "Miguel R.",
    amountCents: 5500,
  },
  {
    id: "w-006",
    customerName: "Derek Nash",
    vehicleYear: 2020,
    vehicleMake: "Jeep",
    vehicleModel: "Wrangler",
    vehicleColor: "Firecracker Red",
    plate: "NV·D20-JEP",
    serviceType: "medium_exterior",
    serviceLabel: "Medium — Ext Only",
    status: "ready",
    scheduledFor: "8:15 AM",
    operator: "Carlos V.",
    amountCents: 4000,
  },
];

// Status sort order for the default "status" sort
const STATUS_ORDER: WashStatus[] = [
  "ready",
  "finishing",
  "detailing",
  "washing",
  "started",
  "queued",
  "complete",
];

type SortMode = "time" | "status";

export default function QueuePage() {
  const router = useRouter();
  const [queue, setQueue] = useState<WashCardData[]>(INITIAL_QUEUE);
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  function handleAdvance(washId: string, nextStatus: WashStatus) {
    setQueue((prev) =>
      prev.map((w) =>
        w.id === washId ? { ...w, status: nextStatus } : w
      )
    );
    const wash = queue.find((w) => w.id === washId);
    if (wash) {
      const label = nextStatus.toUpperCase();
      showToast(`${wash.customerName} — ${label}`);
    }
  }

  // Sort logic
  const sorted = [...queue].sort((a, b) => {
    if (sortMode === "status") {
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    }
    // Sort by scheduled time (string compare works for 12h times in this demo)
    return a.scheduledFor.localeCompare(b.scheduledFor);
  });

  // Status counts for the filter strip
  const statusCounts = queue.reduce<Partial<Record<WashStatus, number>>>(
    (acc, w) => ({ ...acc, [w.status]: (acc[w.status] ?? 0) + 1 }),
    {}
  );
  const activeCount = queue.filter((w) => w.status !== "complete").length;
  const readyCount = statusCounts.ready ?? 0;

  return (
    <div className="p-5 space-y-5">
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "#F5F7FA" }}
          >
            Live Queue
          </h1>
          <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
            {activeCount} active &middot; {readyCount} ready for pickup
          </p>
        </div>

        {/* Walk-in CTA */}
        <button
          onClick={() => router.push("/ops/walkin")}
          className="flex items-center gap-2 px-5 font-black tracking-widest font-mono text-sm rounded-xl transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
            color: "#050810",
            height: "52px",
            minWidth: "140px",
          }}
          aria-label="Add walk-in customer"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-5 h-5 flex-shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          WALK-IN
        </button>
      </div>

      {/* ── Status strip ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(["queued", "started", "washing", "detailing", "finishing", "ready"] as WashStatus[]).map(
          (status) => {
            const count = statusCounts[status] ?? 0;
            return (
              <div key={status} className="flex items-center gap-1.5">
                <StatusBadge status={status} size="sm" />
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: count > 0 ? "#F5F7FA" : "#8B95A8" }}
                >
                  {count}
                </span>
              </div>
            );
          }
        )}
      </div>

      {/* ── Sort toggle ──────────────────────────────────────── */}
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ border: "1px solid #1B2236", width: "fit-content" }}
        role="group"
        aria-label="Sort queue by"
      >
        {(["time", "status"] as SortMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setSortMode(mode)}
            className="px-4 font-mono font-bold text-xs tracking-widest transition-colors"
            style={{
              height: "44px",
              background:
                sortMode === mode ? "rgba(0,180,255,0.12)" : "#0B0F1A",
              color: sortMode === mode ? "#00B4FF" : "#8B95A8",
              borderRight: mode === "time" ? "1px solid #1B2236" : "none",
            }}
            aria-pressed={sortMode === mode}
          >
            {mode === "time" ? "BY TIME" : "BY STATUS"}
          </button>
        ))}
      </div>

      {/* ── Queue cards ──────────────────────────────────────── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
        {sorted.map((wash) => (
          <WashCard
            key={wash.id}
            wash={wash}
            onAdvance={handleAdvance}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div
          className="py-20 text-center rounded-2xl"
          style={{ border: "1px dashed #1B2236" }}
        >
          <p className="text-4xl mb-3" aria-hidden="true">
            &#9679;
          </p>
          <p className="font-mono font-bold text-sm tracking-widest" style={{ color: "#8B95A8" }}>
            NO WASHES IN QUEUE
          </p>
          <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
            Tap WALK-IN to add a new customer
          </p>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-mono font-bold text-sm tracking-wider z-50 toast"
          style={{
            background: "#10B981",
            color: "#050810",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
          }}
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
