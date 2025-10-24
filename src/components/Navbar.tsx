"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const u = {
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name || data.user.email || "User",
          avatar: data.user.user_metadata?.avatar || "",
          role: data.user.user_metadata?.role || "user",
        };
        setUser(u);
      }
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email || "User",
          avatar: session.user.user_metadata?.avatar || "",
          role: session.user.user_metadata?.role || "user",
        };
        setUser(u);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  const navLinkClass = (href: string) =>
    `hover:underline hover:text-yellow-200 transition ${
      pathname === href ? "underline font-semibold" : ""
    }`;

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-teal-400 text-white shadow-lg px-6 py-4 flex items-center justify-between relative z-50">
      {/* Logo + Hamburger */}
      <div className="flex items-center gap-3">
        {/* ✅ Hamburger - visible on mobile only */}
        <button
          className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 rounded-lg border border-white/25 bg-white/15 hover:bg-white/25 transition"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-white mb-1 rounded" />
          <span className="block w-5 h-0.5 bg-white mb-1 rounded" />
          <span className="block w-5 h-0.5 bg-white rounded" />
        </button>

        <Link href="/" className="text-xl font-extrabold tracking-wide">
          Doc<span className="text-yellow-200">Store</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 relative">
        <Link href="/about" className={navLinkClass("/about")}>
          About Us
        </Link>
        <Link href="/contact" className={navLinkClass("/contact")}>
          Contact
        </Link>
        <Link href="/subscribe" className={navLinkClass("/subscribe")}>
          Pricing
        </Link>

        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setAdminDropdown(!adminDropdown)}
              className="flex items-center gap-1 hover:text-yellow-200 transition"
            >
              Admin <FiChevronDown />
            </button>
            <AnimatePresence>
              {adminDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-10 right-0 w-48 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
                >
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setAdminDropdown(false)}
                  >
                    Users
                  </Link>
                  <Link
                    href="/admin/expirations"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setAdminDropdown(false)}
                  >
                    Expirations
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Desktop User / CTA */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              aria-label="User menu"
              className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
                <div className="px-4 py-2 text-xs text-gray-500">Signed in as</div>
                <div className="px-4 pb-2 text-sm truncate">{user.email}</div>
                <div className="border-t" />
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login">
              <Button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold">
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* ✅ Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <div className="relative bg-white text-gray-900 w-64 h-full p-6 flex flex-col overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-extrabold">Menu</span>
                <button
                  className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-3">
                <Link
                  href="/about"
                  className="px-3 py-2 rounded hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="px-3 py-2 rounded hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/subscribe"
                  className="px-3 py-2 rounded hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Pricing
                </Link>

                {isAdmin && (
                  <div className="mt-2 border-t border-gray-200">
                    <button
                      onClick={() => setAdminDropdown(!adminDropdown)}
                      className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-50 rounded"
                    >
                      Admin <FiChevronDown />
                    </button>
                    <AnimatePresence>
                      {adminDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="pl-4 flex flex-col gap-1 mt-1"
                        >
                          <Link
                            href="/admin/users"
                            className="px-3 py-2 hover:bg-gray-50 rounded"
                            onClick={() => {
                              setAdminDropdown(false);
                              setMobileOpen(false);
                            }}
                          >
                            Users
                          </Link>
                          <Link
                            href="/admin/expirations"
                            className="px-3 py-2 hover:bg-gray-50 rounded"
                            onClick={() => {
                              setAdminDropdown(false);
                              setMobileOpen(false);
                            }}
                          >
                            Expirations
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </nav>

              <div className="mt-6 border-t pt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-3 py-2 rounded bg-indigo-600 text-white text-center hover:bg-indigo-700"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="px-3 py-2 rounded hover:bg-gray-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="px-3 py-2 rounded text-left text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-3 py-2 rounded bg-gray-100 text-center hover:bg-gray-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-3 py-2 rounded bg-yellow-400 text-blue-900 text-center hover:bg-yellow-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
