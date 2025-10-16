"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Please check your email for confirmation.");
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <h1 className="text-3xl mb-10 font-bold">Create an Account</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
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
            <Button type="submit">Sign Up</Button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
