"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Row {
  userID: string;
  count: number;
}

type SortKey = "userID" | "count";

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
      const { data: docs, error } = await supabase
        .from("documents")
        .select("userID");
      if (!error && docs) {
        const map: Record<string, number> = {};
        docs.forEach(d => { map[d.userID] = (map[d.userID] || 0) + 1; });
        const result = Object.entries(map).map(([userID, count]) => ({ userID, count: count as number }));
        setRows(result);
      }
      setLoading(false);
    }
    init();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = rows.filter(r => !q || r.userID.toLowerCase().includes(q));
    arr = arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "count") return (a.count - b.count) * dir;
      return a.userID.localeCompare(b.userID) * dir;
    });
    return arr;
  }, [rows, query, sortKey, sortDir]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (notAdmin) return <div className="p-6">You are not authorized to view this page.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users - Document Counts</h1>
      <div className="flex gap-3 mb-3">
        <input
          placeholder="Search by User ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select className="border rounded px-3 py-2" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
          <option value="count">Sort by Count</option>
          <option value="userID">Sort by User ID</option>
        </select>
        <select className="border rounded px-3 py-2" value={sortDir} onChange={e => setSortDir(e.target.value as any)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">User ID</th>
            <th className="py-2">Documents</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.userID} className="border-b">
              <td className="py-2">{r.userID}</td>
              <td className="py-2">{r.count}</td>
              <td className="py-2">
                <Link className="text-indigo-600 hover:underline" href={`/admin/expirations?userID=${encodeURIComponent(r.userID)}`}>
                  View Documents
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
