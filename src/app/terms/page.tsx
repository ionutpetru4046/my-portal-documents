"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiFileText, FiShield, FiLock, FiAlertCircle, FiInfo, FiClock } from "react-icons/fi";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    icon: FiFileText,
    color: "blue",
    content: "By accessing or using DocuVault and our document management services, you accept these Terms & Conditions and agree to be bound by them. These terms apply to all users, including casual browsers and registered account holders. If you do not agree with any part of these terms, you must not use our services. Your continued use of DocuVault constitutes your acceptance of these terms."
  },
  {
    title: "2. Service Description",
    icon: FiShield,
    color: "purple",
    content: (
      <div className="space-y-3">
        <p>DocuVault is a cloud-based document management platform that allows users to:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li>Upload, store, and organize documents securely</li>
          <li>Set expiration dates and receive reminders for important documents</li>
          <li>Share documents with others via secure links</li>
          <li>Access documents from any device with internet connection</li>
          <li>Manage document categories and create custom workflows</li>
          <li>Access administrative insights and analytics (for Admin users)</li>
        </ul>
      </div>
    )
  },
  {
    title: "3. User Account Responsibilities",
    icon: FiLock,
    color: "cyan",
    content: (
      <div className="space-y-3">
        <p className="text-slate-400">As a DocuVault user, you agree to:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li>Provide accurate, complete, and current information during registration</li>
          <li>Maintain the confidentiality of your account credentials and password</li>
          <li>Not share your account credentials with third parties</li>
          <li>Take full responsibility for all activities conducted under your account</li>
          <li>Notify us immediately of any unauthorized access or security breach</li>
          <li>Keep your contact information up-to-date for important communications</li>
        </ul>
      </div>
    )
  },
  {
    title: "4. Document Storage & Data Management",
    icon: FiShield,
    color: "green",
    content: (
      <div className="space-y-3">
        <p className="text-slate-400">DocuVault provides secure document storage with the following terms:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li>Your documents are encrypted with AES-256 encryption both in transit and at rest</li>
          <li>Storage limits depend on your subscription plan (Starter: 1GB, Pro: 50GB, Business: 500GB, Enterprise: Unlimited)</li>
          <li>You retain all rights to your documents and can delete them at any time</li>
          <li>Deleted documents are moved to Trash and permanently deleted after 30 days</li>
          <li>We maintain automated daily backups to prevent data loss</li>
          <li>DocuVault does not access, modify, or share your documents without your explicit consent</li>
          <li>You are responsible for maintaining backups of critical documents</li>
        </ul>
      </div>
    )
  },
  {
    title: "5. Prohibited Activities",
    icon: FiAlertCircle,
    color: "orange",
    content: (
      <div className="space-y-3">
        <p className="text-slate-400">You agree not to use DocuVault to:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li>Store or distribute illegal content, malware, or viruses</li>
          <li>Attempt unauthorized access to other accounts or systems</li>
          <li>Violate any applicable laws, regulations, or intellectual property rights</li>
          <li>Harass, threaten, or defame other users</li>
          <li>Engage in phishing, fraud, or financial manipulation</li>
          <li>Reverse engineer, decompile, or attempt to derive the source code of DocuVault</li>
          <li>Interfere with or disrupt the normal operation of our services</li>
          <li>Bypass security measures or access restrictions</li>
          <li>Use automated tools to access DocuVault without authorization</li>
        </ul>
      </div>
    )
  },
  {
    title: "6. Intellectual Property Rights",
    icon: FiLock,
    color: "pink",
    content: "All content, logos, graphics, software, and proprietary information on DocuVault are the exclusive property of DocuVault or its licensors and are protected by international intellectual property laws. You are granted a limited, non-exclusive license to use DocuVault for personal or business purposes, but you may not reproduce, modify, distribute, or transmit any content without our prior written consent. Your documents and uploaded content remain your intellectual property, and we claim no rights over them."
  },
  {
    title: "7. User-Generated Content",
    icon: FiFileText,
    color: "cyan",
    content: "DocuVault does not claim ownership of documents, files, or data you upload to our platform. You retain full ownership and control over your content. By using DocuVault, you grant us a worldwide, non-exclusive license to use, store, backup, and transmit your documents solely for providing and improving our services. You are solely responsible for ensuring that you have the legal right to upload and share any documents on our platform."
  },
  {
    title: "8. Privacy & Data Protection",
    icon: FiShield,
    color: "blue",
    content: "Your privacy is extremely important to us. DocuVault complies with GDPR, CCPA, and other data protection regulations. We collect minimal personal information necessary to provide our services. Your data is processed securely and never sold to third parties. We use cookies and analytics to improve your experience. You can request data access, modification, or deletion at any time through your account settings. For detailed information, please review our Privacy Policy."
  },
  {
    title: "9. Payment & Billing",
    icon: FiFileText,
    color: "purple",
    content: (
      <div className="space-y-3">
        <p className="text-slate-400">If you subscribe to a paid plan, you agree to:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li>Provide valid payment information and keep it current</li>
          <li>Pay all fees associated with your chosen plan</li>
          <li>Understand that subscription fees are charged upfront</li>
          <li>Automatic renewal unless you cancel before the renewal date</li>
          <li>Accept our refund policy (30-day money-back guarantee)</li>
          <li>Receive invoices via email for your records</li>
        </ul>
      </div>
    )
  },
  {
    title: "10. Termination & Account Closure",
    icon: FiClock,
    color: "orange",
    content: "You may terminate your account at any time through your account settings. DocuVault reserves the right to suspend or terminate your access without notice for violation of these Terms. Upon termination, your documents will be accessible for 30 days for backup purposes, after which they will be permanently deleted. We are not liable for any loss of data after deletion."
  },
  {
    title: "11. Limitation of Liability",
    icon: FiAlertCircle,
    color: "pink",
    content: "To the maximum extent permitted by law, DocuVault shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including loss of data, profits, or business interruption, even if we have been advised of the possibility of such damages. Our total liability is limited to the amount you paid for services in the past 12 months. This limitation applies to all claims, whether in contract, tort, or otherwise."
  },
  {
    title: "12. Changes to Terms & Service",
    icon: FiFileText,
    color: "blue",
    content: "DocuVault may update these Terms & Conditions or service features at any time. Material changes will be communicated via email or a prominent notice on our platform. Your continued use of DocuVault following such changes constitutes your acceptance of the updated terms. We recommend reviewing these terms periodically for updates."
  },
  {
    title: "13. Compliance & Legal",
    icon: FiFileText,
    color: "purple",
    content: "These Terms & Conditions are governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through binding arbitration. DocuVault complies with all applicable regulations including GDPR, HIPAA (where applicable), SOC 2 Type II certification, and industry-standard security practices. Users must comply with all applicable laws in their jurisdiction."
  },
];

