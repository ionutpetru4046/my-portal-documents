// src/app/about/page.tsx
"use client";

import Link from "next/link";
import { FiLock, FiCloud, FiCheckCircle } from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-b-3xl shadow-lg">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
          About Digital Documents
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-10">
          Store, manage, and access your documents securely anytime, anywhere.
        </p>
        <Link
          href="/dashboard"
          className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Go to Dashboard
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">
          Why Choose Digital Documents?
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition">
            <FiLock className="text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Secure Storage</h3>
            <p className="text-gray-600">
              Your documents are encrypted and stored safely in the cloud.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition">
            <FiCloud className="text-green-500 w-12 h-12 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Easy Access</h3>
            <p className="text-gray-600">
              Access your files anytime, from any device, with a simple click.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition">
            <FiCheckCircle className="text-yellow-500 w-12 h-12 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Organized Workflow</h3>
            <p className="text-gray-600">
              Keep your documents organized and track recent activity effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Team Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-t-3xl shadow-lg text-center">
        <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          MyPortal was built to simplify document management for professionals and teams, helping you focus on what matters most.
        </p>
        <Link
          href="/upload"
          className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Upload Your First Document
        </Link>
      </section>
    </div>
  );
}
