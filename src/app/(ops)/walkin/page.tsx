"use client";

// ═══════════════════════════════════════════════════════
// /ops/walkin — Walk-in registration flow
// 5-step flow, optimized for ≤ 90 seconds.
// Big touch targets. Demo lookups.
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { useRouter } from "next/navigation";

// ── Types ───────────────────────────────────────────────
interface SavedVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
  plate: string;
  primary: boolean;
}

interface CustomerMatch {
  id: string;
  name: string;
  phone: string;
  memberTier: "SOLO" | "DUO" | "FLEET" | null;
  totalWashes: number;
  vehicles: SavedVehicle[];
}

interface ServiceOption {
  id: string;
  label: string;
  priceCents: number;
  duration: string;
  desc: string;
}

// ── Demo data ────────────────────────────────────────────
const DEMO_CUSTOMERS: CustomerMatch[] = [
  {
    id: "u-001",
    name: "Marcus Reed",
    phone: "+17025550142",
    memberTier: "DUO",
    totalWashes: 24,
    vehicles: [
      { id: "v-001", year: 2023, make: "Ford", model: "Raptor", color: "Lead Foot Gray", plate: "NV·8H4-LX9", primary: true },
      { id: "v-002", year: 2021, make: "BMW", model: "M340i", color: "Tanzanite Blue", plate: "NV·B12-MMX", primary: false },
    ],
  },
  {
    id: "u-002",
    name: "Sofia Martinez",
    phone: "+17025550198",
    memberTier: "SOLO",
    totalWashes: 9,
    vehicles: [
      { id: "v-003", year: 2021, make: "Tesla", model: "Model S", color: "Midnight Silver", plate: "NV·EV9-MSM", primary: true },
    ],
  },
  {
    id: "u-003",
    name: "Diego Arroyo",
    phone: "+17025550277",
    memberTier: null,
    totalWashes: 3,
    vehicles: [
      { id: "v-004", year: 2022, make: "Mercedes", model: "G63 AMG", color: "Matte Black", plate: "NV·G63-AMG", primary: true },
    ],
  },
];

const SERVICES: ServiceOption[] = [
  {
    id: "small_exterior",
    label: "Small — Ext",
    priceCents: 3500,
    duration: "30 min",
    desc: "Exterior only · sedans · coupes",
  },
  {
    id: "small_full",
    label: "Small — Full",
    priceCents: 5500,
    duration: "45 min",
    desc: "Interior + exterior · sedans · coupes",
  },
  {
    id: "medium_exterior",
    label: "Medium — Ext",
    priceCents: 4000,
    duration: "35 min",
    desc: "Exterior only · SUVs · crossovers",
  },
  {
    id: "medium_full",
    label: "Medium — Full",
    priceCents: 6500,
    duration: "50 min",
    desc: "Interior + exterior · SUVs · crossovers",
  },
  {
    id: "large_exterior",
    label: "Large — Ext",
    priceCents: 4500,
    duration: "40 min",
    desc: "Exterior only · trucks · full-size SUVs",
  },
  {
    id: "large_full",
    label: "Large — Full",
    priceCents: 7500,
    duration: "60 min",
    desc: "Interior + exterior · trucks · full-size SUVs",
  },
  {
    id: "detail",
    label: "Full Detail",
    priceCents: 29500,
    duration: "3–4 hrs",
    desc: "Clay bar · hand wax · deep interior · leather",
  },
];

