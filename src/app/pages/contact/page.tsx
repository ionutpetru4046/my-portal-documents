"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiAlertCircle, FiClock, FiHeadphones, FiMessageSquare, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill out all required fields");
      return;
    }

    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: FiMail,
      title: "Email",
      description: "Send us an email anytime",
      contact: "support@iDocReminder.com",
      link: "mailto:support@iDocReminder.com",
      color: "blue",
    },
    {
      icon: FiPhone,
      title: "Phone",
      description: "Call us during business hours",
      contact: "+1 (800) 123-4567",
      link: "tel:+18001234567",
      color: "purple",
    },
    {
      icon: FiMessageSquare,
      title: "Live Chat",
      description: "Chat with our team instantly",
      contact: "Available 24/7",
      link: "#",
      color: "cyan",
    },
  ];

  const supportInfo = [
    {
      icon: FiClock,
      title: "Response Time",
      description: "We typically respond within 2 hours",
    },
    {
      icon: FiHeadphones,
      title: "Support Team",
      description: "Expert support for all plans",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { 
        bg: "from-blue-500/20 to-blue-600/20 dark:from-blue-500/20 dark:to-blue-600/20", 
        text: "text-blue-600 dark:text-blue-400", 
        border: "border-blue-500/30 dark:border-blue-500/30" 
      },
      purple: { 
        bg: "from-purple-500/20 to-purple-600/20 dark:from-purple-500/20 dark:to-purple-600/20", 
        text: "text-purple-600 dark:text-purple-400", 
        border: "border-purple-500/30 dark:border-purple-500/30" 
      },
      cyan: { 
        bg: "from-cyan-500/20 to-cyan-600/20 dark:from-cyan-500/20 dark:to-cyan-600/20", 
        text: "text-cyan-600 dark:text-cyan-400", 
        border: "border-cyan-500/30 dark:border-cyan-500/30" 
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 relative overflow-hidden transition-colors">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
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

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-6"
          >
            <FiMail className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors">
            Have questions or feedback? We&apos;d love to hear from you. Our team is ready to help.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form - Spans 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl bg-white/50 dark:bg-slate-900/80 border border-gray-300 dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl transition-colors">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                      <span className="text-blue-600 dark:text-blue-400">*</span>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                      <span className="text-blue-600 dark:text-blue-400">*</span>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                    <span className="text-blue-600 dark:text-blue-400">*</span>
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b5cf6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                      paddingRight: "2.5rem",
                    }}
                    required
                  >
                    <option value="" className="bg-gray-900 dark:bg-slate-900 text-gray-900 dark:text-white">Select a subject</option>
                    <option value="general" className="bg-gray-900 dark:bg-slate-900 text-gray-900 dark:text-white">General Inquiry</option>
                    <option value="support" className="bg-gray-900 dark:bg-slate-900 text-gray-900 dark:text-white">Technical Support</option>
                    <option value="billing" className="bg-gray-900 dark:bg-slate-900 text-gray-900 dark:text-white">Billing Question</option>
                    <option value="feature" className="bg-gray-900 dark:bg-slate-900 text-gray-900 dark:text-white">Feature Request</option>
                    <option value="partnership" className="bg-gray-900 dark:bg-slate-900 text-gray-900 dark:text-white">Partnership</option>
                    <option value="other" className="bg-gray-900 dark:bg-slate-900 text-gray-900 dark:text-white">Other</option>
                  </select>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                    <span className="text-blue-600 dark:text-blue-400">*</span>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || submitted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    submitted
                      ? "bg-green-600 text-white"
                      : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  } disabled:opacity-50`}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : submitted ? (
                    <>
                      <FiCheck className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-xs text-gray-500 dark:text-slate-500 mt-4 text-center transition-colors">
                We respect your privacy. Your information will only be used to respond to your inquiry.
              </p>
            </div>
          </motion.div>

          {/* Contact Methods - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {contactMethods.map((method, i) => {
                const Icon = method.icon;
                const colorClass = getColorClasses(method.color);

                return (
                  <motion.a
                    key={i}
                    variants={itemVariants}
                    href={method.link}
                    className={`backdrop-blur-xl bg-linear-to-br ${colorClass.bg} border ${colorClass.border} rounded-xl p-6 hover:shadow-lg transition-all group block bg-white/50 dark:bg-slate-900/50`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${colorClass.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${colorClass.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">{method.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2 transition-colors">{method.description}</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {method.contact}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Support Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 mt-8 pt-8 border-t border-gray-300 dark:border-slate-800 transition-colors"
            >
              {supportInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-1 transition-colors">
                      <Icon className="w-4 h-4 text-gray-600 dark:text-slate-400 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{info.title}</p>
                      <p className="text-xs text-gray-600 dark:text-slate-400 transition-colors">{info.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-white/50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-2xl p-8 md:p-12 text-center transition-colors"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Have a Quick Question?
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto transition-colors">
            Check out our Help Center and FAQ for quick answers to common questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/help"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
            >
              View Help Center
              <FiArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/faq"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all"
            >
              View FAQ
            </motion.a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}