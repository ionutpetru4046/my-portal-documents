"use client";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <h1 className="text-3xl mb-10 font-bold">Create an Account</h1>
      <SignupForm className="w-full max-w-md" />
    </main>
  );
}
