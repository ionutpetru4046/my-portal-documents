/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiSearch,
  FiFilter,
  FiStar,
  FiEye,
  FiChevronRight,
  FiFileText,
  FiArrowRight,
  FiCheckCircle,
  FiCopy,
  FiExternalLink,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiClipboard,
  FiCalendar,
  FiBarChart2,
  FiShield,
} from "react-icons/fi";

interface Template {
  id: string;
  title: string;
  description: string;
  category: "Business" | "Legal" | "HR" | "Finance" | "Medical" | "Education";
  type: "Document" | "Folder Structure" | "Workflow" | "Checklist";
  downloads: number;
  rating: number;
  icon: React.ReactNode;
  thumbnail: string;
  features: string[];
  useCases: string[];
  premium: boolean;
  tags: string[];
}

const templates: Template[] = [
  {
    id: "1",
    title: "Invoice Template",
    description: "Professional invoice template for billing clients and customers.",
    category: "Finance",
    type: "Document",
    downloads: 5234,
    rating: 4.9,
    icon: <FiDollarSign className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-green-400 to-emerald-600",
    features: ["Customizable fields", "Auto-calculation", "Payment terms", "Multi-currency support"],
    useCases: ["Client billing", "Service invoicing", "Product sales"],
    premium: false,
    tags: ["Finance", "Billing", "Business"],
  },
  {
    id: "2",
    title: "Employment Contract",
    description: "Comprehensive employment contract template with all standard clauses.",
    category: "Legal",
    type: "Document",
    downloads: 3456,
    rating: 4.8,
    icon: <FiClipboard className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-blue-400 to-blue-600",
    features: ["Legal compliance", "Job description", "Terms & conditions", "Signature fields"],
    useCases: ["Full-time positions", "Contractor agreements", "Freelance contracts"],
    premium: true,
    tags: ["Legal", "HR", "Contracts"],
  },
  {
    id: "3",
    title: "Project Proposal",
    description: "Complete project proposal template to pitch ideas and secure clients.",
    category: "Business",
    type: "Document",
    downloads: 4123,
    rating: 4.7,
    icon: <FiTrendingUp className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-purple-400 to-purple-600",
    features: ["Executive summary", "Timeline", "Budget breakdown", "Success metrics"],
    useCases: ["Client pitches", "Internal projects", "Agency proposals"],
    premium: false,
    tags: ["Business", "Proposals", "Projects"],
  },
  {
    id: "4",
    title: "Employee Onboarding Checklist",
    description: "Structured onboarding checklist to streamline new employee integration.",
    category: "HR",
    type: "Checklist",
    downloads: 3892,
    rating: 4.8,
    icon: <FiCheckCircle className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-orange-400 to-orange-600",
    features: ["Task lists", "Department integration", "Training modules", "Progress tracking"],
    useCases: ["New hires", "Department transfers", "Internship programs"],
    premium: false,
    tags: ["HR", "Onboarding", "Checklist"],
  },
  {
    id: "5",
    title: "Medical Records Organizer",
    description: "Secure template for organizing and maintaining medical records and documents.",
    category: "Medical",
    type: "Folder Structure",
    downloads: 2543,
    rating: 4.9,
    icon: <FiShield className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-red-400 to-red-600",
    features: ["HIPAA compliant", "Encrypted storage", "Family sharing", "Appointment tracking"],
    useCases: ["Personal health records", "Family documentation", "Insurance claims"],
    premium: true,
    tags: ["Medical", "Healthcare", "Privacy"],
  },
  {
    id: "6",
    title: "Budget Planning Template",
    description: "Comprehensive budget planning template for personal or business finances.",
    category: "Finance",
    type: "Document",
    downloads: 4567,
    rating: 4.6,
    icon: <FiBarChart2 className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-blue-400 to-cyan-600",
    features: ["Income tracking", "Expense categories", "Visualizations", "Goal setting"],
    useCases: ["Annual budgeting", "Project budgets", "Personal finance"],
    premium: false,
    tags: ["Finance", "Planning", "Business"],
  },
  {
    id: "7",
    title: "Team Meeting Agenda",
    description: "Structured meeting agenda template to keep discussions on track.",
    category: "Business",
    type: "Document",
    downloads: 3234,
    rating: 4.7,
    icon: <FiUsers className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    features: ["Agenda items", "Time allocation", "Action items", "Notes section"],
    useCases: ["Team meetings", "Client calls", "Board meetings"],
    premium: false,
    tags: ["Business", "Meetings", "Templates"],
  },
  {
    id: "8",
    title: "Student Assignment Submission",
    description: "Educational assignment submission template with rubric and grading.",
    category: "Education",
    type: "Document",
    downloads: 2876,
    rating: 4.8,
    icon: <FiCalendar className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    features: ["Submission form", "Grading rubric", "Feedback section", "Due date tracking"],
    useCases: ["Course assignments", "Project submissions", "Assessment tracking"],
    premium: false,
    tags: ["Education", "Academic", "Students"],
  },
  {
    id: "9",
    title: "NDA & Confidentiality Agreement",
    description: "Legal NDA template to protect confidential business information.",
    category: "Legal",
    type: "Document",
    downloads: 2345,
    rating: 4.9,
    icon: <FiShield className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-slate-400 to-slate-600",
    features: ["Legal clauses", "Signature fields", "Date tracking", "Multi-party support"],
    useCases: ["Client agreements", "Employee NDAs", "Partnership agreements"],
    premium: true,
    tags: ["Legal", "Contracts", "Confidentiality"],
  },
  {
    id: "10",
    title: "Document Organization Workflow",
    description: "Pre-structured folder organization system for efficient document management.",
    category: "Business",
    type: "Folder Structure",
    downloads: 3678,
    rating: 4.7,
    icon: <FiFileText className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-pink-400 to-pink-600",
    features: ["Folder hierarchy", "Naming conventions", "Access controls", "Retention policies"],
    useCases: ["Company records", "Project management", "Client files"],
    premium: false,
    tags: ["Organization", "Workflow", "Business"],
  },
  {
    id: "11",
    title: "Performance Review Template",
    description: "Comprehensive employee performance review template with rating system.",
    category: "HR",
    type: "Document",
    downloads: 2098,
    rating: 4.6,
    icon: <FiTrendingUp className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    features: ["Rating scales", "Goal assessment", "Development plan", "Signature line"],
    useCases: ["Annual reviews", "Performance management", "Career development"],
    premium: true,
    tags: ["HR", "Performance", "Management"],
  },
  {
    id: "12",
    title: "Content Calendar",
    description: "Social media and content planning calendar with posting schedule.",
    category: "Business",
    type: "Document",
    downloads: 3421,
    rating: 4.8,
    icon: <FiCalendar className="w-6 h-6" />,
    thumbnail: "bg-gradient-to-br from-rose-400 to-rose-600",
    features: ["Monthly view", "Channel tracking", "Status updates", "Collaboration notes"],
    useCases: ["Social media planning", "Blog scheduling", "Marketing campaigns"],
    premium: false,
    tags: ["Marketing", "Content", "Planning"],
  },
];

