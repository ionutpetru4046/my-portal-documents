/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const privacySections = [
  {
    title: "1. Information We Collect",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Personal info you provide, such as name, email, and profile data.</li>
        <li>Data collected automatically, like IP address, browser type, and usage patterns.</li>
        <li>Documents and files you upload to our platform.</li>
      </ul>
    ),
  },
  {
    title: "2. How We Use Your Information",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>To provide, improve, and personalize our services.</li>
        <li>To communicate updates, promotions, and support.</li>
        <li>To ensure security and prevent fraud or unauthorized activity.</li>
      </ul>
    ),
  },
  {
    title: "3. Data Sharing",
    content: (
      <p>
        We do not sell or rent your personal data. We may share info with trusted third-party services
        like cloud storage providers, analytics, and payment processors under strict confidentiality agreements.
      </p>
    ),
  },
  {
    title: "4. Your Rights",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Access, update, or delete your personal information.</li>
        <li>Opt-out of marketing communications at any time.</li>
        <li>Request a copy of the data we hold about you.</li>
      </ul>
    ),
  },
  {
    title: "5. Data Security",
    content: (
      <p>
        We implement reasonable technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
      </p>
    ),
  },
  {
    title: "6. Children's Privacy",
    content: (
      <p>
        Our services are not directed to individuals under 13. We do not knowingly collect personal information from children.
      </p>
    ),
  },
  {
    title: "7. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted here with an updated date. Review this page periodically.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 flex flex-col items-center transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-slate-900 dark:text-white">Privacy Policy</h1>

      <div className="w-full max-w-3xl space-y-4">
        <p className="text-slate-700 dark:text-slate-300 text-center mb-6">
          Your privacy is important to us. This Privacy Policy explains how <strong>DocuVault</strong> ("we", "us", "our") collects, uses, and protects your information.
        </p>

        {privacySections.map((section, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg/20 p-5 cursor-pointer transition-all hover:shadow-md dark:hover:shadow-lg/30"
            onClick={() => toggleSection(index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
              {openIndex === index ? (
                <FiChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </div>
            {openIndex === index && <div className="mt-3 text-slate-700 dark:text-slate-300">{section.content}</div>}
          </div>
        ))}

        <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm text-center">
          Last updated: October 24, 2025
        </p>
      </div>
    </div>
  );
}