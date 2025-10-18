"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          <img src="/default-avatar.jpeg" alt="Hero background" className="w-full h-full object-cover opacity-80" />
        </div>
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-300/40 blur-3xl" />
          <div className="absolute top-20 -right-24 w-80 h-80 rounded-full bg-purple-300/40 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal animation="fade-in" delay={50}>
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest rounded-full bg-indigo-100 text-indigo-700 mb-4">
                Digital Document Hub
              </span>
            </Reveal>
            <Reveal animation="fade-up" delay={100}>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
                Securely store, preview, and manage all your documents
              </h1>
            </Reveal>
            <Reveal animation="fade-up" delay={150}>
              <p className="mt-6 text-lg text-gray-600">
                Upload files, set expirations and reminders, and stay on top of what matters. A fast, modern portal for everyday document workflows.
              </p>
            </Reveal>
            <Reveal animation="fade-up" delay={200}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  Create Account
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-3 rounded-xl bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-semibold transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            </Reveal>
            <Reveal animation="fade-in" delay={250}>
              <div className="mt-10 backdrop-blur-xl bg-white/50 border border-indigo-100 rounded-2xl p-4 sm:p-6 inline-flex items-center gap-3 shadow-md">
                <span className="text-sm text-gray-600">Set expiration + reminders • Admin insights • Fast search</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-6">
        <Reveal animation="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h2>
        </Reveal>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Reveal animation="fade-up" delay={50}>
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition">
              <div className="w-12 h-12 grid place-items-center rounded-xl bg-indigo-100 text-indigo-700 mb-4 group-hover:scale-105 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.94 6.34A2 2 0 014.74 5h10.52a2 2 0 011.8 1.34l.9 2.7a2 2 0 01-1.9 2.66H3.94A2 2 0 012.04 10l.9-2.7z"/><path d="M4 12h12v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Secure by Default</h3>
              <p className="text-gray-600">Backed by robust storage and access rules. Share via safe links.</p>
            </div>
          </Reveal>
          <Reveal animation="fade-up" delay={100}>
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition">
              <div className="w-12 h-12 grid place-items-center rounded-xl bg-green-100 text-green-700 mb-4 group-hover:scale-105 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3h12v10H4z"/><path d="M2 15h16v2H2z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Effortless Uploads</h3>
              <p className="text-gray-600">Drag & drop, quick previews, and version-friendly naming.</p>
            </div>
          </Reveal>
          <Reveal animation="fade-up" delay={150}>
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition">
              <div className="w-12 h-12 grid place-items-center rounded-xl bg-amber-100 text-amber-700 mb-4 group-hover:scale-105 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6h2v5H9zM9 12h2v2H9z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Smart Reminders</h3>
              <p className="text-gray-600">Set expiration dates and reminders so nothing falls through the cracks.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Split Callouts */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Reveal animation="slide-right">
            <div className="rounded-2xl bg-white/80 backdrop-blur p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">Admin Insights</h3>
              <p className="text-gray-600 mb-4">See user document counts, expirations, and act quickly with filters.</p>
              <Link href="/admin/expirations" className="inline-block px-5 py-2 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold transition">Explore Expirations</Link>
            </div>
          </Reveal>
          <Reveal animation="slide-left">
            <div className="rounded-2xl bg-white/80 backdrop-blur p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600 mb-4">Your content stays yours. Fine-grained access and share controls.</p>
              <Link href="/privacy" className="inline-block px-5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition">Read Privacy</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <Reveal animation="fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
        </Reveal>
        <Reveal animation="fade-up" delay={80}>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">Create your account and start managing documents with speed and clarity.</p>
        </Reveal>
        <Reveal animation="fade-up" delay={140}>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">Sign Up</Link>
            <Link href="/dashboard" className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition">Go to Dashboard</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
