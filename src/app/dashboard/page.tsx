"use client";

// src/app/dashboard/page.tsx
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import FolderCard from "@/components/FolderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

interface DocRow {
  id: string;
  category?: string;
  created_at?: string;
  path?: string;
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

        // try to estimate storage used by listing storage objects for this user prefix
        try {
          // attempt to list all files in the 'documents' bucket and sum sizes when available
          const listRes = await supabase.storage.from("documents").list("", { limit: 1000 });
          if (listRes?.data && Array.isArray(listRes.data)) {
            // supabase storage file object may include 'metadata' with size in some setups; defensively sum if present
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
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-white p-6 sm:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Your Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Organize and access your files by category.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Link href="/upload">
              <Button variant="default" size="default" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Upload
              </Button>
            </Link>
          </div>
          <div className="w-full sm:w-auto">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-64 sm:w-80"
            />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">Total Categories</h3>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">Recent Upload</h3>
          <p className="text-sm text-gray-700">
            {recentUpload ? new Date(recentUpload).toLocaleString() : "—"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">Storage Used</h3>
          <p className="text-sm text-gray-700">
            {storageUsedBytes != null ? `${(storageUsedBytes / 1024 / 1024).toFixed(2)} MB` : "—"}
          </p>
        </div>
      </section>

      {/* Categories grid */}
      <section>
        <h2 className="sr-only">Categories</h2>
        {filtered.length === 0 ? (
          <div className="py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No categories match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filtered.map((cat, i) => (
              <FolderCard key={cat.slug} {...cat} index={i} mounted={mounted} docs={docs} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
