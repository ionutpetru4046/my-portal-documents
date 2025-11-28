/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { FiUpload, FiCalendar, FiBell, FiTrash2, FiShare2, FiArrowLeft, FiX, FiChevronLeft, FiChevronRight, FiFile, FiClock, FiEye } from "react-icons/fi";
import { useUser } from "@/context/UserContext";

interface DocumentType {
  id: string;
  name: string;
  path?: string;
  url?: string;
  userID?: string;
  created_at?: string;
  expiration_date?: string;
  reminder_at?: string;
  size?: number;
}

interface UserType {
  id: string;
  email: string;
  user_metadata: { avatar?: string; role?: string };
}

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category;
  const router = useRouter();
  const { user } = useUser();

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [expirationDate, setExpirationDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const imageDocs = documents.filter((d) => d.url && d.name && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(d.name));

  const handleImageClick = (doc: DocumentType) => {
    console.log("Clicked document:", doc);
    console.log("All imageDocs:", imageDocs);
    const index = imageDocs.findIndex((d) => d.id === doc.id);
    console.log("Found index:", index);
    if (index !== -1) {
      setViewerIndex(index);
      setIsViewerOpen(true);
    } else {
      toast.error("Could not open image preview");
    }
  };

  if (!category) return <p className="p-6">Category not found.</p>;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(shouldBeDark);
  }, []);

  // Remove useSession, status, extract values from user context
  const userId = user?.id;
  const userEmail = user?.email;
  const userName = user?.name || userEmail;
  const userAvatar = user?.avatar;

  // If not authenticated, block UI or redirect
  useEffect(() => {
    if (!userId) {
      router.push("/auth/login");
    }
  }, [userId, router]);

  // Fetch documents only if authenticated
  const fetchDocuments = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("userID", userId)
      .eq("category", category)
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to fetch documents");
    else setDocuments(data || []);
  };

  useEffect(() => {
    if (userId && category) fetchDocuments();
  }, [userId, category]);

  useEffect(() => {
    if (!userId || !category) return;
    const channel = supabase
      .channel(`documents-${userId}-${category}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `userID=eq.${userId},category=eq.${category}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDocuments((prev) => [payload.new as DocumentType, ...prev]);
            toast.success(`Uploaded: ${(payload.new as DocumentType).name}`);
          }
          if (payload.eventType === "DELETE") {
            setDocuments((prev) =>
              prev.filter((d) => d.id !== (payload.old as DocumentType).id)
            );
            toast.success("Document deleted");
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, category]);

  // Fix uploads: check userId before upload; use NextAuth user info
  const handleUpload = async () => {
    if (!file || !userId) return toast.error("You must be logged in");
    setUploading(true);
    try {
      const filePath = `${category}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);
      const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;
      const { error: dbError } = await supabase.from("documents").insert([
        {
          name: file.name,
          path: filePath,
          url: publicUrl,
          userID: userId,
          category,
          expiration_date: expirationDate || null,
          reminder_at: reminderAt ? new Date(reminderAt).toISOString() : null,
        },
      ]);
      if (dbError) throw new Error(dbError.message);
      toast.success("File uploaded successfully!");
      fetchDocuments();
      setFile(null);
      setExpirationDate("");
      setReminderAt("");
    } catch (err: any) {
      toast.error(err.message);
    }
    setUploading(false);
  };

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => setIsViewerOpen(false);
  const showPrev = () => setViewerIndex((i) => (i - 1 + imageDocs.length) % imageDocs.length);
  const showNext = () => setViewerIndex((i) => (i + 1) % imageDocs.length);

  useEffect(() => {
    if (!isViewerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isViewerOpen, imageDocs.length]);

  useEffect(() => {
    document.body.style.overflow = isViewerOpen ? "hidden" : "";
  }, [isViewerOpen]);

  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isViewerOpen) return;
    setIsFading(true);
    const t = setTimeout(() => setIsFading(false), 220);
    return () => clearTimeout(t);
  }, [viewerIndex, isViewerOpen]);

  const handleDelete = async (doc: DocumentType) => {
    if (!doc.path || !doc.id) return;
    if (!window.confirm(`Delete "${doc.name}"?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([doc.path]);
      if (storageError) throw new Error(storageError.message);

      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);
      if (dbError) throw new Error(dbError.message);

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      toast.success("Document deleted!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleShare = async (doc: DocumentType) => {
    if (!doc.url) return;
    await navigator.clipboard.writeText(doc.url);
    toast.success("Link copied!");
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);

  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const now = new Date();
    const d = new Date(dateStr);
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const catStr = Array.isArray(category) ? category.join("/") : category;
  const displayName = catStr.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) router.back();
                else router.push("/dashboard");
              }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{documents.length} documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Card */}
        <div className="mb-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Upload New Document</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 opacity-90">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-600 hover:file:bg-white/90"
                />
                {file && <p className="text-sm mt-2 opacity-90">✓ {file.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-90">Expiration Date</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-90">Reminder</label>
                <input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full md:w-auto px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <FiUpload className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FiFile className="w-10 h-10 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No documents yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Start uploading to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {documents.map((doc) => {
              const expiresIn = daysUntil(doc.expiration_date);
              const reminderIn = daysUntil(doc.reminder_at);

              return (
                <div
                  key={doc.id}
                  className="group bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-lg/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Preview */}
                  {isImage(doc.name) && doc.url ? (
                    <div className="relative w-full h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer">
                      <button
                        onClick={() => handleImageClick(doc)}
                        className="absolute inset-0 z-20 cursor-pointer"
                        aria-label={`Open ${doc.name} viewer`}
                        type="button"
                      />
                      <Image
                        src={doc.url}
                        alt={doc.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onError={() => console.error(`Failed to load image: ${doc.url}`)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <FiEye className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-5xl">
                      📄
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="truncate font-semibold text-slate-900 dark:text-white mb-3">{doc.name}</p>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doc.expiration_date && expiresIn !== null && expiresIn <= 7 && expiresIn >= 0 && (
                        <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                          <FiCalendar className="w-3 h-3" /> Expires in {expiresIn}d
                        </span>
                      )}
                      {doc.reminder_at && reminderIn !== null && reminderIn <= 1 && reminderIn >= 0 && (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                          <FiBell className="w-3 h-3" /> Reminder soon
                        </span>
                      )}
                      {doc.expiration_date && expiresIn !== null && expiresIn < 0 && (
                        <span className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-medium">
                          <FiClock className="w-3 h-3" /> Expired
                        </span>
                      )}
                    </div>

                    {/* Dates Info */}
                    {(doc.expiration_date || doc.reminder_at) && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
                        {doc.expiration_date && (
                          <p>Expires: {new Date(doc.expiration_date).toLocaleDateString()}</p>
                        )}
                        {doc.reminder_at && (
                          <p>Reminder: {new Date(doc.reminder_at).toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleShare(doc)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                      >
                        <FiShare2 className="w-4 h-4" /> Share
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {isViewerOpen && imageDocs.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeViewer}
          onTouchStart={(e) => {
            touchStartRef.current = e.touches?.[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartRef.current ?? 0;
            const end = e.changedTouches?.[0]?.clientX ?? 0;
            const dx = end - start;
            const threshold = 50;
            if (Math.abs(dx) > threshold) {
              if (dx > 0) showPrev();
              else showNext();
            }
            touchStartRef.current = null;
          }}
        >
          <div 
            className="relative max-w-[95vw] max-h-[95vh] w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 transition-colors"
              aria-label="Close viewer"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>

            {/* Previous Button */}
            {imageDocs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-colors"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image Container */}
            <div className="w-full h-[90vh] flex items-center justify-center">
              {imageDocs[viewerIndex] && imageDocs[viewerIndex].url && (
                <div
                  className={`transition-opacity duration-300 ${
                    isFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <img
                    key={imageDocs[viewerIndex].id}
                    src={imageDocs[viewerIndex].url}
                    alt={imageDocs[viewerIndex].name || "image"}
                    className="object-contain max-h-[90vh] max-w-[90vw]"
                    onError={(e) => {
                      console.error("Image failed to load:", imageDocs[viewerIndex].url);
                      toast.error("Failed to load image");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Next Button */}
            {imageDocs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-colors"
                aria-label="Next image"
              >
                <FiChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Counter */}
            {imageDocs.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full">
                {viewerIndex + 1} / {imageDocs.length}
              </div>
            )}

            {/* Thumbnails */}
            {imageDocs.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-2 overflow-x-auto max-w-[90vw] pb-2">
                {imageDocs.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewerIndex(idx);
                    }}
                    className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                      idx === viewerIndex
                        ? "ring-2 ring-white scale-105 w-20 h-20"
                        : "w-16 h-16 opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    {img.url && (
                      <img
                        src={img.url}
                        alt={img.name || `thumb-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}