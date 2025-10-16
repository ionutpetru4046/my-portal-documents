"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful!");
      // Refresh session so RootLayout detects the user immediately
      await supabase.auth.getSession();
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) toast.error(error.message);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <h1 className="text-3xl mb-10 font-bold">Document Manager</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Button type="submit">Login</Button>
            <Button variant="outline" type="button" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
