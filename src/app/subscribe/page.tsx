"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FiCheck, FiArrowRight, FiZap, FiStar, FiFrown, FiGift, FiTrendingUp, FiShield, FiHeadphones, FiLock, FiUsers, FiDatabase } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";

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
        "Basic sharing",
      ],
      cta: "Get Started",
      button: "border-2 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-500/10 dark:hover:border-blue-500 dark:hover:bg-blue-500/10",
      paid: false,
      highlight: false,
    },
    {
      name: "Pro",
      icon: FiZap,
      price: { monthly: "$10", annual: "$120" },
      period: billingCycle === "annual" ? "/year" : "/month",
      description: "For growing teams",
      features: [
        "Up to 500 files",
        "Fast file access",
        "Email support (24h response)",
        "50 GB storage",
        "Advanced sharing options",
        "Version history (30 days)",
        "Document collaboration",
        "Priority email support",
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
      price: { monthly: "$45", annual: "$540" },
      period: billingCycle === "annual" ? "/year" : "/month",
      description: "For established companies",
      features: [
        "Unlimited files",
        "Priority support (2h response)",
        "500 GB storage",
        "Advanced analytics",
        "Team management (up to 10)",
        "API access",
        "SSO integration",
        "Custom branding",
        "Unlimited version history",
        "Phone support",
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
        "SLA guarantee (99.9%)",
        "Custom workflows",
        "Advanced audit logs",
        "Team management (unlimited)",
      ],
      cta: "Contact Sales",
      button: "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border border-slate-600",
      paid: true,
      key: "enterprise",
      highlight: false,
    },
  ];

  const comparisonFeatures = [
    { name: "Storage", icon: FiDatabase },
    { name: "Users", icon: FiUsers },
    { name: "Security", icon: FiLock },
    { name: "Support", icon: FiHeadphones },
  ];

  const paymentMethods = [
    { icon: FaCcVisa, label: "Visa", color: "text-blue-600 dark:text-blue-400" },
    { icon: FaCcMastercard, label: "Mastercard", color: "text-red-600 dark:text-red-400" },
    { icon: FaCcAmex, label: "Amex", color: "text-blue-500 dark:text-blue-400" },
    { icon: FaCcPaypal, label: "PayPal", color: "text-blue-700 dark:text-blue-500" },
  ];

  const handlePlanClick = async (plan: typeof plans[0]) => {
    if (!isLoggedIn) {
      router.push("auth/signup");
      return;
    }

    if (plan.key === "enterprise") {
      window.location.href = "/contact";
      return;
    }

    setLoading(true);

    if (plan.paid) {
      await handleCheckout(plan.key!);
    } else {
      try {
        if (!user || !user.id) throw new Error("User ID not found");

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
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center pt-16 md:pt-20 pb-8 md:pb-12 px-4"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text transition-colors">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-2 transition-colors">
          Choose the perfect plan for your needs. Upgrade or downgrade anytime. No hidden fees.
        </p>
        <p className="text-sm text-gray-500 dark:text-slate-500">Join 1000+ organizations trusting DocuVault for secure document management</p>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div 
        className="flex items-center justify-center gap-4 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            billingCycle === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-400 hover:bg-gray-300 dark:hover:bg-slate-700"
          }`}
        >
          Monthly
        </button>
        <div className="text-gray-600 dark:text-slate-400">|</div>
        <button
          onClick={() => setBillingCycle("annual")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            billingCycle === "annual"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-400 hover:bg-gray-300 dark:hover:bg-slate-700"
          }`}
        >
          Annual
          <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
            Save 15%
          </span>
        </button>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16 px-4"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
          <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>SSL Encrypted</span>
        </div>
        <div className="hidden sm:block w-px h-5 bg-gray-300 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
          <FiTrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>99.9% Uptime</span>
        </div>
        <div className="hidden sm:block w-px h-5 bg-gray-300 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
          <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span>30-Day Money Back</span>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="relative max-w-7xl mx-auto px-4 pb-16 md:pb-20">
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
                    ? "md:scale-105 border-2 border-blue-500 bg-white/80 dark:bg-slate-900/80 shadow-2xl shadow-blue-500/20"
                    : "border-gray-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:border-gray-400 dark:hover:border-slate-600"
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                    : "bg-gradient-to-br from-gray-100/20 dark:from-slate-800/20 to-gray-200/20 dark:to-slate-900/20"
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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      plan.highlight
                        ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 group-hover:bg-gray-300 dark:group-hover:bg-slate-700"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">{plan.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-slate-400 transition-colors">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white transition-colors">
                        {plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-600 dark:text-slate-400 text-sm transition-colors">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-sm transition-colors">
                        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-colors ${
                          plan.highlight
                            ? "bg-blue-500/20"
                            : "bg-gray-300 dark:bg-slate-700"
                        }`}>
                          <FiCheck className={`w-3 h-3 transition-colors ${
                            plan.highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-slate-400"
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
                    <p className="text-center text-xs text-gray-500 dark:text-slate-500 mt-4 transition-colors">
                      14-day free trial. No credit card required.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Payment Methods Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto px-4 pb-16 md:pb-20"
      >
        <div className="bg-white/50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-2xl backdrop-blur-xl p-8 md:p-12 transition-colors text-center">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            Secure Payment Methods
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.label} className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <Icon className={`h-6 w-6 ${method.color}`} />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">{method.label}</p>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            All transactions are encrypted and processed securely
          </p>
        </div>
      </motion.div>

      {/* FAQ / Trust Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto px-4 pb-20 text-center"
      >
        <div className="bg-white/50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-2xl backdrop-blur-xl p-8 md:p-12 transition-colors">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Can I change plans?</h4>
              <p className="text-gray-700 dark:text-slate-400 text-sm transition-colors">Yes! You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">What about refunds?</h4>
              <p className="text-gray-700 dark:text-slate-400 text-sm transition-colors">We offer a 30-day money-back guarantee if you are not satisfied with your plan.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Is there a free trial?</h4>
              <p className="text-gray-700 dark:text-slate-400 text-sm transition-colors">Yes! All paid plans include a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">What payment methods do you accept?</h4>
              <p className="text-gray-700 dark:text-slate-400 text-sm transition-colors">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Is there a student discount?</h4>
              <p className="text-gray-700 dark:text-slate-400 text-sm transition-colors">Yes! Students get 50% off any paid plan. Just verify your .edu email address.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Can I get a custom plan?</h4>
              <p className="text-gray-700 dark:text-slate-400 text-sm transition-colors">Absolutely! Contact our sales team for custom pricing tailored to your needs.</p>
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
        <p className="text-gray-600 dark:text-slate-400 text-lg transition-colors">
          Still have questions? <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition font-semibold">Contact our sales team</a>
        </p>
      </motion.div>
    </main>
  );
}