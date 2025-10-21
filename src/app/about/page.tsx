// src/app/about/page.tsx
"use client";

import Link from "next/link";
import { FiLock, FiCloud, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-b-3xl shadow-lg"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold mb-6"
        >
          About Digital Documents
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg sm:text-xl max-w-2xl mb-10"
        >
          Store, manage, and access your documents securely anytime, anywhere.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl shadow hover:bg-gray-100 transition"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 text-center mb-16"
        >
          Why Choose Digital <br/> Documents Hub?
        </motion.h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <FiLock className="text-blue-600 w-12 h-12 mb-4" />,
              title: "Secure Storage",
              desc: "Your documents are encrypted and stored safely in the cloud.",
            },
            {
              icon: <FiCloud className="text-green-500 w-12 h-12 mb-4" />,
              title: "Easy Access",
              desc: "Access your files anytime, from any device, with a simple click.",
            },
            {
              icon: <FiCheckCircle className="text-yellow-500 w-12 h-12 mb-4" />,
              title: "Organized Workflow",
              desc: "Keep your documents organized and track recent activity effortlessly.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * i, duration: 0.6 }}
              className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              {feature.icon}
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission / Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-t-3xl shadow-lg text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6"
        >
          Our Mission
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg max-w-2xl mx-auto mb-6"
        >
          MyPortal was built to simplify document management for professionals and teams, helping you focus on what matters most.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl shadow hover:bg-gray-100 transition"
          >
            Upload Your First Document
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}