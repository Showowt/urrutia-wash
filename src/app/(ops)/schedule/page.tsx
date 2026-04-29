// ═══════════════════════════════════════════════════════
// /ops/schedule — Upcoming bookings calendar view
// Stub — Drop 005 will wire real data.
// ═══════════════════════════════════════════════════════

export default function SchedulePage() {
  const upcomingDays = [
    {
      date: "Wed Apr 30",
      washes: [
        { time: "7:30 AM", customer: "Elena Reyes", service: "Express Wash", plate: "NV·E30-RYS" },
        { time: "8:00 AM", customer: "Mark Chen", service: "Wash + Interior", plate: "NV·M88-CHN" },
        { time: "9:30 AM", customer: "Priya Nair", service: "Full Detail", plate: "NV·P19-NR1" },
        { time: "11:00 AM", customer: "James Whitfield", service: "Ceramic Coating", plate: "NV·RR1-CUL" },
      ],
    },
    {
      date: "Thu May 1",
      washes: [
        { time: "7:00 AM", customer: "Sofia Martinez", service: "Express Wash", plate: "NV·EV9-MSM" },
        { time: "8:30 AM", customer: "Marcus Reed", service: "Wash + Interior", plate: "NV·8H4-LX9" },
      ],
    },
    {
      date: "Fri May 2",
      washes: [
        { time: "10:00 AM", customer: "Derek Nash", service: "Express Wash", plate: "NV·D20-JEP" },
        { time: "1:00 PM", customer: "Amanda Torres", service: "Full Detail", plate: "NV·A24-BMW" },
        { time: "3:00 PM", customer: "Diego Arroyo", service: "Wash + Interior", plate: "NV·G63-AMG" },
      ],
    },
  ];

  const serviceColor = (svc: string) => {
    if (svc.includes("Ceramic")) return "#8B5CF6";
    if (svc.includes("Detail")) return "#FF6B1A";
    if (svc.includes("Interior")) return "#00B4FF";
    return "#8B95A8";
  };

  return (
    <div className="p-5 space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F5F7FA" }}>
          Schedule
        </h1>
        <p className="text-sm font-mono mt-0.5" style={{ color: "#8B95A8" }}>
          Upcoming bookings — next 7 days
        </p>
      </div>

      {upcomingDays.map((day) => (
        <div key={day.date}>
          <div
            className="flex items-center gap-3 mb-3"
          >
            <p className="font-mono font-bold text-sm tracking-wider" style={{ color: "#00B4FF" }}>
              {day.date.toUpperCase()}
            </p>
            <div className="flex-1 h-px" style={{ background: "#1B2236" }} />
            <p className="text-xs font-mono" style={{ color: "#8B95A8" }}>
              {day.washes.length} booked
            </p>
          </div>

          <div className="space-y-2">
            {day.washes.map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: "#0B0F1A", border: "1px solid #1B2236" }}
              >
                <div
                  className="font-mono font-bold text-sm text-right flex-shrink-0"
                  style={{ color: "#8B95A8", minWidth: "64px" }}
                >
                  {w.time}
                </div>
                <div
                  className="w-px self-stretch"
                  style={{ background: "#1B2236" }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate" style={{ color: "#F5F7FA" }}>
                    {w.customer}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: serviceColor(w.service) }}
                    >
                      {w.service}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "#00B4FF" }}>
                      {w.plate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
