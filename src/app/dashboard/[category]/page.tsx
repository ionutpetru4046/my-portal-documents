"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useCallback } from "react";

interface DocumentType {
  id: string;
  name: string;
  path?: string;
  url?: string;
  userID?: string;
  created_at?: string;
  expiration_date?: string;
  reminder_at?: string;
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

  const [user, setUser] = useState<UserType | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [expirationDate, setExpirationDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [uploading, setUploading] = useState(false);
  // Image viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const imageDocs = documents.filter((d) => d.url && d.name && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(d.name));

  if (!category) return <p className="p-6">Category not found.</p>;

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return toast.error("You must be logged in");
      setUser({
        id: data.user.id,
        email: data.user.email ?? "",
        user_metadata: data.user.user_metadata,
      });
    };
    fetchUser();
  }, []);

  // Fetch documents for this user & category
  const fetchDocuments = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("userID", user.id)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to fetch documents");
    else setDocuments(data || []);
  };

  useEffect(() => {
    if (user && category) fetchDocuments();
  }, [user, category]);

  // Real-time updates
  useEffect(() => {
    if (!user?.id || !category) return;

    const channel = supabase
      .channel(`documents-${user.id}-${category}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `userID=eq.${user.id},category=eq.${category}`,
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
  }, [user, category]);

  // Upload file
  const handleUpload = async () => {
    if (!file || !user) return;
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
          userID: user.id,
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

  // Image viewer controls
  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => setIsViewerOpen(false);

  const showPrev = () => setViewerIndex((i) => (i - 1 + imageDocs.length) % imageDocs.length);
  const showNext = () => setViewerIndex((i) => (i + 1) % imageDocs.length);

  // keyboard navigation
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

  // prevent scroll when viewer open
  useEffect(() => {
    document.body.style.overflow = isViewerOpen ? "hidden" : "";
  }, [isViewerOpen]);

  // Delete document
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

  // Share document
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
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) router.back();
                else router.push("/dashboard");
              }}
              aria-label="Go back"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform duration-150 text-gray-700"
            >
              <span className="text-lg">←</span>
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{displayName}</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track your documents efficiently</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-3 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">Category</span>
              <span className="text-sm text-gray-600">{displayName}</span>
            </div>
          </div>
        </div>
      </div>

  {/* Upload Section */}
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row gap-4 mb-8 border border-gray-100">
    <input
      type="file"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      className="border border-dashed border-gray-200 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
    />
    <Input
      type="date"
      value={expirationDate}
      onChange={(e) => setExpirationDate(e.target.value)}
      placeholder="Expiration date"
      className="flex-1 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white"
    />
    <Input
      type="datetime-local"
      value={reminderAt}
      onChange={(e) => setReminderAt(e.target.value)}
      placeholder="Reminder"
      className="flex-1 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white"
    />
    <Button
      onClick={handleUpload}
      disabled={!file || uploading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 shadow-md disabled:opacity-50 transition transform hover:-translate-y-0.5"
    >
      {uploading ? "Uploading..." : "Upload"}
    </Button>
  </div>

  {/* Documents Grid */}
  {documents.length === 0 ? (
    <p className="text-gray-400 text-center mt-16 text-lg">
      No documents yet. Start uploading to see them here!
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {documents.map((doc) => {
        const expiresIn = daysUntil(doc.expiration_date);
        const reminderIn = daysUntil(doc.reminder_at);

          return (
          <div
            key={doc.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 flex flex-col group"
          >
            {/* Preview */}
            {isImage(doc.name) && doc.url ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3 bg-gray-50">
                <button
                  onClick={() => openViewer(imageDocs.findIndex((d) => d.id === doc.id))}
                  className="absolute inset-0 z-20"
                  aria-label={`Open ${doc.name} viewer`}
                />
                <Image
                  src={doc.url}
                  alt={doc.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </div>
            ) : (
              <div className="w-full h-44 bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400 text-5xl mb-3">
                📄
              </div>
            )}

            {/* Document Name */}
            <p className="truncate font-semibold text-gray-900 text-lg mb-1">{doc.name}</p>

            {/* Dates */}
            <div className="text-xs text-gray-500 flex flex-col gap-1">
              {doc.expiration_date && (
                <span>Expires: {new Date(doc.expiration_date).toLocaleDateString()}</span>
              )}
              {doc.reminder_at && (
                <span>Reminder: {new Date(doc.reminder_at).toLocaleString()}</span>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-2 mt-2 flex-wrap text-xs">
              {doc.expiration_date && expiresIn !== null && expiresIn <= 7 && expiresIn >= 0 && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                  Expiring in {expiresIn}d
                </span>
              )}
              {doc.reminder_at && reminderIn !== null && reminderIn <= 1 && reminderIn >= 0 && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Reminder Due Soon
                </span>
              )}
              {doc.expiration_date && expiresIn !== null && expiresIn < 0 && (
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                  Expired
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                onClick={() => handleShare(doc)}
              >
                Share
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(doc)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  )}

  {/* Image viewer modal */}
  {isViewerOpen && imageDocs.length > 0 && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative max-w-[90vw] max-h-[90vh] w-full">
        <button
          onClick={closeViewer}
          className="absolute top-4 right-4 z-40 bg-white/80 rounded-full p-2 hover:bg-white"
          aria-label="Close viewer"
        >
          ✕
        </button>

        <button
          onClick={showPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 text-white bg-black/30 rounded-full p-2 hover:bg-black/50"
          aria-label="Previous image"
        >
          ‹
        </button>

        <div className="w-full h-[80vh] flex items-center justify-center">
          <Image
            src={imageDocs[viewerIndex].url!}
            alt={imageDocs[viewerIndex].name || "image"}
            width={1200}
            height={800}
            className="object-contain max-h-[80vh]"
          />
        </div>

        <button
          onClick={showNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 text-white bg-black/30 rounded-full p-2 hover:bg-black/50"
          aria-label="Next image"
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 text-white text-sm">
          {viewerIndex + 1} / {imageDocs.length}
        </div>
      </div>
    </div>
  )}
</main>

  );
}
