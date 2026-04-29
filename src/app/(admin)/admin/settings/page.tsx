"use client";

// ═══════════════════════════════════════════════════════
// Admin Settings — Business configuration
// Hours, service prices, membership tiers, loyalty rules
// All values are editable (demo: no persistence)
// ═══════════════════════════════════════════════════════

import { useState } from "react";

// ── Types ────────────────────────────────────────────────
interface HourRow {
  day: string;
  key: string;
  open: string;
  close: string;
  closed: boolean;
}

interface ServicePrice {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  washesPerMonth: string;
  vehicles: number;
  perks: string;
}

// ── Initial state ─────────────────────────────────────────
const INITIAL_HOURS: HourRow[] = [
  { day: "Monday", key: "mon", open: "07:00", close: "16:30", closed: false },
  { day: "Tuesday", key: "tue", open: "07:00", close: "16:30", closed: false },
  { day: "Wednesday", key: "wed", open: "07:00", close: "16:30", closed: false },
  { day: "Thursday", key: "thu", open: "07:00", close: "16:30", closed: false },
  { day: "Friday", key: "fri", open: "07:00", close: "16:30", closed: false },
  { day: "Saturday", key: "sat", open: "07:00", close: "16:30", closed: false },
  { day: "Sunday", key: "sun", open: "", close: "", closed: true },
];

const INITIAL_SERVICES: ServicePrice[] = [
  { id: "express", name: "Express Hand Wash", price: 35, duration: "30 min" },
  { id: "wash_interior", name: "Wash + Interior", price: 75, duration: "60 min" },
  { id: "full_detail", name: "Full Detail", price: 295, duration: "4 hr" },
  { id: "ceramic", name: "Ceramic Coating", price: 895, duration: "Full day" },
];

const INITIAL_TIERS: MembershipTier[] = [
  {
    id: "solo",
    name: "SOLO",
    price: 89,
    washesPerMonth: "4",
    vehicles: 1,
    perks: "10% off details",
  },
  {
    id: "duo",
    name: "DUO",
    price: 149,
    washesPerMonth: "8",
    vehicles: 2,
    perks: "15% off details, priority booking",
  },
  {
    id: "fleet",
    name: "FLEET",
    price: 279,
    washesPerMonth: "Unlimited",
    vehicles: 4,
    perks: "20% off, mobile included monthly",
  },
];

