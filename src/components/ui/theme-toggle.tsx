"use client";

import { useTheme } from "next-themes";
import { Button } from "./button";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="h-[1.2rem] w-[1.2rem] text-slate-800 dark:text-slate-200 transition-colors" />
      ) : (
        <FiMoon className="h-[1.2rem] w-[1.2rem] text-slate-800 dark:text-slate-200 transition-colors" />
      )}
    </Button>
  );
}