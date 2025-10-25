"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiFileText, FiUsers, FiClock, FiHelpCircle, FiBook, FiMail, FiSettings, FiLogOut, FiUser, FiGrid } from "react-icons/fi";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function Navbar() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [resourcesDropdown, setResourcesDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const adminRef = useRef<HTMLDivElement | null>(null);
  const resourcesRef = useRef<HTMLDivElement | null>(null);
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
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminDropdown(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  const navLinkClass = (href: string) =>
    `hover:text-yellow-300 transition-colors duration-200 ${
      pathname === href ? "text-yellow-300 font-semibold" : ""
    }`;

  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-400 text-white shadow-lg backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="relative w-12 h-12 md:w-14 md:h-14">
              <Image
                src="/Digital-document-logo.png"
                alt="DigitalStore logo"
                fill
                sizes="56px"
                className="object-contain rounded-full"
                priority
              />
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-tight">
              DigitalStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Features Dropdown */}
            {user && (
              <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
            )}

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setResourcesDropdown(!resourcesDropdown)}
                className="flex items-center gap-1 hover:text-yellow-300 transition-colors duration-200"
              >
                Resources <FiChevronDown className={`transition-transform ${resourcesDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {resourcesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 left-0 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
                  >
                    <Link
                      href="/about"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition group"
                      onClick={() => setResourcesDropdown(false)}
                    >
                      <FiBook className="text-blue-600 group-hover:scale-110 transition" />
                      <div>
                        <div className="font-medium">About Us</div>
                        <div className="text-xs text-gray-500">Learn our story</div>
                      </div>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition group"
                      onClick={() => setResourcesDropdown(false)}
                    >
                      <FiMail className="text-teal-600 group-hover:scale-110 transition" />
                      <div>
                        <div className="font-medium">Contact</div>
                        <div className="text-xs text-gray-500">Get in touch</div>
                      </div>
                    </Link>
                    <Link
                      href="/subscribe"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition group"
                      onClick={() => setResourcesDropdown(false)}
                    >
                      <FiHelpCircle className="text-purple-600 group-hover:scale-110 transition" />
                      <div>
                        <div className="font-medium">Pricing</div>
                        <div className="text-xs text-gray-500">View plans</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => setAdminDropdown(!adminDropdown)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                >
                  <FiGrid size={16} />
                  Admin <FiChevronDown className={`transition-transform ${adminDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {adminDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 right-0 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
                    >
                      <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition group"
                        onClick={() => setAdminDropdown(false)}
                      >
                        <FiUsers className="text-blue-600 group-hover:scale-110 transition" />
                        <div>
                          <div className="font-medium">Users</div>
                          <div className="text-xs text-gray-500">Manage users</div>
                        </div>
                      </Link>
                      <Link
                        href="/admin/expirations"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition group"
                        onClick={() => setAdminDropdown(false)}
                      >
                        <FiClock className="text-teal-600 group-hover:scale-110 transition" />
                        <div>
                          <div className="font-medium">Expirations</div>
                          <div className="text-xs text-gray-500">Monitor docs</div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Side - User Menu / CTA */}
          <div className="flex items-center gap-3">
            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    aria-label="User menu"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <FiChevronDown className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">Signed in as</div>
                          <div className="text-sm font-medium truncate">{user.email}</div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group"
                        >
                          <FiUser className="text-gray-600 group-hover:scale-110 transition" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group"
                        >
                          <FiFileText className="text-gray-600 group-hover:scale-110 transition" />
                          <span>Dashboard</span>
                        </Link>
                        <div className="border-t border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition group"
                        >
                          <FiLogOut className="group-hover:scale-110 transition" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/20 rounded-xl px-5">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold rounded-xl px-5 shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden inline-flex flex-col justify-center items-center w-10 h-10 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-white mb-1 rounded" />
              <span className="block w-5 h-0.5 bg-white mb-1 rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] flex lg:hidden justify-end"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <div className="relative bg-white text-gray-900 w-80 h-full flex flex-col overflow-y-auto shadow-2xl ml-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <Image
                      src="/Digital-document-logo.png"
                      alt="Logo"
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                  <span className="text-lg font-bold text-gray-900">Menu</span>
                </div>
                <button
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                  onClick={() => setMobileOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* User Info (if logged in) */}
              {user && (
                <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-400 text-white">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
                        <span className="text-lg font-bold">{user.name?.charAt(0).toUpperCase() || "U"}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{user.name}</div>
                      <div className="text-xs text-white/80 truncate">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 p-4">
                {user && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition mb-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiGrid className="text-blue-600" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                )}

                <div className="my-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                    Resources
                  </div>
                  <Link
                    href="/about"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiBook className="text-gray-600" />
                    <span>About Us</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiMail className="text-gray-600" />
                    <span>Contact</span>
                  </Link>
                  <Link
                    href="/subscribe"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiHelpCircle className="text-gray-600" />
                    <span>Pricing</span>
                  </Link>
                </div>

                {isAdmin && (
                  <div className="my-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                      Admin
                    </div>
                    <Link
                      href="/admin/users"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                      onClick={() => setMobileOpen(false)}
                    >
                      <FiUsers className="text-blue-600" />
                      <span>Users</span>
                    </Link>
                    <Link
                      href="/admin/expirations"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                      onClick={() => setMobileOpen(false)}
                    >
                      <FiClock className="text-teal-600" />
                      <span>Expirations</span>
                    </Link>
                  </div>
                )}
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      <FiUser className="text-gray-600" />
                      <span>Profile</span>
                    </Link>
                    <button
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 rounded-xl bg-gray-100 text-center hover:bg-gray-200 transition font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-400 text-white text-center hover:from-blue-700 hover:to-teal-500 transition font-medium"
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