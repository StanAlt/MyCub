import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}

