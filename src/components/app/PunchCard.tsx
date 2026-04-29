// ═══════════════════════════════════════════════════════
// PunchCard — 10-punch loyalty card visual
// Circles 1–9 + star for free wash
// ═══════════════════════════════════════════════════════

interface PunchCardProps {
  count: number;
}

export default function PunchCard({ count }: PunchCardProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: 9 }).map((_, i) => {
        const filled = i < count;
        return (
          <div
            key={i}
            className="w-7 h-7 rounded-full grid place-items-center text-[10px] font-bold"
            style={{
              background: filled ? "#00B4FF" : "#11172A",
              border: "1px solid " + (filled ? "#00B4FF" : "#1B2236"),
              color: filled ? "#08101F" : "#8B95A8",
            }}
          >
            {i + 1}
          </div>
        );
      })}
      {/* 10th — free wash star */}
      <div
        className="w-7 h-7 rounded-full grid place-items-center text-[10px] font-bold"
        style={{
          background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
          color: "#08101F",
        }}
      >
        ★
      </div>
    </div>
  );
}
