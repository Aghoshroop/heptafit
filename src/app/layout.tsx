import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://heptafit.com'),
  title: {
    default: "Heptafit | High-Performance Athlete Management OS",
    template: "%s | Heptafit",
  },
  description: "Heptafit is the enterprise operating system for sports academies, combining AI insights, medical tracking, and elite performance analytics into one command center.",
  keywords: ["athlete management", "sports technology", "coach dashboard", "performance tracking", "sports academy software", "Heptafit", "sports medicine"],
  authors: [{ name: "Heptafit Team" }],
  creator: "Heptafit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://heptafit.com",
    title: "Heptafit | High-Performance Athlete Management OS",
    description: "Heptafit is the enterprise operating system for sports academies, combining AI insights, medical tracking, and elite performance analytics into one command center.",
    siteName: "Heptafit",
    images: [
      {
        url: "https://heptafit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Heptafit Dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heptafit | High-Performance Athlete Management OS",
    description: "Heptafit is the enterprise operating system for sports academies, combining AI insights, medical tracking, and elite performance analytics into one command center.",
    images: ["https://heptafit.com/twitter-image.jpg"],
    creator: "@heptafit",
  },
};

import { DeviceRestrictionOverlay } from "@/components/DeviceRestrictionOverlay";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <DeviceRestrictionOverlay />
        <div className="hidden lg:contents">
          <SmoothScrollProvider>
            <Providers>
              {children}
            </Providers>
          </SmoothScrollProvider>
        </div>
      </body>
    </html>
  );
}
