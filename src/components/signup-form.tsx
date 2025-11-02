"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signup successful! Check your email for confirmation.");
      router.push("/login");
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    setLoading(false);
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-slate-950 relative overflow-hidden transition-colors" {...props}>
      {/* Content */}
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Get Started</h1>
          <p className="text-gray-600 dark:text-slate-400 transition-colors">Create your account and start managing documents</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-colors">
            {/* Gradient Header */}
            <div className="h-1 bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500" />

            <div className="p-8 md:p-10 space-y-6">
              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                    <FiMail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-500 transition-colors">We won&apos;t share your email with anyone else.</p>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                    <FiLock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-500 transition-colors">Must be at least 8 characters long.</p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-cyan-400" />
                    Confirm Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-500 transition-colors">Please confirm your password.</p>
                </div>

                {/* Create Account Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-slate-900 text-slate-400 font-medium">or</span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <motion.button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {loading ? "Redirecting..." : "Sign up with Google"}
                </motion.button>
              </form>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-slate-800">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link 
            href="/" 
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors flex items-center justify-center gap-2 group"
          >
            <span>←</span>
            <span className="group-hover:underline">Back to home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}