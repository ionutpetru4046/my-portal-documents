"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Make sure you have this

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const isLoggedIn = Boolean(user);

  const handleCheckout = async (plan: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      console.log("Stripe response:", data);

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Upload up to 5 files",
        "Basic document viewer",
        "Community support",
      ],
      button: "border border-gray-400 text-gray-800 hover:bg-gray-100",
      paid: false,
    },
    {
      name: "Pro",
      price: "$2 / month",
      features: [
        "Up to 500 files",
        "Fast file access",
        "Email support",
        "Auto backups",
      ],
      button: "bg-blue-600 text-white hover:bg-blue-700",
      badge: "Most Popular",
      paid: true,
      key: "pro",
    },
    {
      name: "Premium",
      price: "$15 / month",
      features: [
        "Unlimited uploads",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
      ],
      button: "bg-purple-600 text-white hover:bg-purple-700",
      paid: true,
      key: "premium",
    },
  ];

  const handlePlanClick = async (plan: typeof plans[number]) => {
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }

    setLoading(true);

    if (plan.paid) {
      // Paid plan goes through Stripe checkout
      await handleCheckout(plan.key!);
    } else {
      // Free plan: update user in Supabase and redirect to dashboard
      try {
        const { error } = await supabase
          .from("users") // your table name
          .update({ plan: "free" })
          .eq("id", user.id);

        if (error) {
          console.error("Supabase update error:", error.message);
          alert("Could not update plan. Try again.");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      }
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          Get started today. Upgrade anytime. Simple, flexible, and transparent
          pricing to grow with you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative border rounded-2xl shadow-lg hover:shadow-xl bg-white p-8 flex flex-col ${
              plan.paid && plan.name === "Pro" ? "border-blue-600" : "border-gray-300"
            }`}
          >
            {plan.badge && (
              <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {plan.badge}
              </span>
            )}

            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              {plan.name}
            </h2>
            <p className="text-3xl font-bold text-center mb-6">{plan.price}</p>

            <ul className="space-y-3 mb-8 text-gray-700">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanClick(plan)}
              disabled={loading}
              className={`mt-auto py-3 rounded-xl font-medium transition ${plan.button}`}
            >
              {loading && plan.paid ? "Redirecting..." : "Choose Plan"}
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-gray-400 text-lg mt-12">
        Cancel or change your plan anytime.
      </p>
    </main>
  );
}
