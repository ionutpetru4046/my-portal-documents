// src/app/about/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLock, FiCloud, FiCheckCircle, FiArrowRight, FiUsers, FiTrendingUp, FiShield, FiZap, FiGlobeAlt, FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

export default function AboutPage() {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      router.push("/login");
    }
  };

  const features = [
    {
      icon: FiLock,
      title: "Bank-Level Security",
      desc: "Your documents are encrypted with AES-256 military-grade encryption and stored safely.",
      color: "blue",
    },
    {
      icon: FiCloud,
      title: "Cloud Storage",
      desc: "Access your files anytime, from any device, with 99.9% uptime guarantee.",
      color: "purple",
    },
    {
      icon: FiCheckCircle,
      title: "Smart Organization",
      desc: "Keep your documents organized with categories, tags, and intelligent search.",
      color: "cyan",
    },
  ];

  const values = [
    {
      icon: FiShield,
      title: "Privacy First",
      description: "Your data belongs to you. We never access, sell, or share your documents.",
    },
    {
      icon: FiTrendingUp,
      title: "Always Improving",
      description: "We continuously innovate to bring you the best document management experience.",
    },
    {
      icon: FiUsers,
      title: "User-Centric",
      description: "Every feature is designed with your feedback and needs in mind.",
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Optimized performance ensures your documents load instantly every time.",
    },
  ];

  const stats = [
    { number: "500K+", label: "Documents Managed" },
    { number: "10K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden pt-20 md:pt-28 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About DocuVault
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6"
          >
            Document Management <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10"
          >
            DocuVault is a modern document management platform designed to help professionals and teams store, organize, and access their documents securely. Built with privacy, security, and user experience in mind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              onClick={handleDashboardClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 group"
            >
              Go to Dashboard
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-lg transition-all"
            >
              View Plans
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Why Choose DocuVault?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We combine powerful features with an intuitive interface to make document management effortless.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const colorMap = {
                blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
                purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
                cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
              };

              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className={`backdrop-blur-xl bg-gradient-to-br ${colorMap[feature.color as keyof typeof colorMap]} border rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[feature.color as keyof typeof colorMap].split(' ')[0]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Core Values Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-y border-slate-800"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything we do is guided by our commitment to security, privacy, and user satisfaction.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, i) => {
              const Icon = value.icon;
              const colors = ["from-blue-500/20 to-blue-600/20 border-blue-500/30", "from-purple-500/20 to-purple-600/20 border-purple-500/30", "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30", "from-green-500/20 to-green-600/20 border-green-500/30"];
              const iconColors = ["text-blue-400", "text-purple-400", "text-cyan-400", "text-green-400"];

              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`backdrop-blur-xl bg-gradient-to-br ${colors[i % colors.length]} border rounded-xl p-8 hover:border-slate-600 transition-all`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-${colors[i % colors.length].split('-')[1]}-500/20 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${iconColors[i % iconColors.length]}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              DocuVault was born from a simple observation: most document management solutions were either too complicated, not secure enough, or required expensive enterprise deals. We knew there had to be a better way.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              In 2023, our team of security experts, designers, and developers came together with a shared vision: to create the most user-friendly, secure, and modern document management platform available. We spent months researching, designing, and testing to ensure that every feature serves a purpose and every interaction feels natural.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Today, DocuVault helps thousands of professionals and teams worldwide manage their documents with confidence. We're committed to continuous improvement, listening to our users, and pushing the boundaries of what's possible in document management.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl -z-10" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            To empower professionals and teams worldwide with a secure, intuitive, and reliable document management platform that eliminates complexity and fosters productivity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              onClick={handleDashboardClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg group"
            >
              Start Your Journey
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-semibold transition-all"
            >
              Get in Touch
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}