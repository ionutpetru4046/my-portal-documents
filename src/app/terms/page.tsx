"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using our website or services, you accept these terms and agree to be bound by them. If you do not agree, please do not use our services."
  },
  {
    title: "2. User Responsibilities",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>You must provide accurate and up-to-date information when registering.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You agree not to misuse our services or engage in illegal activities.</li>
      </ul>
    )
  },
  {
    title: "3. Prohibited Activities",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>Distributing malicious software or viruses.</li>
        <li>Attempting unauthorized access to other accounts or systems.</li>
        <li>Violating applicable laws or regulations.</li>
      </ul>
    )
  },
  {
    title: "4. Intellectual Property",
    content: "All content, logos, graphics, and software on this website are the property of MyApp or its licensors and are protected by intellectual property laws."
  },
  {
    title: "5. Termination",
    content: "We reserve the right to suspend or terminate your access to the services at our discretion, without notice, for violation of these Terms."
  },
  {
    title: "6. Limitation of Liability",
    content: "To the maximum extent permitted by law, DocuVault is not liable for any indirect, incidental, or consequential damages arising from your use of our services."
  },
  {
    title: "7. Changes to Terms",
    content: "We may update these Terms & Conditions from time to time. Updates will be posted on this page. Continued use of the services indicates your acceptance of the updated terms."
  },
];

export default function TermsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>

      <div className="w-full max-w-4xl space-y-4">
        <p className="text-gray-700 text-center mb-6">
          Welcome to <strong>DocuVault</strong>. By using our services, you agree to comply with these Terms & Conditions. Please read them carefully.
        </p>

        {termsSections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => toggleSection(index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">{section.title}</h2>
              {openIndex === index ? (
                <FiChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
            {openIndex === index && <div className="mt-3 text-gray-700">{section.content}</div>}
          </div>
        ))}

        <p className="mt-6 text-gray-500 text-sm text-center">
          Last updated: October 24, 2025
        </p>
      </div>
    </div>
  );
}
