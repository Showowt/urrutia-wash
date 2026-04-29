"use client";

// ═══════════════════════════════════════════════════════
// WashCard — Operator Console queue card
// Large touch targets, all key info at a glance,
// single-tap status advancement.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import type { WashStatus } from "@/types/database";
import StatusBadge from "./StatusBadge";

export interface WashCardData {
  id: string;
  customerName: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  plate: string;
  serviceType: string;
  serviceLabel: string;
  status: WashStatus;
  scheduledFor: string; // e.g. "9:30 AM"
  operator: string | null;
  amountCents: number;
}

// Next status in the flow
const NEXT_STATUS: Partial<Record<WashStatus, WashStatus>> = {
  queued: "started",
  started: "washing",
  washing: "detailing",
  detailing: "finishing",
  finishing: "ready",
  ready: "complete",
};

const ADVANCE_LABEL: Partial<Record<WashStatus, string>> = {
  queued: "START WASH",
  started: "WASHING",
  washing: "DETAILING",
  detailing: "FINISHING",
  finishing: "MARK READY",
  ready: "PICKED UP",
};

// Accent color for the advance button by current status
const BUTTON_COLOR: Partial<Record<WashStatus, string>> = {
  queued: "#8B95A8",
  started: "#00B4FF",
  washing: "#00B4FF",
  detailing: "#8B5CF6",
  finishing: "#FF6B1A",
  ready: "#10B981",
};

interface WashCardProps {
  wash: WashCardData;
  onAdvance: (washId: string, nextStatus: WashStatus) => void;
}

export default function WashCard({ wash, onAdvance }: WashCardProps) {
  const nextStatus = NEXT_STATUS[wash.status];
  const advanceLabel = ADVANCE_LABEL[wash.status];
  const buttonColor = BUTTON_COLOR[wash.status] ?? "#8B95A8";
  const isComplete = wash.status === "complete";

  const amountDollars = wash.amountCents
    ? `$${(wash.amountCents / 100).toFixed(0)}`
    : "—";

  function handleAdvance(e: React.MouseEvent) {
    // Prevent link navigation when tapping the button
    e.preventDefault();
    e.stopPropagation();
    if (nextStatus) {
      onAdvance(wash.id, nextStatus);
    }
  }

  return (
    <Link
      href={`/ops/wash/${wash.id}`}
      className="block rounded-2xl overflow-hidden transition-colors active:scale-[0.99]"
      style={{
        background: "#0B0F1A",
        border: `1px solid ${isComplete ? "#1B2236" : "rgba(0,180,255,0.12)"}`,
        opacity: isComplete ? 0.6 : 1,
      }}
    >
      {/* Top stripe — color-keyed to status */}
      <div
        className="h-1 w-full"
        style={{ background: buttonColor }}
        aria-hidden="true"
      />

      <div className="p-4 space-y-3">
        {/* Row 1: Name + Status badge + Time */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-lg font-bold leading-tight truncate"
              style={{ color: "#F5F7FA" }}
            >
              {wash.customerName}
            </p>
            <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
              {wash.scheduledFor}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StatusBadge status={wash.status} size="sm" />
            <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
              {amountDollars}
            </span>
          </div>
        </div>

        {/* Row 2: Vehicle info */}
        <div
          className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl"
          style={{ background: "#11172A" }}
        >
          {/* Car icon */}
          <svg
            className="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B95A8"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M5 11l1.5-4.5h11L19 11M3 11h18v4H3zM5 15v3M19 15v3" />
            <circle cx="7.5" cy="15.5" r="1.5" />
            <circle cx="16.5" cy="15.5" r="1.5" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: "#F5F7FA" }}>
              {wash.vehicleYear} {wash.vehicleMake} {wash.vehicleModel}
            </p>
            <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
              {wash.vehicleColor} &middot;{" "}
              <span className="font-bold" style={{ color: "#00B4FF" }}>
                {wash.plate}
              </span>
            </p>
          </div>
        </div>

        {/* Row 3: Service + Operator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
              style={{
                background: "rgba(255,107,26,0.1)",
                color: "#FF6B1A",
                border: "1px solid rgba(255,107,26,0.25)",
              }}
            >
              {wash.serviceLabel.toUpperCase()}
            </span>
          </div>
          {wash.operator && (
            <p className="text-xs" style={{ color: "#8B95A8" }}>
              {wash.operator}
            </p>
          )}
        </div>

        {/* Advance button — only show if not complete */}
        {!isComplete && nextStatus && (
          <button
            onClick={handleAdvance}
            className="w-full py-4 rounded-xl font-bold text-base tracking-widest font-mono transition-all active:scale-[0.97]"
            style={{
              background: buttonColor,
              color: buttonColor === "#8B95A8" ? "#0B0F1A" : "#050810",
              minHeight: "56px",
            }}
            aria-label={`Advance ${wash.customerName}'s wash to ${nextStatus}`}
          >
            {advanceLabel}
          </button>
        )}

        {isComplete && (
          <div
            className="w-full py-3 rounded-xl text-center font-mono text-sm font-bold tracking-widest"
            style={{ background: "#11172A", color: "#8B95A8" }}
          >
            COMPLETE
          </div>
        )}
      </div>
    </Link>
  );
}
