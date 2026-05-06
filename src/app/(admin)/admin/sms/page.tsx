"use client";

// ═══════════════════════════════════════════════════════
// Admin SMS Log — Delivery audit trail
// Demo data. TCPA-required audit log.
// ═══════════════════════════════════════════════════════

import DataTable, { Column } from "@/components/admin/DataTable";
import KpiCard from "@/components/admin/KpiCard";

// ── Types ────────────────────────────────────────────────
interface SmsEntry {
  id: string;
  to: string;
  name: string;
  template: string;
  body: string;
  status: "delivered" | "sent" | "failed" | "opted_out";
  sentAt: string;
  twilioSid: string;
}

// ── Demo data ────────────────────────────────────────────
const SMS_LOG: SmsEntry[] = [
  {
    id: "s1",
    to: "+17025550142",
    name: "Marcus Reed",
    template: "wash_ready",
    body: "Your Raptor is ready for pickup at LVAC Henderson. Thanks!",
    status: "delivered",
    sentAt: "Apr 29, 9:41 AM",
    twilioSid: "SM1a2b3c4d",
  },
  {
    id: "s2",
    to: "+17025550198",
    name: "Sophia Torres",
    template: "booking_confirmed",
    body: "Urrutia: Wash booked for Apr 30 at 8:30 AM. Reply STOP to opt out.",
    status: "delivered",
    sentAt: "Apr 29, 9:15 AM",
    twilioSid: "SM2b3c4d5e",
  },
  {
    id: "s3",
    to: "+17025550210",
    name: "Diego Ramirez",
    template: "referral_credit",
    body: "$25 credit added! Your code worked. Total credits: $150",
    status: "delivered",
    sentAt: "Apr 29, 8:52 AM",
    twilioSid: "SM3c4d5e6f",
  },
  {
    id: "s4",
    to: "+17025550301",
    name: "Aaliyah Johnson",
    template: "wash_started",
    body: "Your M340i is now being washed. Track: washduringworkout.com/track/abc123",
    status: "delivered",
    sentAt: "Apr 29, 8:30 AM",
    twilioSid: "SM4d5e6f7g",
  },
  {
    id: "s5",
    to: "+17025550411",
    name: "James Kim",
    template: "member_renewal_reminder",
    body: "Your SOLO membership renews May 1 for $89. Manage: washduringworkout.com/member",
    status: "sent",
    sentAt: "Apr 29, 8:00 AM",
    twilioSid: "SM5e6f7g8h",
  },
  {
    id: "s6",
    to: "+17025550502",
    name: "Maria Lopez",
    template: "member_cancelled",
    body: "Membership ends Apr 30. We're sorry to see you go. Reactivate anytime: washduringworkout.com/member",
    status: "delivered",
    sentAt: "Apr 28, 4:12 PM",
    twilioSid: "SM6f7g8h9i",
  },
  {
    id: "s7",
    to: "+17025550603",
    name: "Tyler Washington",
    template: "punch_milestone",
    body: "Only 2 washes until your free wash!",
    status: "delivered",
    sentAt: "Apr 28, 2:30 PM",
    twilioSid: "SM7g8h9i0j",
  },
  {
    id: "s8",
    to: "+17025550714",
    name: "Priya Patel",
    template: "referral_signup",
    body: "Lena T. just signed up using your code. They'll wash, you'll earn $25.",
    status: "delivered",
    sentAt: "Apr 28, 11:44 AM",
    twilioSid: "SM8h9i0j1k",
  },
  {
    id: "s9",
    to: "+17025550815",
    name: "Connor Walsh",
    template: "booking_confirmed",
    body: "Urrutia: Wash booked for Apr 25 at 10:00 AM. Reply STOP to opt out.",
    status: "delivered",
    sentAt: "Apr 24, 3:20 PM",
    twilioSid: "SM9i0j1k2l",
  },
  {
    id: "s10",
    to: "+17025550916",
    name: "Natalie Vega",
    template: "wash_almost_ready",
    body: "Almost done! Your Civic ready in ~5 min.",
    status: "failed",
    sentAt: "Apr 23, 1:15 PM",
    twilioSid: "SM0j1k2l3m",
  },
];

