"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import ClientProviders from "../components/ClientProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Lazy-load FAQPage & Analytics to improve performance
const FAQPage = dynamic(() => import("@/app/pages/faq/page"), { ssr: false });
const Analytics = dynamic(() => import("@vercel/analytics/react").then(m => m.Analytics), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <title>iDocReminder - Secure Document Management</title>
        <meta name="description" content="Securely store, manage, and share your documents with DocuStore." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
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
