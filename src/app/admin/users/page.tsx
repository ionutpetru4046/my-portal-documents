"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Row {
  userID: string;
  count: number;
  email?: string;
}

type SortKey = "userID" | "count" | "email";

export default function AdminUsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAdmin, setNotAdmin] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function init() {
      const { data: userRes } = await supabase.auth.getUser();
      const role = userRes.user?.user_metadata?.role || userRes.user?.app_metadata?.role;
      const rolesArr = (userRes.user?.user_metadata as any)?.roles || (userRes.user?.app_metadata as any)?.roles;
      const isAdmin = role === "admin" || (Array.isArray(rolesArr) && rolesArr.includes("admin"));
      if (!isAdmin) {
        setNotAdmin(true);
        setLoading(false);
        return;
      }

      let docs: any[] | null = null;
      let error: any = null;
      let triedWithEmail = false;

      const res = await supabase.from("documents").select("userID, ownerEmail");
      docs = res.data as any[] | null;
      error = res.error;
      triedWithEmail = true;

      if (error) {
        const res2 = await supabase.from("documents").select("userID");
        docs = res2.data as any[] | null;
        error = res2.error;
        triedWithEmail = false;
      }

      if (!error && docs) {
        const map: Record<string, { count: number; email?: string }> = {};
        docs.forEach((d: any) => {
          if (!map[d.userID]) map[d.userID] = { count: 0, email: undefined };
          map[d.userID].count += 1;
          if (triedWithEmail && d.ownerEmail && !map[d.userID].email) map[d.userID].email = d.ownerEmail;
        });
        const result: Row[] = Object.entries(map).map(([userID, v]) => ({ userID, count: v.count, email: v.email }));
        setRows(result);
      }
      setLoading(false);
    }
    init();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = rows.filter(r => !q || r.userID.toLowerCase().includes(q) || (r.email?.toLowerCase().includes(q) ?? false));
    arr = arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "count") return (a.count - b.count) * dir;
      if (sortKey === "email") return (a.email || "").localeCompare(b.email || "") * dir;
      return a.userID.localeCompare(b.userID) * dir;
    });
    return arr;
  }, [rows, query, sortKey, sortDir]);

  if (loading) 
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
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
        <div className="bg-linear-to-r from-blue-600 to-teal-400 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            User Management
          </h1>
          <p className="text-gray-100 text-base sm:text-lg">
            View and manage all users and their document counts
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {filtered.length} Users
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {rows.reduce((sum, r) => sum + r.count, 0)} Total Documents
            </span>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <input
                placeholder="Search by User ID or Email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="w-full lg:w-56">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
              >
                <option value="count">📊 Document Count</option>
                <option value="userID">🆔 User ID</option>
                <option value="email">📧 Email</option>
              </select>
            </div>
            <div className="w-full lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={sortDir}
                onChange={e => setSortDir(e.target.value as any)}
              >
                <option value="desc">⬇️ Descending</option>
                <option value="asc">⬆️ Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-blue-50 to-teal-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    User ID
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Documents
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-5xl mb-3">👥</span>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(r => (
                    <tr key={r.userID} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <div className="font-mono text-sm text-gray-900 break-all max-w-xs">
                          {r.userID}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700 wrap-break-word">
                          {r.email || <span className="text-gray-400 italic">No email</span>}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-full text-sm">
                          {r.count}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-teal-600 transition font-medium text-sm"
                          href={`/admin/expirations?userID=${encodeURIComponent(r.userID)}`}
                        >
                          <span>View Documents</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <span className="text-5xl mb-3 block">👥</span>
              <p className="text-lg font-medium text-gray-700 mb-1">No users found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            filtered.map(r => (
              <div
                key={r.userID}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-full text-sm">
                        {r.count} {r.count === 1 ? 'doc' : 'docs'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500 font-medium block mb-1">
                      User ID:
                    </span>
                    <span className="text-gray-900 font-mono text-xs break-all bg-gray-50 px-3 py-2 rounded-lg block">
                      {r.userID}
                    </span>
                  </div>

                  {r.email && (
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">
                        Email:
                      </span>
                      <span className="text-gray-700 wrap-break-word block">
                        {r.email}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-teal-500 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-teal-600 transition font-medium w-full"
                  href={`/admin/expirations?userID=${encodeURIComponent(r.userID)}`}
                >
                  <span>View Documents</span>
                  <span>→</span>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}