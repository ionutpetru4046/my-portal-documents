"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FiChevronDown, FiSearch, FiHelpCircle, FiShield, FiClock, FiUsers, FiDownload, FiShare2 } from "react-icons/fi";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const faqCategories = [
    {
      id: "general",
      name: "General",
      icon: FiHelpCircle,
      color: "blue",
      faqs: [
        {
          question: "What is DocuStore?",
          answer:
            "DocuStore is a modern document management platform designed to help you securely store, organize, and manage your important files. With our intuitive interface, you can upload documents, set expiration dates, create reminders, and share files safely with others.",
        },
        {
          question: "Who can use DocuStore?",
          answer:
            "DocuStore is perfect for individuals, small teams, and large enterprises. Whether you need to manage personal documents or organize company-wide document workflows, we have a plan that fits your needs.",
        },
        {
          question: "Is there a free trial?",
          answer:
            "Yes! All our paid plans include a 14-day free trial with full access to premium features. No credit card required to get started.",
        },
      ],
    },
    {
      id: "security",
      name: "Security & Privacy",
      icon: FiShield,
      color: "purple",
      faqs: [
        {
          question: "Is my data secure?",
          answer:
            "Absolutely. We use bank-level AES-256 encryption to protect your data both in transit and at rest. Your documents are stored on secure, redundant servers with automatic backups.",
        },
        {
          question: "What about privacy?",
          answer:
            "We prioritize your privacy completely. We never access your documents, sell your data, or share it with third parties. Your data belongs to you and remains under your control at all times.",
        },
        {
          question: "Can I delete my account and data?",
          answer:
            "Yes, you can delete your account anytime from your settings. All associated data will be permanently removed from our servers within 30 days.",
        },
      ],
    },
    {
      id: "features",
      name: "Features & Usage",
      icon: FiDownload,
      color: "cyan",
      faqs: [
        {
          question: "What file types can I upload?",
          answer:
            "You can upload any file type including PDF, Word documents, Excel spreadsheets, images, videos, and more. We support files up to 5GB in size depending on your plan.",
        },
        {
          question: "How do I set expiration dates and reminders?",
          answer:
            "When uploading or editing a document, you can set an expiration date and reminder date. We'll automatically notify you before the expiration date and can optionally mark expired documents as archived.",
        },
        {
          question: "Can I share documents with others?",
          answer:
            "Yes! Generate secure shareable links with customizable permissions. You can set passwords, expiration dates, and download limits for shared links.",
        },
      ],
    },
    {
      id: "plans",
      name: "Plans & Pricing",
      icon: FiUsers,
      color: "green",
      faqs: [
        {
          question: "What's included in each plan?",
          answer:
            "Our Starter plan is free with basic features. Pro includes 500 files and advanced sharing, Business offers unlimited files with priority support, and Enterprise provides custom solutions for large organizations.",
        },
        {
          question: "Can I upgrade or downgrade my plan?",
          answer:
            "Yes! You can change your plan anytime. Changes take effect on your next billing cycle. If you upgrade, the price difference is prorated.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.",
        },
      ],
    },
    {
      id: "support",
      name: "Support & Help",
      icon: FiClock,
      color: "orange",
      faqs: [
        {
          question: "How can I contact support?",
          answer:
            "You can reach us through the contact form on our website, email support@DocuVault.com, or use the live chat feature available 24/7 for Premium users.",
        },
        {
          question: "What's your response time?",
          answer:
            "For Pro and Business plans, we aim to respond within 24 hours. Premium Enterprise customers get a dedicated support manager with 2-hour response times.",
        },
        {
          question: "Do you have documentation and tutorials?",
          answer:
            "Yes! We have comprehensive documentation, video tutorials, and a help center with step-by-step guides for all features. Visit our Help Center for more information.",
        },
      ],
    },
  ];

  const allFaqs = faqCategories.flatMap(cat => 
    cat.faqs.map(faq => ({ ...faq, category: cat.id }))
  );

  const filteredFaqs = searchQuery.trim() === "" 
    ? allFaqs 
    : allFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const displayedFaqs = activeCategory
    ? filteredFaqs.filter(faq => faq.category === activeCategory)
    : allFaqs;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
  <section className="relative w-full min-h-screen py-16 md:py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-br from-purple-400/20 to-cyan-400/20 dark:from-purple-500/20 dark:to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked <span className="bg-linear-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions about DocuVault. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition">Contact our support team</a>
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 pl-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(null)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                activeCategory === null
                  ? "bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-lg"
                  : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
              }`}
            >
              All
            </motion.button>
            {faqCategories.map((category) => {
              const Icon = category.icon;
              const colorMap = {
                blue: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30",
                purple: "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/30",
                cyan: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-500/30",
                green: "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30",
                orange: "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30",
              };

              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeCategory === category.id
                      ? "bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-lg"
                      : `${colorMap[category.color as keyof typeof colorMap]} border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {displayedFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {displayedFaqs.map((faq, index) => (
                <motion.div key={`${faq.category}-${index}`} variants={itemVariants}>
                  <AccordionItem 
                    value={`item-${faq.category}-${index}`} 
                    className="backdrop-blur-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-slate-700 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FiSearch className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">No questions match your search.</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Try different keywords or browse all categories.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Still Need Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="backdrop-blur-xl bg-linear-to-r from-blue-100/40 via-purple-100/40 to-cyan-100/40 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-cyan-500/20 border border-slate-300 dark:border-slate-800 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Still need help?</h3>
            <p className="text-slate-700 dark:text-slate-400 mb-6 max-w-xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400 text-white rounded-lg font-semibold transition-all"
              >
                Contact Support
                <FiShare2 className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/help"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold transition-all border border-slate-300 dark:border-slate-700"
              >
                Visit Help Center
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}