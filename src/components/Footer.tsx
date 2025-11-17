"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowRight, FiCheck, FiBook, FiFileText, FiGrid, FiHelpCircle, FiHome, FiDollarSign, FiUsers, FiMessageCircle, FiLock, FiShield, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setTimeout(() => {
        setSubscribed(true);
        setLoading(false);
        setTimeout(() => {
          setSubscribed(false);
          setEmail("");
        }, 3000);
      }, 500);
    }
  };

  const footerLinks = [
    { icon: FiHome, label: "Home", href: "/", color: "blue" },
    { icon: FiUsers, label: "About", href: "/about", color: "purple" },
    { icon: FiDollarSign, label: "Pricing", href: "/subscribe", color: "cyan" },
    { icon: FiMessageCircle, label: "Contact", href: "/contact", color: "blue" },
  ];

  const resourcesData = [
    { icon: FiBook, href: "/documentation", label: "Documentation", color: "blue" },
    { icon: FiFileText, href: "/tutorials", label: "Tutorials", color: "purple" },
    { icon: FiGrid, href: "/templates", label: "Templates", color: "cyan" },
    { icon: FiHelpCircle, href: "/faq", label: "FAQ", color: "blue" },
  ];

  const supportLinks = [
    { icon: FiHelpCircle, label: "Help Center", href: "/help", color: "blue" },
    { icon: FiMessageCircle, label: "Contact Us", href: "/contact", color: "purple" },
    { icon: FiFileText, label: "Terms of Service", href: "/terms", color: "cyan" },
    { icon: FiShield, label: "Privacy Policy", href: "/privacy", color: "blue" },
  ];

  const securityBadges = [
    {
      name: "GDPR",
      icon: "🔒",
      title: "GDPR Compliant",
      description: "Full GDPR compliance for data protection",
      href: "/privacy",
    },
    {
      name: "SOC 2",
      icon: "✓",
      title: "SOC 2 Type II",
      description: "Enterprise-grade security audit",
      href: "/security",
    },
    {
      name: "SSL",
      icon: "🔐",
      title: "SSL Encrypted",
      description: "256-bit encryption for all data",
      href: "/security",
    },
    {
      name: "ISO",
      icon: "⭐",
      title: "ISO 27001",
      description: "Information security certified",
      href: "/security",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string }> = {
      blue: { text: "text-blue-400" },
      purple: { text: "text-purple-400" },
      cyan: { text: "text-cyan-400" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <footer className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border-t border-gray-200 dark:border-slate-800 transition-colors">
      {/* Trust & Security Badges Section */}
      <div className="border-b border-gray-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Enterprise-Grade Security
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Your data is protected by industry-leading security standards and certifications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {securityBadges.map((badge, idx) => (
              <motion.a
                key={badge.name}
                href={badge.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer h-full flex flex-col items-center text-center">
                  <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {badge.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                    {badge.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold">Learn more</span>
                    <FiArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Security Features Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <FiLock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">End-to-End Encryption</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">AES-256 encryption standard</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FiCheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">99.9% Uptime SLA</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Enterprise reliability</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <FiShield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Regular Audits</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Third-party security audits</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            <motion.div 
              className="text-center lg:text-left flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400">
                Stay Updated
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base">
                Get the latest updates, tips, and exclusive offers delivered to your inbox
              </p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubscribe} 
              className="w-full lg:w-auto flex-1 lg:flex-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribed}
                  className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all disabled:opacity-50"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={subscribed || loading}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {subscribed ? (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <FiCheck className="w-5 h-5" />
                      Subscribed!
                    </motion.div>
                  ) : loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Subscribe
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
          {/* Brand Section */}
          <motion.div 
            className="sm:col-span-2 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src="/Digital-document-logo.png"
                    alt="DocuVault logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  iDocReminder
                </span>
              </div>
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
              Secure document management made simple. Store, organize, and share your files with confidence.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: FaFacebookF, href: "https://www.facebook.com", label: "Facebook" },
                { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
                { icon: FaInstagram, href: "https://www.instagram.com", label: "Instagram" },
                { icon: FaLinkedinIn, href: "https://www.linkedin.com", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-purple-500 group"
                  aria-label={label}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-gray-600 dark:text-slate-400 group-hover:text-white transition-colors" size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white transition-colors">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => {
                const Icon = link.icon;
                const colorClass = getColorClasses(link.color);
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group text-sm md:text-base font-medium"
                    >
                      <motion.span 
                        className="w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 transition-all duration-300 group-hover:w-2"
                        whileHover={{ width: 8 }}
                      />
                      <Icon className={`w-4 h-4 ${colorClass.text} flex-shrink-0`} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white transition-colors">Resources</h3>
            <ul className="space-y-3">
              {resourcesData.map((resource) => {
                const Icon = resource.icon;
                const colorClass = getColorClasses(resource.color);
                return (
                  <li key={resource.href}>
                    <Link 
                      href={resource.href} 
                      className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group text-sm md:text-base font-medium"
                    >
                      <motion.span 
                        className="w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 transition-all duration-300 group-hover:w-2"
                        whileHover={{ width: 8 }}
                      />
                      <Icon className={`w-4 h-4 ${colorClass.text} flex-shrink-0`} />
                      <span>{resource.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white transition-colors">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => {
                const Icon = link.icon;
                const colorClass = getColorClasses(link.color);
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-slate-400 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors inline-flex items-center gap-2 group text-sm md:text-base font-medium"
                    >
                      <motion.span 
                        className="w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 transition-all duration-300 group-hover:w-2"
                        whileHover={{ width: 8 }}
                      />
                      <Icon className={`w-4 h-4 ${colorClass.text} flex-shrink-0`} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white transition-colors">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <div className="mt-1 w-5 h-5 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <FiMapPin className="text-blue-400" size={16} />
                </div>
                <span className="text-sm md:text-base leading-relaxed">123 Main Street<br />City, Country</span>
              </li>
              <li>
                <a 
                  href="mailto:support@DocuVault.com" 
                  className="flex items-center gap-3 text-slate-400 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group font-medium"
                >
                  <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition">
                    <FiMail className="text-purple-400" size={16} />
                  </div>
                  <span className="text-sm md:text-base">support@DocuStore.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="flex items-center gap-3 text-slate-400 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group font-medium"
                >
                  <div className="w-5 h-5 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/30 transition">
                    <FiPhone className="text-cyan-400" size={16} />
                  </div>
                  <span className="text-sm md:text-base">+123 456 7890</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-center sm:text-left order-2 sm:order-1">
              &copy; {new Date().getFullYear()} DocuVault. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2 flex-wrap justify-center sm:justify-end">
              <Link href="/terms" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Terms
              </Link>
              <span className="text-gray-400 dark:text-slate-600">|</span>
              <Link href="/privacy" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Privacy
              </Link>
              <span className="text-gray-400 dark:text-slate-600">|</span>
              <Link href="/cookies" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Cookies
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}