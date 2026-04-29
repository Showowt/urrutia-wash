// ═══════════════════════════════════════════════════════
// (ops) Layout — Operator Console shell
// Full-width tablet layout · Dark · High contrast
// Touch-only · No animations · No fancy effects
// This is a WORK tool.
// ═══════════════════════════════════════════════════════

import type { Metadata } from "next";
import OpsLayoutClient from "./OpsLayoutClient";

export const metadata: Metadata = {
  title: "URRUTIA OPS",
  description: "Urrutia Wash — Operator Console",
  robots: { index: false, follow: false },
};

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OpsLayoutClient>{children}</OpsLayoutClient>;
}
