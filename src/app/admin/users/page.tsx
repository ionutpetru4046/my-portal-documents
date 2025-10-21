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

  if (loading) return <div className="p-6">Loading...</div>;
  if (notAdmin) return <div className="p-6">You are not authorized to view this page.</div>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Users - Document Counts</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <input
          placeholder="Search by User ID or Email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/3"
        />
        <select
          className="border rounded px-3 py-2 w-full sm:w-1/4"
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
        >
          <option value="count">Sort by Count</option>
          <option value="userID">Sort by User ID</option>
          <option value="email">Sort by Email</option>
        </select>
        <select
          className="border rounded px-3 py-2 w-full sm:w-1/4"
          value={sortDir}
          onChange={e => setSortDir(e.target.value as any)}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-3 text-left">User ID</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Documents</th>
              <th className="py-2 px-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.userID} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 break-words">{r.userID}</td>
                <td className="py-2 px-3 break-words">{r.email || "-"}</td>
                <td className="py-2 px-3">{r.count}</td>
                <td className="py-2 px-3">
                  <Link
                    className="text-indigo-600 hover:underline"
                    href={`/admin/expirations?userID=${encodeURIComponent(r.userID)}`}
                  >
                    View Documents
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
