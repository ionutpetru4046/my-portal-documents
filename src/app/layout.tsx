"use client";

import { UserProvider } from "@/context/UserContext";
import { UploadedFilesProvider } from "@/context/UploadedFilesContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import FAQPage from "@/components/Faq";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes"; // ✅ Use next-themes provider directly
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900">
        {/* ✅ Wrap the entire app with ThemeProvider */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProviderWrapper>
            <UserProvider>
              <UploadedFilesProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Analytics />
                <FAQPage />
                <Footer />
                <Toaster position="top-right" reverseOrder={false} />
              </UploadedFilesProvider>
            </UserProvider>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
