import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";


type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Nonograms",
  description: "Japanese crossword puzzles",
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="h-full antialiased overflow-hidden bg-white">
        <AuthProvider>
          {/* Main Wrapper */}
          <NextIntlClientProvider messages={messages}>
            <div className="flex flex-col h-full">
              
              {/* Navbar: flex-none prevents it from shrinking to 0px */}
              <nav className="flex-none h-14 bg-white border-b border-gray-200 z-50">
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
                  <Navbar />
                </div>
              </nav>

              {/* Main Area: flex-1 takes up all space under the navbar */}
              <main className="flex-1 flex overflow-hidden">
                {children}
              </main>
              
            </div>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
