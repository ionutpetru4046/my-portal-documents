"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ✅ Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      // Redirect if not logged in (only for protected pages)
      if (!data.user && window.location.pathname !== "/login") {
        router.push("/login");
      }
    };

    fetchUser();

    // Optional: subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // ✅ Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-teal-400 text-white shadow-lg px-6 py-4 flex items-center justify-between">
      {/* Left Side: Brand */}
      <Link href="/" className="text-xl font-extrabold tracking-wide">
        Document<span className="text-yellow-200">Manager</span>
      </Link>

      {/* Center: Links */}
      <div className="hidden md:flex gap-6">
        <Link href="/dashboard" className="hover:text-yellow-200 transition">
          Dashboard
        </Link>
        <Link href="/about" className="hover:text-yellow-200 transition">
          About
        </Link>
        <Link href="/contact" className="hover:text-yellow-200 transition">
          Contact
        </Link>
      </div>

      {/* Right Side: Auth Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden sm:inline text-sm bg-white/20 px-3 py-1 rounded-full">
              {user.email}
            </span>
            <Link href="/dashboard">
              <Button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold">
                Dashboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
