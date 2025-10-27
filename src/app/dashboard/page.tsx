// src/app/dashboard/page.tsx
import FolderCard from "@/components/FolderCard";

const categories = [
  { name: "Cars Documents", slug: "cars documents", icon: "🚗" },
  { name: "Company Documents", slug: "company documents", icon: "🏢" },
  { name: "User Documents", slug: "user documents", icon: "👤" },
  { name: "Other Documents", slug: "other documents", icon: "📁" },
  { name: "Employers Documents", slug: "Employers Documents", icon: "📁" },
  { name: "Personal Documents", slug: "Personal Documents", icon: "📁" },
  { name: "Insurance Documents", slug: "insurance documents", icon: "📁" },
  { name: "Government Documents", slug: "governments documents", icon: "📁" },
];

export default function DashboardHome() {
  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Choose a Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {categories.map((cat) => (
          <FolderCard key={cat.slug} {...cat} />
        ))}
      </div>
    </main>
  );
}
