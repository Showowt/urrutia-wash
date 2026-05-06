"use client";

// ═══════════════════════════════════════════════════════
// Book — 4-step booking flow
// Step 1: Vehicle · Step 2: Service
// Step 3: Location + time · Step 4: Confirm
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEMO_VEHICLES,
  SERVICES,
  TIME_SLOTS,
  type ServiceId,
  type ActiveWash,
} from "@/lib/demo-data";

// Booking result stored in sessionStorage so Track page can read it
const WASH_STORAGE_KEY = "urrutia_active_wash";

function storeActiveWash(wash: ActiveWash) {
  try {
    sessionStorage.setItem(WASH_STORAGE_KEY, JSON.stringify(wash));
  } catch {
    // Ignore storage errors in SSR contexts
  }
}

// ── Sub-components ─────────────────────────────────────

function SummaryRow({
  label,
  value,
  sub,
  bold,
}: {
  label: string;
  value: string;
  sub?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className="text-sm"
        style={{ color: sub ? "#10B981" : "#8B95A8" }}
      >
        {label}
      </span>
      <span className={bold ? "text-base font-black" : "text-sm font-semibold"}>
        {value}
      </span>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────

export default function BookPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [vehicleId, setVehicleId] = useState<string>(DEMO_VEHICLES[0].id);
  const [serviceId, setServiceId] = useState<ServiceId | null>(null);
  const [location, setLocation] = useState<"lvac">("lvac");
  const [timeSlot, setTimeSlot] = useState<string | null>(null);

  const vehicle = DEMO_VEHICLES.find((v) => v.id === vehicleId);
  const service = SERVICES.find((s) => s.id === serviceId);

  const canContinue =
    (step === 1) ||
    (step === 2 && serviceId !== null) ||
    (step === 3 && timeSlot !== null) ||
    step === 4;

  const STEP_TITLES: Record<number, string> = {
    1: "Pick a vehicle",
    2: "Pick a service",
    3: "Where & when",
    4: "Confirm",
  };

  function handleConfirm() {
    if (!service || !vehicle) return;

    const newWash: ActiveWash = {
      id: `wASH-${Date.now()}`,
      service: service.name,
      vehicle: vehicle.model,
      statusIndex: 0,
      eta: service.duration,
      location: location === "lvac" ? "LVAC Henderson" : "Mobile · Your address",
    };

    storeActiveWash(newWash);
    router.push("/track");
  }

  return (
    <div className="space-y-5">
      {/* ── Step header ── */}
      <div>
        <p
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "#8B95A8" }}
        >
          STEP {step} OF 4
        </p>
        <h2 className="text-3xl font-bold mt-1">{STEP_TITLES[step]}</h2>
      </div>

      {/* ── Progress bar ── */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="flex-1 h-1 rounded-full"
            style={{ background: n <= step ? "#00B4FF" : "#1B2236" }}
          />
        ))}
      </div>

      {/* ── Step 1: Vehicle ── */}
      {step === 1 && (
        <div className="space-y-2">
          {DEMO_VEHICLES.map((v) => (
            <button
              key={v.id}
              onClick={() => setVehicleId(v.id)}
              className="w-full rounded-xl p-4 text-left flex items-center gap-3"
              style={{
                background: "#0B0F1A",
                border:
                  vehicleId === v.id
                    ? "1px solid #00B4FF"
                    : "1px solid #1B2236",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg grid place-items-center"
                style={{ background: "#11172A" }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00B4FF"
                  strokeWidth="2"
                >
                  <path d="M3 13l2-5h14l2 5M5 13v5a1 1 0 001 1h2a1 1 0 001-1v-2h6v2a1 1 0 001 1h2a1 1 0 001-1v-5" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {v.year} {v.make} {v.model}
                </p>
                <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
                  {v.plate}
                </p>
              </div>
              {vehicleId === v.id && (
                <span style={{ color: "#00B4FF" }}>✓</span>
              )}
            </button>
          ))}

          <button
            className="w-full rounded-xl p-4 text-sm font-mono"
            style={{
              background: "#0B0F1A",
              border: "1px dashed #1B2236",
              color: "#8B95A8",
            }}
          >
            + Add a new vehicle
          </button>
        </div>
      )}

      {/* ── Step 2: Service ── */}
      {step === 2 && (
        <div className="space-y-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setServiceId(s.id)}
              className="w-full rounded-xl p-4 text-left"
              style={{
                background: "#0B0F1A",
                border:
                  serviceId === s.id
                    ? "1px solid #00B4FF"
                    : "1px solid #1B2236",
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-base font-bold">${s.price}</p>
              </div>
              <p className="text-xs" style={{ color: "#8B95A8" }}>
                {s.desc}
              </p>
              {s.duration > 0 && (
                <p
                  className="text-[10px] font-mono mt-2"
                  style={{ color: "#00B4FF" }}
                >
                  ~{s.duration} MIN
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Step 3: Location + time slot ── */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Location */}
          <div>
            <p
              className="text-xs font-mono tracking-widest mb-2"
              style={{ color: "#8B95A8" }}
            >
              LOCATION
            </p>
            <div
              className="rounded-xl p-3 text-left"
              style={{
                background: "#0B0F1A",
                border: "1px solid #00B4FF",
              }}
            >
              <p className="text-sm font-semibold">LVAC Henderson</p>
              <p
                className="text-[10px] font-mono mt-0.5"
                style={{ color: "#8B95A8" }}
              >
                1195 WELLNESS PL
              </p>
            </div>
          </div>

          {/* Time slots */}
          <div>
            <p
              className="text-xs font-mono tracking-widest mb-2"
              style={{ color: "#8B95A8" }}
            >
              TIME SLOT
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className="rounded-xl py-3 text-xs font-mono"
                  style={{
                    background: "#0B0F1A",
                    border:
                      timeSlot === slot
                        ? "1px solid #00B4FF"
                        : "1px solid #1B2236",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Confirm summary ── */}
      {step === 4 && service && vehicle && (
        <div className="space-y-3">
          <SummaryRow
            label="Vehicle"
            value={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
          <SummaryRow label="Service" value={service.name} />
          <SummaryRow
            label="Location"
            value={
              location === "lvac" ? "LVAC Henderson" : "Mobile · Your address"
            }
          />
          <SummaryRow
            label="Time"
            value={timeSlot ?? "Tomorrow · 9:00 AM"}
          />

          <div className="my-2 h-px" style={{ background: "#1B2236" }} />

          <SummaryRow label="Subtotal" value={`$${service.price}.00`} />
          <SummaryRow label="Member discount" value="−$0.00" sub />
          <SummaryRow label="Total" value={`$${service.price}.00`} bold />

          {/* Punch progress nudge */}
          <div
            className="rounded-xl p-3 mt-4 text-xs font-mono flex gap-2"
            style={{
              background: "rgba(255,107,26,0.08)",
              border: "1px solid rgba(255,107,26,0.3)",
              color: "#FF6B1A",
            }}
          >
            <span>★</span>
            <span>You&rsquo;re 4 washes away from your free wash.</span>
          </div>
        </div>
      )}

      {/* ── Footer buttons ── */}
      <div className="flex gap-2 pt-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "#11172A", border: "1px solid #1B2236" }}
          >
            Back
          </button>
        )}

        {step < 4 && (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canContinue}
            className="flex-[2] py-3 rounded-xl text-sm font-bold disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
              color: "#08101F",
            }}
          >
            Continue
          </button>
        )}

        {step === 4 && (
          <button
            onClick={handleConfirm}
            className="flex-[2] py-3 rounded-xl text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
              color: "#08101F",
            }}
          >
            Confirm &amp; book
          </button>
        )}
      </div>
    </div>
  );
}
