import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archipelago Real Estate",
  description: "Find Your Perfect Property in Zanzibar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>{children}</body>
    </html>
  );
}
