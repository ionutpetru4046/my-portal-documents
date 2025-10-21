"use client";

import { UserProvider } from "@/context/UserContext";
import { UploadedFilesProvider } from "@/context/UploadedFilesContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import "./globals.css";
import FAQPage from "@/components/Faq";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <SessionProviderWrapper>
          <UserProvider>
            <UploadedFilesProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <FAQPage />
              <Footer />
              <Toaster position="top-right" reverseOrder={false} />
            </UploadedFilesProvider>
          </UserProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
