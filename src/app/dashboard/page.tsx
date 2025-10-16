"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

interface DocumentType {
  id: string;
  name: string;
  path: string;
  url: string;
  userID: string;
  created_at: string;
}

interface UserType {
  id: string;
  email: string;
  user_metadata: {
    avatar?: string;
    role?: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocs, setFilteredDocs] = useState<DocumentType[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch logged-in user safely
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
        return;
      }

      const userData: UserType = {
        id: data.user.id,
        email: data.user.email ?? "",
        user_metadata: data.user.user_metadata,
      };
      setUser(userData);

      if (userData.user_metadata?.avatar) {
        setAvatarPreview(userData.user_metadata.avatar);
      }
    };

    getUser();
  }, [router]);

  // ✅ Fetch user documents
  const fetchDocuments = async (userID: string) => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("userID", userID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to fetch documents");
      return;
    }

    setDocuments(data || []);
    setFilteredDocs(data || []);
  };

  // ✅ Load docs after user is ready
  useEffect(() => {
    if (user?.id) fetchDocuments(user.id);
  }, [user]);

  // ✅ Real-time updates
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
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // ✅ Search filter
  useEffect(() => {
    if (!searchQuery) setFilteredDocs(documents);
    else {
      const filtered = documents.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocs(filtered);
    }
  }, [searchQuery, documents]);

  // ✅ Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Upload File
  const handleUpload = async () => {
    if (!file || !user?.id) return;
    setUploading(true);

    const filePath = `user-${user.id}/${file.name}`;

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
      },
    ]);

    if (dbError) toast.error(`Failed to save metadata: ${dbError.message}`);
    else toast.success("File uploaded successfully!");

    setFile(null);
    setUploading(false);
  };

  // ✅ Helpers
  const isImage = (name: string) =>
    /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);

  const handleDownload = (doc: DocumentType) => window.open(doc.url, "_blank");

  const handleShare = async (doc: DocumentType) => {
    await navigator.clipboard.writeText(doc.url);
    setCopiedKey(doc.id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (doc: DocumentType) => {
  if (!window.confirm(`Delete "${doc.name}"?`)) return;

  try {
    // 1️⃣ Remove from Supabase Storage
    const { data: removed, error: storageError } = await supabase.storage
      .from("documents")
      .remove([doc.path]);

    if (storageError) throw new Error(`Failed to delete file: ${storageError.message}`);

    // 2️⃣ Remove metadata from DB
    const { data: deleted, error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);

    if (dbError) throw new Error(`Failed to delete metadata: ${dbError.message}`);

    // 3️⃣ Update local state
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    setFilteredDocs((prev) => prev.filter((d) => d.id !== doc.id));

    toast.success("Document deleted successfully!");
  } catch (err: any) {
    toast.error(err.message);
  }
};


  // ✅ JSX
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-teal-400 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold text-white">
            <Link href="/">Digital Docs</Link>
          </div>

          {user && (
            <div className="hidden md:flex flex-1 mx-6 relative">
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-lg text-white"
              />
            </div>
          )}

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-white focus:outline-none"
                >
                  <Image
                    src={avatarPreview || "/default-avatar.jpeg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Dashboard
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        router.push("/login");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main */}
      <div className="p-4 sm:p-6 lg:p-8 flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-400 text-white p-6 rounded-b-3xl mb-8 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Welcome back, {user?.email || "User"}! 👋
          </h1>
          <p className="mt-2 text-gray-100 text-lg">
            Manage your documents efficiently.
          </p>
        </div>

        {/* Upload */}
        <Card className="shadow-md hover:shadow-xl transition p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded"
            disabled={uploading}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Card>

        {/* Documents */}
        <Card className="shadow-md hover:shadow-xl transition p-4">
          <CardTitle className="text-lg mb-2">Your Documents</CardTitle>
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents uploaded yet.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
                >
                  {isImage(doc.name) ? (
                    <Image
                      src={doc.url}
                      alt={doc.name}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md text-gray-500">
                      📄
                    </div>
                  )}
                  <p className="mt-2 text-sm font-semibold truncate">
                    {doc.name}
                  </p>
                  <div className="flex justify-between mt-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleDownload(doc)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleShare(doc)}
                    >
                      {copiedKey === doc.id ? "Copied!" : "Share"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(doc)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
}
