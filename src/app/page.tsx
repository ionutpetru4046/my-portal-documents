"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield, FiUpload, FiBell, FiCheck, FiUsers, FiLock, FiZap } from "react-icons/fi";
import { useUser } from "@/context/UserContext";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      router.push("auth/login");
    }
  };
  const features = [
    {
      icon: FiShield,
      title: "Secure by Default",
      description: "Bank-level encryption and robust access controls. Your documents are always protected.",
      color: "blue",
    },
    {
      icon: FiUpload,
      title: "Effortless Uploads",
      description: "Drag & drop, quick previews, and smart organization for your files.",
      color: "purple",
    },
    {
      icon: FiBell,
      title: "Smart Reminders",
      description: "Set expiration dates and reminders so nothing falls through the cracks.",
      color: "cyan",
    },
  ];

  const benefits = [
    {
      title: "Admin Insights",
      description: "See user document counts, expirations, and act quickly with filters.",
      link: "/admin/expirations",
      linkText: "Explore Expirations",
      icon: FiUsers,
    },
    {
      title: "Privacy First",
      description: "Your content stays yours. Fine-grained access and share controls.",
      link: "/privacy",
      linkText: "Read Privacy",
      icon: FiLock,
    },
  ];

  const stats = [
    { number: "100K+", label: "Documents Secured" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" },
  ];

  const companies = [
    { name: "TechCorp", logo: "💼" },
    { name: "FinanceHub", logo: "💰" },
    { name: "LegalEase", logo: "⚖️" },
    { name: "CloudSync", logo: "☁️" },
    { name: "SecureVault", logo: "🔐" },
    { name: "DataFlow", logo: "📊" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-linear-to-br from-purple-500/20 to-cyan-500/20 blur-3xl"
          />
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <Reveal animation="fade-in" delay={0}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-semibold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to iDocReminder
                </span>
              </motion.div>
            </Reveal>

            {/* Main Heading */}
            <Reveal animation="fade-up" delay={50}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mt-6 mb-6 transition-colors">
                Secure Document<br />
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Management Made Simple
                </span>
              </h1>
            </Reveal>

            {/* Subheading */}
            <Reveal animation="fade-up" delay={100}>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 transition-colors">
                Upload files, set expirations and reminders, and stay organized. A fast, modern platform for managing your important documents with confidence.
              </p>
            </Reveal>

            {/* CTA Buttons */}
            <Reveal animation="fade-up" delay={150}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="auth/signup"
                    className="px-8 py-4 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 group"
                  >
                    Get Started Free
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/dashboard"
                    onClick={handleDashboardClick}
                    className="px-8 py-4 rounded-lg bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 dark:hover:bg-slate-800 border border-slate-700 dark:border-slate-800 hover:border-slate-600 dark:hover:border-slate-700 text-white font-semibold transition-all"
                  >
                    {mounted && user ? "Go to Dashboard" : "Go to Dashboard"}
                  </Link>
                </motion.div>
              </div>
            </Reveal>

            {/* Trust Badge */}
            <Reveal animation="fade-in" delay={200}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="inline-flex items-center gap-6 px-6 py-4 rounded-xl backdrop-blur-xl bg-slate-900/50 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <FiZap className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-slate-300">Blazing Fast</span>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div className="flex items-center gap-2">
                  <FiShield className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-slate-300">Secure</span>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div className="flex items-center gap-2">
                  <FiCheck className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-slate-300">Reliable</span>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <Reveal animation="fade-up">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                Trusted by Leading Companies
              </h3>
              <p className="text-gray-600 dark:text-slate-400 transition-colors">
                Join organizations that secure their documents with iDocReminder
              </p>
            </div>
          </Reveal>

          {/* Logo Carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-gray-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-gray-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Container */}
            <motion.div
              className="flex gap-8 md:gap-12"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* First Set */}
              {companies.map((company, i) => (
                <motion.div
                  key={`first-${i}`}
                  whileHover={{ scale: 1.05 }}
                  className="shrink-0 w-40 md:w-48 h-20 md:h-24 rounded-xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-gray-300/50 dark:border-slate-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform">
                      {company.logo}
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-blue-400 dark:group-hover:text-blue-400 transition-colors">
                      {company.name}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Duplicate Set for Infinite Loop */}
              {companies.map((company, i) => (
                <motion.div
                  key={`second-${i}`}
                  whileHover={{ scale: 1.05 }}
                  className="shrink-0 w-40 md:w-48 h-20 md:h-24 rounded-xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-gray-300/50 dark:border-slate-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform">
                      {company.logo}
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-blue-400 dark:group-hover:text-blue-400 transition-colors">
                      {company.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-slate-400 font-medium transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Why Choose iDocReminder
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors">
                Everything you need to manage documents securely and efficiently
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const colorMap = {
                blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
                purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
                cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
              };

              return (
                <Reveal key={feature.title} animation="fade-up" delay={50 + i * 50}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className={`group backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 ${colorMap[feature.color as keyof typeof colorMap]} border border-gray-200 dark:border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${colorMap[feature.color as keyof typeof colorMap].split(' ')[0]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed transition-colors">{feature.description}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              const isFirst = i === 0;

              return (
                <Reveal 
                  key={benefit.title} 
                  animation={isFirst ? "slide-right" : "slide-left"}
                >
                  <motion.div
                    whileHover={{ x: isFirst ? 8 : -8 }}
                    className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-2xl p-8 md:p-10 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl ${isFirst ? 'bg-blue-500/20 dark:bg-blue-400/20' : 'bg-purple-500/20 dark:bg-purple-400/20'} flex items-center justify-center mb-6`}>
                      <Icon className={`w-6 h-6 ${isFirst ? 'text-blue-400' : 'text-purple-400'}`} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-6 text-lg leading-relaxed transition-colors">{benefit.description}</p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={benefit.link}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                          isFirst
                            ? 'bg-blue-600/20 dark:bg-blue-400/20 text-blue-400 dark:text-blue-300 border border-blue-500/30 dark:border-blue-400/30 hover:bg-blue-600/30 dark:hover:bg-blue-400/30'
                            : 'bg-purple-600/20 dark:bg-purple-400/20 text-purple-400 dark:text-purple-300 border border-purple-500/30 dark:border-purple-400/30 hover:bg-purple-600/30 dark:hover:bg-purple-400/30'
                        }`}
                      >
                        {benefit.linkText}
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <Reveal animation="fade-in">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Ready to secure your documents?
            </h2>
          </Reveal>

          <Reveal animation="fade-up" delay={50}>
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto transition-colors">
              Join thousands of users who trust iDocReminder to manage their important documents. Get started for free today.
            </p>
          </Reveal>

          <Reveal animation="fade-up" delay={100}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="auth/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-950 dark:text-white rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-lg group"
                >
                  Start Free Trial
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  onClick={handleDashboardClick}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 dark:hover:bg-slate-800 border border-slate-700 dark:border-slate-800 text-white rounded-lg font-semibold transition-all"
                >
                  Access Dashboard
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </Reveal>

          <Reveal animation="fade-in" delay={150}>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-8 transition-colors">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </Reveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Infinite Scrolling Logo Carousel */}
      <section className="relative py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <Reveal animation="fade-up">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                Trusted by Leading Companies
              </h3>
              <p className="text-gray-600 dark:text-slate-400 transition-colors">
                Join organizations that secure their documents with iDocReminder
              </p>
            </div>
          </Reveal>

          {/* Logo Carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-gray-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-gray-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Container */}
            <motion.div
              className="flex gap-8 md:gap-12"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* First Set */}
              {companies.map((company, i) => (
                <motion.div
                  key={`first-${i}`}
                  whileHover={{ scale: 1.05 }}
                  className="shrink-0 w-40 md:w-48 h-20 md:h-24 rounded-xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-gray-300/50 dark:border-slate-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform">
                      {company.logo}
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-blue-400 dark:group-hover:text-blue-400 transition-colors">
                      {company.name}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Duplicate Set for Infinite Loop */}
              {companies.map((company, i) => (
                <motion.div
                  key={`second-${i}`}
                  whileHover={{ scale: 1.05 }}
                  className="shrink-0 w-40 md:w-48 h-20 md:h-24 rounded-xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-gray-300/50 dark:border-slate-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform">
                      {company.logo}
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-blue-400 dark:group-hover:text-blue-400 transition-colors">
                      {company.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}