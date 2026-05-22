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
      <body className="min-h-full bg-[color:var(--color-cream)] font-sans text-[color:var(--color-dark)] antialiased relative">
        {/* Retro UI Immersive Backdrop & Paper Grain */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Top-Left Saffron Blob */}
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[color:var(--color-saffron)]/8 blur-[120px] mix-blend-multiply animate-float-slow" />
          
          {/* Bottom-Right Saffron-Light Blob */}
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[color:var(--color-saffron-light)]/8 blur-[150px] mix-blend-multiply animate-float-medium" />

          {/* Middle-Right Forest Green Blob */}
          <div className="absolute top-[35%] -right-[5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-[color:var(--color-forest)]/4 blur-[110px] mix-blend-multiply animate-float-fast" />

          {/* Micro Textured Paper Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }} />

          {/* Subtle coordinates watermark - Dombivli, India */}
          <div className="absolute bottom-6 left-6 text-[9px] font-mono tracking-widest text-dark/15 hidden md:block uppercase select-none">
            [ DOMBIVLI, MH // 19.2184° N, 73.0868° E ]
          </div>
          
          {/* Subtle established stamp watermark */}
          <div className="absolute top-6 right-6 text-[9px] font-mono tracking-widest text-dark/15 hidden md:block uppercase select-none">
            [ ESTD. 1991 // VSM FORMS SYSTEM ]
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
