"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();
  const ref = params.get("ref") || "N/A";

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="max-w-md w-full text-center space-y-6">
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
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#F5F7FA" }}>
          Payment Successful
        </h1>
        <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>
          Reference: {ref}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, #00B4FF, #0066CC)",
            color: "#050810",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
