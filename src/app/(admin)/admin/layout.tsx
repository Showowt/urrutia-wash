// ═══════════════════════════════════════════════════════
// (admin) Layout — Owner / Admin Console shell
// Desktop: sidebar + top bar + scrollable content area
// Mobile: sticky top bar + bottom tab nav
// Dark theme. Water accents.
// ═══════════════════════════════════════════════════════

import { AdminSidebar, AdminBottomNav } from "@/components/admin/AdminNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URRUTIA Admin",
  description: "Owner dashboard — revenue, members, referrals.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#050810", color: "#F5F7FA" }}
    >
      {/* ── Sidebar (desktop only) ── */}
      <AdminSidebar />

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ── */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 lg:px-8 py-4 backdrop-blur-md border-b"
          style={{
            background: "rgba(5,8,16,0.88)",
            borderColor: "#1B2236",
            minHeight: "64px",
          }}
        >
          {/* Left: mobile logo + page context */}
          <div className="flex items-center gap-3">
            {/* Logo — only shown on mobile (sidebar shows on desktop) */}
            <div
              className="lg:hidden w-8 h-8 rounded-lg grid place-items-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #0066CC, #00B4FF)",
                boxShadow: "0 0 12px rgba(0,180,255,0.3)",
              }}
            >
              <span className="text-[9px] font-black tracking-tight text-white">
                URR
              </span>
            </div>

            <div>
              <p className="text-xs font-mono tracking-widest" style={{ color: "#8B95A8" }}>
                URRUTIA
              </p>
              <p className="text-sm font-bold leading-tight" style={{ color: "#F5F7FA" }}>
                Admin Console
              </p>
            </div>
          </div>

          {/* Right: user chip + actions */}
          <div className="flex items-center gap-3">
            {/* Live dot */}
            <div className="hidden sm:flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 status-live"
                style={{ background: "#10B981" }}
                aria-hidden="true"
              />
              <span className="text-xs font-mono" style={{ color: "#10B981" }}>
                LIVE
              </span>
            </div>

            <div
              className="h-5 w-px mx-1"
              style={{ background: "#1B2236" }}
              aria-hidden="true"
            />

            {/* User identity */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full grid place-items-center"
                style={{
                  background: "rgba(255,107,26,0.15)",
                  border: "1px solid rgba(255,107,26,0.3)",
                }}
              >
                <span
                  className="text-xs font-black"
                  style={{ color: "#FF6B1A" }}
                >
                  U
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-none" style={{ color: "#F5F7FA" }}>
                  Urrutia
                </p>
                <p className="text-[10px] font-mono" style={{ color: "#8B95A8" }}>
                  Owner
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              className="w-8 h-8 rounded-lg grid place-items-center transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1B2236",
                color: "#8B95A8",
              }}
              aria-label="Log out"
              title="Log out"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── Page content ── */}
        <main
          className="flex-1 overflow-y-auto px-5 lg:px-8 pt-6 pb-28 lg:pb-8"
          id="main-content"
        >
          {children}
        </main>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <AdminBottomNav />
    </div>
  );
}
