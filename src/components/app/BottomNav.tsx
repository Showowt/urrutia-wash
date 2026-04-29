"use client";

// ═══════════════════════════════════════════════════════
// BottomNav — Fixed tab bar for the customer app
// 5 tabs: Home / Book / Track / Member / Refer
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabConfig {
  href: string;
  label: string;
  icon: "home" | "plus" | "track" | "member" | "refer";
  accent?: boolean;
}

const TABS: TabConfig[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/book", label: "Book", icon: "plus", accent: true },
  { href: "/track", label: "Track", icon: "track" },
  { href: "/member", label: "Member", icon: "member" },
  { href: "/refer", label: "Refer", icon: "refer" },
];

const ICONS: Record<TabConfig["icon"], React.ReactNode> = {
  home: (
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z" />
  ),
  plus: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  track: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  member: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0116 0v1" />
    </>
  ),
  refer: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 11h-6M19 8v6" />
    </>
  ),
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-md border-t"
      style={{
        background: "rgba(5,8,16,0.92)",
        borderColor: "#1B2236",
      }}
    >
      <div className="max-w-md mx-auto px-3 py-2 grid grid-cols-5 gap-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const activeColor = tab.accent ? "#FF6B1A" : "#00B4FF";
          const activeBg = tab.accent
            ? "rgba(255,107,26,0.12)"
            : "rgba(0,180,255,0.12)";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 py-2 rounded-xl"
              style={{ color: isActive ? activeColor : "#8B95A8" }}
            >
              <div
                className="w-7 h-7 grid place-items-center rounded-lg"
                style={{ background: isActive ? activeBg : "transparent" }}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {ICONS[tab.icon]}
                </svg>
              </div>
              <span className="text-[10px] font-mono tracking-widest">
                {tab.label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
