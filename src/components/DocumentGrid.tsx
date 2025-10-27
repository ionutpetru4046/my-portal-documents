"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export interface DocumentType {
  id: string;
  name: string;
  url: string;
  expiration_date?: string;
  reminder_at?: string;
}

interface DocumentGridProps {
  documents: DocumentType[];
}

export default function DocumentGrid({ documents }: DocumentGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const isImage = (name: string) =>
    /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);

  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const now = new Date();
    const d = new Date(dateStr);
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {documents.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No documents yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-gray-200 rounded-3xl p-4 bg-white shadow hover:shadow-2xl transition flex flex-col"
            >
              {/* Image */}
              {isImage(doc.name) ? (
                <div
                  className="cursor-pointer w-full h-40 relative rounded-2xl overflow-hidden"
                  onClick={() => openModal(index)}
                >
                  <Image
                    src={encodeURI(doc.url)}
                    alt={doc.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400 text-4xl">
                  📄
                </div>
              )}

              <p className="mt-3 text-sm font-semibold truncate">{doc.name}</p>

              {/* Badges */}
              <div className="flex gap-2 mt-2 mb-1 text-xs flex-wrap">
                {doc.expiration_date && (
                  <span
                    className={`px-2 py-1 rounded-full ${
                      daysUntil(doc.expiration_date)! < 0
                        ? "bg-gray-100 text-gray-500"
                        : daysUntil(doc.expiration_date)! <= 7
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {daysUntil(doc.expiration_date)! < 0
                      ? "Expired"
                      : `Expires in ${daysUntil(doc.expiration_date)}d`}
                  </span>
                )}
                {doc.reminder_at && daysUntil(doc.reminder_at)! <= 1 && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Reminder Due Soon
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <button
            className="absolute top-6 right-6 text-white text-3xl hover:opacity-75 transition"
            onClick={closeModal}
          >
            ✕
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={encodeURI(documents[currentIndex].url)}
              alt={documents[currentIndex].name}
              fill
              className="object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
