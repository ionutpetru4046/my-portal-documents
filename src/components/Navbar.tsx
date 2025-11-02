"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiFileText, FiUsers, FiClock, FiBook, FiMail, FiSettings, FiLogOut, FiUser, FiGrid, FiX, FiMenu, FiHelpCircle, FiHome, FiDollarSign } from "react-icons/fi";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [quickLinksDropdown, setQuickLinksDropdown] = useState(false);
  const [supportDropdown, setSupportDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const adminRef = useRef<HTMLDivElement | null>(null);
  const quickLinksRef = useRef<HTMLDivElement | null>(null);
  const supportRef = useRef<HTMLDivElement | null>(null);
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
      if (quickLinksRef.current && !quickLinksRef.current.contains(e.target as Node)) {
        setQuickLinksDropdown(false);
      }
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportDropdown(false);
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
    `text-slate-300 hover:text-white transition-colors duration-200 font-medium text-sm ${
      pathname === href ? "text-white" : ""
    }`;

  const isAdmin = user?.role === "admin";

  const quickLinksData = [
    { icon: FiHome, href: "/", label: "Home", description: "Back to homepage", color: "blue" },
    { icon: FiDollarSign, href: "/subscribe", label: "Pricing", description: "View our plans", color: "purple" },
    { icon: FiBook, href: "/about", label: "About Us", description: "Learn our story", color: "cyan" },
  ];

  const supportData = [
    { icon: FiHelpCircle, href: "/help", label: "Help Center", description: "Find answers", color: "blue" },
    { icon: FiMail, href: "/contact", label: "Contact Support", description: "Get in touch", color: "purple" },
    { icon: FiFileText, href: "/terms", label: "Terms & Privacy", description: "Legal docs", color: "cyan" },
  ];

  return (
        <nav className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition group">
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Image
                src="/Digital-document-logo.png"
                alt="DocuVault logo"
                width={40}
                height={40}
                className="rounded-lg"
                priority
              />
            </div>
            <span className="hidden sm:block text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-400 transition-colors">
              DocuVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Dashboard Link */}
            {user && (
              <Link href="/dashboard" className={`px-3 py-2 rounded-lg transition-all ${navLinkClass("/dashboard")} hover:bg-slate-800`}>
                Dashboard
              </Link>
            )}

            {/* Quick Links Dropdown */}
            <div className="relative" ref={quickLinksRef}>
              <button
                onClick={() => setQuickLinksDropdown(!quickLinksDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-medium text-sm"
              >
                Quick Links <FiChevronDown size={16} className={`transition-transform duration-300 ${quickLinksDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {quickLinksDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden"
                  >
                    {quickLinksData.map(({ icon: Icon, href, label, description, color }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/50 transition-colors group"
                        onClick={() => setQuickLinksDropdown(false)}
                      >
                        <div className={`w-9 h-9 rounded-lg bg-${color}-500/20 flex items-center justify-center group-hover:bg-${color}-500/30 transition`}>
                          <Icon size={18} className={`text-${color}-400`} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{label}</div>
                          <div className="text-xs text-slate-400">{description}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support Dropdown */}
            <div className="relative" ref={supportRef}>
              <button
                onClick={() => setSupportDropdown(!supportDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-medium text-sm"
              >
                Support <FiChevronDown size={16} className={`transition-transform duration-300 ${supportDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {supportDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden"
                  >
                    {supportData.map(({ icon: Icon, href, label, description, color }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/50 transition-colors group"
                        onClick={() => setSupportDropdown(false)}
                      >
                        <div className={`w-9 h-9 rounded-lg bg-${color}-500/20 flex items-center justify-center group-hover:bg-${color}-500/30 transition`}>
                          <Icon size={18} className={`text-${color}-400`} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{label}</div>
                          <div className="text-xs text-slate-400">{description}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative ml-2" ref={adminRef}>
                <button
                  onClick={() => setAdminDropdown(!adminDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-700"
                >
                  <FiGrid size={16} />
                  Admin <FiChevronDown size={16} className={`transition-transform duration-300 ${adminDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {adminDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden"
                    >
                      <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/50 transition-colors group"
                        onClick={() => setAdminDropdown(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition">
                          <FiUsers size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Users</div>
                          <div className="text-xs text-slate-400">Manage users</div>
                        </div>
                      </Link>
                      <Link
                        href="/admin/expirations"
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/50 transition-colors group"
                        onClick={() => setAdminDropdown(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition">
                          <FiClock size={18} className="text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Expirations</div>
                          <div className="text-xs text-slate-400">Monitor docs</div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Side - User Menu / CTA */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    aria-label="User menu"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-white transition-all border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 group"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="w-7 h-7 rounded-lg object-cover border border-slate-600 group-hover:border-slate-500 transition"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-slate-600">
                          <span className="text-xs font-bold text-white">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition max-w-[120px] truncate">
                        {user.name}
                      </span>
                    </div>
                    <FiChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden"
                      >
                        <div className="px-4 py-4 border-b border-slate-700 bg-slate-900/50">
                          <div className="text-xs text-slate-400 font-medium mb-1.5">Signed in as</div>
                          <div className="text-sm font-medium text-white truncate">{user.email}</div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition">
                            <FiUser size={16} className="text-slate-300" />
                          </div>
                          <span className="text-sm font-medium">Profile</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition">
                            <FiFileText size={16} className="text-slate-300" />
                          </div>
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <div className="border-t border-slate-700" />
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition">
                            <FiLogOut size={16} />
                          </div>
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button className="bg-slate-800 cursor-pointer hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm border border-slate-700 hover:border-slate-600 rounded-lg px-4 py-2 transition-all">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 cursor-pointer hover:to-purple-700 text-white font-medium text-sm rounded-lg px-4 py-2 shadow-lg hover:shadow-blue-500/20 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile - Show user avatar or hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              {user && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
                          <div className="text-xs text-slate-400 mb-1">Signed in as</div>
                          <div className="text-sm font-medium text-white truncate">{user.email}</div>
                        </div>
                        <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition group">
                          <FiUser size={16} className="text-slate-300" />
                          <span className="text-sm">Profile</span>
                        </Link>
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition group">
                          <FiFileText size={16} className="text-slate-300" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                        <div className="border-t border-slate-700" />
                        <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition text-sm">
                          <FiLogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu className="w-5 h-5 text-slate-300" />
              </button>
            </div>
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
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div 
              className="relative bg-slate-900 text-white w-80 max-w-[90vw] h-screen flex flex-col overflow-y-auto shadow-2xl border-l border-slate-800"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Image src="/Digital-document-logo.png" alt="Logo" width={40} height={40} className="rounded-lg" />
                  </div>
                  <span className="text-lg font-bold">Menu</span>
                </div>
                <button
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-lg object-cover border-2 border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-slate-700 font-bold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{user.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1">
                {user && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiGrid className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                )}

                <div className="my-4 pt-4 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Quick Links</div>
                  {quickLinksData.map(({ icon: Icon, href, label }) => (
                    <Link 
                      key={href}
                      href={href} 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition" 
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">{label}</span>
                    </Link>
                  ))}
                </div>

                <div className="my-4 pt-4 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Support</div>
                  {supportData.map(({ icon: Icon, href, label }) => (
                    <Link 
                      key={href}
                      href={href} 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition" 
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-purple-400" />
                      <span className="text-sm">{label}</span>
                    </Link>
                  ))}
                </div>

                {isAdmin && (
                  <div className="my-4 pt-4 border-t border-slate-800">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Admin</div>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition" onClick={() => setMobileOpen(false)}>
                      <FiUsers className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">Users</span>
                    </Link>
                    <Link href="/admin/expirations" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition" onClick={() => setMobileOpen(false)}>
                      <FiClock className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm">Expirations</span>
                    </Link>
                  </div>
                )}
              </nav>

              {/* Theme Toggle */}
              <div className="px-4 py-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Appearance</div>
                <div className="px-4 py-2">
                  <ThemeToggle />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-slate-800 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <FiUser className="w-5 h-5 text-slate-400" />
                      Profile
                    </Link>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition text-sm font-medium"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                    >
                      <FiLogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-center transition font-medium text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center transition font-medium text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}