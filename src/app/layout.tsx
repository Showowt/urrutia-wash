import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
// import CustomCursor from "@/components/cinema/CustomCursor";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  icons: {
    apple: "/apple-touch-icon.png",
  },
  title: {
    default: "LVAC Carwash and Detailing | Premium Hand Wash & Detail | Henderson, NV",
    template: "%s | LVAC Carwash and Detailing",
  },
  description:
    "Drop your car. Train. Drive home clean. Premium hand wash and detailing at LVAC Henderson, NV. Express exterior wash from $35, full interior+exterior from $55, ceramic coating, and full detail from $295 — all while you work out at Las Vegas Athletic Club.",
  keywords: [
    // Primary
    "car wash henderson nv",
    "hand car wash henderson",
    "auto detailing henderson nv",
    "car detail henderson nevada",
    "LVAC carwash",
    "LVAC car wash",
    "Las Vegas Athletic Club car wash",
    "wash during workout",
    // Services
    "hand wash car near me",
    "exterior car wash henderson",
    "interior car detail henderson",
    "full car detail henderson nv",
    "ceramic coating henderson nv",
    "paint correction henderson",
    "clay bar treatment henderson",
    "spray wax car wash",
    // Vehicle types
    "truck detailing henderson",
    "SUV car wash henderson",
    "luxury car wash las vegas",
    "exotic car detail henderson",
    // Geo long-tail
    "car wash near LVAC henderson",
    "car wash green valley henderson",
    "car wash 89011",
    "auto detail near me henderson",
    "car wash las vegas valley",
    "mobile car wash henderson nv",
    "car wash while working out",
    "gym car wash henderson",
    "car wash near gym las vegas",
    // Pricing
    "cheap car wash henderson",
    "affordable car detail henderson",
    "car wash prices henderson nv",
    "car wash subscription henderson",
    "weekly car wash plan henderson",
    // Intent
    "best car wash henderson nv",
    "best auto detailing henderson",
    "top rated car wash henderson",
    "5 star car wash henderson",
    "hand wash only car wash near me",
    "no touch car wash henderson",
    "premium car wash henderson nv",
    "professional car detailing henderson",
  ],
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  alternates: {
    canonical: "https://www.washduringworkout.com",
  },
  openGraph: {
    title: "LVAC Carwash and Detailing | Premium Hand Wash & Detail | Henderson, NV",
    description:
      "Park at LVAC Henderson. We hand-wash and detail your car while you train. Express wash from $35. Full detail from $295. Walk out to clean.",
    type: "website",
    locale: "en_US",
    siteName: "LVAC Carwash and Detailing",
    url: "https://www.washduringworkout.com",
    images: [
      {
        url: "/gallery/brabus-g63-sunset.jpg",
        width: 1200,
        height: 630,
        alt: "Premium hand wash and detailing at LVAC Henderson — Brabus G63 AMG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LVAC Carwash and Detailing | Premium Hand Wash & Detail",
    description:
      "Park at LVAC Henderson. Hand wash from $35. Full detail from $295. Your car gets clean while you work out.",
    images: ["/gallery/brabus-g63-sunset.jpg"],
  },
  other: {
    "geo.region": "US-NV",
    "geo.placename": "Henderson",
    "geo.position": "36.0211;-115.0707",
    "ICBM": "36.0211, -115.0707",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050810",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
