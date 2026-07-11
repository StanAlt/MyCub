import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mycub.com"),
  title: {
    default: "MyCub — Every little change, one big story",
    template: "%s | MyCub",
  },
  description:
    "A beautiful, private family space to track your child's growth, measurements, milestones, and memories.",
  keywords: [
    "child development",
    "growth tracker",
    "milestones",
    "parenting",
    "baby tracker",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6978eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${quicksand.variable}`}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
