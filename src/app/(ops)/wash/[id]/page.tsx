"use client";

// ═══════════════════════════════════════════════════════
// /ops/wash/[id] — Single wash detail view
// Full controls, status advancement, notes, photos.
// Touch-first. High contrast. iPad-optimized.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { WashStatus } from "@/types/database";
import StatusBadge from "@/components/ops/StatusBadge";

// ── Demo washes map ──────────────────────────────────────
interface WashDetail {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  plate: string;
  serviceLabel: string;
  serviceType: string;
  status: WashStatus;
  scheduledFor: string;
  startedAt: string | null;
  operator: string | null;
  amountCents: number;
  tipCents: number;
  notes: string;
  memberTier: "SOLO" | "DUO" | "FLEET" | null;
}

const DEMO_WASHES: Record<string, WashDetail> = {
  "w-001": {
    id: "w-001",
    customerName: "Marcus Reed",
    customerPhone: "+17025550142",
    vehicleYear: 2023,
    vehicleMake: "Ford",
    vehicleModel: "Raptor",
    vehicleColor: "Lead Foot Gray",
    plate: "NV·8H4-LX9",
    serviceLabel: "Wash + Interior",
    serviceType: "classic",
    status: "washing",
    scheduledFor: "8:00 AM",
    startedAt: "8:04 AM",
    operator: "Carlos V.",
    amountCents: 7500,
    tipCents: 0,
    notes: "Pre-existing scratch above rear wheel — photographed.",
    memberTier: "DUO",
  },
  "w-004": {
    id: "w-004",
    customerName: "James Whitfield",
    customerPhone: "+17025550391",
    vehicleYear: 2023,
    vehicleMake: "Rolls-Royce",
    vehicleModel: "Cullinan",
    vehicleColor: "Andalucian White",
    plate: "NV·RR1-CUL",
    serviceLabel: "Ceramic Coating",
    serviceType: "ceramic",
    status: "detailing",
    scheduledFor: "7:00 AM",
    startedAt: "7:05 AM",
    operator: "Carlos V.",
    amountCents: 89500,
    tipCents: 0,
    notes: "",
    memberTier: "FLEET",
  },
};

const WASH_FLOW: { status: WashStatus; label: string; action: string }[] = [
  { status: "queued", label: "Queued", action: "START WASH" },
  { status: "started", label: "Started", action: "WASHING" },
  { status: "washing", label: "Washing", action: "DETAILING" },
  { status: "detailing", label: "Detailing", action: "FINISHING" },
  { status: "finishing", label: "Finishing", action: "MARK READY" },
  { status: "ready", label: "Ready", action: "MARK PICKED UP" },
  { status: "complete", label: "Complete", action: "" },
];

const NEXT_STATUS: Partial<Record<WashStatus, WashStatus>> = {
  queued: "started",
  started: "washing",
  washing: "detailing",
  detailing: "finishing",
  finishing: "ready",
  ready: "complete",
};

const ADVANCE_COLOR: Partial<Record<WashStatus, string>> = {
  queued: "#8B95A8",
  started: "#00B4FF",
  washing: "#00B4FF",
  detailing: "#8B5CF6",
  finishing: "#FF6B1A",
  ready: "#10B981",
};

function formatDollars(cents: number): string {
  if (cents === 0) return "—";
  return `$${(cents / 100).toFixed(0)}`;
}

