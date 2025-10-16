"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-bold text-green-700 mb-6">
        🎉 Subscription Successful!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for subscribing. You can now enjoy all the features!
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
      >
        Go to Homepage
      </Link>
    </main>
  );
}
