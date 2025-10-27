"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 bg-linear-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Get the latest updates, tips, and exclusive offers delivered to your inbox
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  {subscribed ? (
                    "Subscribed! ✓"
                  ) : (
                    <>
                      Subscribe
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-3 group">
                <div className="relative w-12 h-12">
                  <Image
                    src="/Digital-document-logo.png"
                    alt="DigitalStore logo"
                    fill
                    className="object-contain rounded-full group-hover:scale-110 transition-transform duration-300"
                    sizes="48px"
                  />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  DocuVault
                </span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Secure document management made simple. Store, organize, and share your files with confidence.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-linear-to-r hover:from-blue-600 hover:to-teal-500 flex items-center justify-center transition-all duration-300 group border border-white/10"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-gray-400 group-hover:text-white transition-colors" size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-linear-to-r hover:from-blue-600 hover:to-teal-500 flex items-center justify-center transition-all duration-300 group border border-white/10"
                aria-label="Twitter"
              >
                <FaTwitter className="text-gray-400 group-hover:text-white transition-colors" size={18} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-linear-to-r hover:from-blue-600 hover:to-teal-500 flex items-center justify-center transition-all duration-300 group border border-white/10"
                aria-label="Instagram"
              >
                <FaInstagram className="text-gray-400 group-hover:text-white transition-colors" size={18} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-linear-to-r hover:from-blue-600 hover:to-teal-500 flex items-center justify-center transition-all duration-300 group border border-white/10"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-gray-400 group-hover:text-white transition-colors" size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  About
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="mt-1 shrink-0 text-teal-400" size={18} />
                <span className="text-sm">123 Main Street<br />City, Country</span>
              </li>
              <li>
                <a href="mailto:support@digitalstore.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                  <FiMail className="shrink-0 text-teal-400 group-hover:scale-110 transition-transform" size={18} />
                  <span className="text-sm">support@DocuVault.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                  <FiPhone className="shrink-0 text-teal-400 group-hover:scale-110 transition-transform" size={18} />
                  <span className="text-sm">+123 456 7890</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} DocuVault.com All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}