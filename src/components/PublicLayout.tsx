"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that should NOT have navbar/footer
  const excludedPaths = ["/auth/login", "/auth/signup", "/auth/callback", "/dashboard"];
  const isExcluded = excludedPaths.some(path => pathname?.startsWith(path));
  
  if (isExcluded) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

