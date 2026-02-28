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
  title: "MyCub — Nurture Every Milestone",
  description:
    "Track your child's growth, celebrate milestones, and get gentle AI-powered insights to help your little one thrive.",
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
  themeColor: "#ff6b3d",
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
