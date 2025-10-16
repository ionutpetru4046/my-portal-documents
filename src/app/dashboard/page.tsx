"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

interface DocumentType {
  id: string;
  name: string;
  path: string;
  url: string;
  userId: string;
  createdAt: string;
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocs, setFilteredDocs] = useState<DocumentType[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ Check logged-in user and roles
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");

      // Get user metadata including role
      const userData = {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      };
      setUser(userData);
    };
    fetchUser();
  }, [router]);

  // ✅ Fetch documents
  const fetchDocuments = async () => {
    if (!user?.email) return;
    const { data, error } = await supabase
      .from<DocumentType>("documents")
      .select("*")
      .eq("userId", user.email)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to fetch documents");
    } else {
      setDocuments(data || []);
      setFilteredDocs(data || []);
    }
  };

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user]);

  // ✅ Real-time updates (Supabase v2)
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel(`documents-${user.email}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `userId=eq.${user.email}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDocuments((prev) => [payload.new, ...prev]);
            setFilteredDocs((prev) => [payload.new, ...prev]);
            toast.success(`New document uploaded: ${payload.new.name}`);
          }
          if (payload.eventType === "UPDATE") {
            setDocuments((prev) =>
              prev.map((doc) => (doc.id === payload.new.id ? payload.new : doc))
            );
            setFilteredDocs((prev) =>
              prev.map((doc) => (doc.id === payload.new.id ? payload.new : doc))
            );
          }
          if (payload.eventType === "DELETE") {
            setDocuments((prev) => prev.filter((doc) => doc.id !== payload.old.id));
            setFilteredDocs((prev) => prev.filter((doc) => doc.id !== payload.old.id));
            toast.success("Document deleted!");
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // ✅ Search filter
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

  // ✅ Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Upload file
  const handleUpload = async () => {
    if (!file || !user?.email) return;
    const filePath = `user-${user.email}/${file.name}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file, { upsert: true });
    if (uploadError) return toast.error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl }, error: urlError } = supabase.storage.from("documents").getPublicUrl(filePath);
    if (urlError) return toast.error(`Failed to get public URL: ${urlError.message}`);

    const { error: dbError } = await supabase.from("documents").insert([
      { name: file.name, path: filePath, url: publicUrl, userId: user.email, createdAt: new Date().toISOString() },
    ]);

    if (dbError) toast.error(`Failed to save metadata: ${dbError.message}`);
    else {
      toast.success("File uploaded successfully!");
      setFile(null);
    }
  };

  // ✅ Download, Share, Delete
  const handleDownload = (doc: DocumentType) => window.open(doc.url, "_blank");
  const handleShare = async (doc: DocumentType) => {
    await navigator.clipboard.writeText(doc.url);
    setCopiedKey(doc.id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedKey(null), 2000);
  };
  const handleDelete = async (doc: DocumentType) => {
    if (!window.confirm(`Delete "${doc.name}"?`)) return;

    const { error: storageError } = await supabase.storage.from("documents").remove([doc.path]);
    if (storageError) return toast.error(`Failed to delete file: ${storageError.message}`);

    const { error: dbError } = await supabase.from("documents").delete().eq("id", doc.id);
    if (dbError) toast.error(`Failed to delete metadata: ${dbError.message}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              {searchQuery && filteredDocs.length > 0 && (
                <div className="absolute top-full mt-1 w-full max-w-lg bg-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onClick={() => window.open(doc.url, "_blank")}
                    >
                      {doc.name}
                    </div>
                  ))}
                </div>
              )}
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
                    src={user.user_metadata?.avatar || "/default-avatar.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Profile</Link>
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Dashboard</Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
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

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-400 text-white p-6 rounded-b-3xl mb-8 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Welcome back, {user?.email || "User"}! 👋</h1>
          <p className="mt-2 text-gray-100 text-lg">Manage your documents efficiently.</p>
          {user?.user_metadata?.role && (
            <p className="mt-1 text-gray-200 text-sm">Role: {user.user_metadata.role}</p>
          )}
        </div>

        {/* Upload */}
        <Card className="shadow-md hover:shadow-xl transition p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border p-2 rounded" />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpload} disabled={!file}>Upload</Button>
        </Card>

        {/* Documents List */}
        <Card className="shadow-md hover:shadow-xl transition p-4 mb-8">
          <CardTitle className="text-lg mb-2">Your Documents</CardTitle>
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <li key={doc.id} className="py-2 flex justify-between items-center">
                  <span>{doc.name}</span>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleDownload(doc)}>Download</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleShare(doc)}>
                      {copiedKey === doc.id ? "Copied!" : "Share"}
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(doc)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
