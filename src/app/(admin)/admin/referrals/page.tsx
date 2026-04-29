"use client";

// ═══════════════════════════════════════════════════════
// Admin Referrals — Leaderboard + conversion + activity
// All data hardcoded for demo.
// ═══════════════════════════════════════════════════════

import DataTable, { Column } from "@/components/admin/DataTable";
import KpiCard from "@/components/admin/KpiCard";

// ── Types ────────────────────────────────────────────────
interface Referrer {
  rank: number;
  name: string;
  referrals: number;
  converted: number;
  creditsEarned: number;
  lastReferral: string;
}

interface ReferralActivity {
  id: string;
  referrer: string;
  referred: string;
  status: "pending" | "signed_up" | "converted" | "expired";
  date: string;
  credit: number;
}

// ── Demo data ────────────────────────────────────────────
const LEADERBOARD: Referrer[] = [
  { rank: 1, name: "Diego Ramirez", referrals: 8, converted: 6, creditsEarned: 150, lastReferral: "Apr 27" },
  { rank: 2, name: "Marcus Reed", referrals: 5, converted: 3, creditsEarned: 75, lastReferral: "Apr 22" },
  { rank: 3, name: "Priya Patel", referrals: 4, converted: 3, creditsEarned: 75, lastReferral: "Apr 25" },
  { rank: 4, name: "Aaliyah Johnson", referrals: 3, converted: 2, creditsEarned: 50, lastReferral: "Apr 20" },
  { rank: 5, name: "Tyler Washington", referrals: 2, converted: 2, creditsEarned: 50, lastReferral: "Apr 28" },
  { rank: 6, name: "Sophia Torres", referrals: 2, converted: 1, creditsEarned: 25, lastReferral: "Apr 15" },
  { rank: 7, name: "Connor Walsh", referrals: 1, converted: 1, creditsEarned: 25, lastReferral: "Apr 10" },
];

const RECENT_ACTIVITY: ReferralActivity[] = [
  { id: "r1", referrer: "Diego Ramirez", referred: "Carlos M.", status: "converted", date: "Apr 27", credit: 25 },
  { id: "r2", referrer: "Tyler Washington", referred: "Nina K.", status: "converted", date: "Apr 28", credit: 25 },
  { id: "r3", referrer: "Marcus Reed", referred: "Omar S.", status: "signed_up", date: "Apr 26", credit: 0 },
  { id: "r4", referrer: "Priya Patel", referred: "Lena T.", status: "converted", date: "Apr 25", credit: 25 },
  { id: "r5", referrer: "Sophia Torres", referred: "Brandon X.", status: "pending", date: "Apr 15", credit: 0 },
  { id: "r6", referrer: "Aaliyah Johnson", referred: "Kai R.", status: "expired", date: "Apr 1", credit: 0 },
];

// ── Helpers ──────────────────────────────────────────────
function StatusPill({ status }: { status: ReferralActivity["status"] }) {
  const map: Record<
    ReferralActivity["status"],
    { label: string; color: string; bg: string }
  > = {
    converted: { label: "Converted", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    signed_up: { label: "Signed Up", color: "#00B4FF", bg: "rgba(0,180,255,0.1)" },
    pending: { label: "Pending", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    expired: { label: "Expired", color: "#8B95A8", bg: "rgba(139,149,168,0.1)" },
  };
  const c = map[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: c.color, background: c.bg }}
    >
      {c.label}
    </span>
  );
}

// ── Column definitions ────────────────────────────────────
const LEADERBOARD_COLUMNS: Column<Referrer>[] = [
  {
    key: "rank",
    header: "#",
    align: "center",
    width: "w-12",
    render: (r) => {
      const medal: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
      return (
        <span className="font-mono font-bold text-sm">
          {medal[r.rank] ?? r.rank}
        </span>
      );
    },
  },
  {
    key: "name",
    header: "Member",
    render: (r) => (
      <span className="font-semibold" style={{ color: "#F5F7FA" }}>
        {r.name}
      </span>
    ),
  },
  {
    key: "referrals",
    header: "Referrals",
    align: "right",
    render: (r) => (
      <span className="font-mono" style={{ color: "#F5F7FA" }}>
        {r.referrals}
      </span>
    ),
  },
  {
    key: "converted",
    header: "Converted",
    align: "right",
    render: (r) => (
      <span className="font-mono" style={{ color: "#10B981" }}>
        {r.converted}
      </span>
    ),
  },
  {
    key: "rate",
    header: "Conv. %",
    align: "right",
    render: (r) => {
      const rate = Math.round((r.converted / r.referrals) * 100);
      return (
        <span
          className="font-mono text-xs px-2 py-0.5 rounded-full"
          style={{
            color: rate >= 50 ? "#10B981" : "#F59E0B",
            background:
              rate >= 50
                ? "rgba(16,185,129,0.1)"
                : "rgba(245,158,11,0.1)",
          }}
        >
          {rate}%
        </span>
      );
    },
  },
  {
    key: "credits",
    header: "Credits Earned",
    align: "right",
    render: (r) => (
      <span className="font-bold" style={{ color: "#00B4FF" }}>
        ${r.creditsEarned}
      </span>
    ),
  },
  {
    key: "lastReferral",
    header: "Last",
    render: (r) => (
      <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
        {r.lastReferral}
      </span>
    ),
  },
];

