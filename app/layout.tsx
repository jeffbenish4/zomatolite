import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zomato Lite",
  description: "Restaurant reviews for Ludhiana Burrito."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
