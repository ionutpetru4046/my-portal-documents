"use client";

import React from "react";
import { motion } from "framer-motion";

const CookiesPage = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white text-gray-800 flex flex-col items-center px-6 py-16">
      <motion.section
        className="max-w-3xl w-full space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Cookies Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: October 2025</p>
        </header>

        <article className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
          <p>
            At <span className="font-semibold">DocuVault</span>, we use cookies
            to improve your browsing experience, analyze site traffic, and
            provide personalized content.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help remember your preferences, login sessions,
              and improve your overall experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-medium">Essential Cookies:</span> Required
                for website functionality.
              </li>
              <li>
                <span className="font-medium">Analytics Cookies:</span> Help us
                understand how users interact with our website.
              </li>
              <li>
                <span className="font-medium">Marketing Cookies:</span> Used to
                personalize ads and track performance.
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Manage Your Preferences
            </h2>
            <p>
              You can manage or delete cookies directly in your browser
              settings. Note that disabling cookies may limit certain
              functionalities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
            <p>
              For questions, contact{" "}
              <a
                href="mailto:support@yourcompany.com"
                className="text-blue-600 hover:underline"
              >
                support@DocuVault.com
              </a>
              .
            </p>
          </motion.div>
        </article>
      </motion.section>
    </main>
  );
};

export default CookiesPage;
