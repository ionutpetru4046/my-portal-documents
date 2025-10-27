"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DocumentGrid, { DocumentType } from "./DocumentGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch documents for this category
  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) toast.error(error.message);
      else setDocuments(data || []);
    };
    fetchDocuments();
  }, [category]);

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Upload file
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const filePath = `${category}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    const publicUrl = data?.publicUrl;

    if (!publicUrl) {
      toast.error("Failed to get file URL");
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("documents").insert([
      {
        name: file.name,
        path: filePath,
        url: publicUrl,
        category,
      },
    ]);

    if (dbError) toast.error(dbError.message);
    else {
      toast.success("File uploaded successfully!");
      setDocuments((prev) => [{ id: Date.now().toString(), name: file.name, url: publicUrl }, ...prev]);
    }

    setFile(null);
    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-10">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800">
          {category.charAt(0).toUpperCase() + category.slice(1)} Documents
        </h1>
        <p className="mt-2 text-gray-500 sm:text-lg md:text-xl">
          Upload, view, and manage all {category} documents
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-3 rounded-xl w-full sm:flex-1 sm:min-w-[200px]"
          disabled={uploading}
        />
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 w-full sm:w-auto"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto mb-6">
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl shadow-sm w-full"
        />
      </div>

      {/* Document Grid */}
      <DocumentGrid documents={filteredDocs} />
    </main>
  );
}
