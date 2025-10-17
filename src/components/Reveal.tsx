"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, className = "", animation = "fade-up", delay = 0 }: { children: React.ReactNode; className?: string; animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right"; delay?: number; }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = "transition-all duration-700 ease-out will-change-transform will-change-opacity";
  const hidden = animation === "fade-up"
    ? "opacity-0 translate-y-6"
    : animation === "fade-in"
    ? "opacity-0"
    : animation === "slide-left"
    ? "opacity-0 -translate-x-6"
    : "opacity-0 translate-x-6";
  const shown = "opacity-100 translate-x-0 translate-y-0";

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`${base} ${visible ? shown : hidden} ${className}`}>
      {children}
    </div>
  );
}
