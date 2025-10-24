"use client";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <LoginForm className="w-full max-w-md" />
    </main>
  );
}
