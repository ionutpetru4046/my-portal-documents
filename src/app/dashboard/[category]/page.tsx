"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

interface DocumentType {
  id: string;
  name: string;
  path: string;
  url: string;
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
  const category = params?.category as string;

  const [user, setUser] = useState<UserType | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [expirationDate, setExpirationDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch logged-in user
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

  // ✅ Fetch documents for this user and folder
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

  // ✅ Real-time updates
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

  // ✅ Upload file
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
          category, // ← this must exist in the table
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

  // ✅ Delete document
  const handleDelete = async (doc: DocumentType) => {
    if (!window.confirm(`Delete "${doc.name}"?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([doc.path!]);
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

  // ✅ Share document
  const handleShare = async (doc: DocumentType) => {
    await navigator.clipboard.writeText(doc.url!);
    toast.success("Link copied!");
  };

  const isImage = (name: string) =>
    /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);

  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const now = new Date();
    const d = new Date(dateStr);
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 capitalize">{category}</h1>

      {/* Upload Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded flex-1"
        />
        <Input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          placeholder="Expiration date"
        />
        <Input
          type="datetime-local"
          value={reminderAt}
          onChange={(e) => setReminderAt(e.target.value)}
          placeholder="Reminder"
        />
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <p>No documents yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {documents.map((doc) => {
            const expiresIn = daysUntil(doc.expiration_date);
            const reminderIn = daysUntil(doc.reminder_at);

            return (
              <div
                key={doc.id}
                className="border rounded-2xl p-4 bg-white shadow hover:shadow-lg transition flex flex-col"
              >
                {isImage(doc.name) ? (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-2">
                    <Image
                      src={doc.url!}
                      alt={doc.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400 text-4xl mb-2">
                    📄
                  </div>
                )}

                <p className="truncate font-semibold">{doc.name}</p>

                {/* Dates */}
                <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
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
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Expiring in {expiresIn}d
                    </span>
                  )}
                  {doc.reminder_at && reminderIn !== null && reminderIn <= 1 && reminderIn >= 0 && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Reminder Due Soon
                    </span>
                  )}
                  {doc.expiration_date && expiresIn !== null && expiresIn < 0 && (
                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      Expired
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1" onClick={() => handleShare(doc)}>
                    Share
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(doc)}>
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
