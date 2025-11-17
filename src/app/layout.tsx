import { UserProvider } from "@/context/UserContext";
import { UploadedFilesProvider } from "@/context/UploadedFilesContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQPage from "@/components/Faq";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// This now works!
export const metadata = {
  title: "iDocReminder – Secure Document Storage & Reminders",
  description:
    "Store, manage, and access your important documents securely with iDocReminder. Smart reminders, cloud sync, and easy access.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProviderWrapper>
            <UserProvider>
              <UploadedFilesProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <FAQPage />
                <Footer />
                <Analytics />
                <Toaster position="top-right" />
              </UploadedFilesProvider>
            </UserProvider>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