// ── Sub-components ────────────────────────────────────────
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
        border: "1px solid #1B2236",
      }}
    >
      <h2
        className="text-xs font-mono tracking-widest uppercase"
        style={{ color: "#8B95A8" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-mono mb-1.5" style={{ color: "#8B95A8" }}>
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span
            className="absolute left-3 text-sm font-bold"
            style={{ color: "#8B95A8" }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-2.5 rounded-xl text-sm transition-all field"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #1B2236",
            color: "#F5F7FA",
            paddingLeft: prefix ? "1.75rem" : "0.75rem",
            paddingRight: suffix ? "3rem" : "0.75rem",
          }}
        />
        {suffix && (
          <span
            className="absolute right-3 text-xs font-mono"
            style={{ color: "#8B95A8" }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
      style={{
        background: "linear-gradient(135deg, #0066CC, #00B4FF)",
        color: "#F5F7FA",
        boxShadow: "0 0 20px rgba(0,180,255,0.25)",
      }}
    >
      Save Changes
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [hours, setHours] = useState<HourRow[]>(INITIAL_HOURS);
  const [services, setServices] = useState<ServicePrice[]>(INITIAL_SERVICES);
  const [tiers, setTiers] = useState<MembershipTier[]>(INITIAL_TIERS);
  const [punchGoal, setPunchGoal] = useState("10");
  const [referralCredit, setReferralCredit] = useState("25");
  const [mobileRadius, setMobileRadius] = useState("15");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateHour(
    key: string,
    field: "open" | "close" | "closed",
    value: string | boolean
  ) {
    setHours((prev) =>
      prev.map((h) => (h.key === key ? { ...h, [field]: value } : h))
    );
  }

  function updateServicePrice(id: string, price: string) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: Number(price) } : s))
    );
  }

  function updateTierPrice(id: string, price: string) {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, price: Number(price) } : t))
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
            Business configuration for Urrutia Carwash & Detail
          </p>
        </div>

        {/* Save confirmation */}
        {saved && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              color: "#10B981",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Saved
          </span>
        )}
      </div>

      {/* Business Hours */}
      <SectionCard title="Business Hours">
        <div className="space-y-2">
          {hours.map((row) => (
            <div
              key={row.key}
              className="flex items-center gap-3 flex-wrap"
            >
              <div className="w-28 flex-shrink-0">
                <span className="text-sm font-medium" style={{ color: "#F5F7FA" }}>
                  {row.day}
                </span>
              </div>

              {/* Closed toggle */}
              <button
                role="switch"
                aria-checked={row.closed}
                onClick={() => updateHour(row.key, "closed", !row.closed)}
                className="relative inline-flex items-center w-10 h-5 rounded-full transition-all flex-shrink-0"
                style={{
                  background: row.closed
                    ? "rgba(139,149,168,0.3)"
                    : "rgba(0,180,255,0.4)",
                }}
              >
                <span
                  className="absolute w-4 h-4 rounded-full transition-transform"
                  style={{
                    background: row.closed ? "#8B95A8" : "#00B4FF",
                    transform: row.closed
                      ? "translateX(1px)"
                      : "translateX(22px)",
                    boxShadow: row.closed
                      ? "none"
                      : "0 0 8px rgba(0,180,255,0.6)",
                  }}
                />
              </button>
              <span className="text-xs font-mono w-8 flex-shrink-0" style={{ color: "#8B95A8" }}>
                {row.closed ? "CLOSED" : "OPEN"}
              </span>

              {!row.closed && (
                <>
                  <input
                    type="time"
                    value={row.open}
                    onChange={(e) => updateHour(row.key, "open", e.target.value)}
                    className="field rounded-lg px-2 py-1.5 text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid #1B2236",
                      color: "#F5F7FA",
                    }}
                    aria-label={`${row.day} opening time`}
                  />
                  <span className="text-xs" style={{ color: "#8B95A8" }}>
                    to
                  </span>
                  <input
                    type="time"
                    value={row.close}
                    onChange={(e) => updateHour(row.key, "close", e.target.value)}
                    className="field rounded-lg px-2 py-1.5 text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid #1B2236",
                      color: "#F5F7FA",
                    }}
                    aria-label={`${row.day} closing time`}
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <SaveButton onClick={handleSave} />
      </SectionCard>

      {/* Service Prices */}
      <SectionCard title="Service Prices">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((svc) => (
            <TextInput
              key={svc.id}
              label={`${svc.name} (${svc.duration})`}
              value={svc.price}
              onChange={(v) => updateServicePrice(svc.id, v)}
              prefix="$"
              type="number"
            />
          ))}
        </div>
        <SaveButton onClick={handleSave} />
      </SectionCard>

      {/* Membership Tier Prices */}
      <SectionCard title="Membership Tiers">
        <div className="space-y-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center justify-between gap-4 p-4 rounded-xl flex-wrap"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #1B2236",
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: "#F5F7FA" }}>
                  {tier.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#8B95A8" }}>
                  {tier.washesPerMonth} washes/mo · {tier.vehicles} vehicle
                  {tier.vehicles > 1 ? "s" : ""}
                </p>
                <p className="text-xs" style={{ color: "#8B95A8" }}>
                  {tier.perks}
                </p>
              </div>
              <div className="flex-shrink-0 w-28">
                <TextInput
                  label="Monthly price"
                  value={tier.price}
                  onChange={(v) => updateTierPrice(tier.id, v)}
                  prefix="$"
                  suffix="/mo"
                  type="number"
                />
              </div>
            </div>
          ))}
        </div>
        <SaveButton onClick={handleSave} />
      </SectionCard>

      {/* Loyalty + Referral Rules */}
      <SectionCard title="Loyalty & Referral Rules">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput
            label="Punch Card Goal (free wash after N)"
            value={punchGoal}
            onChange={setPunchGoal}
            suffix="washes"
            type="number"
          />
          <TextInput
            label="Referral Credit (referrer + friend)"
            value={referralCredit}
            onChange={setReferralCredit}
            prefix="$"
            type="number"
          />
          <TextInput
            label="Mobile Service Radius"
            value={mobileRadius}
            onChange={setMobileRadius}
            suffix="miles"
            type="number"
          />
        </div>
        <SaveButton onClick={handleSave} />
      </SectionCard>

      {/* Danger zone */}
      <SectionCard title="Danger Zone">
        <p className="text-sm" style={{ color: "#8B95A8" }}>
          Destructive actions. These cannot be undone. All changes are logged
          to the audit trail.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(255,68,68,0.06)",
              border: "1px solid rgba(255,68,68,0.2)",
              color: "#FF4444",
            }}
          >
            Reset Punch Cards
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(255,68,68,0.06)",
              border: "1px solid rgba(255,68,68,0.2)",
              color: "#FF4444",
            }}
          >
            Export All Data
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
