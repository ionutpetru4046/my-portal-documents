"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { FiMenu, FiX } from "react-icons/fi";

export default function Sidebar({ open, setOpen }: { open?: boolean, setOpen?: (v: boolean) => void }) {
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);

  const closeMenu = () => {
    setMobileMenu(false);
    setOpen?.(false);
  };

  const menuContent = (
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
        {menuContent}
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
            {menuContent}
          </aside>
        </div>
      )}
    </>
  );
}

// Animations: add this to global CSS if not present:
// @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
// .animate-slideInLeft { animation: slideInLeft 0.2s ease; }