const categories = ["All", "Business", "Legal", "HR", "Finance", "Medical", "Education"];
const types = ["All", "Document", "Folder Structure", "Workflow", "Checklist"];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  const filteredTemplates = templates
    .filter((template) => {
      const categoryMatch = selectedCategory === "All" || template.category === selectedCategory;
      const typeMatch = selectedType === "All" || template.type === selectedType;
      const premiumMatch = !showPremiumOnly || template.premium;
      const searchMatch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return categoryMatch && typeMatch && premiumMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Document Templates</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Browse our collection of professionally designed templates to get started quickly
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates by name, category, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[136px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                <FiFilter className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="alphabetical">A - Z</option>
              </select>
            </div>

            {/* Premium Filter */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Premium Only</span>
              </label>
            </div>

            {/* Results Count */}
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold">{filteredTemplates.length}</span> template{filteredTemplates.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700 flex flex-col">
                  {/* Header with Thumbnail and Badge */}
                  <div className={`relative h-32 ${template.thumbnail} overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="p-3 rounded-lg bg-white/90 group-hover:bg-white text-slate-900 transition-colors">
                        {template.icon}
                      </div>
                    </div>

                    {/* Premium Badge */}
                    {template.premium && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <FiStar className="w-3 h-3 fill-current" />
                        Premium
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded text-xs font-semibold">
                      {template.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2 line-clamp-2">
                      {template.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
                        <FiDownload className="w-4 h-4" />
                        <span>{template.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-500 text-xs">
                        <FiStar className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{template.rating}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-1.5 mb-4">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Key Features:</p>
                      {template.features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <FiCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                      {template.features.length > 2 && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 pl-5">+{template.features.length - 2} more</p>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group/btn text-sm">
                        <FiCopy className="w-4 h-4" />
                        <span>Use Template</span>
                      </button>
                      <button className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center text-slate-700 dark:text-slate-300">
                        <FiEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No templates found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedType("All");
                setSearchQuery("");
                setShowPremiumOnly(false);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Featured Collections */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Popular Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Startup Essential",
                count: "8 templates",
                description: "Must-have documents for new businesses",
                icon: "🚀",
              },
              {
                title: "Legal Documents",
                count: "12 templates",
                description: "Contracts, agreements, and more",
                icon: "⚖️",
              },
              {
                title: "HR Management",
                count: "10 templates",
                description: "Recruitment and employee management",
                icon: "👥",
              },
              {
                title: "Financial Planning",
                count: "7 templates",
                description: "Budgets, invoices, and reports",
                icon: "💰",
              },
            ].map((collection, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="text-4xl mb-3">{collection.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                  {collection.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{collection.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{collection.count}</span>
                  <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Custom Template CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Didn't find what you're looking for?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Create your own custom template or request one from our community. Share it with other DocuVault users and earn rewards!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <FiFileText className="w-5 h-5" />
              Create Template
            </button>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Request Template
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Start Using Templates Today</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Save time and maintain consistency with professionally designed templates. Upgrade to Premium for access to exclusive templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/subscribe"
              className="px-8 py-3 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <FiStar className="w-4 h-4" />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}