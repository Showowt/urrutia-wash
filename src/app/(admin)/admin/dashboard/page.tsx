"use client";

// ═══════════════════════════════════════════════════════
// Admin Dashboard — KPI Overview
// Revenue, MRR, Members, Churn, Walk-ins, Referrals
// All data hardcoded for demo. Wire to /api/admin/kpis.
// ═══════════════════════════════════════════════════════

import KpiCard from "@/components/admin/KpiCard";

// ── Demo data ────────────────────────────────────────────
const WEEK_SPARK = [
  { value: 68 },
  { value: 74 },
  { value: 55 },
  { value: 82 },
  { value: 91 },
  { value: 78 },
  { value: 100 }, // today
];

const MRR_SPARK = [
  { value: 81 },
  { value: 84 },
  { value: 84 },
  { value: 88 },
  { value: 91 },
  { value: 94 },
  { value: 100 },
];

const WASH_SPARK = [
  { value: 60 },
  { value: 72 },
  { value: 58 },
  { value: 80 },
  { value: 90 },
  { value: 75 },
  { value: 100 },
];

const MEMBERS_SPARK = [
  { value: 72 },
  { value: 75 },
  { value: 79 },
  { value: 82 },
  { value: 86 },
  { value: 92 },
  { value: 100 },
];

