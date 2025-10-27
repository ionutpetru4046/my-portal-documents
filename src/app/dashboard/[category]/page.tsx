"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
  <Toaster position="top-right" />

  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
    <div className="flex items-center gap-3">
      <button
        onClick={() => {
          // Prefer history back, fallback to dashboard route
          if (typeof window !== "undefined" && window.history.length > 1) router.back();
          else router.push("/dashboard");
        }}
        className="inline-flex items-center px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow md:py-2 md:px-3 text-sm text-gray-700"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold text-gray-900 capitalize">{displayName}</h1>
    </div>
    <p className="text-gray-500 mt-2 sm:mt-0">
      Manage and track your documents efficiently
    </p>
  </div>

  {/* Upload Section */}
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row gap-4 mb-8">
    <input
      type="file"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <Input
      type="date"
      value={expirationDate}
      onChange={(e) => setExpirationDate(e.target.value)}
      placeholder="Expiration date"
      className="flex-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
    />
    <Input
      type="datetime-local"
      value={reminderAt}
      onChange={(e) => setReminderAt(e.target.value)}
      placeholder="Reminder"
      className="flex-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
    />
    <Button
      onClick={handleUpload}
      disabled={!file || uploading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 shadow-md disabled:opacity-50 transition"
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
            className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 flex flex-col"
          >
            {/* Preview */}
            {isImage(doc.name) && doc.url ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3">
                <Image
                  src={doc.url}
                  alt={doc.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
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
</main>

  );
}
