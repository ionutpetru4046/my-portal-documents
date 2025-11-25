"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("Callback page loaded");
        console.log("Full URL:", typeof window !== "undefined" ? window.location.href : "N/A");
        console.log("Search params:", searchParams.toString());
        console.log("Hash:", typeof window !== "undefined" ? window.location.hash : "N/A");
        
        // First, check if Supabase already handled the OAuth automatically
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Existing session check:", existingSession ? "Found" : "Not found", sessionError);
        
        if (existingSession && existingSession.user) {
          console.log("Session already exists:", existingSession.user.email);
          toast.success("Successfully signed in with Google!");
          router.refresh();
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
          return;
        }

        // If no existing session, try to get code from URL
        let code = searchParams.get("code");
        
        // Also check hash fragment
        if (!code && typeof window !== "undefined") {
          const hash = window.location.hash;
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            code = hashParams.get("code") || code;
          }
        }
        
        // Also check full URL for code parameter
        if (!code && typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          code = urlParams.get("code") || code;
        }
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) {
          const errorMsg = errorDescription || errorParam;
          console.error("OAuth error:", errorParam, errorDescription);
          setError(errorMsg);
          toast.error(`OAuth error: ${errorMsg}`);
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
          return;
        }

        if (code) {
          console.log("Exchanging code for session...");
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("Exchange error:", exchangeError);
            setError(exchangeError.message);
            toast.error(`Failed to exchange code: ${exchangeError.message}`);
            setTimeout(() => {
              router.push("/auth/login?error=exchange_failed");
            }, 2000);
            return;
          }

          if (!data.session || !data.user) {
            console.error("No session or user in response:", data);
            setError("No session created");
            toast.error("No session created");
            setTimeout(() => {
              router.push("/auth/login?error=no_session");
            }, 2000);
            return;
          }

          console.log("Session created successfully:", data.user.email);
          toast.success("Successfully signed in with Google!");
          router.refresh();
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
          return;
        }

        console.log("No code found, checking for session...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { session: delayedSession } } = await supabase.auth.getSession();
        if (delayedSession && delayedSession.user) {
          console.log("Session found after delay:", delayedSession.user.email);
          toast.success("Successfully signed in with Google!");
          router.refresh();
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
          return;
        }

        console.error("No code and no session found");
        setError("Unable to complete sign in. Please try again.");
        toast.error("Unable to complete sign in");
        setTimeout(() => {
          router.push("/auth/login?error=no_session");
        }, 2000);
      } catch (err) {
        console.error("Callback error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        toast.error(`An error occurred: ${errorMessage}`);
        setTimeout(() => {
          router.push("/auth/login?error=callback_error");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-500 font-semibold mb-2">Error</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <p className="text-gray-400 text-xs">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Completing sign in with Google...</p>
        <p className="text-gray-400 text-xs mt-2">Please wait...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Completing sign in with Google...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}