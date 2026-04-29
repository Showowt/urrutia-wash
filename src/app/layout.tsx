import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/cinema/CustomCursor";

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
  title: "URRUTIA - Premium Hand Wash & Detail | LVAC Henderson, NV",
  description:
    "Drop your car. Train. Drive home clean. Premium hand wash and detailing at LVAC Henderson. Mobile service available 7 days a week.",
  keywords: [
    "car wash",
    "hand wash",
    "detail",
    "LVAC",
    "Henderson",
    "Las Vegas",
    "ceramic coating",
    "mobile detailing",
  ],
  openGraph: {
    title: "URRUTIA - Premium Hand Wash & Detail",
    description:
      "Park at LVAC. We hand-wash and detail your car while you train. Walk out to clean.",
    type: "website",
    locale: "en_US",
    siteName: "URRUTIA",
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
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
