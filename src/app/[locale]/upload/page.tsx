"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useUploadedFiles } from "@/context/UploadedFilesContext";
import { FiUpload } from "react-icons/fi";

export default function UploadPage() {
  const { uploadedFiles, addFile } = useUploadedFiles();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const fileUrl = URL.createObjectURL(selectedFile);
    addFile(fileUrl);
    setSelectedFile(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center px-6 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-400 text-white w-full max-w-4xl rounded-3xl p-10 shadow-lg mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Upload Your Documents
        </h1>
        <p className="text-lg sm:text-xl">
          Easily upload images and PDFs, manage and preview your files securely.
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg mb-12 hover:shadow-xl transition">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-600 transition">
          <FiUpload className="text-blue-600 w-12 h-12 mb-4" />
          <span className="text-gray-600 mb-2">
            {selectedFile ? selectedFile.name : "Click to select a file"}
          </span>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <button
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
          onClick={handleUpload}
        >
          Upload File
        </button>
      </div>

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Uploaded Files
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {uploadedFiles.map((fileUrl, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
                onClick={() =>
                  !fileUrl.endsWith(".pdf") ? setZoomImage(fileUrl) : null
                }
              >
                {fileUrl.endsWith(".pdf") ? (
                  <p className="text-gray-700 text-center p-6 truncate">
                    {fileUrl.split("/").pop()}
                  </p>
                ) : (
                  <img
                    src={fileUrl}
                    alt={`Upload ${index}`}
                    className="w-full h-36 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <Modal
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
        title="Preview Image"
      >
        {zoomImage && (
          <img src={zoomImage} alt="Zoomed" className="w-full h-auto rounded-xl" />
        )}
      </Modal>
    </div>
  );
}
