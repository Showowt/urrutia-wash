"use client";

// ═══════════════════════════════════════════════════════
// OpsNav — Operator Console sidebar navigation
// Collapsible on tablet. Touch-optimized.
// No hover effects — this is a work tool.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/ops/queue",
    label: "Live Queue",
    shortLabel: "Queue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    href: "/ops/walkin",
    label: "Walk-in",
    shortLabel: "Walk-in",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: "/ops/lookup",
    label: "Lookup",
    shortLabel: "Lookup",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: "/ops/schedule",
    label: "Schedule",
    shortLabel: "Sched",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/ops/shift",
    label: "Shift",
    shortLabel: "Shift",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
];

interface OpsNavProps {
  washCountToday: number;
}

export default function OpsNav({ washCountToday }: OpsNavProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-full transition-all duration-200"
      style={{
        width: collapsed ? "72px" : "200px",
        background: "#0B0F1A",
        borderRight: "1px solid #1B2236",
        flexShrink: 0,
      }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center self-end m-3 rounded-xl transition-colors"
        style={{
          width: "44px",
          height: "44px",
          background: "#11172A",
          border: "1px solid #1B2236",
          color: "#8B95A8",
          flexShrink: 0,
        }}
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
          style={{
            transform: collapsed ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-2 flex-1" aria-label="Operator navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl transition-colors"
              style={{
                minHeight: "52px",
                padding: collapsed ? "0 12px" : "0 14px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive
                  ? "rgba(0,180,255,0.1)"
                  : "transparent",
                color: isActive ? "#00B4FF" : "#8B95A8",
                border: isActive
                  ? "1px solid rgba(0,180,255,0.25)"
                  : "1px solid transparent",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                style={{
                  flexShrink: 0,
                  color: isActive ? "#00B4FF" : "#8B95A8",
                }}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <span className="font-mono font-bold text-sm tracking-wider truncate">
                  {item.label.toUpperCase()}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom stat: today's wash count */}
      {!collapsed && (
        <div
          className="m-3 p-3 rounded-xl text-center"
          style={{
            background: "rgba(255,107,26,0.08)",
            border: "1px solid rgba(255,107,26,0.2)",
          }}
        >
          <p
            className="text-2xl font-black font-mono"
            style={{ color: "#FF6B1A" }}
          >
            {washCountToday}
          </p>
          <p className="text-xs font-mono tracking-widest" style={{ color: "#8B95A8" }}>
            TODAY
          </p>
        </div>
      )}

      {collapsed && (
        <div className="mb-4 flex justify-center">
          <div
            className="w-11 h-11 rounded-xl grid place-items-center font-black font-mono text-sm"
            style={{
              background: "rgba(255,107,26,0.08)",
              border: "1px solid rgba(255,107,26,0.2)",
              color: "#FF6B1A",
            }}
          >
            {washCountToday}
          </div>
        </div>
      )}
    </aside>
  );
}
