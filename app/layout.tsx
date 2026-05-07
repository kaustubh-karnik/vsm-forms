import type { Metadata } from "next";
import { Inter, Noto_Serif_Devanagari, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VSM Forms - Vivekanand Seva Mandal",
  description:
    "Registration forms and initiatives from Vivekanand Seva Mandal, Dombivli. Since 1991.",
  keywords: [
    "VSM",
    "Vivekanand Seva Mandal",
    "Dombivli",
    "volunteer",
    "tribal",
    "NGO",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", inter.variable, notoSerifDevanagari.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full bg-[color:var(--color-cream)] font-sans text-[color:var(--color-dark)] antialiased">
        {children}
      </body>
    </html>
  );
}
