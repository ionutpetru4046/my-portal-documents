"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FiCheck, FiArrowRight, FiZap, FiStar, FiFrown, FiGift } from "react-icons/fi";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
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
      if (data.url) window.location.href = data.url;
      else if (data.error) alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Something went wrong with Stripe!");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Starter",
      icon: FiGift,
      price: { monthly: "$0", annual: "$0" },
      period: "Forever Free",
      description: "Perfect for getting started",
      features: [
        "Upload up to 5 files",
        "Basic document viewer",
        "Community support",
        "1 GB storage",
        "Email notifications",
      ],
      cta: "Get Started",
      button: "border-2 border-slate-700 text-slate-300 hover:border-blue-500 hover:bg-blue-500/10",
      paid: false,
      highlight: false,
    },
    {
      name: "Pro",
      icon: FiZap,
      price: { monthly: "$9", annual: "$99" },
      period: billingCycle === "annual" ? "/year" : "/month",
      description: "For growing teams",
      features: [
        "Up to 500 files",
        "Fast file access",
        "Email support (24h response)",
        "50 GB storage",
        "Advanced sharing options",
        "Version history",
        "Document collaboration",
      ],
      cta: "Start Free Trial",
      button: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/20",
      badge: "Most Popular",
      paid: true,
      key: "pro",
      highlight: true,
    },
    {
      name: "Business",
      icon: FiStar,
      price: { monthly: "$29", annual: "$319" },
      period: billingCycle === "annual" ? "/year" : "/month",
      description: "For established companies",
      features: [
        "Unlimited files",
        "Priority support (2h response)",
        "500 GB storage",
        "Advanced analytics",
        "Team management",
        "API access",
        "SSO integration",
        "Custom branding",
      ],
      cta: "Start Free Trial",
      button: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
      paid: true,
      key: "business",
      highlight: false,
    },
    {
      name: "Enterprise",
      icon: FiFrown,
      price: { monthly: "Custom", annual: "Custom" },
      period: "Contact sales",
      description: "For large organizations",
      features: [
        "Everything in Business",
        "Unlimited storage",
        "Dedicated support manager",
        "Custom integrations",
        "Advanced security features",
        "On-premise deployment option",
        "SLA guarantee",
        "Custom workflows",
      ],
      cta: "Contact Sales",
      button: "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border border-slate-600",
      paid: true,
      key: "enterprise",
      highlight: false,
    },
  ];

  const handlePlanClick = async (plan: typeof plans[0]) => {
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }

    if (plan.key === "enterprise") {
      // Open contact form or redirect to sales page
      window.location.href = "/contact";
      return;
    }

    setLoading(true);

    if (plan.paid) {
      await handleCheckout(plan.key!);
    } else {
      // Free plan: update user plan safely
      try {
        if (!user.id) throw new Error("User ID not found");

        const { error } = await supabase
          .from("users")
          .update({ plan: "starter" })
          .eq("id", user.id);

        if (error) {
          console.error("Supabase update error:", error);
          alert(
            "Could not update plan. Make sure the 'plan' column exists in Supabase."
          );
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Something went wrong while updating your plan.");
      }
    }

    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center pt-16 md:pt-20 pb-12 md:pb-16 px-4"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Choose the perfect plan for your needs. Upgrade or downgrade anytime. No hidden fees.
        </p>

        {/* Billing Toggle */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Monthly
          </button>
          <div className="text-slate-400">|</div>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Annual
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
              Save 15%
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="relative max-w-7xl mx-auto px-4 pb-20 md:pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className={`relative rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden group ${
                  plan.highlight
                    ? "md:scale-105 border-2 border-blue-500 bg-slate-900/80 shadow-2xl shadow-blue-500/20"
                    : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  plan.highlight
                    ? "bg-linear-to-br from-blue-500/10 to-purple-500/10"
                    : "bg-linear-to-br from-slate-800/20 to-slate-900/20"
                }`}
                />

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="relative p-6 md:p-8 flex flex-col h-full">
                  {/* Icon & Title */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.highlight
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
                    <p className="text-sm text-slate-400">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">
                        {plan.price[billingCycle]}
                      </span>
                      <span className="text-slate-400 text-sm">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-slate-300 text-sm">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.highlight
                            ? "bg-blue-500/20"
                            : "bg-slate-700"
                        }`}>
                          <FiCheck className={`w-3 h-3 ${
                            plan.highlight ? "text-blue-400" : "text-slate-400"
                          }`} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => handlePlanClick(plan)}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 md:py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${plan.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        {plan.cta}
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  {plan.paid && !plan.key?.includes("enterprise") && (
                    <p className="text-center text-xs text-slate-500 mt-4">
                      14-day free trial. No credit card required.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* FAQ / Trust Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto px-4 pb-20 text-center"
      >
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-white mb-2">Can I change plans?</h4>
              <p className="text-slate-400 text-sm">Yes! You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">What about refunds?</h4>
              <p className="text-slate-400 text-sm">We offer a 30-day money-back guarantee if you're not satisfied with your plan.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-slate-400 text-sm">Yes! All paid plans include a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-400 text-sm">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative text-center pb-20"
      >
        <p className="text-slate-400 text-lg">
          Questions? <a href="/contact" className="text-blue-400 hover:text-blue-300 transition">Contact our sales team</a>
        </p>
      </motion.div>
    </main>
  );
}