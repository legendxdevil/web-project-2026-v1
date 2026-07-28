import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { CursorTrail } from "@/components/ui/cursor-trail";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AETHER // Premium Interactive Agency Showcase",
  description: "Next-generation digital experience showcasing advanced Next.js, Framer Motion, GSAP, and Lenis animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${geistMono.variable} font-sans bg-background text-foreground antialiased overflow-x-hidden`}
      >
        <CursorTrail />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
