// src/app/dashboard/page.tsx
import FolderCard from "@/components/FolderCard";

const categories = [
  { name: "Cars Documents", slug: "cars", icon: "🚗" },
  { name: "Company Documents", slug: "company", icon: "🏢" },
  { name: "User Documents", slug: "users", icon: "👤" },
  { name: "Other Documents", slug: "other", icon: "📁" },
  { name: "Employers Documents", slug: "employers", icon: "📁" },
  { name: "Personal Documents", slug: "personal", icon: "📁" },
  { name: "Insurance Documents", slug: "insurance", icon: "📁" },
  { name: "Government Documents", slug: "government", icon: "📁" },
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