export default function TermsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const colorMap = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400",
    pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400",
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-6"
          >
            <FiInfo className="w-6 h-6 text-blue-400" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Please read these terms carefully. By using DocuVault, you agree to comply with all the terms outlined below.
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8 mb-8"
        >
          <p className="text-slate-300 text-center leading-relaxed">
            Welcome to <span className="font-bold text-blue-400">DocuVault</span>, a modern document management platform designed to help professionals securely store, organize, and share their important documents. These Terms & Conditions govern your use of our services and establish the rights and responsibilities of both DocuVault and our users. Please read them thoroughly before proceeding.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-12"
        >
          {termsSections.map((section, index) => {
            const Icon = section.icon;
            const colorClass = colorMap[section.color as keyof typeof colorMap];

            return (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  className={`backdrop-blur-xl bg-gradient-to-br ${colorClass} border rounded-xl overflow-hidden transition-all group cursor-pointer hover:shadow-lg hover:shadow-slate-800`}
                  onClick={() => toggleSection(index)}
                  whileHover={{ y: -2 }}
                >
                  <div className="p-6 md:p-7 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass.split(' ')[0]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {section.title}
                      </h2>
                    </div>

                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <FiChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-colors" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 md:px-7 pb-6 border-t border-slate-700 bg-slate-800/20"
                      >
                        <div className="text-slate-300 leading-relaxed space-y-2">
                          {typeof section.content === "string" ? (
                            <p>{section.content}</p>
                          ) : (
                            section.content
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 border-t border-slate-800"
        >
          <p className="text-slate-400 text-sm mb-4">
            <span className="font-semibold text-slate-300">Last Updated:</span> October 24, 2025
          </p>
          <p className="text-slate-500 text-xs max-w-2xl mx-auto">
            These Terms & Conditions are subject to change. We will notify you of any significant changes via email or a prominent notice on our platform. Your continued use of DocuVault indicates your acceptance of any updated terms.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8 text-center"
        >
          <p className="text-slate-400 mb-4">
            Questions about these Terms? Have concerns or need clarification?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}