"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
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

  return (
    <main className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-100 h-100 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-100 h-100 bg-linear-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed sm:hidden inset-y-0 left-0 z-40 w-64 bg-slate-900/90 border-r border-slate-800 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h2 className="text-white font-semibold text-lg">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <FiX size={20} />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 relative z-10 px-4 sm:px-8 py-6 sm:py-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Your Documents</h1>
            <p className="text-slate-400 text-sm mt-1">
              Organize and access your files by category.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="pl-10 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all w-full"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg text-white">
            <h3 className="text-xs text-slate-400 uppercase tracking-wide">Total Categories</h3>
            <p className="text-3xl font-bold mt-3">{categories.length}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg text-white">
            <h3 className="text-xs text-slate-400 uppercase tracking-wide">Recent Upload</h3>
            <p className="text-sm text-slate-300 mt-3">
              {recentUpload ? new Date(recentUpload).toLocaleString() : "—"}
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg text-white">
            <h3 className="text-xs text-slate-400 uppercase tracking-wide">Storage Used</h3>
            <p className="text-sm text-slate-300 mt-3">
              {storageUsedBytes ? `${(storageUsedBytes / 1024 / 1024).toFixed(2)} MB` : "—"}
            </p>
          </div>
        </section>

        {/* Category Grid */}
        <section>
          {filtered.length === 0 ? (
            <div className="py-20 bg-slate-900/50 border border-slate-800 rounded-lg text-center backdrop-blur-xl">
              <p className="text-slate-400">No categories match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <FolderCard {...cat} index={i} mounted={mounted} docs={docs} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
