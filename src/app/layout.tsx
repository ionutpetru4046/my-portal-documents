// app/layout.tsx
"use client";

import ClientProviders from "@/components/ClientProviders";
import PublicLayout from "@/components/PublicLayout";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors">
        <ClientProviders>
          <PublicLayout>{children}</PublicLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
