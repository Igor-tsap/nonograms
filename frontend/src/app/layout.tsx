import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Nonogram",
  description: "Japanese crossword puzzles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="bg-white text-black min-h-screen antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-14">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
