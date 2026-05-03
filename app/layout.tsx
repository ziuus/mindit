import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import OnboardFlow from "@/components/onboarding/OnboardFlow";

export const metadata: Metadata = {
  title: "Mindit — Say what you can't say anywhere else",
  description: "Anonymous mental health platform for India. Express thoughts, find resonance, stay safe.",
};

export const viewport: Viewport = {
  themeColor: "#0a0f14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} suppressHydrationWarning>
        <OnboardFlow />
        <Navbar />
        <main style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
