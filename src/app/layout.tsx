import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "get Lucid",
  description: "An intelligence layer grounding autonomous agents in verified, real-time knowledge at scale.",
  openGraph: {
    title: "get Lucid",
    description: "An intelligence layer grounding autonomous agents in verified, real-time knowledge at scale.",
    siteName: "Lucid",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "get Lucid",
    description: "An intelligence layer grounding autonomous agents in verified, real-time knowledge at scale.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-64.png" type="image/png" sizes="64x64" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
