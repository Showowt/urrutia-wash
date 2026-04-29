"use client";

// ═══════════════════════════════════════════════════════
// Admin Revenue — Breakdown page
// Charts: placeholder (real chart lib in v2)
// Tables: daily totals, member vs walk-in, by service
// ═══════════════════════════════════════════════════════

import DataTable, { Column } from "@/components/admin/DataTable";

// ── Types ────────────────────────────────────────────────
interface DailyRow {
  date: string;
  day: string;
  members: number;
  walkins: number;
  total: number;
  washes: number;
}

interface ServiceRow {
  service: string;
  washes: number;
  revenue: number;
  avgValue: number;
  pct: number;
}

// ── Demo data ────────────────────────────────────────────
const DAILY_DATA: DailyRow[] = [
  { date: "Apr 29", day: "Tue", members: 820, walkins: 425, total: 1245, washes: 14 },
  { date: "Apr 28", day: "Mon", members: 760, walkins: 380, total: 1140, washes: 12 },
  { date: "Apr 27", day: "Sun", members: 0, walkins: 0, total: 0, washes: 0 },
  { date: "Apr 26", day: "Sat", members: 1020, walkins: 640, total: 1660, washes: 22 },
  { date: "Apr 25", day: "Fri", members: 890, walkins: 510, total: 1400, washes: 18 },
  { date: "Apr 24", day: "Thu", members: 740, walkins: 350, total: 1090, washes: 13 },
  { date: "Apr 23", day: "Wed", members: 680, walkins: 310, total: 990, washes: 11 },
  { date: "Apr 22", day: "Tue", members: 600, walkins: 380, total: 980, washes: 13 },
  { date: "Apr 21", day: "Mon", members: 640, walkins: 290, total: 930, washes: 11 },
  { date: "Apr 19", day: "Sat", members: 980, walkins: 590, total: 1570, washes: 20 },
];

const SERVICE_DATA: ServiceRow[] = [
  { service: "Express Hand Wash", washes: 142, revenue: 4970, avgValue: 35, pct: 41 },
  { service: "Wash + Interior", washes: 89, revenue: 6675, avgValue: 75, pct: 37 },
  { service: "Full Detail", washes: 12, revenue: 3540, avgValue: 295, pct: 16 },
  { service: "Ceramic Coating", washes: 3, revenue: 2685, avgValue: 895, pct: 6 },
];

