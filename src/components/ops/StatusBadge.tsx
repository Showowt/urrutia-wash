// ═══════════════════════════════════════════════════════
// StatusBadge — Operator Console
// High-contrast status pill for wash cards and detail views.
// Touch-optimized: no hover effects, readable in sunlight.
// ═══════════════════════════════════════════════════════

import type { WashStatus } from "@/types/database";

// Status display config — label + background + text + optional pulse
const STATUS_CONFIG: Record<
  WashStatus,
  { label: string; bg: string; text: string; border: string; pulse?: boolean }
> = {
  queued: {
    label: "QUEUED",
    bg: "rgba(139,149,168,0.15)",
    text: "#8B95A8",
    border: "rgba(139,149,168,0.4)",
  },
  started: {
    label: "STARTED",
    bg: "rgba(0,180,255,0.12)",
    text: "#00B4FF",
    border: "rgba(0,180,255,0.4)",
  },
  washing: {
    label: "WASHING",
    bg: "rgba(0,180,255,0.12)",
    text: "#00B4FF",
    border: "rgba(0,180,255,0.4)",
    pulse: true,
  },
  detailing: {
    label: "DETAILING",
    bg: "rgba(139,92,246,0.12)",
    text: "#8B5CF6",
    border: "rgba(139,92,246,0.4)",
  },
  finishing: {
    label: "FINISHING",
    bg: "rgba(255,107,26,0.12)",
    text: "#FF6B1A",
    border: "rgba(255,107,26,0.4)",
  },
  ready: {
    label: "READY",
    bg: "rgba(16,185,129,0.12)",
    text: "#10B981",
    border: "rgba(16,185,129,0.4)",
    pulse: true,
  },
  complete: {
    label: "COMPLETE",
    bg: "rgba(27,34,54,0.8)",
    text: "#8B95A8",
    border: "rgba(27,34,54,1)",
  },
};

interface StatusBadgeProps {
  status: WashStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StatusBadge({
  status,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.queued;

  const sizeClasses: Record<typeof size, string> = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold rounded-lg tracking-widest ${sizeClasses[size]} ${className}`}
      style={{
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {/* Live pulse dot for active statuses */}
      {config.pulse && (
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: config.text,
            boxShadow: `0 0 0 0 ${config.text}`,
            animation: "status-badge-pulse 1.8s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
      )}
      {config.label}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes status-badge-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      ` }} />
    </span>
  );
}
