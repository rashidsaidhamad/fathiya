import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Archipelago Real Estate",
  description: "Find Your Perfect Property in Zanzibar",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/uploads/1776245860680-website-logo.png?v=5", type: "image/png", sizes: "32x32" },
      { url: "/uploads/1776245860680-website-logo.png?v=5", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/uploads/1776245860680-website-logo.png?v=5",
    apple: "/uploads/1776245860680-website-logo.png?v=5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
