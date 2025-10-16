"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-b-3xl shadow-lg">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
          Your Documents Portal
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-10">
          Store & Access Your Documents Digitally. Manage all your important files securely in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/subscribe"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          Why Choose Us
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9h4v2H8V9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Secure Storage</h3>
            <p className="text-gray-600">
              All your files are encrypted and stored securely.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition">
            <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3h12v14H4V3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Upload Easily</h3>
            <p className="text-gray-600">
              Upload PDFs and images quickly and efficiently.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition">
            <div className="bg-teal-100 text-teal-600 rounded-full p-4 mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5h16v10H2V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Analytics & Stats</h3>
            <p className="text-gray-600">
              Track activity and manage documents efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-center rounded-t-3xl shadow-lg">
        <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto">
          Create your account now and start managing your documents effortlessly.
        </p>
        <Link
          href="/signup"
          className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
