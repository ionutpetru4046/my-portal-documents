// src/components/Modal.tsx
"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full p-6 relative border border-gray-200 dark:border-slate-800">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
        >
          ✖
        </button>
        
        <div>{children}</div>
      </div>
    </div>
  );
}
