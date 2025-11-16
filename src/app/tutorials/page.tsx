"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiPlay, FiClock, FiBarChart2, FiFilter, FiSearch, FiStar, FiChevronRight, FiVideo, FiBook, FiArrowRight, FiCheckCircle } from "react-icons/fi";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Getting Started" | "Security" | "Collaboration" | "Advanced Features" | "Tips & Tricks";
  thumbnail: string;
  rating: number;
  views: number;
  videoUrl: string;
  keyPoints: string[];
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with DocuVault",
    description: "Learn the basics of creating your account, logging in, and navigating the DocuVault dashboard.",
    duration: "5:30",
    difficulty: "Beginner",
    category: "Getting Started",
    thumbnail: "bg-gradient-to-br from-blue-400 to-blue-600",
    rating: 4.8,
    views: 2543,
    videoUrl: "https://example.com/video1",
    keyPoints: ["Account creation", "Dashboard overview", "Profile setup"],
  },
  {
    id: "2",
    title: "Uploading Your First Document",
    description: "Step-by-step guide to uploading documents to your vault with proper organization and tagging.",
    duration: "4:15",
    difficulty: "Beginner",
    category: "Getting Started",
    thumbnail: "bg-gradient-to-br from-purple-400 to-purple-600",
    rating: 4.9,
    views: 3102,
    videoUrl: "https://example.com/video2",
    keyPoints: ["Single upload", "Bulk upload", "File organization"],
  },
  {
    id: "3",
    title: "Understanding Document Security",
    description: "Explore the security features of DocuVault including encryption, two-factor authentication, and access controls.",
    duration: "7:45",
    difficulty: "Intermediate",
    category: "Security",
    thumbnail: "bg-gradient-to-br from-red-400 to-red-600",
    rating: 4.7,
    views: 1876,
    videoUrl: "https://example.com/video3",
    keyPoints: ["AES-256 encryption", "Two-factor authentication", "Access control"],
  },
  {
    id: "4",
    title: "Sharing Documents Securely",
    description: "Learn how to share documents with team members and clients while maintaining control over permissions.",
    duration: "6:20",
    difficulty: "Intermediate",
    category: "Collaboration",
    thumbnail: "bg-gradient-to-br from-green-400 to-green-600",
    rating: 4.9,
    views: 2891,
    videoUrl: "https://example.com/video4",
    keyPoints: ["Generate share links", "Set permissions", "Expiration dates"],
  },
  {
    id: "5",
    title: "Setting Document Expiration Dates",
    description: "Configure automatic expiration dates for sensitive documents and manage renewal notifications.",
    duration: "5:10",
    difficulty: "Intermediate",
    category: "Advanced Features",
    thumbnail: "bg-gradient-to-br from-orange-400 to-orange-600",
    rating: 4.6,
    views: 1543,
    videoUrl: "https://example.com/video5",
    keyPoints: ["Set expiration", "Renewal notifications", "Compliance benefits"],
  },
  {
    id: "6",
    title: "Version Control & Document History",
    description: "Master version control to track changes, restore previous versions, and maintain document history.",
    duration: "8:00",
    difficulty: "Advanced",
    category: "Advanced Features",
    thumbnail: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    rating: 4.8,
    views: 987,
    videoUrl: "https://example.com/video6",
    keyPoints: ["Version history", "Restore versions", "Change tracking"],
  },
  {
    id: "7",
    title: "Collaborating with Teams",
    description: "Optimize your workflow by setting up team folders, assigning roles, and managing group permissions.",
    duration: "9:30",
    difficulty: "Advanced",
    category: "Collaboration",
    thumbnail: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    rating: 4.7,
    views: 1654,
    videoUrl: "https://example.com/video7",
    keyPoints: ["Team setup", "Role assignment", "Group permissions"],
  },
  {
    id: "8",
    title: "Advanced Search Techniques",
    description: "Discover powerful search filters and techniques to quickly find your documents across your entire vault.",
    duration: "6:45",
    difficulty: "Intermediate",
    category: "Tips & Tricks",
    thumbnail: "bg-gradient-to-br from-pink-400 to-pink-600",
    rating: 4.8,
    views: 2145,
    videoUrl: "https://example.com/video8",
    keyPoints: ["Advanced filters", "Search operators", "Custom tags"],
  },
  {
    id: "9",
    title: "Mobile App Overview",
    description: "Get to know the DocuVault mobile app and access your documents on the go with full functionality.",
    duration: "5:50",
    difficulty: "Beginner",
    category: "Getting Started",
    thumbnail: "bg-gradient-to-br from-teal-400 to-teal-600",
    rating: 4.9,
    views: 3456,
    videoUrl: "https://example.com/video9",
    keyPoints: ["App installation", "Mobile features", "Offline access"],
  },
  {
    id: "10",
    title: "Integrating with Third-Party Apps",
    description: "Connect DocuVault with your favorite productivity tools for seamless workflow integration.",
    duration: "10:15",
    difficulty: "Advanced",
    category: "Advanced Features",
    thumbnail: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    rating: 4.6,
    views: 876,
    videoUrl: "https://example.com/video10",
    keyPoints: ["API integration", "Webhook setup", "Automation rules"],
  },
  {
    id: "11",
    title: "Backup & Recovery Best Practices",
    description: "Learn how to backup your documents and recover them in case of accidental deletion or data loss.",
    duration: "7:20",
    difficulty: "Intermediate",
    category: "Security",
    thumbnail: "bg-gradient-to-br from-violet-400 to-violet-600",
    rating: 4.7,
    views: 1432,
    videoUrl: "https://example.com/video11",
    keyPoints: ["Automatic backups", "Recovery options", "Export documents"],
  },
  {
    id: "12",
    title: "Compliance & Audit Logs",
    description: "Understand compliance features and how to access audit logs for regulatory requirements.",
    duration: "8:55",
    difficulty: "Advanced",
    category: "Security",
    thumbnail: "bg-gradient-to-br from-rose-400 to-rose-600",
    rating: 4.5,
    views: 654,
    videoUrl: "https://example.com/video12",
    keyPoints: ["Audit trails", "Compliance reports", "Data retention"],
  },
];