// ── Tier breakdown component ─────────────────────────────
function TierBreakdown() {
  const tiers = [
    { label: "SOLO", count: 42, color: "#00B4FF", pct: 45 },
    { label: "DUO", count: 38, color: "#6366F1", pct: 40 },
    { label: "FLEET", count: 14, color: "#FF6B1A", pct: 15 },
  ] as const;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
        border: "1px solid #1B2236",
      }}
    >
      <p
        className="text-xs font-mono tracking-widest uppercase mb-4"
        style={{ color: "#8B95A8" }}
      >
        Members by Tier
      </p>

      <div className="flex items-end gap-4 mb-5">
        <span className="text-3xl font-black" style={{ color: "#F5F7FA" }}>
          94
        </span>
        <span className="text-sm font-mono pb-0.5" style={{ color: "#8B95A8" }}>
          active
        </span>
      </div>

      <div className="space-y-3">
        {tiers.map((tier) => (
          <div key={tier.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: tier.color }}
                />
                <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
                  {tier.label}
                </span>
              </div>
              <span className="text-xs font-bold" style={{ color: "#F5F7FA" }}>
                {tier.count}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${tier.pct}%`, background: tier.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent activity feed ──────────────────────────────────
function ActivityFeed() {
  const events = [
    {
      icon: "member",
      text: "Diego R. joined SOLO",
      time: "12 min ago",
      color: "#00B4FF",
    },
    {
      icon: "wash",
      text: "8 walk-ins completed today",
      time: "ongoing",
      color: "#10B981",
    },
    {
      icon: "referral",
      text: "3 referrals converted this week",
      time: "this week",
      color: "#6366F1",
    },
    {
      icon: "churn",
      text: "1 cancellation: Maria L. (SOLO)",
      time: "2 hr ago",
      color: "#FF4444",
    },
    {
      icon: "revenue",
      text: "Daily revenue target hit: +27%",
      time: "today",
      color: "#10B981",
    },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    member: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0116 0v1" />
      </svg>
    ),
    wash: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    referral: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
    churn: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    revenue: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
        border: "1px solid #1B2236",
      }}
    >
      <p
        className="text-xs font-mono tracking-widest uppercase mb-4"
        style={{ color: "#8B95A8" }}
      >
        Recent Activity
      </p>

      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-lg grid place-items-center flex-shrink-0 mt-0.5"
              style={{ background: `${ev.color}18` }}
            >
              <span style={{ color: ev.color }}>{iconMap[ev.icon]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug" style={{ color: "#F5F7FA" }}>
                {ev.text}
              </p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                {ev.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
          Tuesday, April 29, 2026 · LVAC Henderson
        </p>
      </div>

      {/* ── Revenue KPIs ── */}
      <section aria-labelledby="revenue-heading">
        <h2
          id="revenue-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Revenue
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            label="Revenue Today"
            value="$1,245"
            subValue="(vs $980 last Tue)"
            trend={27}
            trendLabel="vs same day last week"
            accent="water"
            spark={WEEK_SPARK}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            }
          />
          <KpiCard
            label="Revenue This Week"
            value="$6,890"
            trend={12}
            trendLabel="vs last week"
            accent="water"
            spark={WEEK_SPARK}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          />
          <KpiCard
            label="Revenue This Month"
            value="$24,560"
            trend={18}
            trendLabel="vs last month"
            accent="water"
            spark={WEEK_SPARK}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            }
          />
          <KpiCard
            label="MRR"
            value="$12,400"
            subValue="ARR $148,800"
            trend={8}
            trendLabel="vs last month"
            accent="success"
            spark={MRR_SPARK}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ── Operations KPIs ── */}
      <section aria-labelledby="ops-heading">
        <h2
          id="ops-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Today&apos;s Operations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard
            label="Walk-ins Today"
            value="8"
            trend={14}
            trendLabel="vs yesterday"
            accent="flame"
            spark={WASH_SPARK}
          />
          <KpiCard
            label="Total Washes Today"
            value="14"
            trend={17}
            trendLabel="vs yesterday"
            accent="water"
            spark={WASH_SPARK}
          />
          <KpiCard
            label="Avg Wash Value"
            value="$62"
            trend={4}
            trendLabel="vs last week"
            accent="neutral"
          />
          <KpiCard
            label="Referral Conv. Rate"
            value="34%"
            trend={2}
            trendLabel="vs last month"
            accent="neutral"
          />
        </div>
      </section>

      {/* ── Member KPIs + tier + activity ── */}
      <section aria-labelledby="members-heading">
        <h2
          id="members-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Membership
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* KPI column */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <KpiCard
              label="Active Members"
              value="94"
              trend={15}
              trendLabel="vs last month"
              accent="water"
              spark={MEMBERS_SPARK}
            />
            <KpiCard
              label="New This Month"
              value="12"
              trend={33}
              trendLabel="vs last month"
              accent="success"
            />
            <KpiCard
              label="Churn This Month"
              value="3"
              trend={-25}
              trendLabel="vs last month"
              accent="neutral"
            />
            <KpiCard
              label="Net Revenue Retention"
              value="108%"
              trend={3}
              trendLabel="vs last month"
              accent="success"
            />
            <KpiCard
              label="LTV / CAC Ratio"
              value="4.2x"
              trend={6}
              trendLabel="vs last quarter"
              accent="water"
            />
            <KpiCard
              label="Avg Wash Freq."
              value="1.7×"
              subValue="/ week"
              trend={8}
              trendLabel="vs last month"
              accent="neutral"
            />
          </div>

          {/* Tier breakdown */}
          <div className="space-y-4">
            <TierBreakdown />
          </div>
        </div>
      </section>

      {/* ── Activity feed ── */}
      <section aria-labelledby="activity-heading">
        <h2
          id="activity-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityFeed />

          {/* Quick links */}
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
              border: "1px solid #1B2236",
            }}
          >
            <p
              className="text-xs font-mono tracking-widest uppercase mb-4"
              style={{ color: "#8B95A8" }}
            >
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "View Members", href: "/admin/members", color: "#00B4FF" },
                { label: "Revenue Detail", href: "/admin/revenue", color: "#00B4FF" },
                { label: "Referral Board", href: "/admin/referrals", color: "#6366F1" },
                { label: "SMS Log", href: "/admin/sms", color: "#8B95A8" },
                { label: "Comp a Wash", href: "/admin/members", color: "#FF6B1A" },
                { label: "Settings", href: "/admin/settings", color: "#8B95A8" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid #1B2236",
                    color: action.color,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      `${action.color}40`;
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      `${action.color}0D`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "#1B2236";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.035)";
                  }}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
