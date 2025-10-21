// src/components/Footer.tsx
"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-teal-400 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-gray-200 transition">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-200 transition">About</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-200 transition">Contact</Link>
            </li>
            <li>
              <Link href="/subscribe" className="hover:text-gray-200 transition">Pricing</Link>
            </li>
          </ul>
        </div>

        {/* FAQ / Support */}
        <div>
          <h3 className="text-xl font-bold mb-4">FAQ & Support</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/help" className="hover:text-gray-200 transition">Help Center</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-200 transition">Contact Us</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gray-200 transition">Terms</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gray-200 transition">Privacy</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition">
              <FaTwitter size={20} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Location / Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Our Location</h3>
          <p>123 Main Street</p>
          <p>City, Country</p>
          <p>Email: support@myportal.com</p>
          <p>Phone: +123 456 7890</p>
        </div>

      </div>

      {/* Bottom Info */}
      <div className="mt-10 border-t border-white/40 pt-6 text-center text-white/80 text-sm">
        &copy; {new Date().getFullYear()} Digital Document Hub. All rights reserved.  
        <Link href="/terms" className="ml-2 hover:text-white transition">Terms</Link> |  
        <Link href="/privacy" className="ml-2 hover:text-white transition">Privacy</Link>
      </div>
    </footer>
  );
}
