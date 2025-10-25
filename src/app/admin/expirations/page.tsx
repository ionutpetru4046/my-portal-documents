"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Doc {
  id: string;
  name: string;
  userID: string;
  ownerEmail?: string | null;
  expiration_date: string | null;
  reminder_at: string | null;
}

function badge(expiration_date: string | null) {
  const base = "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap";
  if (!expiration_date)
    return (
      <span className={`${base} bg-green-100 text-green-700`}>Active</span>
    );
  const now = new Date();
  const d = new Date(expiration_date);
  const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0)
    return <span className={`${base} bg-gray-100 text-gray-600`}>Expired</span>;
  if (days <= 7)
    return (
      <span className={`${base} bg-red-100 text-red-700`}>
        Expiring in {days}d
      </span>
    );
  return <span className={`${base} bg-green-100 text-green-700`}>Active</span>;
}

export default function AdminExpirationsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAdmin, setNotAdmin] = useState(false);
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function init() {
      const { data: userRes } = await supabase.auth.getUser();
      const role =
        userRes.user?.user_metadata?.role || userRes.user?.app_metadata?.role;
      const rolesArr =
        (userRes.user?.user_metadata as any)?.roles ||
        (userRes.user?.app_metadata as any)?.roles;
      const isAdmin =
        role === "admin" ||
        (Array.isArray(rolesArr) && rolesArr.includes("admin"));
      if (!isAdmin) {
        setNotAdmin(true);
        setLoading(false);
        return;
      }
      const url = new URL(window.location.href);
      const filterUserID = url.searchParams.get("userID");

      let res = await (filterUserID
        ? supabase
            .from("documents")
            .select("id,name,userID,ownerEmail,expiration_date,reminder_at")
            .eq("userID", filterUserID)
        : supabase
            .from("documents")
            .select("id,name,userID,ownerEmail,expiration_date,reminder_at"));

      if (res.error) {
        res = await (filterUserID
          ? supabase
              .from("documents")
              .select("id,name,userID,expiration_date,reminder_at")
              .eq("userID", filterUserID)
          : supabase
              .from("documents")
              .select("id,name,userID,expiration_date,reminder_at"));
      }

      if (!res.error && res.data) setDocs(res.data as Doc[]);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = docs.filter(
      (d) =>
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.ownerEmail?.toLowerCase().includes(q) ?? false) ||
        d.userID.toLowerCase().includes(q)
    );
    arr = arr.sort((a, b) => {
      const aTime = a.expiration_date
        ? new Date(a.expiration_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bTime = b.expiration_date
        ? new Date(b.expiration_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      return sortDir === "asc" ? aTime - bTime : bTime - aTime;
    });
    return arr;
  }, [docs, query, sortDir]);

  if (loading) 
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  
  if (notAdmin)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You are not authorized to view this page.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container with max width and centering */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Document Expirations
          </h1>
          <p className="text-gray-200 text-base sm:text-lg">
            Monitor and manage all document expiration dates
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {filtered.length} Documents
            </span>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Documents
              </label>
              <input
                placeholder="Search by document name, email, or user ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value as any)}
              >
                <option value="asc">⬆️ Soonest first</option>
                <option value="desc">⬇️ Farthest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-indigo-50 to-purple-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Document Name
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    User ID
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Expiration
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Reminder
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-5xl mb-3">📭</span>
                        <p className="text-lg font-medium">No documents found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 wrap-break-word max-w-xs">
                          {d.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition break-all"
                          href={`/admin/expirations?userID=${encodeURIComponent(
                            d.userID
                          )}`}
                        >
                          {d.userID.slice(0, 8)}...
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700 wrap-break-word">
                          {d.ownerEmail || <span className="text-gray-400">-</span>}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">
                          {d.expiration_date
                            ? new Date(d.expiration_date).toLocaleDateString()
                            : <span className="text-gray-400">-</span>}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700 text-sm">
                          {d.reminder_at
                            ? new Date(d.reminder_at).toLocaleString()
                            : <span className="text-gray-400">-</span>}
                        </span>
                      </td>
                      <td className="py-4 px-6">{badge(d.expiration_date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <span className="text-5xl mb-3 block">📭</span>
              <p className="text-lg font-medium text-gray-700 mb-1">No documents found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 wrap-break-word">
                      {d.name}
                    </h3>
                    {badge(d.expiration_date)}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-500 font-medium w-24 shrink-0">
                      User ID:
                    </span>
                    <Link
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium break-all"
                      href={`/admin/expirations?userID=${encodeURIComponent(
                        d.userID
                      )}`}
                    >
                      {d.userID}
                    </Link>
                  </div>

                  {d.ownerEmail && (
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-24 shrink-0">
                        Email:
                      </span>
                      <span className="text-gray-700 wrap-break-word">
                        {d.ownerEmail}
                      </span>
                    </div>
                  )}

                  {d.expiration_date && (
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-24 shrink-0">
                        Expires:
                      </span>
                      <span className="text-gray-700">
                        {new Date(d.expiration_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {d.reminder_at && (
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-24 shrink-0">
                        Reminder:
                      </span>
                      <span className="text-gray-700">
                        {new Date(d.reminder_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}