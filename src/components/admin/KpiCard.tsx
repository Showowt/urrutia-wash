"use client";

// ═══════════════════════════════════════════════════════
// KpiCard — Reusable KPI metric card
// Shows: number, label, trend vs prior period, mini bars
// ═══════════════════════════════════════════════════════

interface SparkBar {
  value: number; // relative 0–100
}

interface KpiCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: number; // positive = up, negative = down (percentage)
  trendLabel?: string; // e.g. "vs last week"
  accent?: "water" | "flame" | "success" | "neutral";
  spark?: SparkBar[]; // mini bar chart data (last 7 days)
  icon?: React.ReactNode;
  size?: "default" | "large";
}

function TrendArrow({ trend }: { trend: number }) {
  const up = trend >= 0;
  const color = up ? "#10B981" : "#FF4444";
  const bgColor = up ? "rgba(16,185,129,0.1)" : "rgba(255,68,68,0.1)";

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold"
      style={{ color, background: bgColor }}
    >
      <svg
        viewBox="0 0 12 12"
        fill="none"
        className="w-2.5 h-2.5"
        style={{
          transform: up ? "none" : "rotate(180deg)",
        }}
      >
        <path
          d="M6 2L10 7H2L6 2Z"
          fill={color}
        />
      </svg>
      {up ? "+" : ""}
      {trend}%
    </span>
  );
}

function SparkBars({ bars }: { bars: SparkBar[] }) {
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="flex items-end gap-0.5 h-8" aria-hidden="true">
      {bars.map((bar, i) => {
        const pct = (bar.value / max) * 100;
        const isLast = i === bars.length - 1;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm min-h-[3px] transition-all"
            style={{
              height: `${Math.max(pct, 6)}%`,
              background: isLast
                ? "#00B4FF"
                : `rgba(0,180,255,${0.15 + (i / bars.length) * 0.35})`,
            }}
          />
        );
      })}
    </div>
  );
}

const ACCENT_COLORS = {
  water: { primary: "#00B4FF", glow: "rgba(0,180,255,0.12)" },
  flame: { primary: "#FF6B1A", glow: "rgba(255,107,26,0.12)" },
  success: { primary: "#10B981", glow: "rgba(16,185,129,0.12)" },
  neutral: { primary: "#8B95A8", glow: "transparent" },
};

export default function KpiCard({
  label,
  value,
  subValue,
  trend,
  trendLabel = "vs last week",
  accent = "neutral",
  spark,
  icon,
  size = "default",
}: KpiCardProps) {
  const colors = ACCENT_COLORS[accent];

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
        border: "1px solid #1B2236",
      }}
    >
      {/* Top row: label + optional icon */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-xs font-mono tracking-widest uppercase leading-tight"
          style={{ color: "#8B95A8" }}
        >
          {label}
        </p>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0"
            style={{ background: colors.glow }}
          >
            <span style={{ color: colors.primary }}>{icon}</span>
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="flex items-end gap-2 flex-wrap">
        <span
          className={`font-black tracking-tight leading-none ${
            size === "large" ? "text-4xl" : "text-3xl"
          }`}
          style={{ color: "#F5F7FA" }}
        >
          {value}
        </span>
        {subValue && (
          <span
            className="text-sm font-mono pb-0.5"
            style={{ color: "#8B95A8" }}
          >
            {subValue}
          </span>
        )}
      </div>

      {/* Trend + spark row */}
      <div className="flex items-end justify-between gap-3 mt-auto">
        <div className="flex flex-col gap-1">
          {trend !== undefined && (
            <div className="flex items-center gap-2 flex-wrap">
              <TrendArrow trend={trend} />
              <span className="text-xs" style={{ color: "#8B95A8" }}>
                {trendLabel}
              </span>
            </div>
          )}
        </div>

        {spark && spark.length > 0 && (
          <div className="flex-shrink-0 w-24">
            <SparkBars bars={spark} />
          </div>
        )}
      </div>

      {/* Subtle accent glow line at bottom */}
      {accent !== "neutral" && (
        <div
          className="absolute bottom-0 inset-x-4 h-px rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
