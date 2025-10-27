// src/components/FolderCard.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface FolderCardProps {
  name: string;
  slug: string;
  icon: string;
}

export default function FolderCard({ name, slug, icon }: FolderCardProps) {
  const pathname = usePathname();
  const active = pathname?.startsWith(`/dashboard/${slug}`);

  return (
    <Link
      href={`/dashboard/${slug}`}
      className={`flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 rounded-3xl bg-white shadow-md cursor-pointer group w-full sm:w-44 md:w-52 lg:w-60 transition-all duration-300
        ${active ? 'ring-2 ring-indigo-300 scale-[1.02] bg-indigo-50' : 'hover:shadow-xl hover:bg-linear-to-br hover:from-indigo-50 hover:to-purple-50'}`}
    >
      <div className={`text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 md:mb-5 transition-transform duration-300 ${active ? 'scale-105' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <p className={`font-semibold text-base sm:text-lg md:text-xl text-gray-800 text-center transition-colors duration-300 ${active ? 'text-indigo-700' : 'group-hover:text-indigo-600'}`}>
        {name}
      </p>
      <span className={`mt-2 w-10 sm:w-12 md:w-14 h-1 bg-indigo-200 rounded-full transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
    </Link>
  );
}