// ── Sub-components ────────────────────────────────────────
function SmsStatusPill({ status }: { status: SmsEntry["status"] }) {
  const map: Record<
    SmsEntry["status"],
    { label: string; color: string; bg: string }
  > = {
    delivered: { label: "Delivered", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    sent: { label: "Sent", color: "#00B4FF", bg: "rgba(0,180,255,0.1)" },
    failed: { label: "Failed", color: "#FF4444", bg: "rgba(255,68,68,0.1)" },
    opted_out: { label: "Opted Out", color: "#8B95A8", bg: "rgba(139,149,168,0.1)" },
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
const COLUMNS: Column<SmsEntry>[] = [
  {
    key: "sentAt",
    header: "Time",
    render: (r) => (
      <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
        {r.sentAt}
      </span>
    ),
  },
  {
    key: "to",
    header: "Recipient",
    render: (r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "#F5F7FA" }}>
          {r.name}
        </p>
        <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
          {r.to}
        </p>
      </div>
    ),
  },
  {
    key: "template",
    header: "Template",
    render: (r) => (
      <span
        className="inline-block px-2 py-0.5 rounded text-xs font-mono"
        style={{
          background: "rgba(0,180,255,0.06)",
          color: "#00B4FF",
        }}
      >
        {r.template}
      </span>
    ),
  },
  {
    key: "body",
    header: "Message",
    render: (r) => (
      <p
        className="text-sm max-w-xs truncate"
        style={{ color: "#8B95A8" }}
        title={r.body}
      >
        {r.body}
      </p>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <SmsStatusPill status={r.status} />,
  },
  {
    key: "twilioSid",
    header: "Twilio SID",
    render: (r) => (
      <span className="text-xs font-mono" style={{ color: "#8B95A8" }}>
        {r.twilioSid}
      </span>
    ),
  },
];

// ── Page ─────────────────────────────────────────────────
export default function AdminSmsPage() {
  const delivered = SMS_LOG.filter((s) => s.status === "delivered").length;
  const failed = SMS_LOG.filter((s) => s.status === "failed").length;
  const deliveryRate = Math.round((delivered / SMS_LOG.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
          SMS Log
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
          TCPA-compliant delivery audit trail
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Total Sent" value={String(SMS_LOG.length)} accent="water" />
        <KpiCard
          label="Delivered"
          value={String(delivered)}
          accent="success"
        />
        <KpiCard
          label="Delivery Rate"
          value={`${deliveryRate}%`}
          trend={2}
          trendLabel="vs last week"
          accent="success"
        />
        <KpiCard
          label="Failed"
          value={String(failed)}
          accent={failed > 0 ? "flame" : "neutral"}
        />
      </div>

      {/* Log table */}
      <section aria-labelledby="sms-log-heading">
        <div className="flex items-center justify-between mb-3">
          <h2
            id="sms-log-heading"
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "#8B95A8" }}
          >
            Message Log
          </h2>
          <button
            className="text-xs font-mono px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #1B2236",
              color: "#8B95A8",
            }}
          >
            Export CSV
          </button>
        </div>
        <DataTable
          columns={COLUMNS}
          rows={SMS_LOG}
          keyExtractor={(r) => r.id}
          caption="SMS delivery log"
        />
      </section>

      {/* TCPA note */}
      <div
        className="rounded-2xl p-4 text-sm"
        style={{
          background: "rgba(245,158,11,0.05)",
          border: "1px solid rgba(245,158,11,0.15)",
          color: "#8B95A8",
        }}
      >
        <span className="font-bold" style={{ color: "#F59E0B" }}>
          TCPA Compliance Note:
        </span>{" "}
        All marketing messages include opt-out instructions. STOP requests are
        processed automatically and recorded in the consent log. No marketing
        messages are sent outside 8 AM – 9 PM local time. This log is retained
        for 7 years per telecommunications law requirements.
      </div>
    </div>
  );
}
