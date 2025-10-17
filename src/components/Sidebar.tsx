"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { FiMenu, FiX } from "react-icons/fi";

export default function Sidebar({ open, setOpen }: { open?: boolean, setOpen?: (v: boolean) => void }) {
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const um = data.user?.user_metadata as any;
      const am = data.user?.app_metadata as any;
      const email: string | undefined = data.user?.email ?? undefined;

      const allowlistEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
      const allowlist = allowlistEnv.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      const emailAllowed = email ? allowlist.includes(email.toLowerCase()) : false;

      const isAdminMeta =
        (um && (um.role === "admin" || (Array.isArray(um.roles) && um.roles.includes("admin")))) ||
        (am && (am.role === "admin" || (Array.isArray(am.roles) && am.roles.includes("admin"))));

      setIsAdmin(!!isAdminMeta || emailAllowed);
    };
    fetchUser();
  }, []);

  const closeMenu = () => {
    setMobileMenu(false);
    setOpen?.(false);
  };

  const MenuLinks = () => (
    <nav className="flex-1 flex flex-col mt-4">
      <Link
        href="/dashboard"
        className="px-6 py-3 hover:bg-indigo-100 hover:text-indigo-700 transition rounded-lg mx-2 my-1"
        onClick={closeMenu}
      >
        Dashboard
      </Link>
      <Link
        href="/profile"
        className="px-6 py-3 hover:bg-indigo-100 hover:text-indigo-700 transition rounded-lg mx-2 my-1"
        onClick={closeMenu}
      >
        Profile
      </Link>
      {isAdmin && (
        <div className="mt-4 pt-4 border-t border-gray-200 mx-4">
          <div className="px-2 text-xs uppercase tracking-widest text-gray-500 mb-2">Admin</div>
          <Link
            href="/admin/users"
            className="px-6 py-3 hover:bg-indigo-100 hover:text-indigo-700 transition rounded-lg mx-2 my-1"
            onClick={closeMenu}
          >
            Users
          </Link>
          <Link
            href="/admin/expirations"
            className="px-6 py-3 hover:bg-indigo-100 hover:text-indigo-700 transition rounded-lg mx-2 my-1"
            onClick={closeMenu}
          >
            Expirations
          </Link>
        </div>
      )}
      <button
        className="px-6 py-3 text-left hover:bg-red-100 hover:text-red-700 transition rounded-lg mx-2 my-1"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
          closeMenu();
        }}
      >
        Logout
      </button>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white shadow-lg flex-shrink-0 hidden md:flex flex-col rounded-r-3xl overflow-hidden min-h-screen">
        <div className="p-6 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
          Digital Docs
        </div>
        <MenuLinks />
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center px-4 py-3 bg-white shadow-lg sticky top-0 z-30">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setMobileMenu(true)}>
          <FiMenu size={24} />
        </Button>
        <div className="text-lg font-bold flex-1">Digital Docs</div>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black opacity-30" onClick={closeMenu}></div>
          <aside className="relative w-5/6 max-w-xs bg-white shadow-lg flex flex-col h-full rounded-r-3xl animate-slideInLeft">
            <div className="flex items-center justify-between p-4 border-b shadow-sm">
              <div className="text-xl font-bold">Digital Docs</div>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <FiX size={24} />
              </Button>
            </div>
            <MenuLinks />
          </aside>
        </div>
      )}
    </>
  );
}

// Animations: add this to global CSS if not present:
// @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
// .animate-slideInLeft { animation: slideInLeft 0.2s ease; }
