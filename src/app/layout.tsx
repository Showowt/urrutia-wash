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
  title: "LVAC Carwash and Detailing | Premium Hand Wash & Detail | Henderson, NV",
  description:
    "Drop your car. Train. Drive home clean. Premium hand wash and detailing at LVAC Henderson, NV. Express wash, full detail, and ceramic coating — while you work out.",
  keywords: [
    "car wash",
    "hand wash",
    "auto detailing",
    "LVAC",
    "Henderson",
    "Las Vegas",
    "ceramic coating",
    "car detail Henderson NV",
    "LVAC carwash",
    "wash during workout",
  ],
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    title: "LVAC Carwash and Detailing | Premium Hand Wash & Detail",
    description:
      "Park at LVAC. We hand-wash and detail your car while you train. Walk out to clean.",
    type: "website",
    locale: "en_US",
    siteName: "LVAC Carwash and Detailing",
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
