export default function AppLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full animate-pulse"
          style={{
            background: "linear-gradient(135deg, #0066CC, #00B4FF)",
            boxShadow: "0 0 24px rgba(0,180,255,0.3)",
          }}
        />
        <p className="text-sm font-mono" style={{ color: "#8B95A8" }}>Loading...</p>
      </div>
    </div>
  );
}
