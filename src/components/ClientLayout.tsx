"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
