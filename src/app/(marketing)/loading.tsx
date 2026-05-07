export default function MarketingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050810" }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full animate-pulse"
          style={{
            background: "linear-gradient(135deg, #0066CC, #00B4FF)",
            boxShadow: "0 0 32px rgba(0,180,255,0.3)",
          }}
        />
        <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>Loading...</p>
      </div>
    </div>
  );
}