// ── Bar chart placeholder ────────────────────────────────
function RevenueBarChart({ data }: { data: DailyRow[] }) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const visibleData = data.filter((d) => d.total > 0).slice(0, 10).reverse();

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
        border: "1px solid #1B2236",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <p
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: "#8B95A8" }}
        >
          Daily Revenue — Last 10 Days
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-2 rounded-sm"
              style={{ background: "#00B4FF" }}
            />
            <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
              Members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-2 rounded-sm"
              style={{ background: "#FF6B1A" }}
            />
            <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
              Walk-ins
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-40" aria-hidden="true">
        {visibleData.map((d) => {
          const memberH = (d.members / maxTotal) * 100;
          const walkinH = (d.walkins / maxTotal) * 100;
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center gap-0.5"
            >
              <div className="w-full flex flex-col justify-end h-32 gap-0.5">
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${walkinH}%`,
                    background: "rgba(255,107,26,0.7)",
                    minHeight: "4px",
                  }}
                />
                <div
                  className="w-full rounded-b-sm"
                  style={{
                    height: `${memberH}%`,
                    background: "rgba(0,180,255,0.75)",
                    minHeight: "4px",
                  }}
                />
              </div>
              <span className="text-[9px] font-mono" style={{ color: "#8B95A8" }}>
                {d.date.replace("Apr ", "")}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center mt-3" style={{ color: "#8B95A8" }}>
        Full chart integration (Recharts / Chart.js) in production build
      </p>
    </div>
  );
}

// ── Donut placeholder ────────────────────────────────────
function ServiceDonut({ data }: { data: ServiceRow[] }) {
  const total = data.reduce((s, r) => s + r.revenue, 0);

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
        className="text-xs font-mono tracking-widest uppercase mb-5"
        style={{ color: "#8B95A8" }}
      >
        Revenue by Service
      </p>

      {/* Stacked bar as donut proxy */}
      <div className="flex h-3 rounded-full overflow-hidden gap-px mb-5">
        {data.map((row, i) => {
          const colors = ["#00B4FF", "#6366F1", "#FF6B1A", "#10B981"];
          return (
            <div
              key={row.service}
              style={{
                width: `${(row.revenue / total) * 100}%`,
                background: colors[i],
              }}
            />
          );
        })}
      </div>

      <div className="space-y-3">
        {data.map((row, i) => {
          const colors = ["#00B4FF", "#6366F1", "#FF6B1A", "#10B981"];
          return (
            <div key={row.service} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: colors[i] }}
                />
                <span className="text-sm" style={{ color: "#F5F7FA" }}>
                  {row.service}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="text-xs font-mono"
                  style={{ color: "#8B95A8" }}
                >
                  {row.washes} washes
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#F5F7FA" }}
                >
                  ${row.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Member vs Walk-in card ────────────────────────────────
function MemberVsWalkin() {
  const memberRev = 12400;
  const walkinRev = 12160;
  const total = memberRev + walkinRev;
  const memberPct = Math.round((memberRev / total) * 100);
  const walkinPct = 100 - memberPct;

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
        className="text-xs font-mono tracking-widest uppercase mb-5"
        style={{ color: "#8B95A8" }}
      >
        Member vs Walk-in Revenue (This Month)
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(0,180,255,0.06)",
            border: "1px solid rgba(0,180,255,0.2)",
          }}
        >
          <p className="text-xs font-mono mb-1" style={{ color: "#00B4FF" }}>
            MEMBERS
          </p>
          <p className="text-2xl font-black" style={{ color: "#F5F7FA" }}>
            ${memberRev.toLocaleString()}
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: "#8B95A8" }}>
            {memberPct}% of total
          </p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,107,26,0.06)",
            border: "1px solid rgba(255,107,26,0.2)",
          }}
        >
          <p className="text-xs font-mono mb-1" style={{ color: "#FF6B1A" }}>
            WALK-INS
          </p>
          <p className="text-2xl font-black" style={{ color: "#F5F7FA" }}>
            ${walkinRev.toLocaleString()}
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: "#8B95A8" }}>
            {walkinPct}% of total
          </p>
        </div>
      </div>

      <div className="flex h-2 rounded-full overflow-hidden">
        <div
          style={{ width: `${memberPct}%`, background: "#00B4FF" }}
        />
        <div
          style={{ width: `${walkinPct}%`, background: "#FF6B1A" }}
        />
      </div>

      <p
        className="text-xs text-center mt-3 font-bold"
        style={{ color: "#F5F7FA" }}
      >
        Total: ${total.toLocaleString()} this month
      </p>
    </div>
  );
}

// ── Column definitions ────────────────────────────────────
const DAILY_COLUMNS: Column<DailyRow>[] = [
  {
    key: "date",
    header: "Date",
    render: (r) => (
      <span className="font-medium">
        {r.date}{" "}
        <span className="font-mono text-xs" style={{ color: "#8B95A8" }}>
          {r.day}
        </span>
      </span>
    ),
  },
  {
    key: "members",
    header: "Members",
    align: "right",
    render: (r) =>
      r.total === 0 ? (
        <span style={{ color: "#8B95A8" }}>—</span>
      ) : (
        <span style={{ color: "#00B4FF" }}>
          ${r.members.toLocaleString()}
        </span>
      ),
  },
  {
    key: "walkins",
    header: "Walk-ins",
    align: "right",
    render: (r) =>
      r.total === 0 ? (
        <span style={{ color: "#8B95A8" }}>Closed</span>
      ) : (
        <span style={{ color: "#FF6B1A" }}>
          ${r.walkins.toLocaleString()}
        </span>
      ),
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    render: (r) => (
      <span className="font-bold" style={{ color: "#F5F7FA" }}>
        {r.total === 0 ? "—" : `$${r.total.toLocaleString()}`}
      </span>
    ),
  },
  {
    key: "washes",
    header: "Washes",
    align: "right",
    render: (r) => (
      <span className="font-mono" style={{ color: "#8B95A8" }}>
        {r.washes === 0 ? "—" : r.washes}
      </span>
    ),
  },
];

// ── Page ─────────────────────────────────────────────────
export default function AdminRevenuePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
          Revenue
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
          April 2026 · LVAC Henderson
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Today", value: "$1,245", sub: "+27% vs Tue" },
          { label: "This Week", value: "$6,890", sub: "+12% vs last" },
          { label: "This Month", value: "$24,560", sub: "+18% vs Mar" },
          { label: "MRR", value: "$12,400", sub: "from memberships" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
              border: "1px solid #1B2236",
            }}
          >
            <p
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "#8B95A8" }}
            >
              {s.label}
            </p>
            <p
              className="text-2xl font-black mt-1"
              style={{ color: "#F5F7FA" }}
            >
              {s.value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#10B981" }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueBarChart data={DAILY_DATA} />
        </div>
        <MemberVsWalkin />
      </div>

      {/* Service breakdown */}
      <ServiceDonut data={SERVICE_DATA} />

      {/* Daily table */}
      <section aria-labelledby="daily-table-heading">
        <h2
          id="daily-table-heading"
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "#8B95A8" }}
        >
          Daily Totals
        </h2>
        <DataTable
          columns={DAILY_COLUMNS}
          rows={DAILY_DATA}
          keyExtractor={(r) => r.date}
          caption="Daily revenue breakdown"
        />
      </section>
    </div>
  );
}
