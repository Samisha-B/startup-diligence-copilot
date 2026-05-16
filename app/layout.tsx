import type { Metadata } from "next";
import {
  Inter,
  Cormorant_Garamond,
  Luxurious_Script,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const luxuriousScript = Luxurious_Script({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Startup Diligence Copilot",
  description: "Luxury corporate cinematic diligence workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} ${luxuriousScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}