export default function WashDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const washId = params.id;

  // Try demo data; fall back to a generic placeholder
  const initialWash: WashDetail =
    DEMO_WASHES[washId] ?? {
      id: washId,
      customerName: "Unknown Customer",
      customerPhone: "",
      vehicleYear: 2024,
      vehicleMake: "Unknown",
      vehicleModel: "Vehicle",
      vehicleColor: "—",
      plate: "—",
      serviceLabel: "Express Wash",
      serviceType: "express",
      status: "queued",
      scheduledFor: "—",
      startedAt: null,
      operator: null,
      amountCents: 3500,
      tipCents: 0,
      notes: "",
      memberTier: null,
    };

  const [wash, setWash] = useState<WashDetail>(initialWash);
  const [notes, setNotes] = useState(initialWash.notes);
  const [notesEditing, setNotesEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasBeforePhoto, setHasBeforePhoto] = useState(
    wash.status !== "queued"
  );
  const [hasAfterPhoto, setHasAfterPhoto] = useState(
    wash.status === "complete"
  );

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleAdvance() {
    const next = NEXT_STATUS[wash.status];
    if (!next) return;
    setWash((w) => ({ ...w, status: next }));
    if (next === "started") setHasBeforePhoto(false);
    showToast(`Status: ${next.toUpperCase()}`);
  }

  function handleSaveNotes() {
    setWash((w) => ({ ...w, notes }));
    setNotesEditing(false);
    showToast("Notes saved");
  }

  function handleContactSMS() {
    showToast("SMS sent to " + wash.customerName);
  }

  const nextStatus = NEXT_STATUS[wash.status];
  const actionLabel =
    WASH_FLOW.find((s) => s.status === wash.status)?.action ?? "";
  const advanceColor = ADVANCE_COLOR[wash.status] ?? "#8B95A8";
  const currentStepIdx = WASH_FLOW.findIndex((s) => s.status === wash.status);

  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    SOLO: { bg: "rgba(0,180,255,0.08)", text: "#00B4FF", border: "rgba(0,180,255,0.25)" },
    DUO: { bg: "rgba(139,92,246,0.08)", text: "#8B5CF6", border: "rgba(139,92,246,0.25)" },
    FLEET: { bg: "rgba(255,107,26,0.08)", text: "#FF6B1A", border: "rgba(255,107,26,0.25)" },
  };

  return (
    <div className="p-5 space-y-5 max-w-3xl">

      {/* ── Back + header ────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/ops/queue")}
          className="rounded-xl grid place-items-center flex-shrink-0"
          style={{
            width: "44px",
            height: "44px",
            background: "#0B0F1A",
            border: "1px solid #1B2236",
            color: "#8B95A8",
          }}
          aria-label="Back to queue"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black tracking-tight truncate" style={{ color: "#F5F7FA" }}>
              {wash.customerName}
            </h1>
            <StatusBadge status={wash.status} size="md" />
            {wash.memberTier && (() => {
              const c = tierColors[wash.memberTier] ?? tierColors.SOLO;
              return (
                <span
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  {wash.memberTier}
                </span>
              );
            })()}
          </div>
          <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
            {wash.serviceLabel} &middot; Scheduled {wash.scheduledFor}
          </p>
        </div>
      </div>

      {/* ── Status timeline ──────────────────────────────────── */}
      <div
        className="p-4 rounded-2xl"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
          WASH PROGRESS
        </p>
        <div className="flex items-center gap-0">
          {WASH_FLOW.filter((s) => s.status !== "complete").map((step, i, arr) => {
            const isPast = currentStepIdx > i;
            const isCurrent = currentStepIdx === i;
            return (
              <div key={step.status} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full grid place-items-center font-bold text-xs font-mono"
                    style={{
                      background: isPast
                        ? "#10B981"
                        : isCurrent
                        ? advanceColor
                        : "#11172A",
                      color: isPast || isCurrent ? "#050810" : "#8B95A8",
                      border: isCurrent
                        ? `2px solid ${advanceColor}`
                        : isPast
                        ? "2px solid #10B981"
                        : "1px solid #1B2236",
                      boxShadow: isCurrent ? `0 0 12px ${advanceColor}60` : "none",
                    }}
                    aria-label={`Step ${i + 1}: ${step.label}${isCurrent ? " (current)" : isPast ? " (done)" : ""}`}
                  >
                    {isPast ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className="text-[10px] font-mono text-center leading-tight"
                    style={{
                      color: isCurrent ? advanceColor : isPast ? "#10B981" : "#8B95A8",
                      maxWidth: "52px",
                    }}
                  >
                    {step.label.toUpperCase()}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-1"
                    style={{ background: isPast ? "#10B981" : "#1B2236" }}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BIG advance button ───────────────────────────────── */}
      {nextStatus && (
        <button
          onClick={handleAdvance}
          className="w-full rounded-2xl font-black font-mono text-xl tracking-widest transition-all active:scale-[0.97]"
          style={{
            height: "80px",
            background: advanceColor,
            color: "#050810",
            boxShadow: `0 8px 32px ${advanceColor}40`,
          }}
          aria-label={`Advance to ${nextStatus}`}
        >
          {actionLabel}
        </button>
      )}

      {wash.status === "complete" && (
        <div
          className="w-full rounded-2xl grid place-items-center font-black font-mono text-xl tracking-widest"
          style={{
            height: "80px",
            background: "rgba(16,185,129,0.1)",
            border: "2px solid rgba(16,185,129,0.3)",
            color: "#10B981",
          }}
        >
          WASH COMPLETE
        </div>
      )}

      {/* ── Two-column detail grid ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Vehicle info */}
        <div
          className="p-4 rounded-2xl col-span-2 md:col-span-1"
          style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
        >
          <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
            VEHICLE
          </p>
          <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
            {wash.vehicleYear} {wash.vehicleMake} {wash.vehicleModel}
          </p>
          <p className="text-sm font-mono mt-1" style={{ color: "#8B95A8" }}>
            {wash.vehicleColor}
          </p>
          <div
            className="mt-3 inline-block px-3 py-1.5 rounded-lg font-mono font-bold text-base"
            style={{
              background: "rgba(0,180,255,0.08)",
              color: "#00B4FF",
              border: "1px solid rgba(0,180,255,0.25)",
            }}
          >
            {wash.plate}
          </div>
        </div>

        {/* Payment info */}
        <div
          className="p-4 rounded-2xl col-span-2 md:col-span-1"
          style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
        >
          <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
            PAYMENT
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#8B95A8" }}>Service</span>
              <span className="font-bold" style={{ color: "#F5F7FA" }}>
                {formatDollars(wash.amountCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#8B95A8" }}>Tip</span>
              <span className="font-bold" style={{ color: "#FF6B1A" }}>
                {formatDollars(wash.tipCents)}
              </span>
            </div>
            <div
              className="h-px"
              style={{ background: "#1B2236" }}
            />
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: "#F5F7FA" }}>Total</span>
              <span className="font-black text-lg" style={{ color: "#F5F7FA" }}>
                {formatDollars(wash.amountCents + wash.tipCents)}
              </span>
            </div>
          </div>
        </div>

        {/* Operator + timing */}
        <div
          className="p-4 rounded-2xl col-span-2"
          style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
        >
          <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
            DETAILS
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>Operator</p>
              <p className="font-bold mt-0.5" style={{ color: "#F5F7FA" }}>
                {wash.operator ?? "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>Scheduled</p>
              <p className="font-bold mt-0.5" style={{ color: "#F5F7FA" }}>
                {wash.scheduledFor}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>Started</p>
              <p className="font-bold mt-0.5" style={{ color: "#F5F7FA" }}>
                {wash.startedAt ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Photos ──────────────────────────────────────────── */}
      <div
        className="p-4 rounded-2xl"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
          PHOTOS
        </p>
        <div className="grid grid-cols-2 gap-4">
          {/* Before photo */}
          <div>
            <p className="text-xs font-mono mb-2" style={{ color: "#8B95A8" }}>
              BEFORE
            </p>
            {hasBeforePhoto ? (
              <div
                className="rounded-xl grid place-items-center"
                style={{
                  height: "140px",
                  background: "linear-gradient(135deg, #1a2a4a 0%, #0a1525 100%)",
                  border: "1px solid rgba(16,185,129,0.3)",
                }}
              >
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" className="w-8 h-8 mx-auto">
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <p className="text-xs font-mono mt-1" style={{ color: "#10B981" }}>PHOTO ADDED</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setHasBeforePhoto(true)}
                className="w-full rounded-xl grid place-items-center transition-colors active:scale-[0.97]"
                style={{
                  height: "140px",
                  background: "#11172A",
                  border: "1.5px dashed #1B2236",
                  color: "#8B95A8",
                }}
                aria-label="Add before photo"
              >
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 mx-auto">
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <p className="text-xs font-mono mt-1">ADD BEFORE</p>
                </div>
              </button>
            )}
          </div>

          {/* After photo */}
          <div>
            <p className="text-xs font-mono mb-2" style={{ color: "#8B95A8" }}>
              AFTER
            </p>
            {hasAfterPhoto ? (
              <div
                className="rounded-xl grid place-items-center"
                style={{
                  height: "140px",
                  background: "linear-gradient(135deg, #1a4a3a 0%, #051a15 100%)",
                  border: "1px solid rgba(16,185,129,0.3)",
                }}
              >
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" className="w-8 h-8 mx-auto">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <p className="text-xs font-mono mt-1" style={{ color: "#10B981" }}>PHOTO ADDED</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setHasAfterPhoto(true)}
                className="w-full rounded-xl grid place-items-center transition-colors active:scale-[0.97]"
                style={{
                  height: "140px",
                  background: "#11172A",
                  border: "1.5px dashed #1B2236",
                  color: "#8B95A8",
                  opacity: wash.status !== "ready" && wash.status !== "complete" ? 0.4 : 1,
                }}
                disabled={wash.status !== "ready" && wash.status !== "complete"}
                aria-label="Add after photo"
                aria-disabled={wash.status !== "ready" && wash.status !== "complete"}
              >
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 mx-auto">
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <p className="text-xs font-mono mt-1">ADD AFTER</p>
                  {wash.status !== "ready" && wash.status !== "complete" && (
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                      AVAILABLE AT READY
                    </p>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Notes ───────────────────────────────────────────── */}
      <div
        className="p-4 rounded-2xl"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono font-bold tracking-widest" style={{ color: "#8B95A8" }}>
            NOTES
          </p>
          {!notesEditing ? (
            <button
              onClick={() => setNotesEditing(true)}
              className="text-xs font-mono font-bold tracking-widest px-3 py-1.5 rounded-lg"
              style={{
                background: "#11172A",
                color: "#00B4FF",
                border: "1px solid rgba(0,180,255,0.2)",
                minHeight: "36px",
              }}
            >
              EDIT
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="text-xs font-mono font-bold tracking-widest px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10B981",
                border: "1px solid rgba(16,185,129,0.3)",
                minHeight: "36px",
              }}
            >
              SAVE
            </button>
          )}
        </div>

        {notesEditing ? (
          <textarea
            autoFocus
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this wash, pre-existing damage, special requests..."
            className="w-full rounded-xl outline-none resize-none font-mono text-sm"
            style={{
              background: "#11172A",
              border: "1px solid rgba(0,180,255,0.2)",
              color: "#F5F7FA",
              padding: "12px",
              minHeight: "100px",
              fontSize: "16px",
            }}
            aria-label="Wash notes"
          />
        ) : (
          <p
            className="text-sm font-mono leading-relaxed"
            style={{ color: notes ? "#F5F7FA" : "#8B95A8" }}
          >
            {notes || "No notes yet. Tap EDIT to add."}
          </p>
        )}
      </div>

      {/* ── Contact customer ────────────────────────────────── */}
      {wash.customerPhone && (
        <button
          onClick={handleContactSMS}
          className="w-full flex items-center justify-center gap-3 rounded-2xl font-mono font-bold text-sm tracking-widest transition-all active:scale-[0.97]"
          style={{
            height: "56px",
            background: "#11172A",
            border: "1px solid #1B2236",
            color: "#8B95A8",
          }}
          aria-label={`Send SMS to ${wash.customerName}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          SMS {wash.customerName.split(" ")[0].toUpperCase()}
        </button>
      )}

      {/* ── Toast ───────────────────────────────────────────── */}
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
