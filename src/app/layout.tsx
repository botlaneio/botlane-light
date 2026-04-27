import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://botlane.io"),
  title: {
    default: "Botlane | Pipeline-as-a-Service for IT Firms",
    template: "%s | Botlane",
  },
  description:
    "Botlane builds outbound pipeline systems for IT consultants, MSPs, and cybersecurity firms to generate predictable qualified meetings.",
  keywords: [
    "B2B outbound",
    "pipeline as a service",
    "IT consulting leads",
    "MSP lead generation",
    "qualified meetings",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Botlane | Pipeline-as-a-Service for IT Firms",
    description:
      "Predictable qualified meetings for IT service firms with transparent reporting and repeatable outbound systems.",
    url: "https://botlane.io",
    siteName: "Botlane",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Botlane | Pipeline-as-a-Service for IT Firms",
    description:
      "Predictable qualified meetings for IT service firms with transparent outbound systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
