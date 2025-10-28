"use client";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center bg-gray-50">
      <LoginForm className="w-full max-w-md" />
    </main>
  );
}
