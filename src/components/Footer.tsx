"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-blue-600 to-teal-400 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Social Media */}
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>

          <div className="relative w-32 h-32">
            <Image
              src="/Digital-document-logo.png"
              alt="DocStore logo"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain rounded-[70px]"
              priority
            />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-gray-200 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-200 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-200 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/subscribe"
                className="hover:text-gray-200 transition"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* FAQ / Support */}
        <div>
          <h3 className="text-xl font-bold mb-4">FAQ & Support</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="hover:text-gray-200 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-gray-200 transition">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gray-200 transition">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gray-200 transition">
                Privacy
              </Link>
            </li>
          </ul>
        </div>

        {/* Location / Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Our Location</h3>
          <p className="text-white/90">123 Main Street</p>
          <p className="text-white/90">City, Country</p>
          <p className="text-white/90">Email: support@DocuValut.com</p>
          <p className="text-white/90">Phone: +123 456 7890</p>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-10 border-t border-white/40 pt-6 text-center text-white/80 text-sm">
        &copy; {new Date().getFullYear()} DocuVault.com All rights reserved.
        <Link href="/terms" className="ml-2 hover:text-white transition">
          Terms
        </Link>{" "}
        |
        <Link href="/privacy" className="ml-2 hover:text-white transition">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
