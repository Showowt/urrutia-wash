"use client";

// ═══════════════════════════════════════════════════════
// /ops/lookup — Customer & vehicle search
// Search by plate, phone, or name. Full history on tap.
// ═══════════════════════════════════════════════════════

import { useState, useRef } from "react";
import StatusBadge from "@/components/ops/StatusBadge";
import type { WashStatus } from "@/types/database";

// ── Demo data ────────────────────────────────────────────
interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
  plate: string;
  primary: boolean;
}

interface WashRecord {
  id: string;
  date: string;
  service: string;
  plate: string;
  status: WashStatus;
  amountCents: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  memberTier: "SOLO" | "DUO" | "FLEET" | null;
  totalWashes: number;
  lastWash: string;
  vehicles: Vehicle[];
  washHistory: WashRecord[];
}

const DEMO_DB: Customer[] = [
  {
    id: "u-001",
    name: "Marcus Reed",
    phone: "+1 (702) 555-0142",
    memberTier: "DUO",
    totalWashes: 24,
    lastWash: "Apr 22, 2026",
    vehicles: [
      { id: "v-001", year: 2023, make: "Ford", model: "Raptor", color: "Lead Foot Gray", plate: "NV·8H4-LX9", primary: true },
      { id: "v-002", year: 2021, make: "BMW", model: "M340i", color: "Tanzanite Blue", plate: "NV·B12-MMX", primary: false },
    ],
    washHistory: [
      { id: "w-h1", date: "Apr 22", service: "Wash + Interior", plate: "NV·8H4-LX9", status: "complete", amountCents: 7500 },
      { id: "w-h2", date: "Apr 15", service: "Express Wash", plate: "NV·B12-MMX", status: "complete", amountCents: 3500 },
      { id: "w-h3", date: "Apr 8", service: "Full Detail", plate: "NV·8H4-LX9", status: "complete", amountCents: 29500 },
    ],
  },
  {
    id: "u-002",
    name: "Sofia Martinez",
    phone: "+1 (702) 555-0198",
    memberTier: "SOLO",
    totalWashes: 9,
    lastWash: "Apr 19, 2026",
    vehicles: [
      { id: "v-003", year: 2021, make: "Tesla", model: "Model S", color: "Midnight Silver", plate: "NV·EV9-MSM", primary: true },
    ],
    washHistory: [
      { id: "w-h4", date: "Apr 19", service: "Express Wash", plate: "NV·EV9-MSM", status: "complete", amountCents: 3500 },
      { id: "w-h5", date: "Apr 12", service: "Wash + Interior", plate: "NV·EV9-MSM", status: "complete", amountCents: 7500 },
    ],
  },
  {
    id: "u-003",
    name: "Diego Arroyo",
    phone: "+1 (702) 555-0277",
    memberTier: null,
    totalWashes: 3,
    lastWash: "Apr 10, 2026",
    vehicles: [
      { id: "v-004", year: 2022, make: "Mercedes", model: "G63 AMG", color: "Matte Black", plate: "NV·G63-AMG", primary: true },
    ],
    washHistory: [
      { id: "w-h6", date: "Apr 10", service: "Full Detail", plate: "NV·G63-AMG", status: "complete", amountCents: 29500 },
    ],
  },
  {
    id: "u-004",
    name: "James Whitfield",
    phone: "+1 (702) 555-0391",
    memberTier: "FLEET",
    totalWashes: 62,
    lastWash: "Apr 29, 2026",
    vehicles: [
      { id: "v-005", year: 2023, make: "Rolls-Royce", model: "Cullinan", color: "Andalucian White", plate: "NV·RR1-CUL", primary: true },
      { id: "v-006", year: 2022, make: "Bentley", model: "Bentayga", color: "Midnight Emerald", plate: "NV·BEN-TGA", primary: false },
    ],
    washHistory: [
      { id: "w-h7", date: "Apr 29", service: "Ceramic Coating", plate: "NV·RR1-CUL", status: "detailing", amountCents: 89500 },
      { id: "w-h8", date: "Apr 22", service: "Wash + Interior", plate: "NV·BEN-TGA", status: "complete", amountCents: 0 },
    ],
  },
  {
    id: "u-005",
    name: "Amanda Torres",
    phone: "+1 (702) 555-0456",
    memberTier: null,
    totalWashes: 1,
    lastWash: "Apr 29, 2026",
    vehicles: [
      { id: "v-007", year: 2024, make: "BMW", model: "X5", color: "Alpine White", plate: "NV·A24-BMW", primary: true },
    ],
    washHistory: [
      { id: "w-h9", date: "Apr 29", service: "Express Wash", plate: "NV·A24-BMW", status: "queued", amountCents: 3500 },
    ],
  },
];

