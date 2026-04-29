"use client";

// ═══════════════════════════════════════════════════════
// Refer — Referral system
// Code card · share buttons · stats · how it works
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { DEMO_USER } from "@/lib/demo-data";

function ShareButton({ label }: { label: string }) {
  function handleShare() {
    const text = `Use my URRUTIA code ${DEMO_USER.referralCode} for $25 off your first wash!`;

    if (label === "WhatsApp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    if (label === "Text") {
      window.open(`sms:?body=${encodeURIComponent(text)}`);
      return;
    }

    if (label === "Share" && navigator.share) {
      navigator
        .share({ title: "URRUTIA Referral", text })
        .catch(() => undefined);
      return;
    }
  }

  return (
    <button
      onClick={handleShare}
      className="py-3 rounded-xl text-xs font-mono tracking-widest"
      style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
    >
      {label.toUpperCase()}
    </button>
  );
}

export default function ReferPage() {
  const user = DEMO_USER;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(user.referralCode).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div>
        <p
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "#8B95A8" }}
        >
          REFER &amp; EARN
        </p>
        <h2 className="text-3xl font-bold mt-1">Give $25. Get $25.</h2>
        <p className="text-sm mt-1" style={{ color: "#8B95A8" }}>
          When a friend uses your code on their first wash, they get $25 off and
          you get $25 in URRUTIA credit.
        </p>
      </div>

      {/* ── Referral code card ── */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,107,26,0.12), rgba(255,107,26,0.02))",
          border: "1px solid rgba(255,107,26,0.45)",
        }}
      >
        <p
          className="text-xs font-mono tracking-widest mb-3"
          style={{ color: "#FF6B1A" }}
        >
          YOUR REFERRAL CODE
        </p>
        <p className="text-3xl font-black tracking-widest mb-4">
          {user.referralCode}
        </p>
        <button
          onClick={handleCopy}
          className="px-5 py-2.5 rounded-full text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
            color: "#08101F",
          }}
        >
          {copied ? "✓ Copied" : "Copy code"}
        </button>
      </div>

      {/* ── Share buttons ── */}
      <div className="grid grid-cols-3 gap-2">
        <ShareButton label="Text" />
        <ShareButton label="WhatsApp" />
        <ShareButton label="Share" />
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4"
          style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
        >
          <p
            className="text-xs font-mono tracking-widest"
            style={{ color: "#8B95A8" }}
          >
            FRIENDS REFERRED
          </p>
          <p className="text-3xl font-black mt-2">{user.referralsClosed}</p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
        >
          <p
            className="text-xs font-mono tracking-widest"
            style={{ color: "#8B95A8" }}
          >
            CREDIT EARNED
          </p>
          <p
            className="text-3xl font-black mt-2"
            style={{ color: "#FF6B1A" }}
          >
            ${user.referralCredits}
          </p>
        </div>
      </div>

      {/* ── How it works ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
      >
        <p
          className="text-xs font-mono tracking-widest mb-4"
          style={{ color: "#8B95A8" }}
        >
          HOW IT WORKS
        </p>
        <div className="space-y-3 text-sm">
          {[
            "Share your code with friends.",
            "They book their first wash with your code.",
            "$25 credit lands in your account when their wash is complete.",
          ].map((step, i) => (
            <div key={i} className="flex gap-3">
              <span
                className="w-6 h-6 rounded-full grid place-items-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(0,180,255,0.15)",
                  color: "#00B4FF",
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: "#8B95A8" }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
