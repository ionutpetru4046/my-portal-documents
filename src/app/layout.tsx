"use client";

import { ThemeProvider } from "next-themes";
import ClientProviders from "../components/ClientProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQPage from "@/components/Faq";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientProviders>
            <Navbar />
            <main className="flex-1">{children}</main>
            <FAQPage />
            <Footer />
            <Analytics />
            <Toaster position="top-right" />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
