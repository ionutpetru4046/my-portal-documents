"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/context/UserContext";
import { UploadedFilesProvider } from "@/context/UploadedFilesContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Toaster } from "react-hot-toast";

// Allowed in client components:
const FAQPage = dynamic(() => import("@/components/Faq"));
const Analytics = dynamic(() =>
  import("@vercel/analytics/react").then((m) => m.Analytics)
);

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProviderWrapper>
        <UserProvider>
          <UploadedFilesProvider>
            {children}

            {/* Safe here because we are in a client component */}
            <FAQPage />
            <Analytics />
            <Toaster position="top-right" />
          </UploadedFilesProvider>
        </UserProvider>
      </SessionProviderWrapper>
    </ThemeProvider>
  );
}
