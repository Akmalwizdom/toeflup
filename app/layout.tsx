import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL || "http://localhost:3000"),
  title: {
    default: "toeflup — Platform Persiapan TOEFL #1 di Indonesia",
    template: "%s | toeflup",
  },
  description: "Raih skor TOEFL impian dengan latihan soal adaptif, flashcards cerdas, dan simulasi real-time.",
  openGraph: {
    title: "toeflup — Platform Persiapan TOEFL #1 di Indonesia",
    description: "Raih skor TOEFL impian dengan latihan soal adaptif, flashcards cerdas, dan simulasi real-time.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "toeflup — Platform Persiapan TOEFL #1",
    description: "Raih skor TOEFL impian dengan latihan soal adaptif.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
