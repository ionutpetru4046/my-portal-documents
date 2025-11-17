import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

import ClientProviders from "../components/ClientProviders";

export const metadata = {
  title: "iDocReminder – Secure Document Storage & Smart Reminders",
  description:
    "Store, manage, and access your important documents securely with iDocReminder. Smart reminders, cloud sync, and fast access.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 transition-colors">
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
