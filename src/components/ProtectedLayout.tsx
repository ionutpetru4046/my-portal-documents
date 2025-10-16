"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/login", "/signup"];

  useEffect(() => {
    if (status === "unauthenticated" && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
  }, [status, pathname, router]);

  if (status === "loading") return null;

  // Hide Navbar & Footer on public pages
  if (publicPaths.includes(pathname)) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