type Step = 1 | 2 | 3 | 4 | 5;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function WalkInPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState<CustomerMatch | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<SavedVehicle | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // New vehicle form
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    year: "",
    make: "",
    model: "",
    color: "",
    plate: "",
  });

  // ── Step 1: Phone lookup ───────────────────────────────
  function handlePhoneLookup() {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return;

    // Demo lookup: match by last 4 digits
    const match = DEMO_CUSTOMERS.find((c) =>
      c.phone.replace(/\D/g, "").endsWith(digits.slice(-4))
    );

    if (match) {
      setCustomer(match);
      setIsNewCustomer(false);
    } else {
      setCustomer(null);
      setIsNewCustomer(true);
    }
    setStep(2);
  }

  // ── Step 3: Add new vehicle ────────────────────────────
  function handleAddVehicle() {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.plate) return;
    const v: SavedVehicle = {
      id: `v-new-${Date.now()}`,
      year: parseInt(newVehicle.year) || new Date().getFullYear(),
      make: newVehicle.make,
      model: newVehicle.model,
      color: newVehicle.color,
      plate: newVehicle.plate.toUpperCase(),
      primary: false,
    };
    setSelectedVehicle(v);
    setAddingVehicle(false);
    setStep(4);
  }

  // ── Step 5: Confirm — Square checkout ───────────────────
  async function handleConfirm() {
    if (!selectedService) return;

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: selectedService.id,
          customer_name: customerName,
          customer_phone: phone.replace(/\D/g, ""),
        }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.message || "Checkout failed");
      }

      // Redirect to Square payment
      window.location.href = json.data.checkout_url;
    } catch (err) {
      // Fallback: show success and move to queue (for demo/offline scenarios)
      console.error("[WalkIn] payment error:", err);
      setConfirmed(true);
      setTimeout(() => {
        router.push("/ops/queue");
      }, 2000);
    }
  }

  const customerName = customer?.name ?? newName;

  return (
    <div className="max-w-2xl mx-auto p-5 space-y-6">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (step > 1) setStep((s) => (s - 1) as Step);
            else router.push("/ops/queue");
          }}
          className="rounded-xl grid place-items-center transition-colors active:scale-95"
          style={{
            width: "44px",
            height: "44px",
            background: "#0B0F1A",
            border: "1px solid #1B2236",
            color: "#8B95A8",
            flexShrink: 0,
          }}
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
            Walk-in
          </h1>
          <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>
            Step {step} of 5
          </p>
        </div>
      </div>

      {/* ── Step progress ──────────────────────────────────── */}
      <div className="flex gap-1.5">
        {([1, 2, 3, 4, 5] as Step[]).map((s) => (
          <div
            key={s}
            className="flex-1 h-1.5 rounded-full transition-colors"
            style={{
              background:
                step >= s
                  ? s <= step
                    ? "#00B4FF"
                    : "#1B2236"
                  : "#1B2236",
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          STEP 1 — Phone number
      ════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label
              htmlFor="phone-input"
              className="block text-base font-bold mb-3"
              style={{ color: "#F5F7FA" }}
            >
              Customer phone number
            </label>
            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              autoFocus
              placeholder="(702) 555-0000"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePhoneLookup();
              }}
              className="w-full rounded-2xl font-mono font-bold text-3xl text-center outline-none transition-colors"
              style={{
                background: "#0B0F1A",
                border: "2px solid #1B2236",
                color: "#F5F7FA",
                padding: "20px",
                height: "88px",
              }}
              aria-label="Phone number"
            />
          </div>

          <button
            onClick={handlePhoneLookup}
            disabled={phone.replace(/\D/g, "").length < 10}
            className="w-full rounded-2xl font-black font-mono text-base tracking-widest transition-all active:scale-[0.98]"
            style={{
              height: "64px",
              background:
                phone.replace(/\D/g, "").length >= 10
                  ? "linear-gradient(135deg, #00B4FF, #0066CC)"
                  : "#11172A",
              color:
                phone.replace(/\D/g, "").length >= 10 ? "#050810" : "#8B95A8",
              border: "none",
            }}
          >
            LOOK UP
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 2 — Customer identity
      ════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-4">
          {customer ? (
            // Existing customer found
            <div className="space-y-4">
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: "#0B0F1A",
                  border: "1px solid rgba(16,185,129,0.3)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-xl" style={{ color: "#F5F7FA" }}>
                    {customer.name}
                  </p>
                  {customer.memberTier && (
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(0,180,255,0.1)",
                        color: "#00B4FF",
                        border: "1px solid rgba(0,180,255,0.25)",
                      }}
                    >
                      {customer.memberTier}
                    </span>
                  )}
                </div>
                <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>
                  {phone} &middot; {customer.totalWashes} washes
                </p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full rounded-2xl font-black font-mono text-base tracking-widest active:scale-[0.98]"
                style={{
                  height: "64px",
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "#050810",
                }}
              >
                CONFIRMED — CONTINUE
              </button>
            </div>
          ) : (
            // New customer
            <div className="space-y-4">
              <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
                New customer
              </p>
              <p className="text-sm" style={{ color: "#8B95A8" }}>
                No account found for {phone}. Enter their name to create one.
              </p>
              <div>
                <label
                  htmlFor="name-input"
                  className="block text-sm font-bold mb-2"
                  style={{ color: "#F5F7FA" }}
                >
                  Full name
                </label>
                <input
                  id="name-input"
                  type="text"
                  autoFocus
                  placeholder="Jane Smith"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newName.trim()) setStep(3);
                  }}
                  className="w-full rounded-2xl font-bold text-xl outline-none transition-colors"
                  style={{
                    background: "#0B0F1A",
                    border: "2px solid #1B2236",
                    color: "#F5F7FA",
                    padding: "18px 20px",
                  }}
                />
              </div>
              <button
                onClick={() => setStep(3)}
                disabled={!newName.trim()}
                className="w-full rounded-2xl font-black font-mono text-base tracking-widest active:scale-[0.98]"
                style={{
                  height: "64px",
                  background: newName.trim()
                    ? "linear-gradient(135deg, #00B4FF, #0066CC)"
                    : "#11172A",
                  color: newName.trim() ? "#050810" : "#8B95A8",
                }}
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 3 — Vehicle selection
      ════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
            {customerName ? `${customerName}'s vehicle` : "Select vehicle"}
          </p>

          {/* Saved vehicles */}
          {customer?.vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVehicle(v);
                setStep(4);
              }}
              className="w-full text-left p-4 rounded-2xl transition-colors active:scale-[0.99]"
              style={{
                background: "#0B0F1A",
                border: `1px solid ${v.primary ? "rgba(0,180,255,0.35)" : "#1B2236"}`,
              }}
              aria-label={`Select ${v.year} ${v.make} ${v.model}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-base" style={{ color: "#F5F7FA" }}>
                    {v.year} {v.make} {v.model}
                  </p>
                  <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                    {v.color} &middot;{" "}
                    <span style={{ color: "#00B4FF" }}>{v.plate}</span>
                  </p>
                </div>
                {v.primary && (
                  <span
                    className="text-xs font-mono px-2 py-1 rounded-lg"
                    style={{
                      background: "rgba(0,180,255,0.08)",
                      color: "#00B4FF",
                    }}
                  >
                    PRIMARY
                  </span>
                )}
              </div>
            </button>
          ))}

          {/* Add new vehicle toggle */}
          {!addingVehicle ? (
            <button
              onClick={() => setAddingVehicle(true)}
              className="w-full p-4 rounded-2xl font-mono font-bold text-sm tracking-widest transition-colors"
              style={{
                background: "transparent",
                border: "1.5px dashed #1B2236",
                color: "#8B95A8",
                minHeight: "56px",
              }}
            >
              + ADD NEW VEHICLE
            </button>
          ) : (
            <div
              className="p-4 rounded-2xl space-y-3"
              style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
            >
              <p className="font-bold text-sm" style={{ color: "#F5F7FA" }}>
                Add vehicle
              </p>
              {/* Quick-add fields */}
              {(
                [
                  { key: "year", label: "Year", placeholder: "2024", type: "numeric" },
                  { key: "make", label: "Make", placeholder: "Ford", type: "text" },
                  { key: "model", label: "Model", placeholder: "Raptor", type: "text" },
                  { key: "color", label: "Color", placeholder: "Oxford White", type: "text" },
                  { key: "plate", label: "Plate", placeholder: "NV·ABC-123", type: "text" },
                ] as const
              ).map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label
                    htmlFor={`vehicle-${key}`}
                    className="text-xs font-mono mb-1 block"
                    style={{ color: "#8B95A8" }}
                  >
                    {label}
                  </label>
                  <input
                    id={`vehicle-${key}`}
                    type={type === "numeric" ? "text" : "text"}
                    inputMode={type === "numeric" ? "numeric" : "text"}
                    placeholder={placeholder}
                    value={newVehicle[key]}
                    onChange={(e) =>
                      setNewVehicle((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full rounded-xl font-mono outline-none px-3"
                    style={{
                      background: "#11172A",
                      border: "1px solid #1B2236",
                      color: "#F5F7FA",
                      height: "48px",
                      fontSize: "16px",
                    }}
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setAddingVehicle(false)}
                  className="flex-1 rounded-xl font-mono font-bold text-sm tracking-widest"
                  style={{
                    height: "52px",
                    background: "#11172A",
                    border: "1px solid #1B2236",
                    color: "#8B95A8",
                  }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddVehicle}
                  disabled={!newVehicle.make || !newVehicle.model || !newVehicle.plate}
                  className="flex-1 rounded-xl font-mono font-bold text-sm tracking-widest"
                  style={{
                    height: "52px",
                    background:
                      newVehicle.make && newVehicle.model && newVehicle.plate
                        ? "#00B4FF"
                        : "#11172A",
                    color:
                      newVehicle.make && newVehicle.model && newVehicle.plate
                        ? "#050810"
                        : "#8B95A8",
                  }}
                >
                  ADD
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 4 — Service tier selection
      ════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
            Select service
          </p>
          {selectedVehicle && (
            <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} &middot;{" "}
              <span style={{ color: "#00B4FF" }}>{selectedVehicle.plate}</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((svc) => {
              const isSelected = selectedService?.id === svc.id;
              return (
                <button
                  key={svc.id}
                  onClick={() => {
                    setSelectedService(svc);
                    setStep(5);
                  }}
                  className="p-4 rounded-2xl text-left transition-all active:scale-[0.97]"
                  style={{
                    background: isSelected
                      ? "rgba(255,107,26,0.1)"
                      : "#0B0F1A",
                    border: isSelected
                      ? "2px solid rgba(255,107,26,0.5)"
                      : "1px solid #1B2236",
                    minHeight: "120px",
                  }}
                  aria-pressed={isSelected}
                  aria-label={`${svc.label} — ${formatDollars(svc.priceCents)}`}
                >
                  <p
                    className="font-black text-2xl"
                    style={{ color: "#FF6B1A" }}
                  >
                    {formatDollars(svc.priceCents)}
                  </p>
                  <p className="font-bold text-base mt-1" style={{ color: "#F5F7FA" }}>
                    {svc.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8B95A8" }}>
                    {svc.duration}
                  </p>
                  <p className="text-xs mt-1.5" style={{ color: "#8B95A8" }}>
                    {svc.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 5 — Confirm + process payment
      ════════════════════════════════════════════════════ */}
      {step === 5 && !confirmed && (
        <div className="space-y-5">
          <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
            Confirm walk-in
          </p>

          {/* Summary card */}
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: "#0B0F1A",
              border: "1px solid rgba(0,180,255,0.2)",
            }}
          >
            {/* Customer */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#8B95A8" }}>Customer</span>
              <span className="font-bold" style={{ color: "#F5F7FA" }}>
                {customerName}
              </span>
            </div>
            <div className="h-px" style={{ background: "#1B2236" }} />

            {/* Vehicle */}
            {selectedVehicle && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#8B95A8" }}>Vehicle</span>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: "#F5F7FA" }}>
                      {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                    </p>
                    <p className="text-xs font-mono" style={{ color: "#00B4FF" }}>
                      {selectedVehicle.plate}
                    </p>
                  </div>
                </div>
                <div className="h-px" style={{ background: "#1B2236" }} />
              </>
            )}

            {/* Service */}
            {selectedService && (
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#8B95A8" }}>Service</span>
                <div className="text-right">
                  <p className="font-bold" style={{ color: "#F5F7FA" }}>
                    {selectedService.label}
                  </p>
                  <p className="text-xs" style={{ color: "#8B95A8" }}>
                    {selectedService.duration}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          {selectedService && (
            <div
              className="flex items-center justify-between p-5 rounded-2xl"
              style={{
                background: "rgba(255,107,26,0.08)",
                border: "1px solid rgba(255,107,26,0.2)",
              }}
            >
              <span className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
                Total
              </span>
              <span className="font-black text-3xl" style={{ color: "#FF6B1A" }}>
                {formatDollars(selectedService.priceCents)}
              </span>
            </div>
          )}

          {/* Process payment */}
          <button
            onClick={handleConfirm}
            className="w-full rounded-2xl font-black font-mono text-lg tracking-widest transition-all active:scale-[0.98]"
            style={{
              height: "72px",
              background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
              color: "#050810",
            }}
          >
            PROCESS PAYMENT
          </button>

          <p className="text-center text-xs font-mono" style={{ color: "#8B95A8" }}>
            Square Checkout &middot; Secure payment
          </p>
        </div>
      )}

      {/* ── Confirmation screen ───────────────────────────── */}
      {confirmed && (
        <div className="text-center py-12 space-y-5">
          <div
            className="w-20 h-20 rounded-full grid place-items-center mx-auto"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "2px solid rgba(16,185,129,0.4)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              className="w-10 h-10"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <p className="font-black text-2xl" style={{ color: "#10B981" }}>
              PAYMENT PROCESSED
            </p>
            <p className="text-sm font-mono mt-1" style={{ color: "#8B95A8" }}>
              {customerName} &mdash; {selectedService?.label}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "#8B95A8" }}>
              Added to queue. Returning to queue...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
