"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-teal-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-6"
        >
          <h1 className="text-4xl font-extrabold text-blue-700">Contact Us</h1>
          <p className="text-gray-600">
            We'd love to hear from you! Fill out the form below or reach us directly.
          </p>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>

          <div className="mt-6 text-gray-700">
            <p className="mb-2 font-medium text-blue-700">Or contact us directly:</p>
            <div className="flex flex-col gap-1">
              <span>support@DocuVault.com</span>
              <span>+123 456 7890</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Image Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center"
        >
          <img
            src="/digital-wallet-documents.jpg" // Replace with your image path
            alt="digital wallet"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </main>
  );
}
