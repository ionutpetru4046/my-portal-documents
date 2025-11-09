"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiClock, FiUser, FiTag, FiArrowRight, FiFilter, FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import Reveal from "@/components/Reveal";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  featured_image?: string;
  user_id: string;
  published: boolean;
}

export default function BlogPage() {
  const { user } = useUser();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBlogDetail, setSelectedBlogDetail] = useState<BlogPost | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    published: false,
  });

  useEffect(() => {
    fetchBlogs();
  }, [user?.id]);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchQuery, selectedCategory]);

  const fetchBlogs = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Failed to load blog posts: ${error.message}`);
        setBlogs([]);
        setCategories([]);
        return;
      }

      setBlogs(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map((blog) => blog.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      toast.error(`Error: ${err?.message || "Failed to load blog posts"}`);
      setBlogs([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  };

  const handleCreateOrUpdate = async () => {
    if (!user || !formData.title || !formData.excerpt || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const blogData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category || "",
        tags: formData.tags || [],
        published: formData.published || false,
        author: user.name || user.email,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (editingBlog) {
        const { error } = await supabase
          .from("blog_posts")
          .update(blogData)
          .eq("id", editingBlog.id);

        if (error) throw error;
        toast.success("Blog post updated!");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([{ ...blogData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        toast.success("Blog post created!");
      }

      resetForm();
      fetchBlogs();
      setShowCreateModal(false);
    } catch (err: any) {
      console.error("Error saving blog:", err);
      toast.error(err?.message || "Failed to save blog post");
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData(blog);
    setShowCreateModal(true);
  };

  const handleViewDetail = (blog: BlogPost) => {
    setSelectedBlogDetail(blog);
    setShowDetailModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Blog post deleted!");
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to delete blog post");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: [],
      published: false,
    });
    setEditingBlog(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: "8px",
          background: "#1e293b",
          color: "#f1f5f9",
          border: "1px solid #334155",
        },
      }} />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Create, manage, and organize your blog posts
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 font-medium flex items-center gap-2 transition-colors"
          >
            <FiPlus className="w-5 h-5" /> New Post
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <Reveal animation="fade-up">
          <div className="space-y-4 mb-8">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pointer-events-auto"
              />
            </div>

            {/* Filter and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors pointer-events-auto ${
                    selectedCategory === "All"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors pointer-events-auto ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg transition-colors pointer-events-auto ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg transition-colors pointer-events-auto ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Blog Posts Display */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FiFilter className="w-10 h-10 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No posts found</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Start by creating your first blog post"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, idx) => (
              <Reveal key={blog.id} animation="fade-up" delay={idx * 40}>
                <div 
                  onClick={() => handleViewDetail(blog)}
                  className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-lg/20 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                >
                  {/* Featured Image */}
                  {blog.featured_image && (
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-40 object-cover"
                    />
                  )}

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {blog.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          blog.published
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-xs px-2 py-1 text-slate-600 dark:text-slate-400">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800 mb-4">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" /> {formatDate(blog.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser className="w-3.5 h-3.5" /> {blog.author}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors pointer-events-auto"
                      >
                        <FiEdit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors pointer-events-auto"
                      >
                        <FiTrash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog, idx) => (
              <Reveal key={blog.id} animation="fade-up" delay={idx * 40}>
                <div 
                  onClick={() => handleViewDetail(blog)}
                  className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg dark:hover:shadow-lg/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex gap-6">
                    {blog.featured_image && (
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {blog.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {blog.category}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              blog.published
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {blog.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <FiClock className="w-3.5 h-3.5" /> {formatDate(blog.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiUser className="w-3.5 h-3.5" /> {blog.author}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center gap-1 pointer-events-auto"
                          >
                            <FiEdit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors flex items-center gap-1 pointer-events-auto"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {showDetailModal && selectedBlogDetail && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 pointer-events-auto"
          onClick={() => {
            setShowDetailModal(false);
            setSelectedBlogDetail(null);
          }}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Detail Modal Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 pointer-events-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex-1 pr-4">
                {selectedBlogDetail.title}
              </h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedBlogDetail(null);
                }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-2xl leading-none pointer-events-auto flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Detail Modal Content */}
            <div className="overflow-y-auto flex-1 pointer-events-auto">
              {/* Featured Image */}
              {selectedBlogDetail.featured_image && (
                <img
                  src={selectedBlogDetail.featured_image}
                  alt={selectedBlogDetail.title}
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-6 space-y-6">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {selectedBlogDetail.category}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selectedBlogDetail.published
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}>
                      {selectedBlogDetail.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 ml-auto">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" /> {formatDate(selectedBlogDetail.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser className="w-4 h-4" /> {selectedBlogDetail.author}
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Summary</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedBlogDetail.excerpt}
                  </p>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Content</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selectedBlogDetail.content}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {selectedBlogDetail.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBlogDetail.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detail Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pointer-events-auto">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedBlogDetail(null);
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors pointer-events-auto"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedBlogDetail);
                  setShowDetailModal(false);
                }}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2 pointer-events-auto"
              >
                <FiEdit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedBlogDetail.id);
                  setShowDetailModal(false);
                }}
                className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2 pointer-events-auto"
              >
                <FiTrash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 pointer-events-auto"
          onClick={() => {
            setShowCreateModal(false);
            resetForm();
          }}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 pointer-events-auto">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingBlog ? "Edit Post" : "Create New Post"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-2xl leading-none pointer-events-auto"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 pointer-events-auto">
              {/* Title */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter post title"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pointer-events-auto"
                />
              </div>

              {/* Excerpt */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of your post"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none pointer-events-auto"
                />
              </div>

              {/* Content */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Content *
                </label>
                <textarea
                  value={formData.content || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your full post content here"
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none pointer-events-auto"
                />
              </div>

              {/* Category */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Technology, Business"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pointer-events-auto"
                />
              </div>

              {/* Tags */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., tip, guide, news"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pointer-events-auto"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 pointer-events-auto">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published || false}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer pointer-events-auto"
                />
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer pointer-events-auto"
                >
                  Publish immediately
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pointer-events-auto">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors pointer-events-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex-1 pointer-events-auto"
              >
                {editingBlog ? "Update Post" : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}