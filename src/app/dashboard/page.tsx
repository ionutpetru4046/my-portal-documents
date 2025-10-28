"use client";

// src/app/dashboard/page.tsx
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import FolderCard from "@/components/FolderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FiSearch, FiPlus, FiArrowRight } from "react-icons/fi";

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
  { name: "Employers Documents", slug: "employers", icon: "📁" },
  { name: "Personal Documents", slug: "personal", icon: "📁" },
  { name: "Insurance Documents", slug: "insurance", icon: "📁" },
  { name: "Government Documents", slug: "government", icon: "📁" },
];

export default function DashboardHome() {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // live stats
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [recentUpload, setRecentUpload] = useState<string | null>(null);
  const [storageUsedBytes, setStorageUsedBytes] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);

    const fetchUserDocs = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) return;

        // fetch documents for this user (only necessary fields)
        const res = await supabase
          .from("documents")
          .select("id, category, created_at, path")
          .eq("userID", userId);
        const data = res.data as DocRow[] | null;
        const error = (res as any).error ?? null;

        if (error) {
          console.info("Failed to fetch documents for stats:", error.message);
          return;
        }

        setDocs(data || []);

        // recent upload
        const mostRecent = (data || []).slice().sort((a, b) => {
          const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
          const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
          return tb - ta;
        })[0];
        setRecentUpload(mostRecent?.created_at ?? null);
        // compute storage used from document sizes (preferred if available)
        const totalFromDocs = (data || []).reduce((acc, d) => acc + (d.size ?? 0), 0);
        if (totalFromDocs > 0) {
          setStorageUsedBytes(totalFromDocs);
        } else {
          // try to estimate storage used by listing storage objects for this user prefix as a fallback
          try {
            const listRes = await supabase.storage.from("documents").list("", { limit: 1000 });
            if (listRes?.data && Array.isArray(listRes.data)) {
              let total = 0;
              for (const f of listRes.data) {
                const maybeSize = (f as any).size ?? (f as any).metadata?.size ?? null;
                if (typeof maybeSize === "number") total += maybeSize;
              }
              setStorageUsedBytes(total || null);
            }
          } catch (err) {
            // ignore storage list issues - optional feature
          }
        }
      } catch (err) {
        console.info("Error fetching user docs", err);
      }
    };

    void fetchUserDocs();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q));
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Your Documents</h1>
            <p className="text-slate-400 text-sm mt-1">Organize and access your files by category.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Link href="/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2 rounded-lg px-6 py-2.5 transition-all shadow-lg hover:shadow-blue-500/20 group">
                  <FiPlus className="w-5 h-5" />
                  Upload
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full sm:w-64 pl-10 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-6 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <h3 className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Categories</h3>
            <p className="text-3xl font-bold text-white mt-3">{categories.length}</p>
          </div>
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-6 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/10">
            <h3 className="text-xs text-slate-400 font-medium uppercase tracking-wide">Recent Upload</h3>
            <p className="text-sm text-slate-300 mt-3">
              {recentUpload ? new Date(recentUpload).toLocaleString() : "—"}
            </p>
          </div>
          <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-6 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/10">
            <h3 className="text-xs text-slate-400 font-medium uppercase tracking-wide">Storage Used</h3>
            <p className="text-sm text-slate-300 mt-3">
              {storageUsedBytes != null ? `${(storageUsedBytes / 1024 / 1024).toFixed(2)} MB` : "—"}
            </p>
          </div>
        </motion.section>

        {/* Categories grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="sr-only">Categories</h2>
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
        </motion.section>
      </div>
    </main>
  );
}