/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class", // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6",
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
        secondary: {
          light: "#d1d5db",
          DEFAULT: "#9ca3af",
          dark: "#6b7280",
        },
        accent: {
          light: "#a78bfa",
          DEFAULT: "#8b5cf6",
          dark: "#7c3aed",
        },
        destructive: {
          light: "#f87171",
          DEFAULT: "#ef4444",
          dark: "#dc2626",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#111827",
        },
        foreground: {
          DEFAULT: "#111827",
          dark: "#f9fafb",
        },
        card: {
          DEFAULT: "#ffffff",
          dark: "#1f2937",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
          dark: "#374151",
          "dark-foreground": "#9ca3af",
        },
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};
