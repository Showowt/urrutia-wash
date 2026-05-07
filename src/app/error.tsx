'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
      style={{ background: "#050810" }}
    >
      <div
        className="w-16 h-16 rounded-full grid place-items-center mb-6"
        style={{
          background: "linear-gradient(135deg, #FF6B1A, #FF8B4A)",
          boxShadow: "0 0 40px rgba(255,107,26,0.3)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Something Went Wrong</h1>
      <p className="text-[#8B95A8] max-w-sm mb-8">
        We hit an unexpected error. Try again or head back to the homepage.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer"
          style={{
            background: "transparent",
            border: "1px solid #1B2236",
            color: "#F5F7FA",
          }}
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-full text-sm font-bold transition-all"
          style={{
            background: "linear-gradient(135deg, #00B4FF, #0066CC)",
            color: "#fff",
          }}
        >
          Go Home
        </a>
      </div>

      {process.env.NODE_ENV === "development" && error.message && (
        <pre className="mt-8 p-4 rounded-lg text-xs text-left max-w-lg overflow-auto" style={{ background: "#0B0F1A", color: "#FF6B1A", border: "1px solid #1B2236" }}>
          {error.message}
        </pre>
      )}
    </div>
  );
}
