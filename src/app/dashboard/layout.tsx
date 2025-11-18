"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/auth/login");
      router.refresh();
    }
  }, [user, router]);

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }
  if (user === null) {
    return null; // Redirecting
  }
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
