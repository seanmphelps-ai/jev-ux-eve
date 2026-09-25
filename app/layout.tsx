import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEV-UX · Eve",
  description: "Typed decision layer for Eve agents on Vercel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
