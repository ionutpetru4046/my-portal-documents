"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowRight, FiCheck } from "react-icons/fi";
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
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/subscribe" },
    { label: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            <motion.div 
              className="text-center lg:text-left flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Stay Updated
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
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
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={subscribed || loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
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
                <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src="/Digital-document-logo.png"
                    alt="DocuVault logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  DocuVault
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
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 border border-slate-700 hover:border-purple-500 group"
                  aria-label={label}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-slate-400 group-hover:text-white transition-colors" size={18} />
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
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group text-sm md:text-base"
                  >
                    <motion.span 
                      className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-2"
                      whileHover={{ width: 8 }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group text-sm md:text-base"
                  >
                    <motion.span 
                      className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-2"
                      whileHover={{ width: 8 }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <div className="mt-1 w-5 h-5 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-blue-400" size={16} />
                </div>
                <span className="text-sm md:text-base leading-relaxed">123 Main Street<br />City, Country</span>
              </li>
              <li>
                <a 
                  href="mailto:support@DocuVault.com" 
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition">
                    <FiMail className="text-purple-400" size={16} />
                  </div>
                  <span className="text-sm md:text-base">support@DocuVault.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-5 h-5 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/30 transition">
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
      <div className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-center sm:text-left order-2 sm:order-1">
              &copy; {new Date().getFullYear()} DocuVault. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2 flex-wrap justify-center sm:justify-end">
              <Link href="/terms" className="hover:text-white transition-colors hover:text-blue-400">
                Terms
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/privacy" className="hover:text-white transition-colors hover:text-blue-400">
                Privacy
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/cookies" className="hover:text-white transition-colors hover:text-blue-400">
                Cookies
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}