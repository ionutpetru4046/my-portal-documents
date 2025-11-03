'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHelpCircle, FiFileText, FiUser, FiSettings, FiSearch, FiChevronDown, FiArrowRight, FiMail, FiMessageCircle, FiBook, FiLock, FiUpload, FiShare2, FiBell, FiTrash2, FiDownload, FiClock, FiShield } from "react-icons/fi";

const categories = [
  {
    name: "Getting Started",
    icon: FiUser,
    color: "blue",
    articles: [
      {
        title: "How to create an account",
        content: "Click Sign Up and follow the steps to create your DocuVault account. You'll need to provide your email address and create a secure password. After signing up, confirm your email address to activate your account and gain full access to all features.",
      },
      {
        title: "How to set up your profile",
        content: "Navigate to your Profile settings by clicking on your avatar in the top right corner. Upload a profile picture to personalize your account, add your full name, and fill out any additional personal details you'd like to share.",
      },
      {
        title: "Navigating the dashboard",
        content: "The dashboard is your central hub. You'll see your document categories, recent uploads, and quick access to your most-used features. Use the sidebar to navigate between different sections.",
      },
      {
        title: "Understanding your storage quota",
        content: "Your storage limit depends on your plan. The Starter plan includes 1 GB, Pro includes 50 GB, and Business includes 500 GB. Monitor your usage in Settings > Storage. Upgrade your plan to get more space.",
      },
    ],
  },
  {
    name: "Account & Security",
    icon: FiSettings,
    color: "purple",
    articles: [
      {
        title: "Resetting your password",
        content: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link. Follow the link and create a new password. For security reasons, never share your password with anyone.",
      },
      {
        title: "Managing email notifications",
        content: "Go to Settings > Notifications to customize your preferences. You can control notifications for document uploads, expirations, reminders, and more. Choose to receive notifications immediately or in a daily digest.",
      },
      {
        title: "Enabling two-factor authentication",
        content: "For added security, enable 2FA in your Account Settings. You'll be required to verify your identity using an authenticator app when logging in from new devices.",
      },
      {
        title: "Managing active sessions",
        content: "View all your active login sessions in Security Settings. You can log out of specific devices remotely or log out of all sessions at once if you suspect unauthorized access.",
      },
      {
        title: "Data encryption and privacy",
        content: "All your documents are encrypted with AES-256 military-grade encryption both in transit and at rest. We follow GDPR and CCPA compliance standards. Your data is never sold or shared with third parties.",
      },
    ],
  },
  {
    name: "Documents & Uploads",
    icon: FiFileText,
    color: "cyan",
    articles: [
      {
        title: "Uploading documents",
        content: "Navigate to the Dashboard and click 'Upload Document'. You can upload up to 5GB per file depending on your plan. Drag and drop files or click to browse. Supported formats include PDF, Word, Excel, images, videos, and more.",
      },
      {
        title: "Organizing documents with categories",
        content: "Create custom categories to organize your documents. Use our predefined categories like Cars, Personal, Insurance, or create your own. Drag and drop documents between categories to reorganize them.",
      },
      {
        title: "Setting expiration dates",
        content: "When uploading a document, set an expiration date in the details section. DocuVault will notify you before the date and can automatically archive or delete expired documents based on your preferences.",
      },
      {
        title: "Deleting documents",
        content: "Click on a document and select the delete icon. Deleted documents are moved to Trash and can be recovered within 30 days. After 30 days, they're permanently removed from our servers.",
      },
      {
        title: "Searching for documents",
        content: "Use the search bar to find documents by name, category, or content. Our advanced search algorithm helps you locate files quickly across all your documents.",
      },
      {
        title: "Downloading your documents",
        content: "Click the download icon next to any document to save it to your device. You can also batch download multiple documents at once by selecting them and using the bulk download option.",
      },
    ],
  },
  {
    name: "Sharing & Collaboration",
    icon: FiShare2,
    color: "green",
    articles: [
      {
        title: "Sharing documents with others",
        content: "Click the Share button on a document to generate a secure shareable link. You can set permissions (view-only or download), add password protection, and set an expiration date for the link.",
      },
      {
        title: "Managing share permissions",
        content: "Control who can view, download, or comment on shared documents. Revoke access at any time by deleting the share link. You can create multiple share links with different permission levels.",
      },
      {
        title: "Collaborating with team members",
        content: "Invite team members to collaborate on documents. Assign different roles like Editor, Viewer, or Commenter. Track changes and see who modified what and when.",
      },
      {
        title: "Public vs. Private sharing",
        content: "Keep documents private by default. Create public links only when needed. Private documents are only accessible to you and invited collaborators with specific permissions.",
      },
    ],
  },
  {
    name: "Reminders & Expiration",
    icon: FiBell,
    color: "orange",
    articles: [
      {
        title: "Setting document reminders",
        content: "Set reminders for important documents. You'll receive notifications on the reminder date to review or take action on documents. Reminders can be set for renewal dates, review dates, or any other important milestone.",
      },
      {
        title: "Understanding expiration status",
        content: "DocuVault categorizes documents as 'Active', 'Expiring Soon', or 'Expired'. Documents expiring within 7 days appear in your alerts. Take action before they expire to avoid losing track.",
      },
      {
        title: "Bulk managing expirations",
        content: "For Premium and Business plans, bulk edit multiple documents' expiration dates at once. Select documents, set a new date, and apply to all selected items.",
      },
      {
        title: "Auto-renewal and archival",
        content: "Set documents to auto-renew on expiration dates. Alternatively, archive old documents to keep them organized but easily retrievable. Archived documents don't count toward your storage quota.",
      },
    ],
  },
  {
    name: "Pricing & Plans",
    icon: FiLock,
    color: "pink",
    articles: [
      {
        title: "Understanding our pricing plans",
        content: "DocuVault offers four plans: Starter (free), Pro ($10/month), Business ($45/month), and Enterprise (custom). Compare features and storage limits on our Pricing page to find the plan that's right for you.",
      },
      {
        title: "Upgrading your plan",
        content: "Upgrade anytime from your Account Settings. Changes take effect immediately, and we'll prorate any charges based on your current billing cycle.",
      },
      {
        title: "Managing subscriptions and billing",
        content: "View your billing history, update payment methods, and manage your subscription in the Billing section. We support all major credit cards, PayPal, and bank transfers.",
      },
      {
        title: "Canceling your subscription",
        content: "You can cancel your subscription anytime. Your account will remain active until the end of your billing period. Downgrade to our free Starter plan instead of canceling to keep your documents.",
      },
      {
        title: "Getting the most value from your plan",
        content: "Make use of all features included in your plan. Check the feature comparison to understand what you have access to. Contact support if you need help maximizing your DocuVault experience.",
      },
    ],
  },
  {
    name: "Troubleshooting",
    icon: FiShield,
    color: "red",
    articles: [
      {
        title: "Upload issues and solutions",
        content: "If your upload fails, check your internet connection and file size. Ensure the file format is supported. Try clearing your browser cache or using a different browser. Contact support if issues persist.",
      },
      {
        title: "Can't access my account",
        content: "Verify you're using the correct email. Use the 'Forgot Password' option to reset your password. Check if your account has been deactivated due to inactivity (accounts are deactivated after 2 years of no login).",
      },
      {
        title: "Sync and backup issues",
        content: "DocuVault automatically backs up all documents. If you suspect sync issues, refresh your browser or log out and back in. Clear your browser cache and try again.",
      },
      {
        title: "Browser compatibility",
        content: "DocuVault works best with Chrome, Firefox, Safari, and Edge. For optimal performance, keep your browser updated. Some features may not work in older browser versions.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  // Filter articles across all categories
  const filteredCategories = categories.map((cat) => {
    const filteredArticles = cat.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.content.toLowerCase().includes(search.toLowerCase())
    );
    return { ...cat, articles: filteredArticles };
  }).filter(cat => cat.articles.length > 0);

  const allResults = filteredCategories.flatMap(cat => 
    cat.articles.map(article => ({ ...article, category: cat.name }))
  );

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
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 dark:from-blue-500/20 dark:to-blue-600/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 dark:from-purple-500/20 dark:to-purple-600/20 dark:border-purple-500/30 text-purple-600 dark:text-purple-400",
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 dark:from-cyan-500/20 dark:to-cyan-600/20 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
    green: "from-green-500/20 to-green-600/20 border-green-500/30 dark:from-green-500/20 dark:to-green-600/20 dark:border-green-500/30 text-green-600 dark:text-green-400",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30 dark:from-orange-500/20 dark:to-orange-600/20 dark:border-orange-500/30 text-orange-600 dark:text-orange-400",
    pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 dark:from-pink-500/20 dark:to-pink-600/20 dark:border-pink-500/30 text-pink-600 dark:text-pink-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/30 dark:from-red-500/20 dark:to-red-600/20 dark:border-red-500/30 text-red-600 dark:text-red-400",
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; bg: string }> = {
      blue: { icon: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/20 dark:bg-blue-500/20" },
      purple: { icon: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/20 dark:bg-purple-500/20" },
      cyan: { icon: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/20 dark:bg-cyan-500/20" },
      green: { icon: "text-green-600 dark:text-green-400", bg: "bg-green-500/20 dark:bg-green-500/20" },
      orange: { icon: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/20 dark:bg-orange-500/20" },
      pink: { icon: "text-pink-600 dark:text-pink-400", bg: "bg-pink-500/20 dark:bg-pink-500/20" },
      red: { icon: "text-red-600 dark:text-red-400", bg: "bg-red-500/20 dark:bg-red-500/20" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
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
      <div className="fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[length:60px_60px] pointer-events-none -z-10" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-6 mx-auto"
          >
            <FiHelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors">
            Find guides, tutorials, and answers to common questions about DocuVault.
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
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 pointer-events-none transition-colors" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-4 pl-12 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Results Counter */}
        {search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-slate-400 text-sm mb-8 transition-colors"
          >
            Found {allResults.length} result{allResults.length !== 1 ? 's' : ''} for "{search}"
          </motion.p>
        )}

        {/* Categories Grid */}
        {search ? (
          // Search Results View
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 mb-12"
          >
            {allResults.length > 0 ? (
              allResults.map((article, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="backdrop-blur-xl bg-white/50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-700 rounded-xl overflow-hidden transition-all group"
                >
                  <button
                    onClick={() => setExpandedArticle(expandedArticle === `search-${idx}` ? null : `search-${idx}`)}
                    className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-slate-800/30 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-slate-500 font-medium mb-1 transition-colors">{article.category}</p>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedArticle === `search-${idx}` ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="w-5 h-5 text-gray-400 dark:text-slate-400 flex-shrink-0 ml-4 transition-colors" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedArticle === `search-${idx}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 py-4 border-t border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/20 transition-colors"
                      >
                        <p className="text-gray-700 dark:text-slate-400 leading-relaxed transition-colors">{article.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FiSearch className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-4 transition-colors" />
                <p className="text-gray-600 dark:text-slate-400 text-lg transition-colors">No articles found for "{search}"</p>
                <p className="text-gray-500 dark:text-slate-500 text-sm mt-2 transition-colors">Try different keywords or browse all categories below.</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Categories View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-12 mb-16"
          >
            {categories.map((category, catIdx) => {
              const Icon = category.icon;
              const colorClass = colorMap[category.color as keyof typeof colorMap];
              const colorClasses = getColorClasses(category.color);

              return (
                <motion.div
                  key={catIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} border flex items-center justify-center transition-colors`}>
                      <Icon className={`w-5 h-5 ${colorClasses.icon}`} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                      {category.name}
                    </h2>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-3"
                  >
                    {category.articles.map((article, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="backdrop-blur-xl bg-white/50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-700 rounded-xl overflow-hidden transition-all group"
                      >
                        <button
                          onClick={() => setExpandedArticle(expandedArticle === `${catIdx}-${idx}` ? null : `${catIdx}-${idx}`)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-800/30 transition-colors text-left"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {article.title}
                          </h3>
                          <motion.div
                            animate={{ rotate: expandedArticle === `${catIdx}-${idx}` ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronDown className="w-5 h-5 text-gray-400 dark:text-slate-400 flex-shrink-0 ml-4 transition-colors" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedArticle === `${catIdx}-${idx}` && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-6 py-4 border-t border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/20 transition-colors"
                            >
                              <p className="text-gray-700 dark:text-slate-400 leading-relaxed transition-colors">{article.content}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-cyan-500/10 border border-gray-300 dark:border-slate-800 rounded-2xl p-8 md:p-12 text-center transition-colors">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-6"
            >
              <FiMessageCircle className="w-7 h-7 text-blue-600 dark:text-blue-400 transition-colors" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-xl mx-auto transition-colors">
              Our support team is available 24/7 to answer your questions and help you get the most out of DocuVault.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:support@DocuVault.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg group"
              >
                <FiMail className="w-5 h-5" />
                Email Support
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all"
              >
                <FiMessageCircle className="w-5 h-5" />
                Contact Form
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all"
              >
                <FiBook className="w-5 h-5" />
                FAQ
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}