// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import FolderCard from "@/components/FolderCard";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface DocRow {
  id: string;
  category?: string;
  created_at?: string;
  path?: string;
  size?: number;
}

const categories = [
  { name: "Cars Documents", slug: "cars", icon: "🚗" },
  { name: "Company Documents", slug: "company", icon: "🏢" },
  { name: "User Documents", slug: "users", icon: "👤" },
  { name: "Other Documents", slug: "other", icon: "📁" },
  { name: "Employers Documents", slug: "employers", icon: "💼" },
  { name: "Personal Documents", slug: "personal", icon: "🏠" },
  { name: "Insurance Documents", slug: "insurance", icon: "🛡️" },
  { name: "Government Documents", slug: "government", icon: "🏛️" },
];

export default function DashboardPage() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [recentUpload, setRecentUpload] = useState<string | null>(null);
  const [storageUsedBytes, setStorageUsedBytes] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
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
        .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())[0];
      setRecentUpload(mostRecent?.created_at ?? null);

      const totalSize = (data || []).reduce((acc, d) => acc + (d.size ?? 0), 0);
      setStorageUsedBytes(totalSize || null);
    };

    fetchDocs();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const storagePercentage = storageUsedBytes ? Math.min((storageUsedBytes / (100 * 1024 * 1024)) * 100, 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950 relative overflow-x-hidden py-0 px-0">
      {/* Abstract Blurred Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full bg-linear-to-r from-blue-500 via-cyan-400 to-blue-600 opacity-20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[320px] h-[340px] rounded-full bg-linear-to-br from-purple-900 via-cyan-800 to-indigo-700 opacity-20 blur-3xl animate-pulse-slow" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-10 sm:pt-12 px-4 sm:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -32 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6 md:gap-8"
        >
          <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl shadow-lg bg-white/70 ring-2 ring-blue-400/30 backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <Image src="/Digital-document-logo.png" width={96} height={96} alt="iDocReminder Logo" className="w-full h-full object-contain" priority />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-1 leading-tight">
              iDocReminder
            </h1>
            <p className="text-lg md:text-xl font-medium text-slate-300 max-w-lg mb-2">Your ultra-secure, smart document dashboard for peace of mind—never miss document renewals again!</p>
            <span className="inline-block text-blue-400 dark:text-cyan-400 bg-white/5 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide ring-1 ring-inset ring-blue-900">Ultra Modern Dashboard</span>
          </div>
        </motion.div>
        {/* Motivational/CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 36 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-linear-to-br from-blue-900/70 via-purple-900/30 to-cyan-900/5 glassmorphism p-4 md:p-6 rounded-2xl shadow-xl flex flex-col justify-center items-start gap-2 border border-blue-800/30 w-full md:w-1/2"
        >
          <span className="uppercase text-xs text-slate-300 font-bold tracking-widest mb-1">Tip</span>
          <span className="text-base font-semibold text-white flex items-center gap-2 mb-1"><span className="animate-pulse text-blue-300">💡</span> Set reminders to renew important docs before they expire!</span>
          <button className="mt-3 px-5 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-700 transition-all">Try Smart Reminder →</button>
        </motion.div>
      </section>

      <div className="relative z-10">
        {/* Stats */}
        <AnimatePresence>
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 20 }} 
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 px-4 sm:px-12"
        >
          <div className="p-6 md:p-7 bg-white/80 to-blue-100/60 dark:from-indigo-800/40 dark:to-slate-900/60 rounded-2xl backdrop-blur-xl shadow-lg glassmorphism border border-blue-200/30 flex flex-col items-center">
            <h3 className="text-slate-400 text-xs uppercase font-extrabold mb-1 tracking-wider">Total Categories</h3>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-indigo-100">{categories.length}</p>
          </div>
          <div className="p-6 md:p-7 bg-linear-to-r from-blue-600/60 via-indigo-700/50 to-purple-600/40 rounded-2xl shadow-lg glassmorphism border border-blue-200/20 flex flex-col items-center">
            <h3 className="text-slate-300 text-xs uppercase font-extrabold mb-1 tracking-wider">Recent Upload</h3>
            <p className="text-lg sm:text-xl font-extrabold text-white drop-shadow">
              {recentUpload ? new Date(recentUpload).toLocaleDateString() : "No uploads yet"}
            </p>
          </div>
          <div className="p-6 md:p-7 bg-linear-to-br from-blue-900/60 to-cyan-800/30 rounded-2xl shadow-lg glassmorphism border border-blue-200/10 flex flex-col items-center">
            <h3 className="text-cyan-300 text-xs uppercase font-extrabold mb-1 tracking-wider">Storage Used</h3>
            <p className="text-lg sm:text-xl font-bold text-cyan-200">
              {storageUsedBytes ? `${(storageUsedBytes / 1024 / 1024).toFixed(2)} MB / 100 MB` : "0 MB / 100 MB"}
            </p>
            <div className="w-full bg-slate-700/50 h-2 rounded-lg mt-2">
              <div className="h-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 rounded-lg animate-pulse" style={{ width: `${storagePercentage}%` }} />
            </div>
          </div>
        </motion.section>
        </AnimatePresence>

        {/* Categories */}
        <AnimatePresence>
        <motion.section 
          initial={{ opacity: 0, y: 38 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-12"
              : "flex flex-col gap-6 px-4 sm:px-12"
          }
        >
          {filteredCategories.map((cat, i) => (
            <FolderCard key={cat.slug} {...cat} index={i} docs={docs} mounted={true} />
          ))}
        </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
