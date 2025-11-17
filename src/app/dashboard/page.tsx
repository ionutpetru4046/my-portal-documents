"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSearch, FiFolder, FiClock, FiHardDrive, FiGrid, FiList } from "react-icons/fi";
import FolderCard from "@/components/FolderCard";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

const categories = [
  {
    name: "Cars Documents",
    slug: "cars",
    icon: "🚗",
    sub: ["Insurance", "Registration", "Maintenance"],
  },
  {
    name: "Company Documents",
    slug: "company",
    icon: "🏢",
    sub: ["Reports", "Invoices", "Contracts"],
  },
  {
    name: "User Documents",
    slug: "users",
    icon: "👤",
    sub: ["Profiles", "IDs", "Applications"],
  },
  {
    name: "Other Documents",
    slug: "other",
    icon: "📁",
    sub: ["Miscellaneous", "Receipts"],
  },
  {
    name: "Employers Documents",
    slug: "employers",
    icon: "💼",
    sub: ["HR", "Payroll", "Attendance"],
  },
  {
    name: "Personal Documents",
    slug: "personal",
    icon: "🏠",
    sub: ["Health", "Education", "Finance"],
  },
  {
    name: "Insurance Documents",
    slug: "insurance",
    icon: "🛡️",
    sub: ["Policies", "Claims", "Payments"],
  },
  {
    name: "Government Documents",
    slug: "government",
    icon: "🏛️",
    sub: ["ID", "Tax", "Permits"],
  },
];

interface DocRow {
  id: string;
  category?: string;
  created_at?: string;
  path?: string;
  size?: number;
}

export default function DashboardHome() {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [recentUpload, setRecentUpload] = useState<string | null>(null);
  const [storageUsedBytes, setStorageUsedBytes] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setMounted(true);

    const fetchUserDocs = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const res = await supabase
        .from("documents")
        .select("id, category, created_at, path, size")
        .eq("userID", userId);

      const data = res.data as DocRow[] | null;
      setDocs(data || []);

      const mostRecent = (data || [])
        .slice()
        .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())[0];
      setRecentUpload(mostRecent?.created_at ?? null);

      const totalSize = (data || []).reduce((acc, d) => acc + (d.size ?? 0), 0);
      setStorageUsedBytes(totalSize || null);
    };

    fetchUserDocs();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const storagePercentage = storageUsedBytes ? Math.min((storageUsedBytes / (100 * 1024 * 1024)) * 100, 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -100, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -80, 0],
            y: [0, 80, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Glassmorphism overlay */}
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/50 backdrop-blur-[1px]" />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed sm:hidden inset-y-0 left-0 z-50 w-72 bg-slate-900/95 border-r border-slate-800/50 backdrop-blur-2xl flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/50">
                <h2 className="text-white font-bold text-xl tracking-tight">iDocReminder</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800/50 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 relative z-10 px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10"
        >
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200">
              Your Documents
            </h1>
            <p className="text-slate-400 text-base sm:text-lg font-light">
              Organize and access your files by category
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/50 rounded-xl p-1 backdrop-blur-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories..."
                className="pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800/50 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all w-full backdrop-blur-xl shadow-lg hover:bg-slate-900/80"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10"
        >
          {/* Total Categories */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FiFolder className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Categories</h3>
                </div>
                <p className="text-4xl font-bold text-white">{categories.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiFolder className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Recent Upload */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FiClock className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Recent Upload</h3>
                </div>
                <p className="text-sm text-slate-300 font-medium">
                  {recentUpload ? new Date(recentUpload).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "No uploads yet"}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiClock className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </motion.div>

          {/* Storage Used */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <FiHardDrive className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Storage Used</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-300 font-medium">
                    {storageUsedBytes ? `${(storageUsedBytes / 1024 / 1024).toFixed(2)} MB` : "0 MB"} / 100 MB
                  </p>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${storagePercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiHardDrive className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Category Grid/List */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {filtered.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-32 bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/50 rounded-2xl text-center backdrop-blur-xl shadow-xl"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl flex items-center justify-center">
                <FiSearch className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg font-medium">No categories match your search</p>
              <p className="text-slate-600 text-sm mt-2">Try adjusting your search terms</p>
            </motion.div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
              : "flex flex-col gap-4"
            }>
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: i * 0.05, 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ scale: 1.03, y: -8 }}
                >
                  <FolderCard {...cat} index={i} mounted={mounted} docs={docs} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}