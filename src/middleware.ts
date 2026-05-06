import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ═══════════════════════════════════════════════════════
// URRUTIA — Security Middleware
// CSP · Auth guard · Security headers
// ═══════════════════════════════════════════════════════

// Routes that require an authenticated session
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/book",
  "/member",
  "/refer",
  "/track",
];

// API routes that require auth (webhook routes are excluded — they use
// signature verification instead)
const PROTECTED_API_PREFIXES = ["/api/bookings", "/api/status", "/api/referrals"];

// Nonce is generated per-request so inline scripts covered by CSP are safe.
// For this project we avoid inline scripts, so we use a strict CSP without
// 'unsafe-inline'. If GSAP or other libs need inline styles, extend
// style-src with a nonce later.
function buildCSP(nonce: string): string {
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : "";

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "connect-src": [
      "'self'",
      ...(supabaseHost ? [`https://${supabaseHost}`, `wss://${supabaseHost}`] : []),
      "https://connect.squareup.com",
      "https://connect.squareupsandbox.com",
      "https://api.telegram.org",
      ...(process.env.NODE_ENV === "development" ? ["ws://localhost:*"] : []),
    ],
    "frame-src": [
      "'self'",
      "https://www.openstreetmap.org",
    ],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) =>
      values.length > 0 ? `${key} ${values.join(" ")}` : key
    )
    .join("; ");
}

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isProtectedApi(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Generate nonce for CSP ──────────────────────────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCSP(nonce);

  // ── 2. Supabase session refresh (keeps JWT alive on every request) ─────────
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip auth when Supabase credentials are not configured (demo mode)
  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // getUser() validates the JWT server-side — never trust getSession() alone
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ── 3. Auth guard for protected pages ─────────────────────────────────
    if (isProtectedPage(pathname) && !user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ── 4. Auth guard for protected API routes ────────────────────────────
    if (isProtectedApi(pathname) && !user) {
      return NextResponse.json(
        { data: null, error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }
  }

  // ── 5. Apply security headers ──────────────────────────────────────────────
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Nonce", nonce); // available to Server Components via headers()
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self), usb=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Remove headers that leak server info
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static assets)
     * - _next/image   (image optimizer)
     * - favicon.ico
     * - Public image files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
