/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronRight, FiSearch, FiBook, FiLock, FiUpload, FiShare2, FiTrash2, FiClock, FiAlertCircle, FiCheckCircle, FiFile, FiFolder, FiSettings } from "react-icons/fi";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

const documentation: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <FiBook className="w-6 h-6" />,
    description: "Learn the basics of DocuVault",
    content: "iDocReminder is a secure document management platform designed to help you organize, store, and manage your important files with ease.",
    subsections: [
      {
        title: "Creating Your Account",
        content: "Sign up for a free iDocReminder account in seconds. Visit our signup page and enter your email and password. You'll receive a confirmation email to verify your account.",
      },
      {
        title: "First Login",
        content: "After confirming your email, log in to your dashboard. You'll see your empty vault ready to receive your documents.",
      },
      {
        title: "Dashboard Overview",
        content: "Your dashboard shows recent documents, storage usage, and quick action buttons. Use the sidebar to navigate between different sections.",
      },
    ],
  },
  {
    id: "uploading-documents",
    title: "Uploading Documents",
    icon: <FiUpload className="w-6 h-6" />,
    description: "How to upload and organize files",
    content: "Upload your documents easily using our intuitive interface. Supported formats include PDF, DOC, DOCX, XLS, XLSX, and more.",
    subsections: [
      {
        title: "Single File Upload",
        content: "Click the 'Upload' button, select a file from your computer, and it will be added to your vault. Files are automatically scanned for security.",
      },
      {
        title: "Bulk Upload",
        content: "Upload multiple files at once using drag-and-drop. Simply drag files from your desktop to the upload area.",
      },
      {
        title: "File Organization",
        content: "Create folders and subfolders to organize your documents. Use tags and labels for easier searching and categorization.",
      },
    ],
  },
  {
    id: "security-privacy",
    title: "Security & Privacy",
    icon: <FiLock className="w-6 h-6" />,
    description: "Understand our security measures",
    content: "Your documents are protected with enterprise-grade encryption. All data is encrypted both in transit and at rest.",
    subsections: [
      {
        title: "Encryption Standards",
        content: "We use AES-256 encryption for all stored documents and TLS 1.3 for data in transit. Your encryption keys are never shared with us.",
      },
      {
        title: "Two-Factor Authentication",
        content: "Enable 2FA in settings for enhanced security. You'll need both your password and an authenticator app to log in.",
      },
      {
        title: "Access Control",
        content: "Control who can view, edit, or download your documents. Set permissions for individual users or groups.",
      },
    ],
  },
  {
    id: "sharing-collaboration",
    title: "Sharing & Collaboration",
    icon: <FiShare2 className="w-6 h-6" />,
    description: "Share documents securely with others",
    content: "Easily share documents with team members, clients, or partners while maintaining full control over access permissions.",
    subsections: [
      {
        title: "Generating Share Links",
        content: "Right-click on a document and select 'Share'. Generate a unique link with expiration date and permission settings.",
      },
      {
        title: "Setting Permissions",
        content: "Choose between View, Edit, or Download permissions. Set expiration dates for temporary access.",
      },
      {
        title: "Revoking Access",
        content: "Instantly revoke access to shared documents at any time. Previous viewers won't be able to access the file anymore.",
      },
    ],
  },
  {
    id: "managing-documents",
    title: "Managing Documents",
    icon: <FiFile className="w-6 h-6" />,
    description: "Edit and manage your files",
    content: "Manage your documents with powerful tools for organizing, searching, and collaborating.",
    subsections: [
      {
        title: "Renaming Files",
        content: "Right-click on a file and select 'Rename'. Update the filename with a new name and save.",
      },
      {
        title: "Searching Documents",
        content: "Use the search bar to find documents by name, tag, or content. Advanced filters help narrow down results.",
      },
      {
        title: "File Versioning",
        content: "All changes are tracked automatically. View previous versions and restore to any earlier version if needed.",
      },
    ],
  },
  {
    id: "expiration-dates",
    title: "Document Expiration",
    icon: <FiClock className="w-6 h-6" />,
    description: "Set automatic document expiration",
    content: "Automatically expire documents after a set period. Great for sensitive information that needs periodic updates.",
    subsections: [
      {
        title: "Setting Expiration Dates",
        content: "When uploading or editing a document, set an expiration date. The document will become inaccessible after that date.",
      },
      {
        title: "Renewal Notifications",
        content: "Receive email notifications before a document expires. Easily renew or delete expired documents.",
      },
      {
        title: "Compliance Benefits",
        content: "Ensure compliance with data retention policies. Automatically delete sensitive documents after a specified period.",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: <FiAlertCircle className="w-6 h-6" />,
    description: "Common issues and solutions",
    content: "Find answers to common problems and learn how to resolve them quickly.",
    subsections: [
      {
        title: "Upload Failed",
        content: "Check your internet connection and file size. Maximum file size is 100MB. Try uploading again or contact support.",
      },
      {
        title: "Can't Access Shared Document",
        content: "Verify the link hasn't expired. Ask the document owner to check sharing permissions. Clear browser cache and try again.",
      },
      {
        title: "Forgot Password",
        content: "Click 'Forgot Password' on the login page. Follow the email instructions to reset your password within 24 hours.",
      },
    ],
  },
];

export default function DocumentationPage() {
  const [selectedSection, setSelectedSection] = useState<DocSection | null>(documentation[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubsection, setExpandedSubsection] = useState<string | null>(null);

  const filteredDocs = documentation.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Documentation</h1>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to know about iDocReminder</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedSection(doc)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                    selectedSection?.id === doc.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className={selectedSection?.id === doc.id ? "text-white" : "text-slate-500"}>
                    {doc.icon}
                  </div>
                  <span className="font-medium text-sm flex-1">{doc.title}</span>
                  {selectedSection?.id === doc.id && (
                    <FiChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            key={selectedSection?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3"
          >
            {selectedSection ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                {/* Section Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    {selectedSection.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedSection.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">{selectedSection.description}</p>
                  </div>
                </div>

                {/* Section Content */}
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                    {selectedSection.content}
                  </p>
                </div>

                {/* Subsections */}
                {selectedSection.subsections && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Learn more:</h3>
                    {selectedSection.subsections.map((sub, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedSubsection(
                              expandedSubsection === `${selectedSection.id}-${idx}`
                                ? null
                                : `${selectedSection.id}-${idx}`
                            )
                          }
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white text-left">{sub.title}</h4>
                          <FiChevronRight
                            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                              expandedSubsection === `${selectedSection.id}-${idx}` ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        {expandedSubsection === `${selectedSection.id}-${idx}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/30"
                          >
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{sub.content}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Help CTA */}
                <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Still have questions?</h4>
                      <p className="text-slate-700 dark:text-slate-300 mb-3">
                        Can't find what you're looking for? Reach out to our support team.
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Contact Support
                        <FiChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">No documentation found. Try adjusting your search.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ready to get started?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Join thousands of users who trust iDocReminder with their important documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="auth/signup"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/tutorials"
              className="px-8 py-3 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              View Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}