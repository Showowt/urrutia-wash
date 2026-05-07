import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
      style={{ background: "#050810" }}
    >
      <div
        className="w-16 h-16 rounded-full grid place-items-center mb-6"
        style={{
          background: "linear-gradient(135deg, #0066CC, #00B4FF)",
          boxShadow: "0 0 40px rgba(0,180,255,0.3)",
        }}
      >
        <span className="text-2xl font-black text-white">404</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-[#8B95A8] max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all"
        style={{
          background: "linear-gradient(135deg, #00B4FF, #0066CC)",
          color: "#fff",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
