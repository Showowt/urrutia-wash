// ═══════════════════════════════════════════════════════
// (app) Layout — Customer PWA shell
// Sticky header + bottom tab nav + centered max-w-md
// ═══════════════════════════════════════════════════════

import BottomNav from "@/components/app/BottomNav";
import { DEMO_USER } from "@/lib/demo-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URRUTIA App",
  description: "Your URRUTIA membership, bookings, and wash status.",
  robots: { index: false, follow: false },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white" style={{ background: "#050810" }}>
      <div className="max-w-md mx-auto pb-32 relative">
        {/* ── Header ── */}
        <header
          className="sticky top-0 z-30 backdrop-blur-md border-b"
          style={{
            background: "rgba(5,8,16,0.85)",
            borderColor: "#1B2236",
          }}
        >
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Logo mark */}
              <div
                className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                style={{
                  boxShadow: "0 0 24px rgba(0,180,255,0.45)",
                }}
              >
                <img
                  src="/video/logo-poster.jpg"
                  alt="URRUTIA"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold tracking-widest">URRUTIA</p>
                <p
                  className="text-[10px] font-mono"
                  style={{ color: "#8B95A8" }}
                >
                  {DEMO_USER.name.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Notification bell */}
            <button
              className="w-9 h-9 rounded-full grid place-items-center"
              style={{ background: "#11172A", border: "1px solid #1B2236" }}
              aria-label="Notifications"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="px-5 pt-5 space-y-5">{children}</main>

        {/* ── Bottom tab bar ── */}
        <BottomNav />
      </div>
    </div>
  );
}
