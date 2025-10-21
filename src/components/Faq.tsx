"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is this app about?",
      answer:
        "This app helps you manage your tasks, stay organized, and boost productivity with a clean, intuitive interface.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We prioritize your privacy and use top-grade encryption to protect your data.",
    },
    {
      question: "Can I use it for free?",
      answer:
        "Yes! You can start for free with our basic plan. Premium features are available for advanced users.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach us anytime through the contact form or by emailing support@yourapp.com.",
    },
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4"
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-300 mb-10"
        >
          Find quick answers to common questions below.
        </motion.p>

        <Accordion type="single" collapsible className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border rounded-2xl shadow-sm">
                <AccordionTrigger className="px-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