const categories = ["All", "Getting Started", "Security", "Collaboration", "Advanced Features", "Tips & Tricks"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const difficultyColors = {
  Beginner: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  Intermediate: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  Advanced: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const filteredTutorials = tutorials
    .filter((tutorial) => {
      const categoryMatch = selectedCategory === "All" || tutorial.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === "All" || tutorial.difficulty === selectedDifficulty;
      const searchMatch =
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && difficultyMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "duration-short") return parseFloat(a.duration) - parseFloat(b.duration);
      return parseFloat(b.duration) - parseFloat(a.duration);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Video Tutorials</h1>
            <p className="text-slate-600 dark:text-slate-400">Learn DocuVault with our comprehensive video guides</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[120px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="duration-short">Shortest Duration</option>
                <option value="duration-long">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTutorials.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold">{filteredTutorials.length}</span> tutorial{filteredTutorials.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial, idx) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700 flex flex-col">
                    {/* Thumbnail */}
                    <div className={`relative h-40 ${tutorial.thumbnail} overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <button className="p-4 rounded-full bg-white/90 hover:bg-white text-slate-900 transition-colors">
                          <FiPlay className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {tutorial.duration}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 flex-1">
                          {tutorial.title}
                        </h3>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                        {tutorial.description}
                      </p>

                      {/* Stats and Difficulty */}
                      <div className="space-y-3 mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <FiBarChart2 className="w-4 h-4" />
                            <span>{tutorial.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <FiStar className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{tutorial.rating}</span>
                          </div>
                        </div>

                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[tutorial.difficulty]}`}>
                            {tutorial.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Key Points */}
                      <div className="space-y-2 mb-4">
                        {tutorial.keyPoints.slice(0, 2).map((point, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <FiCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {point}
                          </div>
                        ))}
                        {tutorial.keyPoints.length > 2 && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 pl-5">+{tutorial.keyPoints.length - 2} more</p>
                        )}
                      </div>

                      {/* Watch Button */}
                      <button className="w-full mt-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group/btn">
                        <FiPlay className="w-4 h-4" />
                        Watch Now
                        <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FiVideo className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No tutorials found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDifficulty("All");
                setSearchQuery("");
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Learning Paths Section */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Recommended Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Beginner's Path",
                description: "Perfect for new users. Learn the basics and get started in minutes.",
                videos: ["Getting Started with DocuVault", "Uploading Your First Document", "Mobile App Overview"],
                duration: "15 min",
                icon: "🚀",
              },
              {
                title: "Security Expert",
                description: "Master the security features and best practices for protecting your data.",
                videos: ["Understanding Document Security", "Backup & Recovery Best Practices", "Compliance & Audit Logs"],
                duration: "25 min",
                icon: "🔒",
              },
              {
                title: "Power User",
                description: "Advanced features and workflows to maximize your productivity.",
                videos: ["Version Control & Document History", "Collaborating with Teams", "Integrating with Third-Party Apps"],
                duration: "28 min",
                icon: "⚡",
              },
            ].map((path, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{path.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{path.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{path.description}</p>
                <div className="space-y-2 mb-6">
                  {path.videos.map((video, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {video}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Duration: {path.duration}</span>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1">
                    Start <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to master DocuVault?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Start watching tutorials today and unlock the full potential of your document management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="auth/signup"
              className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/documentation"
              className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}