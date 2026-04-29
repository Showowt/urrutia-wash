// ═══════════════════════════════════════════════════════
// Member — Membership view
// Apple Wallet-style card · punch card · wash history
// ═══════════════════════════════════════════════════════

import PunchCard from "@/components/app/PunchCard";
import { DEMO_USER, DEMO_HISTORY } from "@/lib/demo-data";

export default function MemberPage() {
  const user = DEMO_USER;
  const history = DEMO_HISTORY;

  const totalSpent = history.reduce((sum, h) => sum + h.amount, 0);

  const memberSinceLong = new Date(user.memberSince).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div>
        <p
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "#FF6B1A" }}
        >
          URRUTIA CLUB
        </p>
        <h2 className="text-3xl font-bold mt-1">{user.tier} Membership</h2>
        <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
          Member since {memberSinceLong}
        </p>
      </div>

      {/* ── Apple Wallet-style card ── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B0F1A 0%, #11172A 50%, #0B0F1A 100%)",
          border: "1px solid #1B2236",
          boxShadow: "0 24px 80px -20px rgba(0,180,255,0.3)",
        }}
      >
        {/* Card header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full grid place-items-center"
              style={{
                background: "linear-gradient(135deg, #0066CC, #00B4FF)",
              }}
            >
              <span className="text-[10px] font-black tracking-tighter">
                URR
              </span>
            </div>
            <p className="font-bold tracking-widest text-sm">URRUTIA</p>
          </div>
          <span
            className="text-[10px] font-mono px-2 py-1 rounded-full"
            style={{ background: "rgba(0,180,255,0.15)", color: "#00B4FF" }}
          >
            {user.tier}
          </span>
        </div>

        {/* Member name */}
        <p
          className="text-xs font-mono tracking-widest mb-1"
          style={{ color: "#8B95A8" }}
        >
          MEMBER
        </p>
        <p className="text-2xl font-bold mb-6">{user.name}</p>

        {/* Footer row */}
        <div className="flex justify-between items-end">
          <div>
            <p
              className="text-[10px] font-mono tracking-widest"
              style={{ color: "#8B95A8" }}
            >
              WASHES THIS CYCLE
            </p>
            <p className="text-xl font-black">
              {user.punchCount}{" "}
              <span className="text-sm font-mono" style={{ color: "#8B95A8" }}>
                / 8
              </span>
            </p>
          </div>
          <p className="text-[10px] font-mono" style={{ color: "#8B95A8" }}>
            RENEWS MAY 12
          </p>
        </div>
      </div>

      {/* ── Add to Apple Wallet ── */}
      <button
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        style={{ background: "#11172A", border: "1px solid #1B2236" }}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M2 11h20" />
        </svg>
        Add to Apple Wallet
      </button>

      {/* ── Punch card ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-xs font-mono tracking-widest"
            style={{ color: "#FF6B1A" }}
          >
            10TH WASH FREE
          </p>
          <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
            {user.punchCount} / 10
          </p>
        </div>
        <PunchCard count={user.punchCount} />
        <p className="text-xs mt-4" style={{ color: "#8B95A8" }}>
          4 more washes until your free one. Tracked automatically by license
          plate.
        </p>
      </div>

      {/* ── Wash history ── */}
      <div>
        <p
          className="font-mono text-[10px] tracking-widest mb-3"
          style={{ color: "#8B95A8" }}
        >
          RECENT WASHES · ${totalSpent} SPENT
        </p>
        <div className="space-y-2">
          {history.map((h) => (
            <div
              key={h.id}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
            >
              <div
                className="w-9 h-9 rounded-lg grid place-items-center shrink-0"
                style={{ background: "rgba(16,185,129,0.1)" }}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{h.service}</p>
                <p
                  className="text-[10px] font-mono"
                  style={{ color: "#8B95A8" }}
                >
                  {h.date} · {h.vehicle.toUpperCase()}
                </p>
              </div>
              <p className="text-sm font-bold shrink-0">${h.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
