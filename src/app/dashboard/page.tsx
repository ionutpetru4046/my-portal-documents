// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import FolderCard from "@/components/FolderCard";
import { Input } from "@/components/ui/input";
import { FiGrid, FiList } from "react-icons/fi";

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
  const [query, setQuery] = useState("");
  const [recentUpload, setRecentUpload] = useState<string | null>(null);
  const [storageUsedBytes, setStorageUsedBytes] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    <main className="min-h-screen bg-slate-950 p-6">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Documents</h1>
            <p className="text-slate-400">Organize and access your files by category</p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="px-4 py-2 rounded-lg bg-slate-800 text-white placeholder:text-slate-500"
            />
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              <FiList />
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-900 rounded-lg">
            <h3 className="text-slate-400 text-sm">Total Categories</h3>
            <p className="text-white text-2xl font-bold">{categories.length}</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg">
            <h3 className="text-slate-400 text-sm">Recent Upload</h3>
            <p className="text-white text-lg">{recentUpload ? new Date(recentUpload).toLocaleDateString() : "No uploads yet"}</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg">
            <h3 className="text-slate-400 text-sm">Storage Used</h3>
            <p className="text-white text-lg">{storageUsedBytes ? `${(storageUsedBytes / 1024 / 1024).toFixed(2)} MB / 100 MB` : "0 MB / 100 MB"}</p>
            <div className="w-full bg-slate-800 h-2 rounded mt-1">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${storagePercentage}%` }} />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
          {filteredCategories.map((cat, i) => (
            <FolderCard key={cat.slug} {...cat} index={i} docs={docs} mounted={true} />
          ))}
        </section>
      </main>
  );
}
