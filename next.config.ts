import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers as a defense-in-depth layer alongside middleware.
  // Middleware CSP takes precedence for dynamic routes; these catch anything
  // that bypasses the middleware matcher (e.g., static file serving edge cases).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self), usb=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Explicitly allow only the image domains actually used
  images: {
    remotePatterns: [],
    qualities: [75, 90],
  },

  // Do not expose the Next.js version header
  poweredByHeader: false,
};

export default nextConfig;
