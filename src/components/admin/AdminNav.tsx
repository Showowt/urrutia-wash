"use client";

// ═══════════════════════════════════════════════════════
// AdminNav — Sidebar (desktop) + Bottom nav (mobile)
// Routes: Dashboard / Revenue / Members / Referrals /
//         SMS Log / Settings
// Dark theme. Water accent on active. Collapsible label.
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/revenue",
    label: "Revenue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    href: "/admin/members",
    label: "Members",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" />
      </svg>
    ),
  },
  {
    href: "/admin/referrals",
    label: "Referrals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    href: "/admin/sms",
    label: "SMS Log",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

function NavLink({ item, collapsed }: { item: NavItem; collapsed?: boolean }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
      style={{
        color: isActive ? "#00B4FF" : "#8B95A8",
        background: isActive ? "rgba(0,180,255,0.08)" : "transparent",
        border: isActive
          ? "1px solid rgba(0,180,255,0.18)"
          : "1px solid transparent",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
          style={{ background: "#00B4FF" }}
          aria-hidden="true"
        />
      )}

      <span
        className="flex-shrink-0 transition-colors"
        style={{ color: isActive ? "#00B4FF" : "#8B95A8" }}
      >
        {item.icon}
      </span>

      {!collapsed && (
        <span className="text-sm font-medium truncate">{item.label}</span>
      )}

      {/* Tooltip on collapsed */}
      {collapsed && (
        <span
          className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
          style={{
            background: "#11172A",
            border: "1px solid #1B2236",
            color: "#F5F7FA",
          }}
        >
          {item.label}
        </span>
      )}
    </Link>
  );
}

// ── Desktop Sidebar ─────────────────────────────────────
export function AdminSidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-56 flex-shrink-0 h-screen sticky top-0"
      style={{
        background: "#0B0F1A",
        borderRight: "1px solid #1B2236",
      }}
    >
      {/* Wordmark */}
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "#1B2236" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #0066CC, #00B4FF)",
              boxShadow: "0 0 16px rgba(0,180,255,0.35)",
            }}
          >
            <span className="text-[9px] font-black tracking-tight text-white">
              URR
            </span>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest text-white">
              URRUTIA
            </p>
            <p className="text-[9px] font-mono" style={{ color: "#8B95A8" }}>
              ADMIN
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom: User */}
      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: "#1B2236" }}
      >
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid #1B2236",
          }}
        >
          <div
            className="w-7 h-7 rounded-full grid place-items-center flex-shrink-0"
            style={{ background: "rgba(255,107,26,0.2)" }}
          >
            <span className="text-xs font-bold" style={{ color: "#FF6B1A" }}>
              U
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              Urrutia
            </p>
            <p
              className="text-[9px] font-mono truncate"
              style={{ color: "#8B95A8" }}
            >
              Owner
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Mobile Bottom Nav ────────────────────────────────────
// Shows 5 items (drop SMS Log; accessible from Settings)
const MOBILE_NAV = NAV_ITEMS.filter((i) => i.label !== "SMS Log");

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-md border-t"
      style={{
        background: "rgba(11,15,26,0.94)",
        borderColor: "#1B2236",
      }}
      aria-label="Admin navigation"
    >
      <div className="px-2 py-2 grid grid-cols-5 gap-1">
        {MOBILE_NAV.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
              style={{ color: isActive ? "#00B4FF" : "#8B95A8" }}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className="w-8 h-8 grid place-items-center rounded-lg"
                style={{
                  background: isActive
                    ? "rgba(0,180,255,0.1)"
                    : "transparent",
                }}
              >
                {item.icon}
              </div>
              <span className="text-[9px] font-mono tracking-widest">
                {item.label.toUpperCase().slice(0, 5)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
