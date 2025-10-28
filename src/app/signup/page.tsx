"use client";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <SignupForm className="w-full max-w-md" />
    </main>
  );
}
