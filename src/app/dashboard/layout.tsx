"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [supabaseUser, setSupabaseUser] = useState<{ id: string; email?: string } | null>(null);
  const [checkingSupabase, setCheckingSupabase] = useState(true);

  // Check Supabase session for OAuth users
  useEffect(() => {
    const checkSupabaseSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setSupabaseUser(user);
      setCheckingSupabase(false);
    };
    checkSupabaseSession();
  }, []);

  useEffect(() => {
    // Only redirect if both NextAuth and Supabase sessions are missing
    if (status === "unauthenticated" && !supabaseUser && !checkingSupabase) {
      router.push("/auth/login");
      router.refresh();
    }
  }, [status, supabaseUser, checkingSupabase, router]);

  // Show loading state while checking authentication
  if (status === "loading" || checkingSupabase) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // Allow access if either NextAuth session OR Supabase session exists
  // This handles both regular login and Google OAuth users
  const isAuthenticated = (status === "authenticated" && session) || supabaseUser;

  if (!isAuthenticated) {
    return null; // Redirecting
  }

  // Render dashboard content when authenticated (either way)
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