const ACTIVITY_COLUMNS: Column<ReferralActivity>[] = [
  {
    key: "referrer",
    header: "Referrer",
    render: (r) => (
      <span className="font-medium" style={{ color: "#F5F7FA" }}>
        {r.referrer}
      </span>
    ),
  },
  {
    key: "referred",
    header: "Referred",
    render: (r) => (
      <span style={{ color: "#8B95A8" }}>{r.referred}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <StatusPill status={r.status} />,
  },
  {
    key: "date",
    header: "Date",
    render: (r) => (
      <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
        {r.date}
      </span>
    ),
  },
  {
    key: "credit",
    header: "Credit Paid",
    align: "right",
    render: (r) => (
      <span
        className="font-mono"
        style={{ color: r.credit > 0 ? "#10B981" : "#8B95A8" }}
      >
        {r.credit > 0 ? `$${r.credit}` : "—"}
      </span>
    ),
  },
];

// ── Page ─────────────────────────────────────────────────
export default function AdminReferralsPage() {
  const totalReferrals = LEADERBOARD.reduce((s, r) => s + r.referrals, 0);
  const totalConverted = LEADERBOARD.reduce((s, r) => s + r.converted, 0);
  const totalCredits = LEADERBOARD.reduce((s, r) => s + r.creditsEarned, 0);
  const convRate = Math.round((totalConverted / totalReferrals) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
          Referrals
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
          All-time leaderboard and recent activity
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Total Referrals"
          value={String(totalReferrals)}
          trend={28}
          trendLabel="vs last month"
          accent="water"
        />
        <KpiCard
          label="Converted"
          value={String(totalConverted)}
          trend={18}
          trendLabel="vs last month"
          accent="success"
        />
        <KpiCard
          label="Conv. Rate"
          value={`${convRate}%`}
          trend={5}
          trendLabel="vs last month"
          accent="water"
        />
        <KpiCard
          label="Credits Issued"
          value={`$${totalCredits}`}
          trend={22}
          trendLabel="vs last month"
          accent="flame"
        />
      </div>

      {/* Leaderboard */}
      <section aria-labelledby="leaderboard-heading">
        <h2
          id="leaderboard-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Top Referrers — All Time
        </h2>
        <DataTable
          columns={LEADERBOARD_COLUMNS}
          rows={LEADERBOARD}
          keyExtractor={(r) => String(r.rank)}
          caption="Referral leaderboard"
        />
      </section>

      {/* Recent activity */}
      <section aria-labelledby="activity-heading">
        <h2
          id="activity-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Recent Referral Activity
        </h2>
        <DataTable
          columns={ACTIVITY_COLUMNS}
          rows={RECENT_ACTIVITY}
          keyExtractor={(r) => r.id}
          caption="Recent referral activity"
        />
      </section>

      {/* Mechanics card */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(0,180,255,0.04)",
          border: "1px solid rgba(0,180,255,0.15)",
        }}
      >
        <p
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#00B4FF" }}
        >
          Referral Program — Current Terms
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Referrer earns", value: "$25 credit" },
            { label: "Friend earns", value: "$25 credit" },
            { label: "Trigger", value: "Friend&apos;s first wash" },
            { label: "Expires", value: "90 days after signup" },
            { label: "Code format", value: "NAME-XXXX" },
            { label: "Max per month", value: "Unlimited" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
                {item.label}
              </p>
              <p
                className="text-sm font-bold mt-0.5"
                style={{ color: "#F5F7FA" }}
                dangerouslySetInnerHTML={{ __html: item.value }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
