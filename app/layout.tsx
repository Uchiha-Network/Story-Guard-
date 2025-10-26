import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StoryGuard - AI-Powered Copyright Detection",
  description: "Protect your creative work with blockchain-based copyright detection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}