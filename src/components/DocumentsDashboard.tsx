// src/components/DocumentsDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import Reveal from "@/components/Reveal";
import { AnimatePresence, motion } from "framer-motion";

interface DocumentType {
  id: string;
  name: string;
  path: string;
  url: string;
  userID: string;
  created_at: string;
  expiration_date?: string;
  reminder_at?: string;
  category?: string;
}

interface UserType {
  id: string;
  email: string;
  user_metadata: {
    avatar?: string;
    role?: string;
  };
}

interface DocumentsDashboardProps {
  category: string; // e.g. 'cars', 'companies', 'users', 'others'
}

export default function DocumentsDashboard({ category }: DocumentsDashboardProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const [expirationDate, setExpirationDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");

      const userData = {
        id: data.user.id,
        email: data.user.email ?? "",
        user_metadata: data.user.user_metadata,
      };
      setUser(userData);

      if (userData.user_metadata?.avatar)
        setAvatarPreview(userData.user_metadata.avatar);
    };
    fetchUser();
  }, [router]);

  // Fetch documents (filtered by category)
  const fetchDocuments = async () => {
    if (!user?.id) return;

    const q = supabase
      .from("documents")
      .select("*")
      .eq("userID", user.id)
      .order("created_at", { ascending: false });

    // apply category filter only if category provided
    if (category) q.eq("category", category);

    const { data, error } = await q;

    if (error) toast.error("Failed to fetch documents");
    else {
      setDocuments(data || []);
      setFilteredDocs(data || []);
    }
  };

  useEffect(() => {
    if (user) fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, category]);

  // Real-time updates (only update if row matches current category)
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`documents-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `userID=eq.${user.id}`,
        },
        (payload) => {
          // only reflect changes that match the current category (or when category empty)
          const newRow = payload.new as DocumentType | undefined;
          const oldRow = payload.old as DocumentType | undefined;

          const matchesCategory = (row?: DocumentType) => {
            if (!row) return false;
            if (!category) return true;
            return row.category === category;
          };

          if (payload.eventType === "INSERT" && matchesCategory(newRow)) {
            setDocuments((prev) => [newRow as DocumentType, ...prev]);
            setFilteredDocs((prev) => [newRow as DocumentType, ...prev]);
            toast.success(`Uploaded: ${(newRow as DocumentType).name}`);
          }
          if (payload.eventType === "DELETE" && matchesCategory(oldRow)) {
            setDocuments((prev) =>
              prev.filter((d) => d.id !== (oldRow as DocumentType).id)
            );
            setFilteredDocs((prev) =>
              prev.filter((d) => d.id !== (oldRow as DocumentType).id)
            );
            toast.success("Document deleted");
          }
          if (payload.eventType === "UPDATE") {
            // replace if exists and matches; remove if category changed away; add if newly matches
            if (newRow) {
              setDocuments((prev) => {
                const exists = prev.find((p) => p.id === newRow.id);
                if (newRow.category === category) {
                  if (exists) return prev.map((p) => (p.id === newRow.id ? newRow : p));
                  return [newRow, ...prev];
                } else {
                  // was in this category but moved away
                  return prev.filter((p) => p.id !== newRow.id);
                }
              });
              setFilteredDocs((prev) => {
                const exists = prev.find((p) => p.id === newRow.id);
                if (newRow.category === category) {
                  if (exists) return prev.map((p) => (p.id === newRow.id ? newRow : p));
                  return [newRow, ...prev];
                } else {
                  return prev.filter((p) => p.id !== newRow.id);
                }
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, category]);

  // Search filter
  useEffect(() => {
    if (!searchQuery) setFilteredDocs(documents);
    else {
      setFilteredDocs(
        documents.filter((doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, documents]);

  // Keyboard for modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") setIsModalOpen(false);
      if (e.key === "ArrowLeft")
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      if (e.key === "ArrowRight")
        setCurrentIndex((prev) =>
          prev < filteredDocs.length - 1 ? prev + 1 : prev
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen, filteredDocs.length]);

  // Upload file
  const handleUpload = async () => {
    if (!file || !user?.id) return;
    setUploading(true);

    // include category in file path
    const filePath = `user-${user.id}/${category}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      toast.error("Failed to get public URL");
      setUploading(false);
      return;
    }

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

    if (dbError) toast.error(`Failed to save metadata: ${dbError.message}`);
    else toast.success("File uploaded successfully!");
    setFile(null);
    setExpirationDate("");
    setReminderAt("");
    setUploading(false);
  };

  const isImage = (name: string) =>
    /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);

  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const now = new Date();
    const d = new Date(dateStr);
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleDelete = async (doc: DocumentType) => {
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
      setFilteredDocs((prev) => prev.filter((d) => d.id !== doc.id));
      toast.success("Document deleted successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleShare = async (doc: DocumentType) => {
    await navigator.clipboard.writeText(doc.url);
    setCopiedKey(doc.id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Toaster position="top-right" />
      <div className="flex flex-1 w-full">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <Reveal animation="fade-up">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-3xl mb-8 shadow-xl">
              <h1 className="sm:text-4xl text-center font-extrabold">
                {category.charAt(0).toUpperCase() + category.slice(1)} Documents
              </h1>
              <p className="mt-2 text-gray-200 text-center text-lg">
                Manage your {category} documents here.
              </p>
            </div>
          </Reveal>

          <Reveal animation="fade-up" delay={60}>
            <Card className="shadow-lg hover:shadow-2xl transition p-6 mb-8 flex flex-col gap-4 bg-white rounded-3xl">
              <AnimatePresence>
                {(file || expirationDate || reminderAt) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-center sm:text-left mb-2"
                  >
                    {file && (
                      <p className="text-gray-700 font-medium">
                        📄 Selected file:{" "}
                        <span className="font-semibold text-indigo-600">
                          {file.name}
                        </span>
                      </p>
                    )}
                    {expirationDate && (
                      <p className="text-gray-700">
                        ⏳ Expiration date selected:{" "}
                        <span className="font-semibold text-purple-600">
                          {new Date(expirationDate).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                    {reminderAt && (
                      <p className="text-gray-700">
                        🔔 Reminder set for:{" "}
                        <span className="font-semibold text-blue-600">
                          {new Date(reminderAt).toLocaleString()}
                        </span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-wrap">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="border p-3 rounded-xl w-full sm:flex-1 sm:min-w-[200px]"
                  disabled={uploading}
                />
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="border p-3 rounded-xl w-full sm:w-auto"
                  disabled={uploading}
                  style={{ minWidth: 180 }}
                />
                <input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  className="border p-3 rounded-xl w-full sm:w-auto"
                  disabled={uploading}
                  style={{ minWidth: 220 }}
                />
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 w-full sm:w-auto"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </Card>
          </Reveal>

          <div className="mb-6">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl shadow-sm w-full"
            />
          </div>

          {filteredDocs.length === 0 ? (
            <p className="text-gray-500 text-center">
              No documents uploaded yet.
            </p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredDocs.map((doc, index) => {
                const expiresIn = daysUntil(doc.expiration_date);
                const reminderIn = daysUntil(doc.reminder_at);
                return (
                  <Reveal key={doc.id} animation="fade-up" delay={index * 40}>
                    <div className="border border-gray-200 rounded-3xl p-4 bg-white shadow hover:shadow-2xl transition flex flex-col">
                      {isImage(doc.name) ? (
                        <div
                          className="cursor-pointer w-full h-40 relative rounded-2xl overflow-hidden"
                          onClick={() => openModal(index)}
                        >
                          <Image
                            src={doc.url}
                            alt={doc.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400 text-4xl">
                          📄
                        </div>
                      )}
                      <p className="mt-3 text-sm font-semibold truncate">
                        {doc.name}
                      </p>

                      {(doc.expiration_date || doc.reminder_at) && (
                        <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
                          {doc.expiration_date && (
                            <span>
                              Expires:{" "}
                              {new Date(
                                doc.expiration_date
                              ).toLocaleDateString()}
                            </span>
                          )}
                          {doc.reminder_at && (
                            <span>
                              Reminder:{" "}
                              {new Date(doc.reminder_at).toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 mt-2 mb-1 text-xs flex-wrap">
                        {doc.expiration_date &&
                          expiresIn !== null &&
                          expiresIn <= 7 &&
                          expiresIn >= 0 && (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Expiring in {expiresIn}d
                            </span>
                          )}
                        {doc.reminder_at &&
                          reminderIn !== null &&
                          reminderIn <= 1 &&
                          reminderIn >= 0 && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Reminder Due Soon
                            </span>
                          )}
                        {doc.expiration_date &&
                          expiresIn !== null &&
                          expiresIn < 0 && (
                            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                              Expired
                            </span>
                          )}
                        {(!doc.expiration_date ||
                          (expiresIn !== null && expiresIn > 7)) &&
                          !(
                            doc.expiration_date &&
                            expiresIn !== null &&
                            (expiresIn <= 7 || expiresIn < 0)
                          ) && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1"
                          onClick={() => handleShare(doc)}
                        >
                          {copiedKey === doc.id ? "Copied!" : "Share"}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1"
                          onClick={() => handleDelete(doc)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {isModalOpen && filteredDocs[currentIndex] && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
              <button
                className="absolute top-6 right-6 text-white text-3xl hover:opacity-75 transition"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <button
                className="absolute left-2 sm:left-6 text-white text-4xl hover:opacity-75 transition disabled:opacity-30"
                onClick={() =>
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
                }
                disabled={currentIndex === 0}
              >
                ‹
              </button>
              <div className="relative w-full max-w-5xl">
                <Image
                  src={filteredDocs[currentIndex].url}
                  alt={filteredDocs[currentIndex].name}
                  width={900}
                  height={900}
                  className="max-h-[90vh] w-full object-contain rounded-xl"
                />
              </div>
              <button
                className="absolute right-2 sm:right-6 text-white text-4xl hover:opacity-75 transition disabled:opacity-30"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev < filteredDocs.length - 1 ? prev + 1 : prev
                  )
                }
                disabled={currentIndex === filteredDocs.length - 1}
              >
                ›
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
