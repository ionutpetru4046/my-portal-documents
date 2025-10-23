'use client';

import { useState } from "react";
import { FiHelpCircle, FiFileText, FiUser, FiSettings } from "react-icons/fi";

const categories = [
  {
    name: "Getting Started",
    icon: <FiUser className="w-6 h-6 text-blue-500" />,
    articles: [
      {
        title: "How to create an account",
        content: "Click Sign Up and follow the steps. Confirm your email to activate your account.",
      },
      {
        title: "How to set up your profile",
        content: "Go to Profile settings, upload a picture, and fill out your personal details.",
      },
    ],
  },
  {
    name: "Account & Security",
    icon: <FiSettings className="w-6 h-6 text-green-500" />,
    articles: [
      {
        title: "Resetting your password",
        content: "Click 'Forgot Password' on the login page and follow the instructions.",
      },
      {
        title: "Managing your email notifications",
        content: "Go to Account Settings > Notifications to customize your preferences.",
      },
    ],
  },
  {
    name: "Documents & Uploads",
    icon: <FiFileText className="w-6 h-6 text-purple-500" />,
    articles: [
      {
        title: "Uploading documents",
        content: "Navigate to the 'Documents' page and click 'Upload'. You can add multiple files.",
      },
      {
        title: "Deleting documents",
        content: "Click on the trash icon next to a document to remove it permanently.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  // Filter articles across all categories
  const filteredCategories = categories.map((cat) => {
    const filteredArticles = cat.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.content.toLowerCase().includes(search.toLowerCase())
    );
    return { ...cat, articles: filteredArticles };
  }).filter(cat => cat.articles.length > 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Help Center</h1>
          <p className="text-gray-700">
            Find guides, tutorials, and answers to common questions.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center mb-4 space-x-2">
                {category.icon}
                <h2 className="text-2xl font-semibold">{category.name}</h2>
              </div>

              <div className="space-y-3">
                {category.articles.map((article, i) => (
                  <details
                    key={i}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                  >
                    <summary className="cursor-pointer text-lg font-medium">
                      {article.title}
                    </summary>
                    <p className="mt-2 text-gray-700">{article.content}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-gray-500 text-center mt-4">No articles found.</p>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
          <p className="text-gray-700 mb-4">
            Contact our support team for further assistance.
          </p>
          <a
            href="mailto:support@myapp.com"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
