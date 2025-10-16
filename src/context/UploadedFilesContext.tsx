"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UploadedFilesContextType {
  uploadedFiles: string[];
  addFile: (fileUrl: string) => void;
}

const UploadedFilesContext = createContext<UploadedFilesContextType | undefined>(undefined);

export const UploadedFilesProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Load files from localStorage on mount
  useEffect(() => {
    const storedFiles = localStorage.getItem("myportal-files");
    if (storedFiles) setUploadedFiles(JSON.parse(storedFiles));
  }, []);

  const addFile = (fileUrl: string) => {
    setUploadedFiles((prev) => {
      const newFiles = [fileUrl, ...prev];
      localStorage.setItem("myportal-files", JSON.stringify(newFiles));
      return newFiles;
    });
  };

  return (
    <UploadedFilesContext.Provider value={{ uploadedFiles, addFile }}>
      {children}
    </UploadedFilesContext.Provider>
  );
};

export const useUploadedFiles = () => {
  const context = useContext(UploadedFilesContext);
  if (!context) throw new Error("useUploadedFiles must be used within UploadedFilesProvider");
  return context;
};