function searchCustomers(query: string): Customer[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().replace(/[\s·\-\.]/g, "");
  return DEMO_DB.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(q);
    const phoneMatch = c.phone.replace(/[\s\-\(\)\+]/g, "").includes(q.replace(/[\s\-\(\)\+]/g, ""));
    const plateMatch = c.vehicles.some((v) =>
      v.plate.toLowerCase().replace(/[\s·\-]/g, "").includes(q)
    );
    return nameMatch || phoneMatch || plateMatch;
  });
}

function formatDollars(cents: number): string {
  if (cents === 0) return "Member";
  return `$${(cents / 100).toFixed(0)}`;
}

export default function LookupPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(value: string) {
    setQuery(value);
    setResults(searchCustomers(value));
    setSelected(null);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setSelected(null);
    inputRef.current?.focus();
  }

  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    SOLO: { bg: "rgba(0,180,255,0.08)", text: "#00B4FF", border: "rgba(0,180,255,0.25)" },
    DUO: { bg: "rgba(139,92,246,0.08)", text: "#8B5CF6", border: "rgba(139,92,246,0.25)" },
    FLEET: { bg: "rgba(255,107,26,0.08)", text: "#FF6B1A", border: "rgba(255,107,26,0.25)" },
  };

  return (
    <div className="p-5 space-y-5">
      {/* ── Header ──────────────────────────────────────────── */}
      <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
        Customer Lookup
      </h1>

      {/* ── Search bar ──────────────────────────────────────── */}
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B95A8"
            strokeWidth="2"
            className="w-6 h-6"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          placeholder="Search by plate, phone, or name..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-2xl font-mono outline-none transition-colors"
          style={{
            background: "#0B0F1A",
            border: "2px solid rgba(0,180,255,0.2)",
            color: "#F5F7FA",
            padding: "18px 52px",
            fontSize: "18px",
            height: "64px",
          }}
          aria-label="Search customers"
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full grid place-items-center"
            style={{ background: "#1B2236", color: "#8B95A8" }}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Hint text ──────────────────────────────────────── */}
      {!query && (
        <div
          className="flex gap-4 text-sm font-mono"
          style={{ color: "#8B95A8" }}
        >
          <span>Try: NV·8H4-LX9</span>
          <span>or: Marcus</span>
          <span>or: 702-555</span>
        </div>
      )}

      {/* ════ DETAIL VIEW ════════════════════════════════════ */}
      {selected && (
        <div className="space-y-4">
          {/* Back */}
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 font-mono font-bold text-sm tracking-wider"
            style={{ color: "#00B4FF" }}
            aria-label="Back to results"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            BACK
          </button>

          {/* Customer header */}
          <div
            className="p-5 rounded-2xl"
            style={{ background: "#0B0F1A", border: "1px solid rgba(0,180,255,0.2)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-black text-2xl" style={{ color: "#F5F7FA" }}>
                  {selected.name}
                </p>
                <p className="text-base font-mono mt-1" style={{ color: "#8B95A8" }}>
                  {selected.phone}
                </p>
              </div>
              {selected.memberTier && (() => {
                const c = tierColors[selected.memberTier] ?? tierColors.SOLO;
                return (
                  <span
                    className="text-sm font-mono font-black px-3 py-1.5 rounded-xl"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                  >
                    {selected.memberTier}
                  </span>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-3 rounded-xl text-center"
                style={{ background: "#11172A" }}
              >
                <p className="font-black text-2xl" style={{ color: "#00B4FF" }}>
                  {selected.totalWashes}
                </p>
                <p className="text-xs font-mono tracking-widest" style={{ color: "#8B95A8" }}>
                  TOTAL WASHES
                </p>
              </div>
              <div
                className="p-3 rounded-xl text-center"
                style={{ background: "#11172A" }}
              >
                <p className="font-bold text-sm" style={{ color: "#F5F7FA" }}>
                  {selected.lastWash}
                </p>
                <p className="text-xs font-mono tracking-widest" style={{ color: "#8B95A8" }}>
                  LAST WASH
                </p>
              </div>
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
              VEHICLES
            </p>
            <div className="space-y-2">
              {selected.vehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl flex items-center justify-between"
                  style={{
                    background: "#0B0F1A",
                    border: `1px solid ${v.primary ? "rgba(0,180,255,0.3)" : "#1B2236"}`,
                  }}
                >
                  <div>
                    <p className="font-bold" style={{ color: "#F5F7FA" }}>
                      {v.year} {v.make} {v.model}
                    </p>
                    <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                      {v.color} &middot;{" "}
                      <span style={{ color: "#00B4FF" }}>{v.plate}</span>
                    </p>
                  </div>
                  {v.primary && (
                    <span className="text-xs font-mono" style={{ color: "#00B4FF" }}>
                      PRIMARY
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wash history */}
          <div>
            <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: "#8B95A8" }}>
              WASH HISTORY
            </p>
            <div className="space-y-2">
              {selected.washHistory.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl flex items-center justify-between"
                  style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#F5F7FA" }}>
                        {w.service}
                      </p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: "#8B95A8" }}>
                        {w.date} &middot; <span style={{ color: "#00B4FF" }}>{w.plate}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={w.status} size="sm" />
                    <span className="text-sm font-mono font-bold" style={{ color: "#FF6B1A" }}>
                      {formatDollars(w.amountCents)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════ SEARCH RESULTS ═════════════════════════════════ */}
      {!selected && results.length > 0 && (
        <div
          className="space-y-3"
          role="listbox"
          aria-label="Search results"
        >
          <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.map((customer) => (
            <button
              key={customer.id}
              onClick={() => setSelected(customer)}
              className="w-full text-left p-4 rounded-2xl transition-colors active:scale-[0.99]"
              style={{
                background: "#0B0F1A",
                border: "1px solid #1B2236",
                minHeight: "80px",
              }}
              role="option"
              aria-selected="false"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className="font-bold text-lg" style={{ color: "#F5F7FA" }}>
                      {customer.name}
                    </p>
                    {customer.memberTier && (() => {
                      const c = tierColors[customer.memberTier] ?? tierColors.SOLO;
                      return (
                        <span
                          className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg"
                          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                        >
                          {customer.memberTier}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-sm font-mono mt-1" style={{ color: "#8B95A8" }}>
                    {customer.phone}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {customer.vehicles.map((v) => (
                      <span
                        key={v.id}
                        className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{
                          background: "#11172A",
                          color: "#00B4FF",
                          border: "1px solid #1B2236",
                        }}
                      >
                        {v.plate}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-base" style={{ color: "#F5F7FA" }}>
                    {customer.totalWashes}
                  </p>
                  <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
                    washes
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8B95A8" }}>
                    Last: {customer.lastWash}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {!selected && query && results.length === 0 && (
        <div
          className="py-16 text-center rounded-2xl"
          style={{ border: "1px dashed #1B2236" }}
        >
          <p className="font-mono font-bold tracking-widest text-sm" style={{ color: "#8B95A8" }}>
            NO RESULTS FOR &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm mt-2" style={{ color: "#8B95A8" }}>
            Try searching by plate, phone number, or name
          </p>
        </div>
      )}
    </div>
  );
}
