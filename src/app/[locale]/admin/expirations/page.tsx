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
  const base = "px-2 py-1 rounded-full text-xs";
  if (!expiration_date) return <span className={`${base} bg-green-100 text-green-700`}>Active</span>;
  const now = new Date();
  const d = new Date(expiration_date);
  const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return <span className={`${base} bg-gray-100 text-gray-600`}>Expired</span>;
  if (days <= 7) return <span className={`${base} bg-red-100 text-red-700`}>Expiring in {days}d</span>;
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
      const role = userRes.user?.user_metadata?.role || userRes.user?.app_metadata?.role;
      const rolesArr = (userRes.user?.user_metadata as any)?.roles || (userRes.user?.app_metadata as any)?.roles;
      const isAdmin = role === "admin" || (Array.isArray(rolesArr) && rolesArr.includes("admin"));
      if (!isAdmin) {
        setNotAdmin(true);
        setLoading(false);
        return;
      }
      const url = new URL(window.location.href);
      const filterUserID = url.searchParams.get("userID");

      // Try select with ownerEmail first
      let res = await (filterUserID
        ? supabase.from("documents").select("id,name,userID,ownerEmail,expiration_date,reminder_at").eq("userID", filterUserID)
        : supabase.from("documents").select("id,name,userID,ownerEmail,expiration_date,reminder_at"));

      if (res.error) {
        // Fallback without ownerEmail if column missing
        res = await (filterUserID
          ? supabase.from("documents").select("id,name,userID,expiration_date,reminder_at").eq("userID", filterUserID)
          : supabase.from("documents").select("id,name,userID,expiration_date,reminder_at"));
      }

      if (!res.error && res.data) setDocs(res.data as Doc[]);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = docs.filter(d => !q || d.name.toLowerCase().includes(q) || (d.ownerEmail?.toLowerCase().includes(q) ?? false) || d.userID.toLowerCase().includes(q));
    arr = arr.sort((a, b) => {
      const aTime = a.expiration_date ? new Date(a.expiration_date).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.expiration_date ? new Date(b.expiration_date).getTime() : Number.MAX_SAFE_INTEGER;
      return sortDir === "asc" ? aTime - bTime : bTime - aTime;
    });
    return arr;
  }, [docs, query, sortDir]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (notAdmin) return <div className="p-6">You are not authorized to view this page.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Documents - Expirations</h1>
      <div className="flex gap-3 mb-3">
        <input
          placeholder="Search by document name, email, or user ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select className="border rounded px-3 py-2" value={sortDir} onChange={e => setSortDir(e.target.value as any)}>
          <option value="asc">Soonest first</option>
          <option value="desc">Farthest first</option>
        </select>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th className="py-2">User ID</th>
            <th className="py-2">Email</th>
            <th className="py-2">Expiration</th>
            <th className="py-2">Reminder</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(d => (
            <tr key={d.id} className="border-b">
              <td className="py-2">{d.name}</td>
              <td className="py-2">
                <Link className="text-indigo-600 hover:underline" href={`/admin/expirations?userID=${encodeURIComponent(d.userID)}`}>{d.userID}</Link>
              </td>
              <td className="py-2">{d.ownerEmail || "-"}</td>
              <td className="py-2">{d.expiration_date ? new Date(d.expiration_date).toLocaleDateString() : "-"}</td>
              <td className="py-2">{d.reminder_at ? new Date(d.reminder_at).toLocaleString() : "-"}</td>
              <td className="py-2">{badge(d.expiration_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
