import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

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
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
